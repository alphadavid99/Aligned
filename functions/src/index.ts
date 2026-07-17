/**
 * Cloud Functions for TwoAgree — region-pinned to europe-west1.
 *
 * These are the operations the client cannot be trusted with (GDPR §8): a full
 * account delete must cascade across the partner's session data, which the
 * security rules correctly forbid a client from touching. So they run here with
 * the admin SDK.
 */
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import { randomUUID } from "node:crypto";

setGlobalOptions({ region: "europe-west1" });
initializeApp();

export const healthcheck = onRequest((_req, res) => {
  res.json({ ok: true, service: "aligned-functions", region: "europe-west1" });
});

interface SessionMember {
  name?: string;
  uid?: string;
}
interface SessionNode {
  members?: { host?: SessionMember; guest?: SessionMember };
  uids?: Record<string, boolean>;
  decks?: Record<
    string,
    {
      answers?: Record<string, Record<string, unknown>>;
      guesses?: Record<string, Record<string, unknown>>;
      done?: Record<string, Record<string, unknown>>;
    }
  >;
}

function requireUid(auth: { uid: string } | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  return auth.uid;
}

// Return every session the user is a member of, keyed by code.
async function sessionsForUser(uid: string) {
  const snap = await getDatabase().ref("sessions").once("value");
  const all = (snap.val() as Record<string, SessionNode> | null) ?? {};
  return Object.entries(all).filter(([, s]) => s?.uids?.[uid]);
}

/**
 * exportMyData — GDPR access/portability. Returns the caller's profile plus the
 * sessions they participate in, as JSON.
 */
export const exportMyData = onCall(async (request) => {
  const uid = requireUid(request.auth);
  const profileSnap = await getDatabase().ref(`users/${uid}`).once("value");
  const sessions = await sessionsForUser(uid);

  return {
    exportedAt: new Date().toISOString(),
    uid,
    profile: profileSnap.val() ?? null,
    sessions: Object.fromEntries(sessions),
  };
});

/**
 * deleteMyAccount — GDPR erasure. Cascades across every session the user is in:
 * removes their member slot, their uid from the membership set, and their
 * answers/guesses/done for their role in each deck. If they were the only
 * member left, the whole session is removed. Then deletes the profile and the
 * Firebase Auth user.
 */
export const deleteMyAccount = onCall(async (request) => {
  const uid = requireUid(request.auth);
  const db = getDatabase();
  const sessions = await sessionsForUser(uid);

  let sessionsUpdated = 0;
  let sessionsDeleted = 0;

  for (const [code, s] of sessions) {
    const role =
      s.members?.host?.uid === uid
        ? "host"
        : s.members?.guest?.uid === uid
          ? "guest"
          : null;
    const otherRole = role === "host" ? "guest" : "host";
    const otherPresent = role ? !!s.members?.[otherRole]?.uid : false;

    if (!otherPresent) {
      // We're the only one left — remove the whole session.
      await db.ref(`sessions/${code}`).remove();
      sessionsDeleted++;
      continue;
    }

    // Partner remains — surgically remove only our contributions.
    const updates: Record<string, null> = {
      [`sessions/${code}/uids/${uid}`]: null,
    };
    if (role) updates[`sessions/${code}/members/${role}`] = null;
    if (role && s.decks) {
      for (const [slug, deck] of Object.entries(s.decks)) {
        for (const qid of Object.keys(deck.answers ?? {}))
          updates[`sessions/${code}/decks/${slug}/answers/${qid}/${role}`] = null;
        for (const qid of Object.keys(deck.guesses ?? {}))
          updates[`sessions/${code}/decks/${slug}/guesses/${qid}/${role}`] = null;
        for (const lvl of Object.keys(deck.done ?? {}))
          updates[`sessions/${code}/decks/${slug}/done/${lvl}/${role}`] = null;
      }
    }
    await db.ref().update(updates);
    sessionsUpdated++;
  }

  await db.ref(`users/${uid}`).remove();
  await getAuth().deleteUser(uid);

  logger.info("account deleted", { uid, sessionsUpdated, sessionsDeleted });
  return { ok: true, sessionsUpdated, sessionsDeleted };
});

// ---- Joining a session (server-side) ---------------------------------------
// Join moved off the client so the sessions write rule can be locked to members
// only. Both paths run with admin rights and enforce: a host exists, and the
// guest slot is empty. The joiner's profile name rides into the guest slot.

async function seatGuest(uid: string, code: string): Promise<string> {
  const db = getDatabase();
  const ref = db.ref(`sessions/${code}`);
  const s = (await ref.once("value")).val() as SessionNode | null;
  if (!s || !s.members?.host?.uid) {
    throw new HttpsError("not-found", "No session with that code.");
  }
  if (s.uids?.[uid]) return code; // already a member — idempotent
  if (s.members?.guest?.uid) {
    throw new HttpsError("failed-precondition", "That session is already full.");
  }
  const name =
    ((await db.ref(`users/${uid}/name`).once("value")).val() as string) ||
    "Guest";
  await ref.update({
    "members/guest/name": name,
    "members/guest/uid": uid,
    [`uids/${uid}`]: true,
  });
  return code;
}

/** Join by typing the 4-character code the host shared. */
export const joinByCode = onCall(async (request) => {
  const uid = requireUid(request.auth);
  const code = String((request.data as { code?: string })?.code ?? "")
    .trim()
    .toUpperCase();
  if (code.length < 4) {
    throw new HttpsError("invalid-argument", "Enter the 4-character code.");
  }
  return { code: await seatGuest(uid, code) };
});

/** Host mints a single-use invite link; returns the token. */
export const createInvite = onCall(async (request) => {
  const uid = requireUid(request.auth);
  const code = String((request.data as { code?: string })?.code ?? "")
    .trim()
    .toUpperCase();
  const db = getDatabase();
  const s = (await db.ref(`sessions/${code}`).once("value")).val() as
    | SessionNode
    | null;
  if (!s) throw new HttpsError("not-found", "No such session.");
  if (s.members?.host?.uid !== uid) {
    throw new HttpsError("permission-denied", "Only the host can invite.");
  }
  const token = randomUUID();
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  await db.ref(`invites/${token}`).set({ code, createdBy: uid, expires });
  return { token };
});

/** Redeem an invite link: seat the caller as guest, then burn the token. */
export const redeemInvite = onCall(async (request) => {
  const uid = requireUid(request.auth);
  const token = String((request.data as { token?: string })?.token ?? "");
  const db = getDatabase();
  const invRef = db.ref(`invites/${token}`);
  const inv = (await invRef.once("value")).val() as
    | { code: string; expires: number }
    | null;
  if (!inv) {
    throw new HttpsError(
      "not-found",
      "This invite link is invalid or already used.",
    );
  }
  if (inv.expires < Date.now()) {
    await invRef.remove();
    throw new HttpsError("deadline-exceeded", "This invite link has expired.");
  }
  const code = await seatGuest(uid, inv.code);
  await invRef.remove();
  return { code };
});
