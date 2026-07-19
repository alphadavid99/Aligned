#!/usr/bin/env node
// Build the typed question bank from the repo-owned JSON source of truth.
//
//   data/questions.json  (flat array, one object per question)  ── the truth
//   data/decks.json      (deck metadata + display order + prefix)
//        │
//        ▼  validate, then group by deck in order
//   src/data/questions.generated.ts   (checked in; imported by the app)
//
// Usage:
//   node scripts/build-questions.mjs           # validate + (re)write the generated file
//   node scripts/build-questions.mjs --check    # validate + fail if the generated file is stale
//
// Every validation failure is collected and reported with the offending ID,
// so a bad paste tells you exactly what to fix. See CLAUDE.md §9.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const QUESTIONS_PATH = path.join(ROOT, "data", "questions.json");
const DECKS_PATH = path.join(ROOT, "data", "decks.json");
const OUT_PATH = path.join(ROOT, "src", "data", "questions.generated.ts");

const CHECK = process.argv.includes("--check");
const TYPES = new Set(["scale", "mc", "rank", "open"]);

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    fail(`Could not read/parse ${path.relative(ROOT, p)}: ${e.message}`);
  }
}

function fail(msg) {
  console.error(`\n✗ build-questions: ${msg}\n`);
  process.exit(1);
}

// --- load ---------------------------------------------------------------------
const decks = readJson(DECKS_PATH);
const questions = readJson(QUESTIONS_PATH);

if (!Array.isArray(decks) || !decks.length) fail("data/decks.json must be a non-empty array.");
if (!Array.isArray(questions) || !questions.length) fail("data/questions.json must be a non-empty array.");

// --- validate decks -----------------------------------------------------------
const errors = [];
const slugToDeck = new Map();
const prefixToSlug = new Map();
const slugToPrefix = new Map();
for (const d of decks) {
  if (!d.slug || !d.prefix || !d.name || !d.color || !d.icon) {
    errors.push(`deck "${d.slug || "?"}" is missing one of slug/prefix/name/color/icon`);
    continue;
  }
  if (slugToDeck.has(d.slug)) errors.push(`duplicate deck slug: ${d.slug}`);
  if (prefixToSlug.has(d.prefix)) errors.push(`duplicate deck prefix: ${d.prefix}`);
  slugToDeck.set(d.slug, d);
  prefixToSlug.set(d.prefix, d.slug);
  slugToPrefix.set(d.slug, d.prefix);
}
if (errors.length) fail(`deck metadata problems:\n  - ${errors.join("\n  - ")}`);

// --- allocate IDs for freshly pasted questions (write mode only) --------------
// A question may arrive with a `deck` but no `id` — assign the next free number
// for that deck's prefix so a hand-pasted block can never collide with the bank.
// (--check refuses to mutate; a missing id there is a validation error below.)
if (!CHECK) {
  const nextNum = new Map(); // prefix -> next free integer
  for (const q of questions) {
    if (typeof q.id === "string") {
      const m = q.id.match(/^([A-Z]+)-(\d+)$/);
      if (m) nextNum.set(m[1], Math.max(nextNum.get(m[1]) || 0, Number(m[2]) + 1));
    }
  }
  let allocated = 0;
  for (const q of questions) {
    if (q.id) continue;
    const prefix = slugToPrefix.get(q.deck);
    if (!prefix) fail(`a question has no id and deck "${q.deck}" is unknown — cannot allocate an id.`);
    const n = nextNum.get(prefix) || 1;
    nextNum.set(prefix, n + 1);
    q.id = `${prefix}-${String(n).padStart(3, "0")}`;
    allocated++;
    console.log(`  allocated ${q.id} (${q.deck})`);
  }
  if (allocated) {
    fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(questions, null, 2) + "\n");
    console.log(`  wrote ${allocated} new id(s) back to data/questions.json`);
  }
}

