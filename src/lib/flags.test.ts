import { describe, it, expect } from "vitest";
import { scoreQ, type DeckData } from "./scoring";
import { collectFlagRows, groupFlagRows } from "./flags";
import type { Question } from "./questions";

const mc = (id = "M"): Question => ({
  id,
  q: "",
  type: "mc",
  depth: 3,
  opts: ["a", "b"],
  guessable: true,
});
const scale = (id = "S"): Question => ({ id, q: "", type: "scale", depth: 3 });

describe("blindSpot flag (§4a)", () => {
  it("fires on a Worth-a-chat difference the partner guessed wrong", () => {
    // host 0, guest 1 → Worth a chat. host guessed guest=0 (wrong).
    const d: DeckData = {
      answers: { M: { host: 0, guest: 1 } },
      guesses: { M: { host: 0 } },
    };
    const r = scoreQ(mc(), d, "host");
    expect(r.verdict).toBe("Worth a chat");
    expect(r.flags).toContain("blindSpot");
  });

  it("does NOT fire when the guess was right", () => {
    const d: DeckData = {
      answers: { M: { host: 0, guest: 1 } },
      guesses: { M: { host: 1 } }, // host correctly guessed guest=1
    };
    expect(scoreQ(mc(), d, "host").flags).not.toContain("blindSpot");
  });

  it("excludes Close", () => {
    // scale 3 vs 4 → Close, even with a wrong guess
    const d: DeckData = {
      answers: { S: { host: 3, guest: 4 } },
      guesses: { S: { host: 1 } },
    };
    const r = scoreQ({ ...scale(), guessable: true }, d, "host");
    expect(r.verdict).toBe("Close");
    expect(r.flags).not.toContain("blindSpot");
  });

  it("excludes Complementary", () => {
    const par: Question = { id: "PAR-004", q: "", type: "scale", depth: 3, guessable: true };
    const d: DeckData = {
      answers: { "PAR-004": { host: 1, guest: 5 } },
      guesses: { "PAR-004": { host: 5 } }, // wrong
    };
    const r = scoreQ(par, d, "host");
    expect(r.verdict).toBe("Complementary");
    expect(r.flags).not.toContain("blindSpot");
  });

  it("excludes open and rank", () => {
    const open: Question = { id: "O", q: "", type: "open", depth: 1 };
    const rank: Question = { id: "R", q: "", type: "rank", depth: 3, opts: ["a", "b", "c"] };
    expect(scoreQ(open, { answers: { O: { host: "x", guest: "y" } } }, "host").flags).toEqual([]);
    const rd: DeckData = { answers: { R: { host: "0,1,2", guest: "2,1,0" } } };
    expect(scoreQ(rank, rd, "host").flags).not.toContain("blindSpot");
  });
});

describe("unevenStakes flag (§4b)", () => {
  it("fires on a gap ≥ 3, independent of the verdict (even Agreed)", () => {
    const d: DeckData = {
      answers: { M: { host: 0, guest: 0 } }, // Agreed
      importance: { M: { host: 5, guest: 1 } },
    };
    const r = scoreQ(mc(), d, "host");
    expect(r.verdict).toBe("Agreed");
    expect(r.flags).toContain("unevenStakes");
  });

  it("does not fire on a gap < 3", () => {
    const d: DeckData = {
      answers: { M: { host: 0, guest: 0 } },
      importance: { M: { host: 4, guest: 2 } }, // gap 2
    };
    expect(scoreQ(mc(), d, "host").flags).not.toContain("unevenStakes");
  });

  it("does not fire when only one partner rated importance", () => {
    const d: DeckData = {
      answers: { M: { host: 0, guest: 0 } },
      importance: { M: { host: 5 } },
    };
    expect(scoreQ(mc(), d, "host").flags).not.toContain("unevenStakes");
  });
});

describe("collectFlagRows ordering (§5b)", () => {
  it("orders mutual blindSpot, then one-sided, then unevenStakes", () => {
    const oneSided = { ...mc("A") };
    const mutual = { ...mc("B") };
    const stakes = { ...mc("C") };
    const d: DeckData = {
      answers: {
        A: { host: 0, guest: 1 }, // Worth a chat
        B: { host: 0, guest: 1 }, // Worth a chat
        C: { host: 0, guest: 0 }, // Agreed
      },
      guesses: {
        A: { host: 0 }, // host wrong only → one-sided
        B: { host: 0, guest: 1 }, // both wrong → mutual
      },
      importance: { C: { host: 5, guest: 1 } }, // uneven
    };
    const rows = collectFlagRows([oneSided, mutual, stakes], d, "host");
    expect(rows.map((r) => `${r.flag}:${r.q.id}:${r.mutual}`)).toEqual([
      "blindSpot:B:true",
      "blindSpot:A:false",
      "unevenStakes:C:false",
    ]);
  });

  it("a question with both flags appears once per group", () => {
    const both = { ...mc("A") };
    const d: DeckData = {
      answers: { A: { host: 0, guest: 1 } }, // Worth a chat
      guesses: { A: { host: 0 } }, // wrong → blindSpot
      importance: { A: { host: 5, guest: 1 } }, // uneven
    };
    const rows = collectFlagRows([both], d, "host");
    const grouped = groupFlagRows(rows);
    expect(grouped.blindSpot).toHaveLength(1);
    expect(grouped.unevenStakes).toHaveLength(1);
  });
});
