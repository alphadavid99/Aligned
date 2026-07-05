// Per-level completion state — PORTED VERBATIM from legacy/index.html
// (levelDone / levelComplete / catComplete / curLevel and the *DoneLvl counts).
// Pure: operates on a deck's DeckData rather than the global SESS.
import { type Role, other, type DeckData } from "./scoring";
import { nLevels, lvlQs } from "./leveling";

export function levelDone(
  deck: DeckData | undefined,
  lvl: number,
  who: Role,
): boolean {
  return !!deck?.done?.[lvl]?.[who];
}

export function levelComplete(
  deck: DeckData | undefined,
  lvl: number,
  role: Role,
): boolean {
  return levelDone(deck, lvl, role) && levelDone(deck, lvl, other(role));
}

export function catComplete(
  slug: string,
  deck: DeckData | undefined,
  role: Role,
): boolean {
  for (let l = 0; l < nLevels(slug); l++) {
    if (!levelComplete(deck, l, role)) return false;
  }
  return true;
}

export function curLevel(
  slug: string,
  deck: DeckData | undefined,
  role: Role,
): number {
  const L = nLevels(slug);
  for (let l = 0; l < L; l++) {
    if (!levelDone(deck, l, role)) return l;
  }
  return L - 1;
}

// Levels both partners have finished — the mutually "revealed" ground.
export function completedLevels(
  slug: string,
  deck: DeckData | undefined,
  role: Role,
): number[] {
  const out: number[] = [];
  for (let l = 0; l < nLevels(slug); l++) {
    if (levelComplete(deck, l, role)) out.push(l);
  }
  return out;
}

// The questions of those revealed levels: what Results may score and review.
// Levels either partner hasn't finished stay out, so the per-level reveal
// gate is never leaked around.
export function revealedQs(
  slug: string,
  deck: DeckData | undefined,
  role: Role,
) {
  return completedLevels(slug, deck, role).flatMap((l) => lvlQs(slug, l));
}

// Count of a level's questions answered by `who`.
export function doneInLevel(
  slug: string,
  lvl: number,
  deck: DeckData | undefined,
  who: Role,
): number {
  return lvlQs(slug, lvl).filter((q) => deck?.answers?.[q.id]?.[who] != null)
    .length;
}
