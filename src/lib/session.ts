// Session service — create/join and the answer/guess/done writes.
// The account graft (CLAUDE.md §6): a signed-in user's uid + profile name are
// written into the host/guest member slot so the host/guest scoring layer is
// untouched. Every write is a scalar leaf (never {}) so RTDB auto-creates
// intermediates — the hard-won gotcha in §6.
import { ref, get, update } from "firebase/database";
import { db } from "../firebase";
import type { Role, AnswerValue } from "./scoring";

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

// Host creates a session. Returns the new code. We can read our own writes, so
// we probe for a free code first (a fresh code node is world-writable only in
// the sense that its guest slot is empty — see database.rules.json).
export async function createSession(
  uid: string,
  name: string,
): Promise<string> {
  let code = randCode();
  // Avoid an accidental collision with a live session.
  for (let tries = 0; tries < 5; tries++) {
    const snap = await get(ref(db, `sessions/${code}/created`)).catch(() => null);
    if (!snap || !snap.exists()) break;
    code = randCode();
  }
  await update(ref(db, `sessions/${code}`), {
    created: Date.now(),
    "members/host/name": name,
    "members/host/uid": uid,
    [`uids/${uid}`]: true,
  });
  return code;
}

// Guest joins by code. Rules only let us WRITE our guest slot (when it's empty
// and a host exists) — we can't read the session until we're a member — so this
// is a blind write; a bad code / full session is rejected by the rules and
// surfaces as an error. After it lands, useSession can read as a member.
export async function joinSession(
  uid: string,
  name: string,
  code: string,
): Promise<void> {
  await update(ref(db, `sessions/${code}`), {
    "members/guest/name": name,
    "members/guest/uid": uid,
    [`uids/${uid}`]: true,
  });
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
