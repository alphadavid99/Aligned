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
  importance?: Record<string, RoleMap<number>>; // 1..5, asked on tier-3 + DEAL-*
}

export type Verdict = "Shared" | "Agreed" | "Close" | "Worth a chat" | "Complementary";

// Additive metadata, NOT verdicts (brief §4). Verdicts are mutually exclusive;
// flags stack. A question can be Agreed + unevenStakes. Internal keys are kept
// descriptive; only the copy layer renames them ("Didn't know" / "Matters more").
export type Flag = "blindSpot" | "unevenStakes";

export interface ScoreResult {
  me: AnswerValue | undefined;
  th: AnswerValue | undefined;
  verdict: Verdict;
  score: number | null;
  flags: Flag[];
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
  // Importance ratings backing the unevenStakes flag (undefined if unrated).
  impMe?: number;
  impTh?: number;
}

export const other = (r: Role): Role => (r === "host" ? "guest" : "host");

// "Not yet" (brief §7): a first-class, unscored answer. Stored distinctly from
// unanswered — null means untouched, this sentinel means deliberately chosen —
// so it counts as answered for progress but is excluded from every score.
export const NOT_YET = "__not_yet__";
export const isNotYet = (v: AnswerValue | null | undefined): boolean =>
  v === NOT_YET;

// ---- Weighting (brief 2 §1a) ---------------------------------------------
// `depth` (1–5) is the default importance weight — five buckets, endpoints
// preserved from the old three-tier scale. A partner-supplied importance
// rating (1..5), when present, overrides it.
const DEPTH_WEIGHT: Record<number, number> = { 1: 0.5, 2: 0.75, 3: 1, 4: 1.5, 5: 2 };

export function weightOf(q: Question, importance?: number | null): number {
  if (importance != null) return importance / 3; // 1..5 → 0.33..1.67
  return DEPTH_WEIGHT[Number(q.depth)] ?? 1;
}

// The shared score must read the SAME for both partners, so a question's weight
// can't depend on the viewing role. When either partner has rated importance we
// weight by the HIGHER of the two ratings — if it's a deal-breaker for one of
// them, it should carry that weight in the headline number. No ratings → the
// tier default (handled by weightOf's null branch).
export function combinedImportance(q: Question, deck: DeckData): number | null {
  const imp = deck.importance?.[q.id];
  if (!imp) return null;
  const vals = [imp.host, imp.guest].filter(
    (v): v is number => typeof v === "number",
  );
  return vals.length ? Math.max(...vals) : null;
}

// Weighted score/weight sums across the scoreable joint questions. Kept
// separate from overall() so cross-conversation aggregation (overallAll /
// knownAll) can add the sums up and stay a true weighted mean over questions,
// not an average of per-conversation averages.
export function weightedStats(
  qs: Question[],
  deck: DeckData,
  role: Role,
): { weighted: number; weight: number } {
  const js = jointQuestions(qs, deck).filter((q) => q.type !== "open");
  let weighted = 0;
  let weight = 0;
  for (const q of js) {
    const w = weightOf(q, combinedImportance(q, deck));
    weighted += (scoreQ(q, deck, role).score ?? 0) * w;
    weight += w;
  }
  return { weighted, weight };
}

// Some flagged questions score as fully aligned even when answers differ.
const COMPLEMENT = new Set(["PAR-004"]);
export function isComplement(q: Question): boolean {
  return (
    (q.complement || COMPLEMENT.has(q.id)) &&
    (q.type === "scale" || q.type === "mc")
  );
}

// unevenStakes (brief §4b): both partners rated importance and the gap is ≥3.
// Independent of agreement and of question type (rank included). Rare by design.
function stakesGap(q: Question, deck: DeckData, role: Role) {
  const impMe = deck.importance?.[q.id]?.[role];
  const impTh = deck.importance?.[q.id]?.[other(role)];
  const uneven =
    typeof impMe === "number" &&
    typeof impTh === "number" &&
    Math.abs(impMe - impTh) >= 3;
  return { impMe, impTh, uneven };
}

export function scoreQ(q: Question, deck: DeckData, role: Role): ScoreResult {
  const a = deck.answers?.[q.id] ?? {};
  const me = a[role];
  const th = a[other(role)];

  if (q.type === "open") {
    return { me, th, verdict: "Shared", score: null, open: true, flags: [] };
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
    // blindSpot excludes rank (never guessed); unevenStakes can still apply.
    const { impMe, impTh, uneven } = stakesGap(q, deck, role);
    return {
      me,
      th,
      verdict,
      score,
      rank: true,
      A,
      B,
      flags: uneven ? ["unevenStakes"] : [],
      impMe,
      impTh,
    };
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

  const flags: Flag[] = [];
  // blindSpot (brief §4a): a real difference (verdict "Worth a chat") that at
  // least one partner didn't see coming. Complementary/Close are deliberately
  // excluded — those verdicts already say the difference isn't a problem.
  const isBlindSpot =
    verdict === "Worth a chat" &&
    ((guessed && !guessRight) || (theyGuessed && !theyGuessRight));
  if (isBlindSpot) flags.push("blindSpot");
  const { impMe, impTh, uneven } = stakesGap(q, deck, role);
  if (uneven) flags.push("unevenStakes");

  return {
    me,
    th,
    verdict,
    score,
    flags,
    guessed,
    guessRight,
    guess: g,
    theyGuessed,
    theyGuessRight,
    theirGuess: tg,
    impMe,
    impTh,
  };
}

// Questions both partners have actually answered. A "Not yet" from either side
// drops the question out — it's neither agreement nor a gap, so it never reaches
// scoring, Known, flags or the breakdown (brief §7).
export function jointQuestions(qs: Question[], deck: DeckData): Question[] {
  return qs.filter((q) => {
    const a = deck.answers?.[q.id];
    return (
      a &&
      a.host != null &&
      a.guest != null &&
      !isNotYet(a.host) &&
      !isNotYet(a.guest)
    );
  });
}

// Overall agreement % across the given (scoreable) joint questions — a weighted
// mean, sum(score·weight) / sum(weight) (brief §2). Open questions stay excluded.
export function overall(qs: Question[], deck: DeckData, role: Role): number {
  const { weighted, weight } = weightedStats(qs, deck, role);
  return weight ? Math.round((weighted / weight) * 100) : 0;
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
