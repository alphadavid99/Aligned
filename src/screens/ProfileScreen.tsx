import { useEffect, useRef, useState } from "react";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useProfile } from "../hooks/useProfile";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { prettyError } from "../lib/errors";
import type { Profile } from "../types";

export default function ProfileScreen({ user }: { user: User }) {
  const { profile, loading, saveProfile } = useProfile(user.uid);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Hydrate the form once from the stored profile (or the Google displayName),
  // then leave it alone so live snapshots don't clobber in-progress edits.
  useEffect(() => {
    if (!loading && !hydrated) {
      setName(profile?.name ?? user.displayName ?? "");
      setBio(profile?.bio ?? "");
      setHydrated(true);
    }
  }, [loading, hydrated, profile, user.displayName]);

  const clear = () => {
    setErr("");
    setOk("");
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clear();
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setPendingPhoto(dataUrl);
      setOk("Photo ready — tap Save profile to keep it.");
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const save = async () => {
    clear();
    if (!name.trim()) {
      setErr("Your name is needed — your partner sees it.");
      return;
    }
    setBusy(true);
    const data: Partial<Profile> = {
      name: name.trim(),
      bio: bio.trim(),
      email: user.email ?? "",
    };
    if (!profile?.created) data.created = Date.now();
    if (pendingPhoto) data.photo = pendingPhoto; // only overwrite if newly chosen
    try {
      await saveProfile(data);
      setPendingPhoto(null);
      setOk("Saved.");
    } catch (e2) {
      setErr(prettyError(e2));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          Loading your profile…
        </p>
      </>
    );
  }

  const photo = pendingPhoto ?? profile?.photo ?? null;
  const initial =
    (name || user.email || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        Your profile
      </div>

      <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
        <div className="avatarwrap">
          <div className="avatar">
            {photo ? <img src={photo} alt="" /> : initial}
          </div>
          <button
            className="photobtn"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            Change photo
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={onPhoto}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label htmlFor="name">
            Name{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              (your partner sees this)
            </span>
          </label>
          <input
            className="input"
            id="name"
            maxLength={20}
            placeholder="e.g. Sarah"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="bio">
            A line about you{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <textarea
            className="input"
            id="bio"
            maxLength={140}
            placeholder="Something honest and short."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}

        <button className="btn" type="button" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save profile"}
        </button>
      </div>

      <button className="btn out" type="button" onClick={() => signOut(auth)}>
        Sign out
      </button>

      <div className="foot">
        Signed in as {user.email || "(google account)"} · uid {user.uid}
      </div>
    </section>
  );
}
