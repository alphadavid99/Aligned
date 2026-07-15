// Shared "where you landed" maths — used by both the Results tab and the
// Home stat tiles / recent-reveals rows so the numbers can never disagree.
import { ORDER } from "./questions";
import { completedLevels, revealedQs } from "./progress";
import {
  overall,
  weightedStats,
  knowScore,
  scoreQ,
  weightOf,
  combinedImportance,
  isNotYet,
  other,
  type DeckData,
  type Role,
} from "./scoring";
import { DECKS, type Question } from "./questions";
import { nLevels } from "./leveling";
import type { Session } from "../types";

export type QFilter = (q: Question) => boolean;

// Aggregate agreement across every scoreable question in the bank that matches
// `filter` and both partners have answered (brief 2 §1d). Question-level, not
// gated on part completion — so a fixed instrument like the Core (§C) can show a
// live "34 of 70 · 81% agreed" from the very first answered question. Returns
// the total matching-scoreable count so the denominator can go on screen (§C7).
export function overallAll(
  decks: Session["decks"],
  role: Role,
  filter: QFilter = () => true,
): { pct: number | null; done: number; total: number } {
  let weighted = 0;
  let weight = 0;
  let done = 0;
  let total = 0;
  for (const slug in DECKS) {
    const deck = decks?.[slug];
    for (const q of DECKS[slug].questions) {
      if (q.type === "open" || !filter(q)) continue;
      total++;
      const a = deck?.answers?.[q.id];
      if (!a || a.host == null || a.guest == null || isNotYet(a.host) || isNotYet(a.guest))
        continue;
      done++;
      const w = weightOf(q, combinedImportance(q, deck!));
      weighted += (scoreQ(q, deck!, role).score ?? 0) * w;
      weight += w;
    }
  }
  return { pct: weight ? Math.round((weighted / weight) * 100) : null, done, total };
}

// Same shape for Known (guess accuracy). Total counts guessable, scoreable
// matches (the Known denominator); done counts those both have answered.
export function knownAll(
  decks: Session["decks"],
  role: Role,
  filter: QFilter = () => true,
): { pct: number | null; done: number; total: number } {
  let right = 0;
  let made = 0;
  let done = 0;
  let total = 0;
  for (const slug in DECKS) {
    const deck = decks?.[slug];
    for (const q of DECKS[slug].questions) {
      if (q.type === "open" || !q.guessable || !filter(q)) continue;
      total++;
      const a = deck?.answers?.[q.id];
      if (!a || a.host == null || a.guest == null || isNotYet(a.host) || isNotYet(a.guest))
        continue;
      done++;
      const r = scoreQ(q, deck!, role);
      if (r.guessed) {
        made++;
        if (r.guessRight) right++;
      }
      if (r.theyGuessed) {
        made++;
        if (r.theyGuessRight) right++;
      }
    }
  }
  return { pct: made ? Math.round((right / made) * 100) : null, done, total };
}

// The fixed Core instrument (brief 2 §C6).
export const isCore: QFilter = (q) => q.core === true;

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
