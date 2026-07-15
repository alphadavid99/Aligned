import { useState } from "react";
import { Logo } from "../components/Logo";

type T = (en: string, fr: string) => string;
type Stat = { pct: number | null; done: number; total: number };

// The Core headline (brief 2 §C). Two numbers computed over the fixed 70-question
// instrument, each with its denominator on screen (§C7) — a 71% over 70 is a
// brag, a 94% over 9 is not, and the denominator keeps them apart. Known is the
// hero (§C8): Agreed has a ceiling problem (100% = two identical people), Known
// doesn't. So Known leads, larger and warmer.
export function CoreScore({
  agreed,
  known,
  myName,
  partnerName,
  t,
}: {
  agreed: Stat;
  known: Stat;
  myName: string;
  partnerName: string;
  t: T;
}) {
  const [sharing, setSharing] = useState(false);
  const complete = agreed.done >= agreed.total;
  return (
    <div className="core">
      <div className="core-stats">
        <div className="corestat hero">
          <div className="corenum">
            {known.pct ?? "—"}
            <span>%</span>
          </div>
          <div className="corelb">{t("Known", "Connus")}</div>
          <div className="coredenom">
            {known.done} / {known.total}
          </div>
        </div>
        <div className="corestat">
          <div className="corenum">
            {agreed.pct ?? "—"}
            <span>%</span>
          </div>
          <div className="corelb">{t("Agreed", "D’accord")}</div>
          <div className="coredenom">
            {agreed.done} / {agreed.total}
          </div>
        </div>
      </div>

      {/* Coverage is the flex, not a hedge — the score pulls you to finish it. */}
      <p className="core-pull">
        {complete
          ? t("You’ve finished the Core together.", "Vous avez terminé le Cœur ensemble.")
          : t(
              `${agreed.done} of ${agreed.total} — it isn’t yours until you finish it.`,
              `${agreed.done} sur ${agreed.total} — il n’est vraiment à vous qu’une fois terminé.`,
            )}
      </p>

      {agreed.done > 0 && (
        <button className="btn out" type="button" onClick={() => setSharing(true)}>
          {t("Share your card", "Partager votre carte")}
        </button>
      )}

      {sharing && (
        <ShareCard
          agreed={agreed}
          known={known}
          myName={myName}
          partnerName={partnerName}
          t={t}
          onClose={() => setSharing(false)}
        />
      )}
    </div>
  );
}

// The share card (brief 2 §C9). Core only — a number earned over anything else
// is a lie the moment two couples compare. Leads with Known; denominator shown;
// no leaderboard, ever (the no-competition constant). A couple screenshots this.
function ShareCard({
  agreed,
  known,
  myName,
  partnerName,
  t,
  onClose,
}: {
  agreed: Stat;
  known: Stat;
  myName: string;
  partnerName: string;
  t: T;
  onClose: () => void;
}) {
  const share = () => {
    const txt = t(
      `${myName} & ${partnerName} — we knew each other ${known.pct}% (${known.done} of ${known.total}) on TwoAgree.`,
      `${myName} & ${partnerName} — on se connaît à ${known.pct}% (${known.done} sur ${known.total}) sur TwoAgree.`,
    );
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
  };
  return (
    <div className="sharewrap" onClick={onClose}>
      <div className="sharecard" onClick={(e) => e.stopPropagation()}>
        <div className="sharecard-names">
          {myName} &amp; {partnerName}
        </div>
        <div className="sharecard-hero">
          <div className="sharecard-num">
            {known.pct ?? "—"}
            <span>%</span>
          </div>
          <div className="sharecard-lb">{t("known each other", "se connaissent")}</div>
          <div className="sharecard-denom">
            {known.done} / {known.total}
          </div>
        </div>
        <div className="sharecard-agree">
          {agreed.pct ?? "—"}% {t("agreed", "d’accord")} · {agreed.done}/{agreed.total}
        </div>
        <div className="sharecard-mark">
          <Logo size={22} />
        </div>
      </div>
      <button className="btn pill" type="button" onClick={share} style={{ maxWidth: 360 }}>
        {t("Share", "Partager")}
      </button>
      <button className="btn ghost" type="button" onClick={onClose}>
        {t("Close", "Fermer")}
      </button>
    </div>
  );
}