// --- validate questions -------------------------------------------------------
const seen = new Set();
for (const q of questions) {
  const id = q.id || "(no id)";
  const bad = (m) => errors.push(`${id}: ${m}`);

  if (!/^[A-Z]+-\d+$/.test(id)) { bad("id must look like PREFIX-000"); continue; }
  if (seen.has(id)) bad("duplicate id");
  seen.add(id);

  const prefix = id.split("-")[0];
  const expectedSlug = prefixToSlug.get(prefix);
  if (!expectedSlug) bad(`prefix "${prefix}" has no matching deck in data/decks.json`);
  else if (q.deck !== expectedSlug) bad(`deck "${q.deck}" does not match prefix "${prefix}" (expected "${expectedSlug}")`);

  if (!TYPES.has(q.type)) bad(`type "${q.type}" must be one of scale/mc/rank/open`);
  // `depth` (1–5) is the single internal sort key + weight; `tier`/`level` are gone.
  if (!Number.isInteger(q.depth) || q.depth < 1 || q.depth > 5) bad(`depth "${q.depth}" must be an integer 1–5`);
  if ("tier" in q || "level" in q) bad("`tier`/`level` are removed — use `depth`");
  if (typeof q.q !== "string" || !q.q.trim()) bad("question text (q) is empty");
  if (q.guessable !== true && q.guessable !== false) bad("guessable must be true or false");

  if (q.type === "mc" || q.type === "rank") {
    if (!Array.isArray(q.opts) || q.opts.length < 2) bad(`${q.type} needs at least 2 options`);
    if (q.lo || q.hi) bad(`${q.type} must not have lo/hi`);
  } else if (q.type === "scale") {
    if (!q.lo || !q.hi) bad("scale needs both lo and hi endpoint labels");
    if (q.opts) bad("scale must not have opts");
  } else if (q.type === "open") {
    if (q.opts) bad("open must not have opts");
    if (q.lo || q.hi) bad("open must not have lo/hi");
  }
}

if (errors.length) {
  fail(`${errors.length} problem(s) in the question bank:\n  - ${errors.join("\n  - ")}`);
}

// --- render generated TS ------------------------------------------------------
// Runtime carries only the fields the app renders; authoring-only columns
// (level, subcat, status, source, dateAdded) live in the JSON source only.
const order = decks.map((d) => d.slug);
const byDeck = new Map(order.map((s) => [s, []]));
for (const q of questions) byDeck.get(q.deck).push(q);
// Sort every deck by depth ascending (stable — ties keep bank order). This is
// what turns the existing ~7-per-chunk grouping into a real difficulty ramp:
// Part 1 is a deck's lightest questions, Part N its heaviest (brief §A7b).
for (const arr of byDeck.values()) arr.sort((a, b) => a.depth - b.depth);

function runtimeQuestion(q) {
  const o = { id: q.id, q: q.q, type: q.type, depth: q.depth };
  if (q.ref) o.ref = q.ref;
  if (q.note) o.note = q.note;
  if (q.guessable === true) o.guessable = true;
  if (q.complement === true) o.complement = true;
  if (q.notYet === true) o.notYet = true;
  if (q.core === true) o.core = true;
  if (q.showIf) o.showIf = q.showIf;
  if (q.complementary) o.complementary = q.complementary;
  if (q.opts) o.opts = q.opts;
  if (q.lo) o.lo = q.lo;
  if (q.hi) o.hi = q.hi;
  return o;
}

// Resolve each conversation's A7 hook (brief 2 §A7) from a question id to live
// text at build time, so rewording the question moves the hook with it.
const byId = new Map(questions.map((q) => [q.id, q]));
const decksLiteral = {};
for (const d of decks) {
  if (d.hook && !byId.has(d.hook)) {
    fail(`deck "${d.slug}" hook "${d.hook}" is not a question id`);
  }
  decksLiteral[d.slug] = {
    name: d.name,
    color: d.color,
    icon: d.icon,
    ...(d.hook ? { hook: { id: d.hook, q: byId.get(d.hook).q } } : {}),
    questions: byDeck.get(d.slug).map(runtimeQuestion),
  };
}

