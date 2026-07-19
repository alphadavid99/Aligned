# TwoAgree — Project Knowledge (for the claude.ai Project)

**Paste this file as the knowledge document in your Claude Project.** It is written
for *ideation and thinking*, not for building. The Project cannot see the codebase,
the live site, or Firebase — it reasons only from what's written here. When something
needs to actually be built, changed, tested, or deployed, that's a job for **Claude
Code** (which has the repo), not this Project.

> This is the *thinking* brief. The repo's `CLAUDE.md` is the *builder's* brief and is
> the source of truth for anything technical — if the two ever disagree, `CLAUDE.md`
> in the repo wins.

_Last synced: Jul 2026._

---

## 0. How to use this Project vs Claude Code

- **This Project (claude.ai):** decide *what* to build and why. Feature ideas, product
  and philosophy debates, brand/tone/copy, drafting and sharpening questions for the
  bank, roadmap prioritisation, GDPR/legal framing, marketing. No code access — so keep
  it at the level of ideas, decisions, and drafts.
- **Claude Code:** actually build it. It has the repo, runs tests, edits files, and
  deploys. Hand it the ideas that survive discussion here.
- **The handoff:** when an idea is ready, the output of this Project is usually a crisp
  spec or a block of drafted questions. Take that to Claude Code to implement.

---

## 1. What TwoAgree is

A faith-based (non-denominational, Christian) **couples compatibility app**. Two
partners answer the same questions independently; their answers are scored for
alignment; results **surface conversation, they don't declare a winner**.

Core philosophy: **"surface, don't settle."** The product exists to get honest things
onto the table before a couple commits — not to gamify, score-shame, or judge.

**Name & meaning:** *TwoAgree*, from **Amos 3:3** — *"Can two walk together, unless they
are agreed?"* Two partners, walking together, only if they're agreed. That's the whole
product in one line. (Formerly **Aligned** — same product, pre-rename.)

**Design values (non-negotiable):**
- No gamified guilt mechanics — no streaks, no loss-aversion, no competitive "you vs
  them" framing.
