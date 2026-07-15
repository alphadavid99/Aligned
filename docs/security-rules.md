# Security rules — status & verification

`database.rules.json` implements the write side of the onboarding spec v2 §9.
**These rules do not auto-deploy** (the GitHub Action deploys Hosting only). They
take effect only when someone runs `firebase deploy --only database`, so this
change is safe to merge — production keeps its current rules until you deploy.

Per CLAUDE.md §7 and spec v2 §9, **verify on a dev target with two test accounts
before deploying.**

## What's enforced now (deployable)

- **Write-once answers / guesses / importance.** `!data.exists()` at
  `sessions/{code}/decks/{slug}/{answers|guesses|importance}/{qid}/{role}`.
  Nobody can change an answer after the fact.
- **Role integrity.** A member can only write their *own* role's leaf — you
  can't write your partner's answer. Enforced by matching
  `members/{role}/uid === auth.uid`.
- **Create-once sessions.** `sessions/{code}` is writable only when it doesn't
  exist yet (the host skeleton); all subsequent member writes go through the leaf
  rules above. Guest join stays server-side (the `joinByCode` / `redeemInvite`
  Cloud Functions run with admin and bypass rules).
- **Consent node.** `consents/{uid}` — own read/write only (unbundled per §2).

### The two manual checks before `firebase deploy --only database`
1. A second write to an answer that already exists is **rejected**.
2. A member cannot write the other role's answer leaf.
Plus a regression pass: create a session, join by code, answer, mark a part done,
reveal — all still work.

## Staged, NOT yet active: the both-answered READ gate (§9)

The spec also wants a partner's answer to be **unreadable until both roles have
answered it** — enforced server-side, not in the client. That is intentionally
**not active** in this file, because it cannot ship without a client change:

- RTDB read rules cascade — a `.read` granted at `sessions/{code}` grants read to
  the whole subtree, so a per-answer gate can only work if the session-level read
  is **removed** and reads move to the leaves.
- The current client (`useSession`) reads the whole session in one `onValue`.
  Under a leaf-level read gate that call is denied outright, so the client must be
  reworked to read metadata + per-answer paths.

Target read rule (enable together with the `useSession` rework, then re-verify):

```
sessions/{code}/decks/{slug}/answers/{qid}
  ".read": "member && (data.numChildren() >= 2
             || data.child(<my role>).exists())"
```

with the session-level `.read` narrowed to metadata only. This is the one
remaining piece of §9 and should be built and verified against a dev target with
two accounts, not shipped blind — it reworks the live reveal read path.
