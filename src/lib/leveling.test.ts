import { describe, it, expect } from "vitest";
import { levelsOf, nLevels, lvlQs, stageOf } from "./leveling";
import { DECKS, ORDER } from "./questions";

describe("question bank integrity", () => {
  it("has 21 conversations and 399 questions (brief 2)", () => {
    expect(ORDER).toHaveLength(21);
    const total = ORDER.reduce((n, s) => n + DECKS[s].questions.length, 0);
    expect(total).toBe(399);
  });
  it("every deck is sorted by depth ascending (brief 2 §A7b)", () => {
    for (const slug of ORDER) {
      const depths = DECKS[slug].questions.map((q) => q.depth);
      const sorted = [...depths].sort((a, b) => a - b);
      expect(depths, `${slug} not depth-sorted`).toEqual(sorted);
    }
  });
});

describe("levelsOf partitions a deck in order", () => {
  it("levels reconstruct the deck exactly, for every deck", () => {
    for (const slug of ORDER) {
      const flat = levelsOf(slug).flat();
      expect(flat).toEqual(DECKS[slug].questions); // same items, same order
    }
  });
  it("uses ~7-question levels (round(total/7), min 1)", () => {
    for (const slug of ORDER) {
      const total = DECKS[slug].questions.length;
      expect(nLevels(slug)).toBe(Math.max(1, Math.round(total / 7)));
    }
  });
  it("distributes the remainder to the earliest levels", () => {
    // A single-part deck's part 0 is the whole deck.
    const single = ORDER.find((s) => nLevels(s) === 1)!;
    expect(lvlQs(single, 0).length).toBe(DECKS[single].questions.length);
  });
});

describe("stageOf", () => {
  it("returns 0, 1, or 2 for every deck", () => {
    for (const slug of ORDER) {
      expect([0, 1, 2]).toContain(stageOf(slug));
    }
  });
});
