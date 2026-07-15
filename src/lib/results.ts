// Shared "where you landed" maths — used by both the Results tab and the
// Home stat tiles / recent-reveals rows so the numbers can never disagree.
import { ORDER } from "./questions";
import { completedLevels, revealedQs } from "./progress";
import { overall, weightedStats, knowScore, other, type DeckData, type Role } from "./scoring";
import { nLevels } from "./leveling";
import type { Session } from "../types";

// Solo-first (brief §6): how many questions you've answered that your partner
// hasn't yet — the count behind "N answers waiting for Judah". Works before the
// partner has even joined (all your answers are then waiting), and is honest
// progress, never a nag. Iterates the stored answers directly, no bank needed.
export function answersWaiting(decks: Session["decks"], role: Role): number {
  const o = other(role);
  let n = 0;
  for (const slug in decks) {
    const answers = decks[slug]?.answers ?? {};
    for (const qid in answers) {
      const a = answers[qid];
      if (a?.[role] != null && a[o] == null) n++;
    }
  }
  return n;
}

export type DeckRow = {
  slug: string;
  pct: number;
  known: number | null; // guess-accuracy % for this deck (null = nothing guessable yet)
  lvls: number; // mutually-revealed levels
  of: number; // total levels in the deck
  weight: number; // total question weight backing pct
};

// One row per deck with at least one mutually-revealed, scoreable level, plus
// the two aggregate axes (brief §3b): overallPct (agreement) and knownPct
// (guess accuracy). overallPct is a weighted mean over every scoreable joint
// question across all decks — the weighted sums add up, so it's a true
// question-level mean, not an average of per-conversation averages. knownPct is
// the same idea over guesses (total right / total made).
export function revealedRows(
  decks: Session["decks"],
  role: Role,
): { rows: DeckRow[]; overallPct: number | null; knownPct: number | null } {
  let weightedSum = 0;
  let weightSum = 0;
  let rightSum = 0;
  let madeSum = 0;
  const rows: DeckRow[] = [];
  for (const slug of ORDER) {
    const deck: DeckData | undefined = decks?.[slug];
    const lvls = completedLevels(slug, deck, role);
    if (!lvls.length) continue;
    const qs = revealedQs(slug, deck, role);
    const { weighted, weight } = weightedStats(qs, deck ?? {}, role);
    if (!weight) continue;
    const pct = overall(qs, deck ?? {}, role);
    const know = knowScore(qs, deck ?? {}, role);
    rows.push({ slug, pct, known: know.pct, lvls: lvls.length, of: nLevels(slug), weight });
    weightedSum += weighted;
    weightSum += weight;
    rightSum += know.right;
    madeSum += know.made;
  }
  return {
    rows,
    overallPct: weightSum ? Math.round((weightedSum / weightSum) * 100) : null,
    knownPct: madeSum ? Math.round((rightSum / madeSum) * 100) : null,
  };
}
