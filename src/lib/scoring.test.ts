import { describe, it, expect } from "vitest";
import {
  scoreQ,
  overall,
  knowScore,
  isComplement,
  jointQuestions,
  weightOf,
  combinedImportance,
  NOT_YET,
  type DeckData,
} from "./scoring";
import type { Question } from "./questions";

const scale = (id = "S"): Question => ({ id, q: "", type: "scale", depth: 3 });
const mc = (id = "M"): Question => ({
  id,
  q: "",
  type: "mc",
  depth: 3,
  opts: ["a", "b"],
});
const rank = (id = "R"): Question => ({
  id,
  q: "",
  type: "rank",
  depth: 3,
  opts: ["a", "b", "c", "d"],
});

// answers/guesses helper
const deck = (
  answers: DeckData["answers"],
  guesses?: DeckData["guesses"],
): DeckData => ({ answers, guesses });

describe("scoreQ — scale", () => {
  it("agreed when equal", () => {
    const r = scoreQ(scale(), deck({ S: { host: 3, guest: 3 } }), "host");
    expect(r.score).toBe(1);
    expect(r.verdict).toBe("Agreed");
  });
  it("close when one apart", () => {
    const r = scoreQ(scale(), deck({ S: { host: 3, guest: 4 } }), "host");
    expect(r.score).toBeCloseTo(0.75);
    expect(r.verdict).toBe("Close");
  });
  it("worth a chat at the extremes", () => {
    const r = scoreQ(scale(), deck({ S: { host: 1, guest: 5 } }), "host");
    expect(r.score).toBe(0);
    expect(r.verdict).toBe("Worth a chat");
  });
});

describe("scoreQ — mc", () => {
  it("agreed / worth a chat", () => {
    expect(scoreQ(mc(), deck({ M: { host: 0, guest: 0 } }), "host").score).toBe(1);
    expect(scoreQ(mc(), deck({ M: { host: 0, guest: 1 } }), "host").score).toBe(0);
  });
});

describe("scoreQ — rank", () => {
  it("identical order agrees", () => {
    const r = scoreQ(rank(), deck({ R: { host: "0,1,2,3", guest: "0,1,2,3" } }), "host");
    expect(r.score).toBe(1);
    expect(r.verdict).toBe("Agreed");
  });
  it("one swap is close (0.75)", () => {
    const r = scoreQ(rank(), deck({ R: { host: "0,1,2,3", guest: "1,0,2,3" } }), "host");
    expect(r.score).toBeCloseTo(0.75);
    expect(r.verdict).toBe("Close");
  });
  it("full reversal is 0 / worth a chat", () => {
    const r = scoreQ(rank(), deck({ R: { host: "0,1,2,3", guest: "3,2,1,0" } }), "host");
    expect(r.score).toBe(0);
    expect(r.verdict).toBe("Worth a chat");
  });
});

describe("scoreQ — open", () => {
  it("is shared, unscored", () => {
    const r = scoreQ({ id: "O", q: "", type: "open", depth: 1 }, deck({ O: { host: "x", guest: "y" } }), "host");
    expect(r.score).toBeNull();
    expect(r.verdict).toBe("Shared");
    expect(r.open).toBe(true);
  });
});

describe("complementary (PAR-004)", () => {
  const par: Question = { id: "PAR-004", q: "", type: "scale", depth: 3 };
  it("is flagged", () => expect(isComplement(par)).toBe(true));
  it("differing answers still score 1, verdict Complementary", () => {
    const r = scoreQ(par, deck({ "PAR-004": { host: 1, guest: 5 } }), "host");
    expect(r.score).toBe(1);
    expect(r.verdict).toBe("Complementary");
  });
  it("equal answers are simply Agreed", () => {
    const r = scoreQ(par, deck({ "PAR-004": { host: 3, guest: 3 } }), "host");
    expect(r.verdict).toBe("Agreed");
  });
});

describe("guess layer", () => {
  it("tracks my guess and theirs", () => {
    // host guessed guest=1 (guest actually 1 -> right); guest guessed host=0 (host is 0 -> right)
    const r = scoreQ(
      mc(),
      deck({ M: { host: 0, guest: 1 } }, { M: { host: 1, guest: 0 } }),
      "host",
    );
    expect(r.guessed).toBe(true);
    expect(r.guessRight).toBe(true);
    expect(r.theyGuessed).toBe(true);
    expect(r.theyGuessRight).toBe(true);
  });
  it("wrong guess flagged", () => {
    const r = scoreQ(mc(), deck({ M: { host: 0, guest: 1 } }, { M: { host: 0 } }), "host");
    expect(r.guessed).toBe(true);
    expect(r.guessRight).toBe(false);
  });
});

