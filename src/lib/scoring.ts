// Alignment scoring — PORTED VERBATIM from legacy/index.html (scoreQ / overall /
// knowScore / isComplement). Refactored only to be pure: instead of reading a
// global SESS, each function takes the deck's answer/guess data explicitly.
// The math is unchanged. See CLAUDE.md §9, §11.
import type { Question } from "./questions";

export type Role = "host" | "guest";
export type AnswerValue = number | string;
export type RoleMap<T> = Partial<Record<Role, T>>;

export interface DeckData {
  answers?: Record<string, RoleMap<AnswerValue>>;
  guesses?: Record<string, RoleMap<AnswerValue>>;
  done?: Record<string, RoleMap<boolean>>;
}

export type Verdict = "Shared" | "Agreed" | "Close" | "Worth a chat" | "Complementary";

export interface ScoreResult {
  me: AnswerValue | undefined;
  th: AnswerValue | undefined;
  verdict: Verdict;
  score: number | null;
  open?: boolean;
  rank?: boolean;
  A?: number[];
  B?: number[];
  guessed?: boolean;
  guessRight?: boolean;
  guess?: AnswerValue;
  theyGuessed?: boolean;
  theyGuessRight?: boolean;
  theirGuess?: AnswerValue;
}

export const other = (r: Role): Role => (r === "host" ? "guest" : "host");

// Some flagged questions score as fully aligned even when answers differ.
const COMPLEMENT = new Set(["PAR-004"]);
export function isComplement(q: Question): boolean {
  return (
    (q.complement || COMPLEMENT.has(q.id)) &&
    (q.type === "scale" || q.type === "mc")
  );
}

export function scoreQ(q: Question, deck: DeckData, role: Role): ScoreResult {
  const a = deck.answers?.[q.id] ?? {};
  const me = a[role];
  const th = a[other(role)];

  if (q.type === "open") {
    return { me, th, verdict: "Shared", score: null, open: true };
  }

  if (q.type === "rank") {
    const A = String(me).split(",").map(Number);
    const B = String(th).split(",").map(Number);
    const n = A.length;
    let dist = 0;
    for (let o = 0; o < n; o++) dist += Math.abs(A.indexOf(o) - B.indexOf(o));
    const maxd = Math.floor((n * n) / 2) || 1;
    const score = Math.max(0, 1 - dist / maxd);
    const verdict: Verdict =
      dist === 0 ? "Agreed" : score >= 0.7 ? "Close" : "Worth a chat";
    return { me, th, verdict, score, rank: true, A, B };
  }

  let verdict: Verdict;
  let score: number;
  if (q.type === "scale") {
    const diff = Math.abs(Number(me) - Number(th));
    score = 1 - diff / 4;
    verdict = diff === 0 ? "Agreed" : diff === 1 ? "Close" : "Worth a chat";
  } else {
    // mc
    score = me === th ? 1 : 0;
    verdict = me === th ? "Agreed" : "Worth a chat";
  }
  if (isComplement(q)) {
    score = 1;
    verdict = me === th ? "Agreed" : "Complementary";
  }

  const g = deck.guesses?.[q.id]?.[role];
  const guessed = g != null;
  const guessRight = guessed && g === th;
  const tg = deck.guesses?.[q.id]?.[other(role)];
  const theyGuessed = tg != null;
  const theyGuessRight = theyGuessed && tg === me;
  return {
    me,
    th,
    verdict,
    score,
    guessed,
    guessRight,
    guess: g,
    theyGuessed,
    theyGuessRight,
    theirGuess: tg,
  };
}

// Questions both partners have answered.
export function jointQuestions(qs: Question[], deck: DeckData): Question[] {
  return qs.filter((q) => {
    const a = deck.answers?.[q.id];
    return a && a.host != null && a.guest != null;
  });
}

// Overall alignment % across the given (scoreable) joint questions.
export function overall(qs: Question[], deck: DeckData, role: Role): number {
  const js = jointQuestions(qs, deck).filter((q) => q.type !== "open");
  if (!js.length) return 0;
  let s = 0;
  js.forEach((q) => {
    s += scoreQ(q, deck, role).score ?? 0;
  });
  return Math.round((s / js.length) * 100);
}

// "How well you know each other" — guess accuracy across guessable questions.
export function knowScore(qs: Question[], deck: DeckData, role: Role) {
  const js = jointQuestions(qs, deck).filter(
    (q) => q.type !== "open" && q.guessable,
  );
  let made = 0;
  let right = 0;
  js.forEach((q) => {
    const r = scoreQ(q, deck, role);
    if (r.guessed) {
      made++;
      if (r.guessRight) right++;
    }
    if (r.theyGuessed) {
      made++;
      if (r.theyGuessRight) right++;
    }
  });
  return { pct: made ? Math.round((right / made) * 100) : null, made, right };
}
