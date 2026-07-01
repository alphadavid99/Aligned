import { useCallback, useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import type { Profile } from "../types";

// Live read + update for users/{uid}. `profile` stays fresh via onValue; the
// edit form keeps its own local state and calls saveProfile() to persist.
export function useProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onValue(
      ref(db, `users/${uid}`),
      (snap) => {
        setProfile((snap.val() as Profile | null) ?? null);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [uid]);

  // update() auto-creates intermediates and never writes {} (RTDB gotcha, §6).
  const saveProfile = useCallback(
    async (data: Partial<Profile>) => {
      if (!uid) throw new Error("Not signed in.");
      await update(ref(db, `users/${uid}`), { ...data, updated: Date.now() });
    },
    [uid],
  );

  return { profile, loading, saveProfile };
}
