// Pending partner-invite token — the ONE place the app looks for "someone sent
// me a link". On web the token rides in on the querystring (/?t=TOKEN) at load.
// Inside the native shell there's no querystring — the local bundle loads from
// capacitor://localhost — so the token arrives later via a universal link
// (see device/deeplinks.ts), which calls setInviteToken(). Components read it
// through a tiny subscription so a token that lands AFTER mount still routes.
let current: string | null = new URLSearchParams(window.location.search).get(
  "t",
);

const subs = new Set<(t: string | null) => void>();

export function currentInviteToken(): string | null {
  return current;
}

export function setInviteToken(token: string): void {
  current = token;
  subs.forEach((f) => f(token));
}

export function onInviteToken(cb: (t: string | null) => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