- Calm, devotional tone. Collaborative framing throughout ("the two of you", "where you
  landed").
- Honest and direct on contentious topics (abortion, same-sex marriage, gender roles,
  sex before marriage, etc.). **Do not soften or add "politically correct" hedging** —
  surfacing the real position is the entire point.
- Owner/dev is **Dave** (product + sole developer). Test partner referenced as MRL.
- Placeholder names in mockups: **Sarah** (user) / **Judah** (partner).

---

## 2. Current state (Jul 2026) — this is the big update

The old knowledge said "single static `index.html`, Aligned, project `aligned-9f843`."
**All of that is dead.** Reality now:

- **Live product** at **twoagree.app**, rebuilt as a proper **React + TypeScript + Vite**
  app. The static `index.html` era is over.
- **Firebase project is `twoagreeapp`** (region europe-west1, Blaze plan). The old
  project **`aligned-9f843` is DEAD** — never reference it as a live target.
- **New GitHub repo** (`TwoAgree`). New Firebase Hosting. New domain.
- The build is **well into Phase 3** of the roadmap — not a fresh start. Already exists:
  - Auth (email/password + Google) and `users/{uid}` profiles with base64 avatars.
  - Realtime sync via SDK `onValue` listeners (the old 1.5s REST polling is gone).
  - Security rules locked to session members, emulator-tested.
  - Cloud Functions: GDPR `exportMyData` / `deleteMyAccount`, plus `joinByCode`,
    `createInvite`, `redeemInvite`.
  - Scoring, complementary-verdict logic, deck leveling, guess/predict layer — all
    ported into typed modules.
  - French **i18n** groundwork.
- **Some internal identifiers still read `aligned` by design** (localStorage keys, the
  word "aligned" in scoring vocabulary). That is deliberate, not a bug to chase.

**What's left / where thinking is most useful:** launch polish, recruiting testers,
watching retention, and eventually native (Capacitor wrapping the same build) — but only
*after* web retention proves out. Native is a packaging step, not a rewrite.

---

## 3. Question bank (where ideation pays off most)

The bank is the heart of the product and the place where this Project earns its keep —
drafting, sharpening, and pressure-testing questions.

- **~415 questions across 21 decks** (grown from the old "271 / 19"). Largest decks:
  us-compatibility, faith-worship-practice, conflict-communication,
  character-self-awareness, where-we-are-now.
- Question **types:** `SCALE`, `MC` (multiple choice), `RANK`, `OPEN`. `OPEN` is kept
  deliberately for disclosure/identity prompts and **cannot** feed alignment scores.
- **Guessable** flag marks questions that support the "predict your partner" layer. All
  `RANK` questions are non-guessable.
- **Complementary scoring:** some questions score as fully aligned even when answers
  differ (a purple "Complementary" verdict) — for genuinely complementary differences,
  not disagreements.
- **Question principle:** don't take a prompt literally — extract the underlying *value*.
  Don't be too quick to dismiss something as a duplicate or unscoreable; re-mine harder
  when challenged.
- Tone reminder: on hot-button topics, write the question that surfaces the real
  position. No hedging.

> Mechanically, the bank lives as one source-of-truth file in the repo and is built into
> typed data by Claude Code. This Project's job is to **draft and refine the question
> text and options**; Claude Code's job is to add them to the bank and validate IDs. So
> the ideal output here is a clean block of proposed questions (prompt + type + options +
> which deck + guessable? + any complementary note), ready to hand off.

---

## 4. Brand (so ideation stays on-brand)

- **Name is the mark.** The logo is the **TwoAgree mark** — two leaning strokes + a
  floating gold bar — and it doubles as the **A** in the "TwoAgree" wordmark. Never treat
  "TwoAgree" as plain text in UI mockups.
- **Colour — "Claret & Gold":**
  - **Claret `#3E1A2E`** — primary. Grounds, headers, primary buttons.
  - **Honey/Gold `#C6913C`** — accent. **Only ever on a claret ground** (fails contrast on
    white). The app also runs a warm honey accent on light grounds for pills/CTAs (a
    Dave-approved deviation).
  - **Blush `#F3DED6`** — cards, callouts, selected states.
  - **White** — in-app screen background (the default). **Paper `#FBF6F0` is
    marketing-only**, never app screens.
- **The three rules:** (1) gold only on claret; (2) app screens are white, blush is the
  card surface, paper is marketing-only; (3) the mark is the A.
- **Fonts:** wordmark = Inter; UI = Hanken Grotesk; display = Fraunces. Self-hosted, no
  Google CDN (GDPR).
- **Surfaces:** soft-blush ground with pure-white cards floating on it — never cream.

The full, locked spec lives in `TWOAGREE-MARK.md` and `BRAND-REPORT.md` in the repo.
Don't redesign the mark; it's measured and locked.

---

## 5. GDPR / launch gate (keep it in mind when ideating features)

TwoAgree collects **special-category data** (religion, sex life, health answers) on real
people in the UK. Any feature idea should respect:
- Privacy policy + consent at sign-up.
- Account **export** and **delete** (delete cascades across the user's profile and every
  session they're in — already built as Cloud Functions).
- Don't invent legal specifics — **Dave is not a lawyer; flag legal questions for him to
  confirm** rather than asserting them.

---

## 6. How Dave likes to work

- Fast and direct. Diagnose independently; don't ask for clarification that can be
  reasoned out.
- **Honest pushback and expert disagreement are wanted, not agreement.** If an idea is
  weak, say so and say why.
- Recommend **what's best**, but "best" for a solo dev is **lean and shippable**, not
  maximal. The thing that kills solo apps is over-architecting before anyone proves
  retention.
- When exploring options, make **distinct** choices — minor look-alike variations
  frustrate him.

---

## 7. What NOT to assume (stale facts to forget)

- ❌ "It's a static `index.html` with no build step" → it's a React/TS/Vite app.
- ❌ "The project is `aligned-9f843`" → it's `twoagreeapp`, and the old one is dead.
- ❌ "It's called Aligned" → it's **TwoAgree** (twoagree.app).
- ❌ "271 questions / 19 categories" → ~415 questions / 21 decks.
- ❌ "Data is read via unauthenticated REST polling" → SDK listeners, locked rules, auth.
- ❌ The C3 caret logo → retired; the TwoAgree mark replaces it.
