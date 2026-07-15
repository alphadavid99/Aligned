import { describe, it, expect } from "vitest";
import { answersWaiting, overallAll, knownAll, isCore } from "./results";
import { DECKS } from "./questions";
import type { Session } from "../types";

// The fixed Core instrument (brief 2 §C6): 70 Agreed, 63 Known.
describe("Core aggregates", () => {
  it("has the fixed denominators — 70 agreed, 63 known", () => {
    expect(overallAll({}, "host", isCore).total).toBe(70);
    expect(knownAll({}, "host", isCore).total).toBe(63);
  });

  it("counts only both-answered core questions toward `done`", () => {
    // find a scoreable core question and answer it by both partners
    let slug = "";
    let qid = "";
    for (const s in DECKS) {
      const q = DECKS[s].questions.find((x) => x.core && x.type !== "open");
      if (q) {
        slug = s;
        qid = q.id;
        break;
      }
    }
    const decks: Session["decks"] = { [slug]: { answers: { [qid]: { host: 3, guest: 3 } } } };
    expect(overallAll(decks, "host", isCore).done).toBe(1);
    expect(overallAll(decks, "host", isCore).pct).toBe(100); // they agree
  });
});

// Solo-first: the count behind "N answers waiting for Judah" (brief §6).
describe("answersWaiting", () => {
  const decks: Session["decks"] = {
    a: {
      answers: {
        "A-1": { host: 3 }, // waiting (guest hasn't)
        "A-2": { host: 2, guest: 4 }, // both in — not waiting
        "A-3": { guest: 1 }, // only guest — not mine
      },
    },
    b: {
      answers: {
        "B-1": { host: 0 }, // waiting
      },
    },
  };

  it("counts my answers the partner hasn't matched", () => {
    expect(answersWaiting(decks, "host")).toBe(2); // A-1, B-1
  });

  it("is symmetric to the role", () => {
    expect(answersWaiting(decks, "guest")).toBe(1); // A-3 only
  });

  it("is zero for an empty session", () => {
    expect(answersWaiting(undefined, "host")).toBe(0);
    expect(answersWaiting({}, "host")).toBe(0);
  });
});
