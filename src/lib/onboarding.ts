// Onboarding config (brief 2 Part B). Screen order and copy live here, not
// hardcoded in components — this flow WILL change, and §9 requires it be config.
import { DECKS } from "./questions";
import { deckDepthWord } from "./leveling";

export type OnbStage = "dating" | "engaged" | "married";

// Onboarding warm-ups — the "how well do you know each other?" hook. All are
// "Who's more likely to…?" so every couple fits an option (the old free-day /
// hobbies items failed because their fixed options didn't cover everyone).
// Predict-your-partner turns each into a bet; a disagreement is the conversation.
// The array order is the ask order.
//
// CONSTRAINT: every id must sit in fun-icebreakers' level-0 slice (its first
// depth-1 questions — see the Fun-block order in data/questions.json). Onboarding
// marks that level done and the reveal shows jointQuestions(lvlQs(slug, 0)); an id
// outside the slice would be answered but never appear in the reveal.
export const STARTER_QIDS = [
  "FUN-010", // Who's more likely to be running late?
  "FUN-008", // Who's more likely to cry at a film?
  "FUN-023", // Who's more likely to overthink a text?
  "FUN-009", // Who's more likely to apologise first after a row?
  "FUN-011", // Who's more likely to fall asleep during the sermon?
];

// Three stages only (§A3 Part B). Blended is a family structure, not a stage —
// it gets its own field when it earns one. "dating" is labelled "In a relationship".
export const ONB_STAGES: { key: OnbStage; en: string; fr: string }[] = [
  { key: "dating", en: "In a relationship", fr: "En couple" },
  { key: "engaged", en: "Engaged", fr: "Fiancés" },
  { key: "married", en: "Married", fr: "Mariés" },
];

// A7 — five stage-keyed conversations (§A7). Each is a suggestion, never a gate;
// "See all 21" is one tap away. Deal-breakers is offered to new couples, never
// imposed — on a list of five with an honest snippet and a Hardest label, it's
// simply available.
const A7_SETS: Record<OnbStage, string[]> = {
  dating: [
    "fun-icebreakers",
    "faith-worship-practice",
    "character-self-awareness",
    "us-compatibility",
    "deal-breakers",
  ],
  engaged: [
    "in-the-home",
    "in-laws-extended-family",
    "finances-money",
    "roles-responsibilities",
    "intimacy-physical",
  ],
  married: [
    "fun-icebreakers",
    "conflict-communication",
    "finances-money",
    "where-we-are-now",
    "intimacy-physical",
  ],
};

// Depth of a deck as a sortable rank (its median), so a set can be ordered
// Warm-up → Hardest (§A7).
function deckRank(slug: string): number {
  const ds = DECKS[slug].questions.map((q) => q.depth).sort((a, b) => a - b);
  const mid = Math.floor(ds.length / 2);
  return ds.length % 2 ? ds[mid] : (ds[mid - 1] + ds[mid]) / 2;
}

export interface A7Card {
  slug: string;
  name: string;
  depth: [string, string]; // depth word [en, fr]
  hook: string; // live question text, resolved at build time
  count: number;
}

// The five cards for a stage, ordered Warm-up → Hardest, each carrying its hook
// question resolved from the bank (never hand-copied).
export function a7Cards(stage: OnbStage): A7Card[] {
  return [...A7_SETS[stage]]
    .sort((a, b) => deckRank(a) - deckRank(b))
    .map((slug) => {
      const d = DECKS[slug];
      return {
        slug,
        name: d.name,
        depth: deckDepthWord(slug),
        hook: d.hook?.q ?? d.questions[0].q,
        count: d.questions.length,
      };
    });
}
