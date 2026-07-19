// The Path — client-side helpers. The Path is a SEQUENCER over the existing
// question engine (brief §"get-this-right #1"): it never stores answers in a new
// shape. A step's bank questions are answered under their real deck slug (so an
// answer given here counts in that deck too, and one already answered there
// counts complete here — the brief's overlap rule, for free). The one Path-only
// thing is the per-step "At the table" OPEN prompt, stored under a synthetic
// deck slug so it flows through the existing OPEN mechanics.
import { DECKS, type Question } from "./questions";
import type { DeckData, Role } from "./scoring";
import { jointQuestions } from "./scoring";
import type { Session, PathStepData } from "../types";
import { PATH_STEPS, type PathStepMeta } from "../data/path.generated";

// Synthetic deck slug that holds the "At the table" open answers (keyed by step
// key). Distinct from the sessions/{code}/path node (the curriculum structure).
export const AT_TABLE_SLUG = "at-table";
export const atTableQid = (stepKey: string) => `attable-${stepKey}`;

// qid → its Question plus the real deck slug it lives in. Built once from the
// generated bank so the Path can route answers to the right deck.
const BY_ID: Record<string, { q: Question; slug: string }> = {};
for (const slug of Object.keys(DECKS)) {
  for (const q of DECKS[slug].questions) BY_ID[q.id] = { q, slug };
}

export const questionOf = (qid: string): Question | undefined => BY_ID[qid]?.q;
export const deckOf = (qid: string): string | undefined => BY_ID[qid]?.slug;

// Step display metadata (name, glyph, verses, at-table prompt), keyed by key.
export const stepMeta = (key: string): PathStepMeta | undefined =>
  PATH_STEPS.find((s) => s.key === key);

// The synthetic OPEN Question for a step's "At the table" prompt.
export function atTableQuestion(stepKey: string): Question | null {
  const meta = stepMeta(stepKey);
  if (!meta?.atTable) return null;
  return { id: atTableQid(stepKey), q: meta.atTable, type: "open", depth: 1 };
}

// The playable questions of a step, in order: its bank questions then the open
// "At the table" prompt (the last item in every step).
export function stepQuestions(step: PathStepData): Question[] {
  const bank = step.qids.map(questionOf).filter((q): q is Question => !!q);
  const at = atTableQuestion(step.key);
  return at ? [...bank, at] : bank;
}

// Merge the answers/guesses/importance for a step's questions into one DeckData,
// pulling each bank question from its real deck and the open prompt from the
// synthetic at-table deck. This is what feeds the existing RevealScreen/scoring.
export function stepDeckData(session: Session, step: PathStepData): DeckData {
  const out: DeckData = { answers: {}, guesses: {}, importance: {} };
  for (const qid of step.qids) {
    const slug = deckOf(qid);
    const d = slug ? session.decks?.[slug] : undefined;
    if (d?.answers?.[qid]) out.answers![qid] = d.answers[qid];
    if (d?.guesses?.[qid]) out.guesses![qid] = d.guesses[qid];
    if (d?.importance?.[qid]) out.importance![qid] = d.importance[qid];
  }
  const at = session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key];
  if (at) out.answers![atTableQid(step.key)] = at;
  return out;
}

// Has `role` answered a specific question (looked up in its real deck)?
function answered(session: Session, qid: string, role: Role): boolean {
  const slug = deckOf(qid);
  return slug ? session.decks?.[slug]?.answers?.[qid]?.[role] != null : false;
}

// Has `role` finished a whole step (every bank question + the at-table prompt)?
export function stepDoneBy(session: Session, step: PathStepData, role: Role): boolean {
  if (!step.qids.every((qid) => answered(session, qid, role))) return false;
  const at = atTableQuestion(step.key);
  if (at) return session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key]?.[role] != null;
  return true;
}

// A step is revealable once BOTH partners have finished it and there is joint
// material to show (mirrors the deck reveal gate).
export function stepRevealable(session: Session, step: PathStepData, role: Role): boolean {
  const other: Role = role === "host" ? "guest" : "host";
  if (!stepDoneBy(session, step, role) || !stepDoneBy(session, step, other)) return false;
  return jointQuestions(stepQuestions(step), stepDeckData(session, step)).length > 0;
}

export const lampLit = (session: Session, index: number): boolean =>
  session.pathLamps?.[String(index)] === true;

// The step list, ordered, as {index, key, data}. The path node keys steps by
// numeric index; The Lookout (finale) has no data node.
export function orderedSteps(session: Session): { index: number; data: PathStepData }[] {
  const steps = session.path?.steps ?? {};
  return Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b)
    .map((index) => ({ index, data: steps[String(index)] }));
}

// The first step whose lamp isn't lit — the couple's current position. Returns
// the step count (all lit → at The Lookout) when the whole trail is walked.
export function currentIndex(session: Session): number {
  const steps = orderedSteps(session);
  for (const { index } of steps) if (!lampLit(session, index)) return index;
  return steps.length; // all question-steps done → The Lookout
}

export const pathReady = (session: Session | null): boolean =>
  !!session?.path?.steps && Object.keys(session.path.steps).length > 0;
