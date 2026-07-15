import { describe, it, expect } from "vitest";
import { answersWaiting } from "./results";
import type { Session } from "../types";

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
