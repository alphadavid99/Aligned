import { useState } from "react";
import { createSession } from "../lib/session";
import { joinByCode } from "../lib/functions";
import { setActiveCode } from "../lib/local";
import { prettyError } from "../lib/errors";
import { useT } from "../lib/i18n";

// Create a new session or join a partner's by code. The signed-in user's
// profile name rides into the member slot (the account graft).
export default function StartScreen({
  uid,
  name,
  onEnter,
}: {
  uid: string;
  name: string;
  onEnter: (code: string) => void;
}) {
  const t = useT();
  const [mode, setMode] = useState<"choose" | "join">("choose");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const enter = (c: string) => {
    setActiveCode(uid, c);
    onEnter(c);
  };

  const create = async () => {
    setErr("");
    setBusy(true);
    try {
      const c = await createSession(uid, name);
      enter(c);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const join = async () => {
    setErr("");
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setErr(
        t(
          "Enter the 4-character code your partner shared.",
          "Saisissez le code à 4 caractères partagé par votre partenaire.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const res = await joinByCode({ code: c });
      enter(res.data.code);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  return (
    <section className="screen-enter">
      <div className="eyebrow center" style={{ marginTop: 30 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ marginTop: 8 }}>
        {t("Start a session", "Démarrer une session")}
      </h1>
      {mode === "choose" ? (
        <ol className="steps">
          <li className="step">
            <span className="stepn">1</span>
            <span className="stept">
              <b>{t("You create a code", "Vous créez un code")}</b>{" "}
              {t("— it takes one tap", "— un seul appui suffit")}
            </span>
          </li>
          <li className="step">
            <span className="stepn">2</span>
            <span className="stept">
              <b>{t("Share it", "Partagez-le")}</b>{" "}
              {t("with your partner", "avec votre partenaire")}
            </span>
          </li>
          <li className="step">
            <span className="stepn">3</span>
            <span className="stept">
              <b>{t("You each answer", "Vous répondez chacun")}</b>{" "}
              {t("privately, on your own", "en privé, de votre côté")}
            </span>
          </li>
        </ol>
      ) : (
        <p
          className="sub serif center"
          style={{ fontStyle: "italic", margin: "10px 20px 26px" }}
        >
          {t(
            "Enter the 4-character code your partner shared with you.",
            "Saisissez le code à 4 caractères que votre partenaire vous a partagé.",
          )}
        </p>
      )}

      {mode === "choose" ? (
        <>
          <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={create} disabled={busy}>
            {busy
              ? t("One moment…", "Un instant…")
              : t("Create a session →", "Créer une session →")}
          </button>
          <button
            className="btn out"
            type="button"
            onClick={() => {
              setErr("");
              setMode("join");
            }}
          >
            {t("I have a code", "J’ai un code")}
          </button>
          {err && <div className="err">{err}</div>}
        </>
      ) : (
        <>
          <label htmlFor="code">{t("Partner’s code", "Code du partenaire")}</label>
          <input
            className="input"
            id="code"
            maxLength={4}
            autoCapitalize="characters"
            placeholder="ABCD"
            style={{ textTransform: "uppercase", letterSpacing: 4 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {err && <div className="err">{err}</div>}
          <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={join} disabled={busy}>
            {busy ? t("Joining…", "Connexion…") : t("Join →", "Rejoindre →")}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setErr("");
              setMode("choose");
            }}
          >
            {t("← Back", "← Retour")}
          </button>
        </>
      )}
    </section>
  );
}
