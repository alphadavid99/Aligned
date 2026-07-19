// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)

// Compact question metadata for the Path generation Cloud Function.
export type QuestionType = "scale" | "mc" | "rank" | "open";
export interface BankEntry {
  deck: string;
  type: QuestionType;
  depth: number;
  guessable?: boolean;
  complement?: boolean;
}

/** Every question's selection metadata, keyed by id. */
export const BANK: Record<string, BankEntry> = {
  "HOME-001": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-002": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-003": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-004": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-005": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-006": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HOME-007": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "HOME-008": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-009": {
    "deck": "in-the-home",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FIN-001": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-002": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-003": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-004": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-005": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-006": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-007": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FIN-008": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-009": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FIN-010": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-011": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-012": {
    "deck": "finances-money",
    "type": "rank",
    "depth": 3
  },
  "FIN-013": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-014": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-015": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FIN-016": {
    "deck": "finances-money",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "FIN-017": {
    "deck": "finances-money",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "FAITH-001": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-002": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-003": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-004": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-005": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-006": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-007": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAITH-008": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-009": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-010": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-011": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 2
  },
  "FAITH-012": {
    "deck": "faith-worship-practice",
    "type": "open",
    "depth": 1
  },
  "FAITH-013": {
    "deck": "faith-worship-practice",
    "type": "rank",
    "depth": 2
  },
  "FAITH-014": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-015": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-016": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-017": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-018": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-019": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "FAITH-020": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-021": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-022": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-023": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-024": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-025": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-026": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-027": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-028": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-029": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAITH-030": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAITH-031": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-032": {
    "deck": "faith-worship-practice",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FAITH-033": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-034": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAITH-035": {
    "deck": "faith-worship-practice",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "ROLE-001": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-002": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-003": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "ROLE-004": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "ROLE-005": {
    "deck": "roles-responsibilities",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "THEO-001": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "THEO-002": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "THEO-003": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-004": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-005": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-006": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-007": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "THEO-008": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "THEO-009": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "THEO-010": {
    "deck": "theology-beliefs",
    "type": "rank",
    "depth": 3
  },
  "DREAM-001": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-002": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DREAM-003": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DREAM-004": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "DREAM-005": {
    "deck": "dreams-future",
    "type": "open",
    "depth": 2
  },
  "DREAM-006": {
    "deck": "dreams-future",
    "type": "open",
    "depth": 1
  },
  "FAM-001": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-002": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-003": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-004": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-005": {
    "deck": "family-children",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FAM-006": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-007": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-008": {
    "deck": "family-children",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "FAM-009": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FAM-010": {
    "deck": "family-children",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-001": {
    "deck": "parenting-style",
    "type": "rank",
    "depth": 2
  },
  "PAR-002": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-003": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "PAR-004": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "PAR-005": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-006": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "PAR-007": {
    "deck": "parenting-style",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INT-001": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-002": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-003": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-001": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-005": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "LOYAL-002": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5
  },
  "INT-007": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-008": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-009": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-010": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5
  },
  "LOYAL-003": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-012": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "CONF-001": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-002": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-003": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-004": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-004": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-005": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "LOYAL-006": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-008": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-009": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 1
  },
  "LOYAL-007": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-011": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 2
  },
  "CONF-012": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-013": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-014": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-015": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "CONF-016": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-017": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-018": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-019": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-020": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "CONF-021": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-022": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-023": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-024": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-025": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-026": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CONF-027": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CONF-028": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-001": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-002": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "INLAW-003": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-004": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INLAW-005": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-006": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "INLAW-007": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "FUN-010": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-008": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-023": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-009": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-011": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-002": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DEAL-001": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-002": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-003": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "DEAL-004": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-005": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-006": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DEAL-007": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-008": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-009": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "HEALTH-001": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-002": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-003": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-004": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-005": {
    "deck": "health-lifestyle",
    "type": "open",
    "depth": 4
  },
  "HEALTH-006": {
    "deck": "health-lifestyle",
    "type": "open",
    "depth": 4
  },
  "HEALTH-007": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HEALTH-008": {
    "deck": "health-lifestyle",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-009": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "HEALTH-010": {
    "deck": "health-lifestyle",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "PAST-001": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-002": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-003": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-004": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-008": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "PAST-006": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-007": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-008": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "PAST-009": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 4
  },
  "PAST-010": {
    "deck": "past-baggage",
    "type": "open",
    "depth": 3
  },
  "PAST-011": {
    "deck": "past-baggage",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CAREER-001": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-002": {
    "deck": "career-ambition",
    "type": "open",
    "depth": 2
  },
  "CAREER-003": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-004": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CAREER-005": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "CAREER-006": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-007": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-008": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-009": {
    "deck": "career-ambition",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "CAREER-010": {
    "deck": "career-ambition",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "SELF-001": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-002": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-003": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 4
  },
  "SELF-004": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-005": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-006": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "SELF-007": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 4
  },
  "SELF-008": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-009": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-010": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-011": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-012": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "SELF-013": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "SELF-014": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-015": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-016": {
    "deck": "character-self-awareness",
    "type": "open",
    "depth": 2
  },
  "SELF-017": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-018": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-019": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-020": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-021": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-022": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-023": {
    "deck": "character-self-awareness",
    "type": "rank",
    "depth": 2
  },
  "SELF-024": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-025": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "SELF-026": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "SELF-027": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-001": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-002": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-003": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-004": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-005": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-006": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-007": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-008": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-009": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-010": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 1
  },
  "US-011": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 5
  },
  "US-012": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 4
  },
  "US-013": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-014": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "US-015": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-016": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 3
  },
  "US-017": {
    "deck": "us-compatibility",
    "type": "open",
    "depth": 2
  },
  "US-018": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "US-019": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-020": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-021": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-022": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-023": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-024": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "US-025": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-026": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-027": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 2
  },
  "US-028": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-029": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-030": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-031": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-032": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 3
  },
  "US-033": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "US-034": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "US-035": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-036": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-037": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-038": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-039": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-040": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "VAL-001": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-002": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-003": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-004": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-005": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-006": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-007": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-008": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "VAL-009": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-010": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "VAL-011": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "VAL-012": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "FUN-003": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-001": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-002": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-003": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-004": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-005": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "NOW-006": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-007": {
    "deck": "where-we-are-now",
    "type": "rank",
    "depth": 4
  },
  "NOW-008": {
    "deck": "where-we-are-now",
    "type": "rank",
    "depth": 2
  },
  "NOW-009": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-010": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-011": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-012": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-013": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-014": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CONF-029": {
    "deck": "conflict-communication",
    "type": "rank",
    "depth": 3
  },
  "US-041": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 4
  },
  "US-042": {
    "deck": "us-compatibility",
    "type": "rank",
    "depth": 4
  },
  "INT-013": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-014": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-015": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-016": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "INT-017": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-018": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-019": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 4,
    "guessable": true
  },
  "INT-020": {
    "deck": "intimacy-physical",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "INT-021": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "INT-022": {
    "deck": "intimacy-physical",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-030": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-031": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-032": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-033": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-034": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "CONF-035": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "CONF-036": {
    "deck": "conflict-communication",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "CONF-037": {
    "deck": "conflict-communication",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-043": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "US-044": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-045": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-046": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-047": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "US-048": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 2,
    "guessable": true
  },
  "US-049": {
    "deck": "us-compatibility",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "US-050": {
    "deck": "us-compatibility",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "SELF-028": {
    "deck": "character-self-awareness",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "SELF-029": {
    "deck": "character-self-awareness",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "HOME-010": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "HOME-011": {
    "deck": "in-the-home",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-004": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-015": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-016": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "NOW-017": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-018": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "NOW-019": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-020": {
    "deck": "where-we-are-now",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "NOW-021": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-022": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "NOW-023": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "NOW-024": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "FUN-005": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-006": {
    "deck": "fun-icebreakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FUN-001": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-007": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-012": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-013": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-014": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-015": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-016": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-017": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-018": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-019": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-020": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "FUN-021": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 2,
    "guessable": true
  },
  "FUN-022": {
    "deck": "fun-icebreakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-006": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-007": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-008": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "ROLE-009": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "ROLE-010": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-007": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-008": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DREAM-009": {
    "deck": "dreams-future",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DREAM-010": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "DREAM-011": {
    "deck": "dreams-future",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "DREAM-012": {
    "deck": "dreams-future",
    "type": "rank",
    "depth": 3
  },
  "INLAW-008": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-009": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "INLAW-010": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-011": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "INLAW-012": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 3,
    "guessable": true
  },
  "DEAL-010": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-011": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-012": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-013": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DEAL-014": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-015": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-016": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-017": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-018": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "DEAL-019": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 5,
    "guessable": true
  },
  "DEAL-020": {
    "deck": "deal-breakers",
    "type": "rank",
    "depth": 5
  },
  "DEAL-021": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 5,
    "guessable": true
  },
  "DEAL-022": {
    "deck": "deal-breakers",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "DEAL-023": {
    "deck": "deal-breakers",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAM-011": {
    "deck": "family-children",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "FAM-012": {
    "deck": "family-children",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "INLAW-013": {
    "deck": "in-laws-extended-family",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "INLAW-014": {
    "deck": "in-laws-extended-family",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "PAR-008": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "PAR-009": {
    "deck": "parenting-style",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-011": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "ROLE-012": {
    "deck": "roles-responsibilities",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "THEO-011": {
    "deck": "theology-beliefs",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "THEO-012": {
    "deck": "theology-beliefs",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "VAL-013": {
    "deck": "values-convictions",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "VAL-014": {
    "deck": "values-convictions",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "NOW-025": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-026": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "NOW-027": {
    "deck": "where-we-are-now",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-009": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-010": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 1,
    "guessable": true
  },
  "LOYAL-011": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-012": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-013": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-014": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-015": {
    "deck": "faithfulness-loyalty",
    "type": "mc",
    "depth": 4,
    "guessable": true
  },
  "LOYAL-016": {
    "deck": "faithfulness-loyalty",
    "type": "scale",
    "depth": 3,
    "guessable": true
  },
  "LOYAL-017": {
    "deck": "faithfulness-loyalty",
    "type": "rank",
    "depth": 4
  }
};
