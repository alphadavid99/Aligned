#!/usr/bin/env node
// Build the typed Path content from data/path.json (Dave-owned editable source).
//
//   data/path.json  ──►  src/data/path.generated.ts   (imported by the app)
//
// Usage:
//   node scripts/build-path.mjs           # (re)write the generated file
//   node scripts/build-path.mjs --check   # fail if the generated file is stale
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC = path.join(ROOT, "data", "path.json");
const OUT = path.join(ROOT, "src", "data", "path.generated.ts");
const CHECK = process.argv.includes("--check");

function fail(msg) {
  console.error(`\n✗ build-path: ${msg}\n`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(SRC, "utf8"));
} catch (e) {
  fail(`could not read/parse data/path.json: ${e.message}`);
}

// --- validate ---------------------------------------------------------------
const errors = [];
if (!Array.isArray(data.intake) || data.intake.length === 0) errors.push("intake must be a non-empty array");
for (const q of data.intake ?? []) {
  if (!q.id || !q.q || !q.type) errors.push(`intake "${q.id || "?"}" missing id/q/type`);
  if (!["single", "multi"].includes(q.type)) errors.push(`intake "${q.id}" type must be single|multi`);
  if (!Array.isArray(q.opts) || q.opts.length < 2) errors.push(`intake "${q.id}" needs ≥2 opts`);
}
if (!Array.isArray(data.steps) || data.steps.length !== 10) errors.push("steps must be an array of 10 (nine waypoints + The Lookout)");
const stepKeys = new Set();
for (const s of data.steps ?? []) {
  if (!s.key || !s.name || !s.glyph || !s.mechanic) errors.push(`step "${s.key || "?"}" missing key/name/glyph/mechanic`);
  if (!["guess", "noguess", "finale"].includes(s.mechanic)) errors.push(`step "${s.key}" mechanic must be guess|noguess|finale`);
  if (stepKeys.has(s.key)) errors.push(`duplicate step key: ${s.key}`);
  stepKeys.add(s.key);
  if (s.mechanic !== "finale" && !s.atTable) errors.push(`step "${s.key}" needs an atTable prompt`);
  if (!data.verses?.[s.key] || data.verses[s.key].length < 1) errors.push(`step "${s.key}" has no verses`);
}
if (errors.length) fail(`problems in data/path.json:\n  - ${errors.join("\n  - ")}`);

// --- render -----------------------------------------------------------------
const header = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/path.json. Regenerate with: npm run build:path
`;
const body = `${header}
export type IntakeType = "single" | "multi";
export interface IntakeQuestion {
  id: string;
  q: string;
  hint?: string;
  type: IntakeType;
  cap?: number;
  excl?: string;
  opts: string[];
}

export type StepMechanic = "guess" | "noguess" | "finale";
export interface PathStepMeta {
  key: string;
  name: string;
  theme: string;
  glyph: string;
  verse: string;
  ref: string;
  frame: string;
  mechanic: StepMechanic;
  atTable?: string;
}

export interface Verse {
  v: string;
  ref: string;
}

export const INTAKE: IntakeQuestion[] = ${JSON.stringify(data.intake, null, 2)};

export const PATH_STEPS: PathStepMeta[] = ${JSON.stringify(data.steps, null, 2)};

export const VERSES: Record<string, Verse[]> = ${JSON.stringify(data.verses, null, 2)};
`;

if (CHECK) {
  if (!fs.existsSync(OUT)) fail(`${path.relative(ROOT, OUT)} is missing. Run: npm run build:path`);
  if (fs.readFileSync(OUT, "utf8") !== body) fail(`${path.relative(ROOT, OUT)} is stale. Run: npm run build:path`);
  console.log(`✓ path content valid and up to date (${data.steps.length} steps, ${data.intake.length} intake questions).`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, body);
  console.log(`✓ wrote ${path.relative(ROOT, OUT)} (${data.steps.length} steps, ${data.intake.length} intake questions).`);
}
