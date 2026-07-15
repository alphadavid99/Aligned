import { describe, it, expect } from "vitest";
import {
  scoreQ,
  overall,
  knowScore,
  isComplement,
  jointQuestions,
  type DeckData,
} from "./scoring";
import type { Question } from "./questions";

const scale = (id = "S"): Question => ({ id, q: "", type: "scale", tier: "2" });
const mc = (id = "M"): Question => ({
  id,
  q: "",
  type: "mc",
  tier: "2",
  opts: ["a", "b"],
});
const rank = (id = "R"): Question => ({
  id,
  q: "",
  type: "rank",
  tier: "2",
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
    const r = scoreQ({ id: "O", q: "", type: "open", tier: "1" }, deck({ O: { host: "x", guest: "y" } }), "host");
    expect(r.score).toBeNull();
    expect(r.verdict).toBe("Shared");
    expect(r.open).toBe(true);
  });
});

describe("complementary (PAR-004)", () => {
  const par: Question = { id: "PAR-004", q: "", type: "scale", tier: "2" };
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
