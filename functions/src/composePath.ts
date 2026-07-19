// The Path composition algorithm (build brief §"Path composition"). PURE and
// deterministic: given both partners' intakes it always produces the same path,
// which is what makes "generate once" safe and testable. It reads ONLY the two
// intakes + the vendored question bank — never anything that could leak which
// partner flagged what. The fixed spine guarantees every theme is present, so a
// topic's mere presence is never a signal; only quiet weighting differs.
import { BANK, type BankEntry } from "./questionBank.generated.js";

// Intake topics, in the option order the intake UI presents them (brief: the
// prototype's TOPICS array). Q3 "talk" and Q4 "avoided" answers are indices here.
export const TOPICS = [
  "faith",
  "money",
  "family",
  "intimacy",
  "conflict",
  "roles",
  "career",
  "past",
  "inlaws",
  "health",
] as const;

const WEIGHTED_POOL = 40; // ~40 weighted questions on top of the ~30 spine.

type Mechanic = "guess" | "noguess";

interface StepSpec {
  key: string;
  decks: string[];
  spine: number; // fixed baseline (the ~30 spine, summed across steps)
  topics: number[]; // TOPICS indices that weight this step
  mechanic: Mechanic;
  band: [number, number]; // depth band for the tier ramp
  fixedWeighted?: number; // steps with no topic get a fixed weighted count
}

// The nine question-steps, in trail order. Step ten (The Lookout) is the finale
// and carries no questions, so it isn't here. Themes/source-decks per the brief's
// curriculum; the spine baselines sum to ~30 (faith/conflict/money/family/us +
// warm-up + convictions), the weighted pool (~40) is shared out by intake weight.
const STEPS: StepSpec[] = [
  { key: "trailhead", decks: ["fun-icebreakers", "us-compatibility", "health-lifestyle"], spine: 5, topics: [], mechanic: "guess", band: [1, 2], fixedWeighted: 2 },
  { key: "fork", decks: ["conflict-communication"], spine: 4, topics: [4], mechanic: "guess", band: [1, 3] },
  { key: "storehouse", decks: ["finances-money"], spine: 3, topics: [1], mechanic: "guess", band: [1, 3] },
  { key: "table", decks: ["family-children", "parenting-style", "in-laws-extended-family", "roles-responsibilities", "in-the-home"], spine: 4, topics: [2, 5, 8], mechanic: "guess", band: [2, 3] },
  { key: "garden", decks: ["intimacy-physical"], spine: 2, topics: [3], mechanic: "guess", band: [2, 4] },
  { key: "valley", decks: ["past-baggage", "health-lifestyle"], spine: 2, topics: [7, 9], mechanic: "guess", band: [2, 4] },
  { key: "hilltop", decks: ["faith-worship-practice", "theology-beliefs"], spine: 4, topics: [0], mechanic: "guess", band: [2, 4] },
  { key: "horizon", decks: ["dreams-future", "career-ambition"], spine: 2, topics: [6], mechanic: "guess", band: [3, 4] },
  { key: "summit", decks: ["values-convictions", "deal-breakers", "faithfulness-loyalty", "character-self-awareness"], spine: 4, topics: [], mechanic: "noguess", band: [4, 5], fixedWeighted: 4 },
];

export interface Intake {
  answers?: Record<string, number | number[]>;
}

export interface PathStep {
  key: string;
  mechanic: Mechanic;
  qids: string[];
}

export interface PathStructure {
  version: number;
  questionCount: number;
  steps: Record<number, PathStep>;
}

const SPEC_VERSION = 1;

const asArr = (v: unknown): number[] =>
  Array.isArray(v) ? v.filter((x): x is number => typeof x === "number") : [];
const asNum = (v: unknown): number | null => (typeof v === "number" ? v : null);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// Topic weights: each partner's Q3 "want to talk through" adds 1, Q4
// "avoided/unresolved" adds 2 (avoided weighted above talk, per the brief).
// Summed across both partners → 0 (neither) … up to 6 (both avoided).
function topicWeights(host: Intake, guest: Intake): number[] {
  const w = TOPICS.map(() => 0);
  for (const intake of [host, guest]) {
    for (const t of asArr(intake.answers?.talk)) if (w[t] !== undefined) w[t] += 1;
    for (const t of asArr(intake.answers?.avoided)) if (w[t] !== undefined) w[t] += 2;
  }
  return w;
}

