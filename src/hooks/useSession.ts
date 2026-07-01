import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import type { Session } from "../types";
import type { Role } from "../lib/scoring";

// Live subscription to sessions/{code}. Replaces the legacy 1.5s REST polling.
// `role` is derived from which member slot holds the current uid.
export function useSession(code: string | null, uid: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!code) {
      setSession(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setDenied(false);
    return onValue(
      ref(db, `sessions/${code}`),
      (snap) => {
        setSession((snap.val() as Session | null) ?? null);
        setLoading(false);
      },
      () => {
        // Permission denied (not a member) or network error.
        setDenied(true);
        setLoading(false);
      },
    );
  }, [code]);

  let role: Role | null = null;
  if (session?.members && uid) {
    if (session.members.host?.uid === uid) role = "host";
    else if (session.members.guest?.uid === uid) role = "guest";
  }

  return { session, role, loading, denied };
}
