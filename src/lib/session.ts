// Session service — create/join and the answer/guess/done writes.
// The account graft (CLAUDE.md §6): a signed-in user's uid + profile name are
// written into the host/guest member slot so the host/guest scoring layer is
// untouched. Every write is a scalar leaf (never {}) so RTDB auto-creates
// intermediates — the hard-won gotcha in §6.
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import type { Role, AnswerValue } from "./scoring";
import type { Stage } from "../types";

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

// Host creates a session. Rules allow a write only to a brand-new code (or by a
// member), and deny reads of codes we're not in — so we can't pre-check. We
// just attempt the write and, on the rare collision with a live session (write
// denied), retry with a fresh code.
export async function createSession(
  uid: string,
  name: string,
  stage?: Stage,
): Promise<string> {
  for (let tries = 0; tries < 6; tries++) {
    const code = randCode();
    try {
      await update(ref(db, `sessions/${code}`), {
        created: Date.now(),
        // Only write stage when chosen — never a nullish leaf (RTDB gotcha §6).
        ...(stage ? { stage } : {}),
        "members/host/name": name,
        "members/host/uid": uid,
        [`uids/${uid}`]: true,
      });
      return code;
    } catch {
      // code already taken by someone else's session — try another
    }
  }
  throw new Error("Couldn’t start a session — please try again.");
}

// Guest join is server-side now (joinByCode / redeemInvite callables) so the
// sessions write rule can stay locked to members. See src/lib/functions.ts.

// Article 9 consent (onboarding spec v2 §2). Its OWN node — never nested with
// anything else, so the faith-data consent is an unbundled, demonstrable record.
// Bump the version whenever the wording the person ticks changes.
export const CONSENT_VERSION = "2026-07-15";
export function recordConsent(uid: string): Promise<void> {
  return update(ref(db, `consents/${uid}`), {
    "article9/granted": true,
    "article9/version": CONSENT_VERSION,
    "article9/timestampMs": Date.now(),
  });
}

// Profile write — name at consent/sign-up; email + photo when the account is
// created at the invite gate (spec v2 §2, §7.4). Only scalar leaves, never {}.
export function writeProfile(
  uid: string,
  data: { name?: string; email?: string; photo?: string },
): Promise<void> {
  const patch: Record<string, string | number> = {};
  if (data.name != null) patch.name = data.name;
  if (data.email != null) patch.email = data.email;
  if (data.photo != null) patch.photo = data.photo;
  patch.updated = Date.now();
  return update(ref(db, `users/${uid}`), patch);
}

// Implementation intention (spec v2 §A6) — when the couple will sit down.
// Stored on the session (the couple), skippable, never nagged.
export function writeMeetAt(code: string, whenMs: number): Promise<void> {
  return update(ref(db, `sessions/${code}`), { meetAt: whenMs });
}

export function writeAnswer(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/answers/${qid}`), {
    [role]: value,
  });
}

export function writeGuess(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: AnswerValue,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/guesses/${qid}`), {
    [role]: value,
  });
}

// Importance rating (1..5) for the weighting layer. Asked only on tier-3 and
// DEAL-* questions (brief §2b); mirrors the answers/guesses write shape.
export function writeImportance(
  code: string,
  slug: string,
  qid: string,
  role: Role,
  value: number,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/importance/${qid}`), {
    [role]: value,
  });
}

export function markLevelDone(
  code: string,
  slug: string,
  lvl: number,
  role: Role,
): Promise<void> {
  return update(ref(db, `sessions/${code}/decks/${slug}/done/${lvl}`), {
    [role]: true,
  });
}
