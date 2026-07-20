import { useEffect, useRef, useState } from "react";
import { signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import { useProfile } from "../hooks/useProfile";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { prettyError } from "../lib/errors";
import { exportMyData, deleteMyAccount } from "../lib/functions";
import { useT, useLang, setLang, LANGS } from "../lib/i18n";
import BuildStamp from "../components/BuildStamp";
import type { Profile } from "../types";

export default function ProfileScreen({
  user,
  onLeave,
}: {
  user: User;
  onLeave?: () => void;
}) {
  const t = useT();
  const lang = useLang();
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

  const [dataBusy, setDataBusy] = useState(false);
  const [dataMsg, setDataMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const clear = () => {
    setErr("");
    setOk("");
  };

  const doExport = async () => {
    setDataBusy(true);
    setDataMsg("");
    try {
      const res = await exportMyData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "twoagree-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      setDataMsg(t("Your data has been downloaded.", "Vos données ont été téléchargées."));
    } catch (e) {
      setDataMsg(prettyError(e));
    } finally {
      setDataBusy(false);
    }
  };

  const doDelete = async () => {
    setDataBusy(true);
    setDataMsg("");
    try {
      await deleteMyAccount();
      await signOut(auth); // App swaps to the sign-in screen
    } catch (e) {
      setDataMsg(prettyError(e));
      setDataBusy(false);
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clear();
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setPendingPhoto(dataUrl);
      setOk(
        t(
          "Photo ready — tap Save profile to keep it.",
          "Photo prête — appuyez sur Enregistrer pour la garder.",
        ),
      );
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const save = async () => {
    clear();
    if (!name.trim()) {
      setErr(
        t(
          "Your name is needed — your partner sees it.",
          "Votre nom est requis — votre partenaire le voit.",
        ),
      );
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
      setOk(t("Saved.", "Enregistré."));
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
          {t("Loading your profile…", "Chargement de votre profil…")}
        </p>
      </>
    );
  }

  const photo = pendingPhoto ?? profile?.photo ?? null;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        {t("Your profile", "Votre profil")}
      </div>

      <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
        <div className="avatarwrap">
          <div className="avatar">
            {/* No photo → the branded blush/claret placeholder, not initials
                (brand pack §6). Identity avatars elsewhere keep their initials. */}
            <img src={photo ?? "/avatar-placeholder-256.png"} alt="" />
          </div>
          <button
            className="photobtn"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            {t("Change photo", "Changer la photo")}
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
            {t("Name", "Nom")}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              {t("(your partner sees this)", "(votre partenaire le voit)")}
            </span>
          </label>
          <input
            className="input"
            id="name"
            maxLength={20}
            placeholder={t("e.g. Sarah", "p. ex. Sarah")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="bio">
            {t("A line about you", "Une ligne sur vous")}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              {t("(optional)", "(facultatif)")}
            </span>
          </label>
          <textarea
            className="input"
            id="bio"
            maxLength={140}
            placeholder={t("Something honest and short.", "Quelque chose d’honnête et de court.")}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}

        <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={save} disabled={busy}>
          {busy ? t("Saving…", "Enregistrement…") : t("Save profile", "Enregistrer le profil")}
        </button>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="eyebrow">{t("Language", "Langue")}</div>
        <p className="muted" style={{ fontSize: 13, margin: "8px 0 14px" }}>
          {t(
            "Choose the language for the app.",
            "Choisissez la langue de l’application.",
          )}
        </p>
        <div className="langrow">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`langopt ${lang === l.code ? "on" : ""}`}
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      {onLeave && (
        <button className="btn out" type="button" onClick={onLeave}>
          {t("Leave this session", "Quitter cette session")}
        </button>
      )}
      <button className="btn out" type="button" onClick={() => signOut(auth)}>
        {t("Sign out", "Se déconnecter")}
      </button>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="eyebrow">{t("Your data", "Vos données")}</div>
        <p className="muted" style={{ fontSize: 13, margin: "8px 0 14px" }}>
          {t(
            "TwoAgree holds sensitive answers. You can take them with you or erase everything, at any time.",
            "TwoAgree conserve des réponses sensibles. Vous pouvez les emporter ou tout effacer, à tout moment.",
          )}
        </p>
        <button className="btn out" type="button" onClick={doExport} disabled={dataBusy}>
          {dataBusy ? t("Working…", "En cours…") : t("Export my data", "Exporter mes données")}
        </button>

        {!confirmDelete ? (
          <button
            className="btn ghost"
            type="button"
            style={{ color: "var(--danger)" }}
            onClick={() => setConfirmDelete(true)}
            disabled={dataBusy}
          >
            {t("Delete my account", "Supprimer mon compte")}
          </button>
        ) : (
          <>
            <p className="err">
              {t(
                "This permanently erases your profile and removes you from every session. It can’t be undone.",
                "Ceci efface définitivement votre profil et vous retire de toutes les sessions. C’est irréversible.",
              )}
            </p>
            <button
              className="btn"
              type="button"
              style={{ background: "var(--danger)", boxShadow: "none" }}
              onClick={doDelete}
              disabled={dataBusy}
            >
              {dataBusy
                ? t("Deleting…", "Suppression…")
                : t("Yes, delete everything", "Oui, tout supprimer")}
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={dataBusy}
            >
              {t("Cancel", "Annuler")}
            </button>
          </>
        )}
        {dataMsg && <div className="ok">{dataMsg}</div>}
        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          {t("See our", "Consultez notre")}{" "}
          <a className="link" href="/privacy.html" target="_blank" rel="noreferrer">
            {t("Privacy Policy", "Politique de confidentialité")}
          </a>
          .
        </p>
      </div>

      <div className="foot">
        {t("Signed in as", "Connecté en tant que")}{" "}
        {user.email || t("your Google account", "votre compte Google")}
      </div>
      <BuildStamp />
    </section>
  );
}
