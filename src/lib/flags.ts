// Flag collection for the "Before you walk on" review (brief §4/§5).
// Pure: turns a set of questions + deck data into ordered, display-ready flag
// rows. One row per (question, flag) — a question carrying both flags yields a
// row in each group, which is what the grouped index wants.
import {
  scoreQ,
  jointQuestions,
  type DeckData,
  type Role,
  type Flag,
  type ScoreResult,
} from "./scoring";
import type { Question } from "./questions";

export interface FlagRow {
  q: Question;
  r: ScoreResult;
  flag: Flag;
  /** blindSpot only: both partners guessed wrong (the more serious case). */
  mutual: boolean;
}

// Ordered flag rows: blindSpot first (mutual above one-sided), then
// unevenStakes — mirroring the index grouping in §5b.
export function collectFlagRows(
  qs: Question[],
  deck: DeckData,
  role: Role,
): FlagRow[] {
  const blind: FlagRow[] = [];
  const stakes: FlagRow[] = [];
  for (const q of jointQuestions(qs, deck)) {
    const r = scoreQ(q, deck, role);
    if (r.flags.includes("blindSpot")) {
      const mutual =
        !!r.guessed && !r.guessRight && !!r.theyGuessed && !r.theyGuessRight;
      blind.push({ q, r, flag: "blindSpot", mutual });
    }
    if (r.flags.includes("unevenStakes")) {
      stakes.push({ q, r, flag: "unevenStakes", mutual: false });
    }
  }
  blind.sort((a, b) => Number(b.mutual) - Number(a.mutual)); // mutual first
  return [...blind, ...stakes];
}

/** Rows split by flag type, in display order, for the grouped index. */
export function groupFlagRows(rows: FlagRow[]): {
  blindSpot: FlagRow[];
  unevenStakes: FlagRow[];
} {
  return {
    blindSpot: rows.filter((r) => r.flag === "blindSpot"),
    unevenStakes: rows.filter((r) => r.flag === "unevenStakes"),
  };
}