describe("aggregate scores", () => {
  const qs = [scale("A"), scale("B"), mc("C")];
  const d = deck({
    A: { host: 3, guest: 3 }, // 1
    B: { host: 3, guest: 4 }, // 0.75
    C: { host: 0, guest: 1 }, // 0
  });
  it("jointQuestions needs both answers", () => {
    const partial = deck({ A: { host: 3 }, B: { host: 3, guest: 4 } });
    expect(jointQuestions(qs, partial).map((q) => q.id)).toEqual(["B"]);
  });
  it("overall averages to a rounded %", () => {
    // (1 + 0.75 + 0) / 3 = 0.5833 -> 58
    expect(overall(qs, d, "host")).toBe(58);
  });
  it("knowScore counts guesses made/right", () => {
    const guessable = [{ ...mc("C"), guessable: true }];
    const r = knowScore(guessable, deck({ C: { host: 0, guest: 1 } }, { C: { host: 1, guest: 0 } }), "host");
    expect(r).toEqual({ pct: 100, made: 2, right: 2 });
  });
});

describe("Not yet (§7)", () => {
  it("drops the question from joint/agreement/known but not from 'answered'", () => {
    const qs = [mc("A"), mc("B")];
    const d = deck(
      { A: { host: NOT_YET, guest: 0 }, B: { host: 0, guest: 0 } },
      { A: { host: 1 } }, // even a (wrong) guess on a not-yet must not score
    );
    expect(jointQuestions(qs, d).map((q) => q.id)).toEqual(["B"]);
    expect(overall(qs, d, "host")).toBe(100); // only B counts, and it's agreed
    // A still reads as answered by host (non-null) — that's the null-vs-chosen line
    expect(d.answers!.A.host).toBe(NOT_YET);
  });
});

describe("weighting (brief 2 §1a — depth)", () => {
  const at = (id: string, depth: number): Question => ({ id, q: "", type: "scale", depth });

  it("weightOf uses depth as the default weight (5 buckets)", () => {
    expect(weightOf(at("A", 1))).toBe(0.5);
    expect(weightOf(at("A", 2))).toBe(0.75);
    expect(weightOf(at("A", 3))).toBe(1);
    expect(weightOf(at("A", 4))).toBe(1.5);
    expect(weightOf(at("A", 5))).toBe(2);
  });

  it("a depth-5 question outweighs a depth-1 by 4× (DoD)", () => {
    expect(weightOf(at("A", 5)) / weightOf(at("A", 1))).toBe(4);
  });

  it("an importance rating (1..5) overrides the depth weight", () => {
    expect(weightOf(at("C", 5), 5)).toBeCloseTo(5 / 3);
    expect(weightOf(at("C", 5), 1)).toBeCloseTo(1 / 3); // depth-5, yet barely counts
    expect(weightOf(at("A", 1), 3)).toBe(1);
  });

  // Same three scores; only the weights differ. Flat-mean = 58, so any change
  // proves the weighting is live. depths 1/3/5 give weights 0.5/1/2.
  const qs = [at("A", 1), at("B", 3), at("C", 5)];
  const answers = {
    A: { host: 3, guest: 3 }, // score 1
    B: { host: 3, guest: 4 }, // score 0.75
    C: { host: 1, guest: 5 }, // score 0
  };

  it("a flat-weight (single-depth) fixture matches the old flat mean", () => {
    const flat = [at("A", 3), at("B", 3), at("C", 3)];
    expect(overall(flat, deck(answers), "host")).toBe(58);
  });

  it("depth weights move the number (58 → 36)", () => {
    // (1·0.5 + 0.75·1 + 0·2) / (0.5+1+2) = 1.25/3.5 = 0.357 → 36
    expect(overall(qs, deck(answers), "host")).toBe(36);
  });

  it("combinedImportance takes the higher of the two partners' ratings", () => {
    const d: DeckData = { ...deck(answers), importance: { C: { host: 1, guest: 5 } } };
    expect(combinedImportance(at("C", 5), d)).toBe(5);
    // C now weighs 5/3 instead of depth-5's 2:
    // (0.5 + 0.75 + 0) / (0.5 + 1 + 5/3) = 1.25/3.167 = 0.3947 → 39
    expect(overall(qs, d, "host")).toBe(39);
  });

  it("stays symmetric — host and guest see the same number", () => {
    const d: DeckData = { ...deck(answers), importance: { C: { host: 5, guest: 1 } } };
    expect(overall(qs, d, "host")).toBe(overall(qs, d, "guest"));
  });
});
