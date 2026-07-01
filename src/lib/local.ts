// Tiny localStorage helpers for per-user client state (active session + deck).
// Keyed by uid so switching accounts on one device stays separate.

const activeKey = (uid: string) => `aligned_active_${uid}`;

export function getActiveCode(uid: string): string | null {
  return localStorage.getItem(activeKey(uid));
}

export function setActiveCode(uid: string, code: string): void {
  localStorage.setItem(activeKey(uid), code);
}

export function clearActiveCode(uid: string): void {
  localStorage.removeItem(activeKey(uid));
}
