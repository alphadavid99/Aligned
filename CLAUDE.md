# CLAUDE.md — Aligned

Project brief and working agreement for Claude Code. Read this fully before touching code.

---

## 1. What Aligned is

A faith-based (non-denominational, Christian) **couples compatibility app**. Two partners answer the same questions independently; their answers are scored for alignment; results **surface conversation, they don't declare a winner**.

Core philosophy: **"surface, don't settle."** The product exists to get honest things onto the table before a couple commits, not to gamify or judge.

**Design values (non-negotiable):**
- No gamified guilt mechanics — no streaks, no loss-aversion, no competitive "you vs them" framing.
- Calm, devotional tone. Collaborative framing throughout ("the two of you", "where you landed").
- Honest and direct on contentious topics (abortion, same-sex marriage, gender roles, sex before marriage, etc.). **Do not soften or add "politically correct" hedging** to hot-button questions — surfacing the real position is the point.
- Owner/dev is **Dave** (product + sole developer). Test partner referenced as MRL.

---

## 2. Direction — READ THIS

Historically Aligned was a **single static `index.html`, no build step**. That constraint is **dropped**. Aligned is being **rebuilt as a proper React + TypeScript + Vite app**.

Sequencing (this drives every architecture decision): **web first**, to recruit testers, **then iOS + Android via Capacitor** wrapping the same codebase. Build toward the native endgame so the UI is built **once**. React + Capacitor was chosen over Expo/React-Native because the web experience is the priority right now, and over Flutter to stay in the JS/TS ecosystem.

What "proper app" means here, and what it does NOT:
- **DOES mean:** clean React components, TypeScript, sensible folder structure, tested logic, and — most importantly — a **locked-down secure backend**.
- **Does NOT mean:** Redux, Next.js/SSR, GraphQL, a hand-built design system, or any heavy abstraction. This is a solo build recruiting its first testers. Reach for a library when something actually hurts, not preemptively. The thing that kills solo apps is over-architecting before anyone proves retention.

Dave's standing instruction: recommend **what's best**, not the most minimal option — but "best" for a solo dev is lean and shippable, not maximal.

---

## 3. Current state (what exists today)

- `index.html` — the entire working app, ~758 lines, vanilla JS, hand-rolled DOM rendering. **It works.** Session flow, deck play, guess layer, scoring, reveal screens, results, profile stub.
- Data lives in **Firebase Realtime Database (RTDB)**, currently accessed by **unauthenticated REST `fetch`** with no Content-Type header (a CORS-preflight dodge that only works because the DB is wide open). **This is the #1 thing to fix.**
- Sync is **1.5s REST polling** (`setInterval(refresh, 1500)`). Replace with SDK `onValue` listeners.
- Question bank: **271 questions across 19 categories**, maintained as BOTH an `.xlsx` workbook and a self-contained HTML viewer — the two must stay in sync as canonical deliverables.
- A **standalone auth test page** (`aligned-accounts.html`) already exists: Firebase Auth (email/password + Google), editable name/bio, and a photo picker that square-crops + downscales to a ~256px JPEG stored as base64. It's the reference for the auth/profile layer — port its logic, upgrade it to the modular SDK.

---

## 4. Firebase project

- Project: **`aligned-9f843`**, region **europe-west1**. Plan: **Blaze** (Functions/Hosting available).
- RTDB URL: `https://aligned-9f843-default-rtdb.europe-west1.firebasedatabase.app`
- Web config (apiKey / messagingSenderId / appId) comes from **console → Project settings → Your apps → Web app**. It is not secret (public by design) but store it via Vite env (`VITE_FIREBASE_*`) with `.env.local` gitignored and a committed `.env.example`.

---

## 5. Target architecture (production)

- **Framework:** **React + TypeScript**, built with **Vite**. Function components + hooks. Wrap Firebase's realtime listeners in a few custom hooks (e.g. `useSession(code)`, `useProfile(uid)`) so components stay clean.
- **Styling:** reuse the existing brand tokens as CSS variables (they already live in the current `:root`). Plain CSS / CSS Modules is fine — do not stand up a component library or design system yet.
- **Native later:** **Capacitor** wraps this same web build into iOS + Android apps when web retention justifies it. Keep the code Capacitor-friendly: no hard dependency on browser-only globals in core logic, keep device features (camera, push) behind small adapter modules so swapping web→native plugin is a one-file change. Do NOT add Capacitor in Phase 0 — it's a later packaging step, not a rewrite.
- **Firebase modular SDK v9+** (`firebase/app`, `firebase/auth`, `firebase/database`), imported per-function (tree-shakeable).
- **Real-time via `onValue` listeners** inside the hooks, not REST polling.
- **Cloud Functions** for anything the client can't be trusted with: partner-invite emails, GDPR account deletion (cascade across `users` + `sessions`). Scoring stays client-side for now (a user could only "forge" their own alignment number — low stakes).
- **Firebase Hosting** for deploy (unifies hosting + auth + db + functions; custom domain, SSL, preview channels).
- **Emulator Suite** for all local dev and rules testing. Nothing security-related ships without an emulator test first.