const header = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)
`;

const body = `${header}
export type QuestionType = "scale" | "mc" | "rank" | "open";

export interface Question {
  id: string;
  q: string;
  type: QuestionType;
  /** 1–5 internal sort key + weight. Never rendered as a number (brief 2 §A3). */
  depth: number;
  ref?: string;
  note?: string;
  /** Supports the predict-your-partner scoring layer. */
  guessable?: boolean;
  /** Scores as fully aligned even when answers differ (purple "Complementary"). */
  complement?: boolean;
  /** Offers a first-class, unscored "Not yet" answer (brief §7). */
  notYet?: boolean;
  /** Part of the fixed Core scoring instrument (brief 2 §C). */
  core?: boolean;
  /** Reserved: conditional display (brief 2 §A3). */
  showIf?: string;
  /** Reserved: id of a complementary question (brief 2 §A3). */
  complementary?: string;
  /** Options for mc / rank questions. */
  opts?: string[];
  /** Scale endpoint labels (type === "scale"). */
  lo?: string;
  hi?: string;
}

export interface Deck {
  name: string;
  color: string;
  icon: string;
  /** A7 onboarding hook — a real question from inside, resolved at build time. */
  hook?: { id: string; q: string };
  questions: Question[];
}

/** Category slugs in display order. */
export const ORDER: string[] = ${JSON.stringify(order, null, 2)};

/** All decks keyed by slug. */
export const DECKS: Record<string, Deck> = ${JSON.stringify(decksLiteral, null, 2)};
`;

// --- render the compact bank for the Cloud Functions package ------------------
// The Path generation function selects question ids server-side, so it needs
// per-question metadata (deck/type/depth/guessable/complement). The functions
// package can't import from src/, and only functions/ is uploaded at deploy, so
// we vendor a compact map into functions/src. Same source of truth, kept in sync
// by --check (below), so the two can never drift.
const FN_OUT_PATH = path.join(ROOT, "functions", "src", "questionBank.generated.ts");
const bank = {};
for (const q of questions) {
  const e = { deck: q.deck, type: q.type, depth: q.depth };
  if (q.guessable === true) e.guessable = true;
  if (q.complement === true) e.complement = true;
  bank[q.id] = e;
}
const fnBody = `${header}
// Compact question metadata for the Path generation Cloud Function.
export type QuestionType = "scale" | "mc" | "rank" | "open";
export interface BankEntry {
  deck: string;
  type: QuestionType;
  depth: number;
  guessable?: boolean;
  complement?: boolean;
}

/** Every question's selection metadata, keyed by id. */
export const BANK: Record<string, BankEntry> = ${JSON.stringify(bank, null, 2)};
`;

function checkFile(outPath, expected, label) {
  if (!fs.existsSync(outPath)) {
    fail(`${path.relative(ROOT, outPath)} is missing. Run: npm run build:questions`);
  }
  if (fs.readFileSync(outPath, "utf8") !== expected) {
    fail(`${path.relative(ROOT, outPath)} is stale. Run: npm run build:questions`);
  }
  void label;
}

if (CHECK) {
  checkFile(OUT_PATH, body);
  checkFile(FN_OUT_PATH, fnBody);
  console.log(`✓ question bank valid and up to date (${questions.length} questions, ${decks.length} decks).`);
} else {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, body);
  fs.mkdirSync(path.dirname(FN_OUT_PATH), { recursive: true });
  fs.writeFileSync(FN_OUT_PATH, fnBody);
  console.log(`✓ wrote ${path.relative(ROOT, OUT_PATH)} + ${path.relative(ROOT, FN_OUT_PATH)} (${questions.length} questions, ${decks.length} decks).`);
}
