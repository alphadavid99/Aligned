// Security-rules tests for database.rules.json, run against the RTDB emulator.
// CLAUDE.md §7/§11: nothing security-related ships without an emulator test.
//
// Requires the emulator on :9000 — `firebase emulators:start --only database`.
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { ref, get, set, update } from "firebase/database";

let env: RulesTestEnvironment;

const HOST = "host-uid";
const GUEST = "guest-uid";
const STRANGER = "stranger-uid";
const CODE = "ABCD";

beforeAll(async () => {
  env = await initializeTestEnvironment({
    // Deliberately NOT "twoagreeapp": the emulator namespaces data by projectId,
    // so a dedicated id keeps clearDatabase() from wiping a dev session that
    // happens to be sharing this emulator.
    projectId: "twoagree-rules-test",
    database: {
      host: "127.0.0.1",
      port: 9000,
      rules: readFileSync("database.rules.json", "utf8"),
    },
  });
});

afterAll(async () => await env.cleanup());
beforeEach(async () => await env.clearDatabase());

describe("users/{uid} — the account-creation path", () => {
  it("lets a signed-in user create and read their own profile", async () => {
    const db = env.authenticatedContext(HOST).database();
    // This is exactly what useProfile.saveProfile() does on signup.
    await assertSucceeds(
      update(ref(db, `users/${HOST}`), { name: "Sarah", updated: 1 }),
    );
    await assertSucceeds(get(ref(db, `users/${HOST}`)));
  });

  it("denies a signed-out visitor", async () => {
    const db = env.unauthenticatedContext().database();
    await assertFails(set(ref(db, `users/${HOST}`), { name: "Nope" }));
    await assertFails(get(ref(db, `users/${HOST}`)));
  });

  it("denies reading or writing someone else's profile", async () => {
    const db = env.authenticatedContext(STRANGER).database();
    await assertFails(get(ref(db, `users/${HOST}`)));
    await assertFails(set(ref(db, `users/${HOST}`), { name: "Hacked" }));
  });
});

describe("sessions/{code} — membership gating", () => {
  // Seed a host-owned session, bypassing rules like the real create flow would.
  const seed = async () =>
    await env.withSecurityRulesDisabled(async (ctx) => {
      await set(ref(ctx.database(), `sessions/${CODE}`), {
        created: 1,
        members: { host: { name: "Sarah", uid: HOST } },
        uids: { [HOST]: true },
      });
    });

  it("lets the host read their own session", async () => {
    await seed();
    const db = env.authenticatedContext(HOST).database();
    await assertSucceeds(get(ref(db, `sessions/${CODE}`)));
  });

  it("denies a signed-in stranger who is not a member", async () => {
    await seed();
    const db = env.authenticatedContext(STRANGER).database();
    await assertFails(get(ref(db, `sessions/${CODE}`)));
    await assertFails(
      set(ref(db, `sessions/${CODE}/decks/faith/answers/q1/host`), "tampered"),
    );
  });

  it("lets a seated guest read and write their own answers", async () => {
    await seed();
    await env.withSecurityRulesDisabled(async (ctx) => {
      // Server-side join (redeemInvite) seats the guest.
      await update(ref(ctx.database(), `sessions/${CODE}`), {
        [`members/guest`]: { name: "Judah", uid: GUEST },
        [`uids/${GUEST}`]: true,
      });
    });
    const db = env.authenticatedContext(GUEST).database();
    await assertSucceeds(get(ref(db, `sessions/${CODE}`)));
    await assertSucceeds(
      set(ref(db, `sessions/${CODE}/decks/faith/answers/q1/guest`), "3"),
    );
  });

  it("forbids claiming a uids slot that isn't yours", async () => {
    await seed();
    const db = env.authenticatedContext(STRANGER).database();
    await assertFails(set(ref(db, `sessions/${CODE}/uids/${HOST}`), true));
  });
});

describe("invites — server-only", () => {
  it("denies all client access", async () => {
    const db = env.authenticatedContext(HOST).database();
    await assertFails(get(ref(db, "invites/tok")));
    await assertFails(set(ref(db, "invites/tok"), { code: CODE }));
  });
});

describe("intake/{uid} — private to its author (the Path privacy guarantee)", () => {
  // The intake holds special-category data (faith stage, health, family conflict).
  // The generated path's emphasis is itself a readout of these answers, so a
  // partner must NOT be able to read the other's intake (brief §2.1).
  it("lets the author write and read their own intake", async () => {
    const db = env.authenticatedContext(HOST).database();
    await assertSucceeds(
      update(ref(db, `intake/${HOST}`), { updated: 1, answers: { stage: 2 } }),
    );
    await assertSucceeds(get(ref(db, `intake/${HOST}`)));
  });

  it("denies the PARTNER reading or writing the other's intake", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await set(ref(ctx.database(), `intake/${HOST}`), { answers: { avoided: [3] } });
    });
    const db = env.authenticatedContext(GUEST).database();
    await assertFails(get(ref(db, `intake/${HOST}`)));
    await assertFails(set(ref(db, `intake/${HOST}`), { answers: {} }));
  });

  it("denies a signed-out visitor", async () => {
    const db = env.unauthenticatedContext().database();
    await assertFails(get(ref(db, `intake/${HOST}`)));
    await assertFails(set(ref(db, `intake/${HOST}`), { answers: {} }));
  });
});

describe("sessions/{code}/path — generated server-side, read by members only", () => {
  // The Cloud Function (Admin SDK, bypasses rules) writes the path. Clients must
  // never write it; only members may read it (brief §2.2).
  const seedWithPath = async () =>
    await env.withSecurityRulesDisabled(async (ctx) => {
      await set(ref(ctx.database(), `sessions/${CODE}`), {
        created: 1,
        members: {
          host: { name: "Sarah", uid: HOST },
          guest: { name: "Judah", uid: GUEST },
        },
        uids: { [HOST]: true, [GUEST]: true },
        path: { generatedAt: 1, steps: { 0: { qids: ["FUN-001"] } } },
      });
    });

  it("lets a member read the generated path", async () => {
    await seedWithPath();
    const db = env.authenticatedContext(GUEST).database();
    await assertSucceeds(get(ref(db, `sessions/${CODE}/path`)));
  });

  it("denies a non-member reading the path", async () => {
    await seedWithPath();
    const db = env.authenticatedContext(STRANGER).database();
    await assertFails(get(ref(db, `sessions/${CODE}/path`)));
  });

  it("forbids ANY client from writing the path (server-only)", async () => {
    await seedWithPath();
    const db = env.authenticatedContext(HOST).database();
    await assertFails(
      set(ref(db, `sessions/${CODE}/path/steps/0/qids/0`), "HACK-001"),
    );
    await assertFails(set(ref(db, `sessions/${CODE}/path`), { steps: {} }));
  });

  it("lets a member light a lamp but denies a stranger", async () => {
    await seedWithPath();
    const memberDb = env.authenticatedContext(HOST).database();
    await assertSucceeds(set(ref(memberDb, `sessions/${CODE}/pathLamps/0`), true));
    const strangerDb = env.authenticatedContext(STRANGER).database();
    await assertFails(set(ref(strangerDb, `sessions/${CODE}/pathLamps/1`), true));
  });
});