**The backend is the real production gate, not the frontend.** A polished React app on an open database is not a proper app. Locked rules + Functions + emulator tests are the actual work; React makes it *look* finished before it is. Do not let the polish mask an unsecured backend.

---

## 6. Data model

**Identity is role-based (`host` / `guest`) and the entire scoring/reveal layer depends on it. DO NOT re-key it.** Accounts are layered on **additively**.

```
users/{uid}
  name, bio, photo(base64), email, created, updated

sessions/{CODE}
  created
  members/
    host/  { name, uid }      # name auto-filled from users/{uid} at create time
    guest/ { name, uid }      # name auto-filled from users/{uid} at join time
  uids/                       # membership set, for security rules
    {hostUid}: true
    {guestUid}: true
  decks/{slug}/
    answers/{qid}/{host|guest}
    guesses/{qid}/{host|guest}
    done/{level}/{host|guest}
```

The additive graft: a signed-in user has ONE persistent `users/{uid}` profile; `createSession`/`joinSession` write `uid` into the member slot and copy `name`/`photo` from the profile so all downstream host/guest code is untouched. Add the `uids` set so rules can gate membership.

**RTDB gotcha (hard-won):** Firebase silently drops empty objects. Never write `{}`. Always write scalar leaves so RTDB auto-creates intermediates, and guard nested writes (`cur.answers = cur.answers || {}`).

---

## 7. Security rules — first cut, VALIDATE IN EMULATOR

Locking `users` is straightforward. Locking `sessions` for "join-by-code but read only to members" is genuinely fiddly in RTDB — this is exactly why we now have the emulator. Treat the `sessions` block below as a starting point to test and refine, not as final.

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read":  "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "sessions": {
      "$code": {
        ".read":  "auth != null && data.child('uids').child(auth.uid).exists()",
        ".write": "auth != null && (data.child('uids').child(auth.uid).exists() || !data.child('members/guest').exists())",
        "uids": { "$uid": { ".validate": "auth.uid === $uid" } }
      }
    }
  }
}
```

Test with two fake emulator accounts: host creates, guest joins by code, both can read/write their own answers, a third signed-in stranger is denied read.

---

## 8. GDPR / launch gate

Aligned collects **special-category data** (religion, sex life, health answers) on real people in the UK. Before onboarding strangers:
- Privacy policy + a consent point at sign-up.
- **Account export** and **delete-account** that cascades across `users` and all `sessions` the user is a member of (implement delete as a Cloud Function — the client can't be trusted to fully purge, and rules won't let it touch the partner's data).
- Build the export/delete controls INTO the profile screen from the start, not as a retrofit.

Dave is not a lawyer; flag legal specifics for him to confirm, don't invent them.

---

## 9. Question bank

- Types: `SCALE`, `MC`, `RANK`, `HHB` (all scoreable) and `OPEN` (kept deliberately for disclosure/identity prompts — OPEN cannot feed alignment scores).
- A **Guessable** flag marks questions that support the "predict your partner" scoring layer.
- **Complementary scoring:** some flagged questions score as fully aligned even when answers differ (shown with a purple "Complementary" verdict). `PAR-004` is flagged; candidates `SELF-018, SELF-004, SELF-013, CONF-017` are pending Dave's confirmation.
- The `.xlsx` and the HTML viewer are BOTH canonical — keep them in sync after any batch. Run recalc validation after every xlsx save.
- Question principle: don't take a prompt literally — extract the underlying value. Don't be too quick to dismiss as duplicate/unscoreable; re-mine harder when challenged.

---

## 10. Brand system

- Colours: Deep Berry `#682D5C` (`--berry2 #7C3C69`), Warm Honey `#E5A93C` (`--honeyD #D9963A`, text-safe amber `#8F5A12`), Soft Blush `#F8E9EC`, ink `#2E2230`. **Surfaces (Dave-approved revamp, Jul 2026): soft-blush ground (`#FBF2F5→#F8E9EC` gradient) with pure-white cards floating on it — never cream.** Honey is the action colour (pill CTAs, active nav pill); berry stays identity/ink. Exception: the play screen keeps its original berry button + progress bar by Dave's explicit preference.
- Typography intent: **Fraunces** (display) + **Hanken Grotesk** (UI). These render in Dave's browser; the render pipeline falls back to **Lora / Poppins** — the shipped `index.html` currently loads Lora + Poppins. Disclose the fallback whenever presenting a render.
- Logo: the **C3 caret** mark — path `M-46,40 L0,-46 L46,40 L20,40 L0,2.6 L-20,40 Z`, viewBox `-60 -60 120 120`.
- Full token block, spacing (4/8 scale), radius scale, and berry-tinted elevation live in the `:root` of `index.html` — reuse verbatim, don't re-derive.
- Placeholder names in mockups: **Sarah** (user) / **Judah** (partner).

---

## 11. Working rules for Claude Code

