// Shared "where you landed" maths — used by both the Results tab and the
// Home stat tiles / recent-reveals rows so the numbers can never disagree.
import { ORDER } from "./questions";
import { completedLevels, revealedQs } from "./progress";
import { overall, jointQuestions, type DeckData, type Role } from "./scoring";
import { nLevels } from "./leveling";
import type { Session } from "../types";

export type DeckRow = {
  slug: string;
  pct: number;
  lvls: number; // mutually-revealed levels
  of: number; // total levels in the deck
  weight: number; // scoreable joint answers backing pct
};

// One row per deck with at least one mutually-revealed, scoreable level, plus
// the overall alignment (average weighted by each deck's joint answer count).
export function revealedRows(
  decks: Session["decks"],
  role: Role,
): { rows: DeckRow[]; overallPct: number | null } {
  let sum = 0;
  let n = 0;
  const rows: DeckRow[] = [];
  for (const slug of ORDER) {
    const deck: DeckData | undefined = decks?.[slug];
    const lvls = completedLevels(slug, deck, role);
    if (!lvls.length) continue;
    const qs = revealedQs(slug, deck, role);
    const joint = jointQuestions(qs, deck ?? {}).filter((q) => q.type !== "open");
    if (!joint.length) continue;
    const pct = overall(qs, deck ?? {}, role);
    rows.push({ slug, pct, lvls: lvls.length, of: nLevels(slug), weight: joint.length });
    sum += pct * joint.length;
    n += joint.length;
  }
  return { rows, overallPct: n ? Math.round(sum / n) : null };
}
