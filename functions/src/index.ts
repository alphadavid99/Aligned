/**
 * Cloud Functions for Aligned — region-pinned to europe-west1.
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