- **Port the brain, rebuild the body.** The scoring math, complementary-verdict logic, deck leveling, guess/predict layer, and data model are pure logic — lift them out of `index.html` **verbatim** into typed functions/modules; do not reinterpret or re-derive them. Only the hand-rolled `innerHTML` rendering gets rebuilt as React components. Preserve the reveal-screen fixes (rev1/rev2 kept out of the FLOW nav logic so bottom nav shows on reveal).
- **Test rules and flows in the emulator before any deploy.**
- **Never put secrets client-side.** Email/API keys for invites go in Functions secrets.
- Don't reintroduce the no-Content-Type REST hack; that retires with the SDK.
- Dave works fast and direct. Diagnose independently; don't ask for clarification you can resolve from the code. Render/build output first, explanation second. Minor look-alike variations frustrate him — when exploring, make distinct choices.
- Honest pushback and expert disagreement are wanted, not agreement.

---

## 12. Roadmap to production

- **Phase 0 — Toolchain.** `git init`; scaffold **React + TypeScript + Vite**; `firebase init` (Hosting, Realtime Database, Emulators, Functions) targeting **europe-west1**; wire the Firebase web config via Vite env (`VITE_FIREBASE_*`, `.env.local` gitignored, `.env.example` committed); get the app + emulator suite running locally; deploy a smoke test to Hosting to prove the pipeline **before** any feature code.
- **Phase 1 — Auth + profiles.** Port `aligned-accounts.html` logic to the modular SDK inside React; `useProfile` hook; `users/{uid}` profiles; base64 avatar; account name replaces typed name in create/join. Lock `users` rules. Emulator-test.
- **Phase 2 — Realtime + rules.** `useSession` hook on `onValue`; port scoring/reveal logic into typed modules and render as components; lock `sessions` rules to members; emulator-test join/reveal with two fake accounts.
- **Phase 3 — Invites + GDPR (Functions).** Partner-invite links/emails; export + delete-cascade Functions; privacy policy + consent at sign-up. **This is the "ready for strangers" gate.**
- **Phase 4 — Launch polish (web).** Custom domain; privacy-respecting analytics; error monitoring; GitHub Actions deploy on `main`; optional staging project. Recruit testers. Watch retention.
- **Phase 5 — Native (only after web retention proves out).** Add Capacitor, wrap the existing build, swap the device-feature adapters to native plugins, submit to App Store + Play Console. Packaging job, not a rewrite.

Start at Phase 0. Confirm the pipeline deploys before writing feature code.

---

## 13. Appendix — starting specs

### Suggested structure (keep it flat; grow only when it hurts)
```
src/
  main.tsx
  App.tsx
  firebase.ts              # initializeApp + exported auth, db
  hooks/
    useAuth.ts             # onAuthStateChanged wrapper
    useProfile.ts          # users/{uid} read + update
    useSession.ts          # onValue(sessions/{code}) live subscription
  lib/
    scoring.ts             # PORTED verbatim from index.html — alignment + complementary verdict
    leveling.ts            # PORTED — deck-splitting into ~7-question levels
    questions.ts           # the 271-question bank as typed data (import, don't inline in components)
    device/                # adapters — swap web→Capacitor plugins later
      photo.ts             # square-crop + downscale + base64 (from aligned-accounts.html)
  screens/                 # Onboard, Create, Join, Home, Decks, Question, Guess, Reveal, Results, Profile
  components/              # Ring, Card, Avatar, Nav, Button...
functions/                 # Cloud Functions (Phase 3)
database.rules.json        # in git, emulator-tested
```

### `.env.example` (commit this; real values go in gitignored `.env.local`)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=aligned-9f843.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://aligned-9f843-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=aligned-9f843
VITE_FIREBASE_STORAGE_BUCKET=aligned-9f843.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Partner-invite Function (Phase 3)
Client should not mint or email invites directly. Shape:
- Callable `createInvite({ code })` → verifies caller is the session host, generates a single-use token, stores `invites/{token} = { code, createdBy, expires }`, returns a shareable link `https://<host>/join?t=<token>`.
- `join?t=` flow: client calls `redeemInvite({ token })` → Function validates token + expiry, checks the guest slot is empty, writes the caller's `uid` into `sessions/{code}/members/guest` and `sessions/{code}/uids/{uid}=true`, deletes the token. This keeps join logic server-side so `sessions` write rules can stay tight.
- Email via a provider (e.g. Resend/SendGrid); API key in **Functions secrets**, never client.

### Delete-account Function (Phase 3, GDPR)
Callable `deleteMyAccount()` running as the signed-in user:
1. Find every session where `sessions/{code}/uids/{uid}` is true.
2. For each: remove the user's member slot, their `uid` from `uids`, and their `answers`/`guesses`/`done` entries under each deck for that role. If both members are now gone, delete the whole session node.
3. Delete `users/{uid}`.
4. Delete the Firebase Auth user (`admin.auth().deleteUser(uid)`).
5. Return a summary. Pair with an `exportMyData()` callable that returns the user's profile + their answers as JSON for the export requirement.

This must be a Function (admin SDK) because rules correctly forbid a client from touching the partner's data or another node — so the client alone cannot fully honour a deletion request.

### Photo (already solved in aligned-accounts.html)
Square-crop centre → 256px → `toDataURL('image/jpeg', 0.82)` → store as base64 in `users/{uid}/photo`. Move to Firebase Storage only if profiles get heavy at scale.
