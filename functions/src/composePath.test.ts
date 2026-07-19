// Invariants for the Path composition. Excluded from the deploy build
// (tsconfig "exclude"); run with `npm test` in functions/.
import { describe, it, expect } from "vitest";
import { composePath, TOPICS, type Intake } from "./composePath.js";

// Intake fixtures keyed the way the client writes them (answers.{qid}).
const empty: Intake = { answers: {} };
const idx = (name: string) => TOPICS.indexOf(name as (typeof TOPICS)[number]);

const flag = (opts: {
  talk?: string[];
  avoided?: string[];
  depth?: number;
}): Intake => ({
  answers: {
    talk: (opts.talk ?? []).map(idx),
    avoided: (opts.avoided ?? []).map(idx),
    ...(opts.depth != null ? { depth: opts.depth } : {}),
  },
});

const allQids = (p: ReturnType<typeof composePath>) =>
  Object.values(p.steps).flatMap((s) => s.qids);

describe("composePath — structure", () => {
  it("always produces the nine question-steps in order", () => {
    const p = composePath(empty, empty);
    expect(Object.keys(p.steps)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8"]);
    expect(p.steps[0].key).toBe("trailhead");
    expect(p.steps[8].key).toBe("summit");
  });

  it("gives every step at least its spine questions (topic presence never signals)", () => {
    const p = composePath(empty, empty);
    for (const s of Object.values(p.steps)) expect(s.qids.length).toBeGreaterThan(0);
  });

  it("targets roughly seventy questions", () => {
    const p = composePath(empty, empty);
    expect(p.questionCount).toBeGreaterThanOrEqual(55);
    expect(p.questionCount).toBeLessThanOrEqual(85);
  });

  it("never repeats a question across the path", () => {
    const p = composePath(
      flag({ talk: ["intimacy", "money"], avoided: ["conflict"] }),
      flag({ avoided: ["faith", "past"] }),
    );
    const ids = allQids(p);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only ever selects real, non-open questions", () => {
    const p = composePath(empty, empty);
    // ids look like PREFIX-000 and none are the open 'At the table' prompt.
    for (const id of allQids(p)) expect(id).toMatch(/^[A-Z]+-\d+$/);
  });
});

describe("composePath — mechanic flavour", () => {
  it("The Summit has no guess layer; the rest do", () => {
    const p = composePath(empty, empty);
    expect(p.steps[8].mechanic).toBe("noguess");
    for (let i = 0; i < 8; i++) expect(p.steps[i].mechanic).toBe("guess");
  });
});

describe("composePath — intake weighting", () => {
  it("weights a heavily-flagged topic's step above the neutral baseline", () => {
    const neutral = composePath(empty, empty);
    // Both partners flag intimacy as avoided (heaviest weight) → The Garden (step 4) grows.
    const heavy = composePath(
      flag({ avoided: ["intimacy"] }),
      flag({ avoided: ["intimacy"] }),
    );
    expect(heavy.steps[4].qids.length).toBeGreaterThan(neutral.steps[4].qids.length);
  });

  it("is deterministic — same intakes yield an identical path (generate-once safe)", () => {
    const a = composePath(flag({ talk: ["money"] }), flag({ avoided: ["faith"] }));
    const b = composePath(flag({ talk: ["money"] }), flag({ avoided: ["faith"] }));
    expect(a).toEqual(b);
  });
});

describe("composePath — tier ramp", () => {
  it("starts gentler for an 'ease us in' couple than a 'straight to the deep' couple", () => {
    // depth 0 = ease, 2 = deep. The deep couple's early steps should skip the
    // shallowest openers, so their path is not identical to the gentle couple's.
    const gentle = composePath(flag({ depth: 0 }), flag({ depth: 0 }));
    const deep = composePath(flag({ depth: 2 }), flag({ depth: 2 }));
    expect(gentle.steps[0].qids).not.toEqual(deep.steps[0].qids);
  });
});