// Tier ramp start: begin at the GENTLER partner's Q5 depth (0 ease / 1 middle /
// 2 deep). A couple who both want depth skips the shallowest openers.
function startOffset(host: Intake, guest: Intake): number {
  const h = asNum(host.answers?.depth) ?? 0;
  const g = asNum(guest.answers?.depth) ?? 0;
  return clamp(Math.min(h, g), 0, 2);
}

// Deterministic selection of `count` question ids for a step, within a depth
// band, from the step's source decks, skipping ids already used elsewhere in the
// path. Guess steps prefer guessable questions. Widens the band if the banded
// pool can't fill the step (small decks), so a step is never starved.
function selectForStep(step: StepSpec, count: number, offset: number, used: Set<string>): string[] {
  const decks = new Set(step.decks);
  const lo = clamp(step.band[0] + offset, 1, step.band[1]);
  const hi = clamp(step.band[1] + offset, lo, 5);

  const gather = (minD: number, maxD: number) =>
    Object.entries(BANK)
      .filter(([id, e]: [string, BankEntry]) =>
        decks.has(e.deck) && e.type !== "open" && !used.has(id) && e.depth >= minD && e.depth <= maxD)
      .sort((a, b) => {
        if (step.mechanic === "guess") {
          const ga = a[1].guessable ? 0 : 1;
          const gb = b[1].guessable ? 0 : 1;
          if (ga !== gb) return ga - gb;
        }
        if (a[1].depth !== b[1].depth) return a[1].depth - b[1].depth;
        return a[0] < b[0] ? -1 : 1;
      })
      .map(([id]) => id);

  let cands = gather(lo, hi);
  if (cands.length < count) cands = gather(1, 5); // widen to the whole deck set
  const picked = cands.slice(0, count);
  picked.forEach((id) => used.add(id));
  return picked;
}

/**
 * Compose a couple's path from both intakes. Pure + deterministic.
 * The output is only a list of existing question ids per step + the mechanic —
 * the sequencer over the existing engine, never a new question store.
 */
export function composePath(host: Intake, guest: Intake): PathStructure {
  const tw = topicWeights(host, guest);
  const offset = startOffset(host, guest);

  // Weighted allocation: trailhead + summit take fixed shares; the remaining
  // pool is split across the seven topic-carrying steps — each gets a floor of 1
  // (light-but-nonzero, so every topic stays present) plus a share by weight.
  const middle = STEPS.map((s, i) => ({ s, i })).filter(({ s }) => s.fixedWeighted === undefined);
  const stepTopicWeight = (s: StepSpec) => s.topics.reduce((a, t) => a + tw[t], 0);
  const fixedTotal = STEPS.reduce((a, s) => a + (s.fixedWeighted ?? 0), 0);
  const pool = Math.max(0, WEIGHTED_POOL - fixedTotal); // shared across the middle steps
  // Each middle step carries a base weight of 1 (so the whole pool is always
  // spent — every couple reaches ~70) plus its intake topic weight, which skews
  // where the extra questions land. Neither-flagged still gets its even share.
  const BASE = 1;
  const denom = middle.reduce((a, { s }) => a + BASE + stepTopicWeight(s), 0) || 1;
  const weightedAlloc = STEPS.map((s) =>
    s.fixedWeighted ?? Math.round((pool * (BASE + stepTopicWeight(s))) / denom),
  );

  const used = new Set<string>();
  const steps: Record<number, PathStep> = {};
  let questionCount = 0;
  STEPS.forEach((step, i) => {
    const count = step.spine + weightedAlloc[i];
    const qids = selectForStep(step, count, offset, used);
    steps[i] = { key: step.key, mechanic: step.mechanic, qids };
    questionCount += qids.length;
  });

  return { version: SPEC_VERSION, questionCount, steps };
}
