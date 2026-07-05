import { useEffect, useRef, useState } from "react";
import { ORDER } from "../lib/questions";
import { nLevels, lvlQs } from "../lib/leveling";
import { curLevel, doneInLevel, catComplete } from "../lib/progress";
import { revealedRows } from "../lib/results";
import { other, type DeckData, type Role } from "../lib/scoring";
import { createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import type { Session } from "../types";
import { Avatar } from "../components/Avatar";
import { IconDecks, IconSettings } from "../components/icons";
import { deckName } from "../lib/questions.fr";
import { useT, useLang, type Lang } from "../lib/i18n";

export default function HomeScreen({
  code,
  session,
  role,
  slug,
  onPlay,
  onBrowse,
  onReview,
  onProfile,
}: {
  code: string;
  session: Session;
  role: Role;
  slug: string;
  onPlay: (slug: string) => void;
  onBrowse: () => void;
  onReview: (slug: string) => void;
  onProfile: () => void;
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
      ? t("Good morning,", "Bonjour,")
      : h < 18
        ? t("Good afternoon,", "Bon après-midi,")
        : t("Good evening,", "Bonsoir,");

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

  // Stat tiles + recent reveals share the Results maths, so the numbers agree.
  const decksComplete = ORDER.filter((s) =>
    catComplete(s, session.decks?.[s], role),
  ).length;
  const { rows, overallPct } = revealedRows(session.decks, role);
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const lowest = ranked[0];
  const closest = ranked[ranked.length - 1];

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
      {/* Avatar-pair chip + settings — the couple lives in the header now. */}
      <div className="homehdr">
        <span className={`avchip${justJoined ? " joinnow" : ""}`}>
          <span className="avchip-stack">
            <Avatar name={myName} tone="berry" size={30} />
            {joined ? (
              <span className="joinpop">
                <Avatar name={partnerName} tone="honey" size={30} />
              </span>
            ) : (
              <span
                className="avatar-disc avatar-wait"
                style={{ width: 30, height: 30, fontSize: 13 }}
              >
                ?
              </span>
            )}
          </span>
          <i>
            {myName} &amp; {joined ? partnerName : "…"}
          </i>
        </span>
        <button
          className="roundbtn"
          type="button"
          onClick={onProfile}
          aria-label={t("Profile & settings", "Profil et réglages")}
        >
          <IconSettings size={18} />
        </button>
      </div>

      <h1 className="greet serif">
        {greeting}
        <br />
        {myName}
        <small>
          {joined
            ? t("Where you left off, together.", "Là où vous en étiez, ensemble.")
            : t("It starts when your partner joins.", "Tout commence quand votre partenaire arrive.")}
        </small>
      </h1>
      {justJoined && (
        <div className="joinnote" style={{ margin: "6px 2px 0" }}>
          {partnerName} {t("joined ✓", "vous a rejoint ✓")}
        </div>
      )}

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

      <div className="tiles">
        <div className="tile">
          <span className="tile-ic">
            <IconDecks size={15} />
          </span>
          <span className="tile-lb">
            {t("Decks", "Thèmes")}
            <br />
            {t("complete", "terminés")}
          </span>
          <div>
            <b className="serif">{decksComplete}</b>
            <span className="tile-u">
              {t(`of ${ORDER.length}`, `sur ${ORDER.length}`)}
            </span>
          </div>
        </div>
        <div className="tile">
          <span className="tile-ic">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="tile-lb">
            {t("Aligned", "Alignés")}
            <br />
            {t("so far", "jusqu’ici")}
          </span>
          <div>
            <b className="serif">{overallPct ?? "—"}</b>
            {overallPct != null && <span className="tile-u">%</span>}
          </div>
        </div>
      </div>

      {/* Featured deck: the orb meter — one orb per question this level. */}
      <div className="feat">
        <div className="featrow">
          <button className="featleft" type="button" onClick={onBrowse}>
            <span className="fchip">
              <IconDecks size={16} />
            </span>
            <span>
              <span className="featnm">{deckName(slug, lang)} &#9662;</span>
              <span className="featmt">
                {allDone
                  ? t("All levels revealed", "Tous les niveaux révélés")
                  : L > 1
                    ? t(`Level ${lvl + 1} of ${L}`, `Niveau ${lvl + 1} sur ${L}`) +
                      (joined ? t(` · with ${partnerName}`, ` · avec ${partnerName}`) : "")
                    : t(`${lvlTotal} questions`, `${lvlTotal} questions`)}
              </span>
            </span>
          </button>
        </div>
        <div className="morbs" aria-hidden="true">
          {Array.from({ length: lvlTotal }, (_, i) => (
            <span
              key={i}
              className={`morb${i < mine ? " on" : i === mine && !allDone ? " cur" : ""}`}
            />
          ))}
        </div>
        <div className="capline">
          {allDone ? (
            t("Finished together", "Terminé ensemble")
          ) : (
            <>
              <b>
                {t(`${mine} of ${lvlTotal}`, `${mine} sur ${lvlTotal}`)}
              </b>{" "}
              {t("answered", "répondues")}
              {joined && (
                <>
                  {" · "}
                  {partnerName} {t(`is at ${theirs}`, `en est à ${theirs}`)}
                </>
              )}
            </>
          )}
        </div>
        <button className="btn pill" type="button" onClick={() => onPlay(slug)}>
          {cta}
        </button>
      </div>

      {rows.length > 0 && (
        <>
          <div className="shead">{t("Recent reveals", "Dernières révélations")}</div>
          {rows.length >= 2 && lowest.slug !== closest.slug ? (
            <>
              <HomeRow
                slug={closest.slug}
                pct={closest.pct}
                sub={t("Closest alignment", "Alignement le plus fort")}
                onOpen={onReview}
                lang={lang}
              />
              <HomeRow
                slug={lowest.slug}
                pct={lowest.pct}
                sub={t("Most worth a conversation", "À aborder en priorité")}
                onOpen={onReview}
                lang={lang}
              />
            </>
          ) : (
            <HomeRow
              slug={ranked[0].slug}
              pct={ranked[0].pct}
              sub={t("Revealed together", "Révélé ensemble")}
              onOpen={onReview}
              lang={lang}
            />
          )}
        </>
      )}

      <div className="link center" style={{ display: "block", marginTop: 18, fontSize: 14 }} onClick={onBrowse}>
        {t("Browse all decks", "Parcourir tous les thèmes")}
      </div>
    </section>
  );
}

function HomeRow({
  slug,
  pct,
  sub,
  onOpen,
  lang,
}: {
  slug: string;
  pct: number;
  sub: string;
  onOpen: (slug: string) => void;
  lang: Lang;
}) {
  return (
    <button className="arow" type="button" onClick={() => onOpen(slug)}>
      <span className="arow-t">
        <b>{deckName(slug, lang)}</b>
        <span>{sub}</span>
      </span>
      <span className="pctpill">{pct}%</span>
    </button>
  );
}
