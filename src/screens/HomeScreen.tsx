import { useEffect, useRef, useState } from "react";
import { nLevels, lvlQs } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete } from "../lib/progress";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { ProgressRing } from "../components/Ring";
import { Avatar } from "../components/Avatar";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

export default function HomeScreen({
  code,
  session,
  role,
  slug,
  onPlay,
  onBrowse,
}: {
  code: string;
  session: Session;
  role: Role;
  slug: string;
  onPlay: (slug: string) => void;
  onBrowse: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const deck: DeckData | undefined = session.decks?.[slug];
  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partner = session.members?.[other(role)];
  const partnerName = partner?.name ?? t("your partner", "votre partenaire");
  const joined = !!partner;

  // Celebrate the moment the partner arrives while we're watching — their
  // avatar slides in and a short note settles. No replay on later visits.
  const prevJoined = useRef(joined);
  const [justJoined, setJustJoined] = useState(false);
  useEffect(() => {
    if (joined && !prevJoined.current) setJustJoined(true);
    prevJoined.current = joined;
  }, [joined]);

  const h = new Date().getHours();
  const greeting =
    h < 12
      ? t("Good morning.", "Bonjour.")
      : h < 18
        ? t("Good afternoon.", "Bon après-midi.")
        : t("Good evening.", "Bonsoir.");

  const L = nLevels(slug);
  const lvl = curLevel(slug, deck, role);
  const lvlTotal = lvlQs(slug, lvl).length;
  const mine = doneInLevel(slug, lvl, deck, role);
  const theirs = doneInLevel(slug, lvl, deck, other(role));
  const allDone = catComplete(slug, deck, role);

  const cta = allDone
    ? t("See your alignment →", "Voir votre alignement →")
    : L > 1
      ? mine > 0
        ? t(`Continue Level ${lvl + 1} →`, `Continuer le niveau ${lvl + 1} →`)
        : t(`Start Level ${lvl + 1} →`, `Commencer le niveau ${lvl + 1} →`)
      : mine > 0
        ? t("Continue →", "Continuer →")
        : t("Start answering →", "Commencer à répondre →");

  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);

  const share = () => {
    const txt = t(
      `Join me on aligned — our code is ${code}`,
      `Rejoignez-moi sur aligned — notre code est ${code}`,
    );
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(code);
  };

  const sendInviteLink = async () => {
    setInviteBusy(true);
    setInviteMsg("");
    try {
      const res = await createInvite({ code });
      const link = `${window.location.origin}/?t=${res.data.token}`;
      const txt = t(
        `Join me on aligned — ${link}`,
        `Rejoignez-moi sur aligned — ${link}`,
      );
      if (navigator.share) await navigator.share({ text: txt }).catch(() => {});
      else if (navigator.clipboard) await navigator.clipboard.writeText(link);
      setInviteMsg(
        t(
          "Invite link ready — sent to your share sheet or copied.",
          "Lien d’invitation prêt — envoyé au partage ou copié.",
        ),
      );
    } catch (e) {
      setInviteMsg(prettyError(e));
    } finally {
      setInviteBusy(false);
    }
  };

  return (
    <section>
      <p className="muted center" style={{ marginTop: 20, fontSize: 14 }}>
        {greeting}
      </p>

      {!joined && (
        <div className="banner" style={{ marginTop: 16 }}>
          {t(
            "Share your code so your partner can join:",
            "Partagez votre code pour que votre partenaire vous rejoigne :",
          )}{" "}
          <button className="codechip" type="button" onClick={share}>
            {code}
          </button>
          <button
            className="btn out"
            type="button"
            style={{ marginTop: 14 }}
            onClick={sendInviteLink}
            disabled={inviteBusy}
          >
            {inviteBusy
              ? t("Creating link…", "Création du lien…")
              : t("Send an invite link instead", "Envoyer plutôt un lien d’invitation")}
          </button>
          {inviteMsg && (
            <div style={{ marginTop: 8, fontSize: 13 }}>{inviteMsg}</div>
          )}
        </div>
      )}

      <div className="qcard" style={{ textAlign: "center", padding: "32px 26px 36px", marginTop: 16 }}>
        <div className={`avstack${justJoined ? " joinnow" : ""}`}>
          <Avatar name={myName} tone="berry" />
          {joined ? (
            <span className="joinpop">
              <Avatar name={partnerName} tone="honey" />
            </span>
          ) : (
            <div className="avatar-disc avatar-wait" style={{ width: 46, height: 46 }}>
              ?
            </div>
          )}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, margin: "8px 0 14px" }}>
          {myName} &amp; {joined ? partnerName : "…"}
          {justJoined && (
            <div className="joinnote">
              {partnerName} {t("joined ✓", "vous a rejoint ✓")}
            </div>
          )}
        </div>
        <button className="badge tap" type="button" onClick={onBrowse}>
          {deckName(slug, lang)} &#9662;
        </button>
        {L > 1 && (
          <div className="muted" style={{ fontSize: 13, marginTop: 8, letterSpacing: 1 }}>
            {t(`LEVEL ${lvl + 1} OF ${L}`, `NIVEAU ${lvl + 1} SUR ${L}`)}
          </div>
        )}
        <div style={{ marginTop: 18 }}>
          <ProgressRing done={mine} total={lvlTotal} size={116} />
        </div>
        <div style={{ margin: "16px 0 22px", fontSize: 15, color: "var(--sub)" }}>
          {joined ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Avatar name={partnerName} tone="honey" size={26} ring={false} />
              <span>
                <b style={{ color: "var(--ink)" }}>{partnerName}</b> {theirs}/{lvlTotal}
                {L > 1 ? t(" this level", " ce niveau") : ""}
              </span>
            </span>
          ) : (
            <span className="muted">
              {t("Waiting for your partner to join…", "En attente de votre partenaire…")}
            </span>
          )}
        </div>
        <button className="btn" type="button" onClick={() => onPlay(slug)}>
          {cta}
        </button>
        <div className="link" style={{ marginTop: 18, fontSize: 14 }} onClick={onBrowse}>
          {t("Browse all decks", "Parcourir tous les thèmes")}
        </div>
      </div>
    </section>
  );
}
