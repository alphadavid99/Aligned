import { useState } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs } from "../lib/leveling";
import { curLevel, levelDone, levelComplete, catComplete, doneInLevel, revealedQs } from "../lib/progress";
import { jointQuestions, other } from "../lib/scoring";
import { useSession } from "../hooks/useSession";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";
import PlayScreen from "./PlayScreen";
import RevealScreen from "./RevealScreen";
import { TopBar } from "../components/TopBar";
import { Logo } from "../components/Logo";
import { PillNav } from "../components/PillNav";
import { IconHome, IconDecks, IconResults, IconProfile } from "../components/icons";
import { useT } from "../lib/i18n";

type Tab = "home" | "decks" | "results" | "profile";
type Flow = null | "play" | "review" | "reviewDeck";

const TABS: {
  key: Tab;
  en: string;
  fr: string;
  Icon: (p: { size?: number }) => React.JSX.Element;
}[] = [
  { key: "home", en: "Home", fr: "Accueil", Icon: IconHome },
  { key: "decks", en: "Talk", fr: "Parler", Icon: IconDecks },
  { key: "results", en: "Us", fr: "Nous", Icon: IconResults },
  { key: "profile", en: "You", fr: "Vous", Icon: IconProfile },
];

export default function SessionApp({
  code,
  user,
  onLeave,
}: {
  code: string;
  user: User;
  onLeave: () => void;
}) {
  const t = useT();
  const { session, role, loading, denied } = useSession(code, user.uid);
  const [tab, setTab] = useState<Tab>("home");
  const [slug, setSlug] = useState(ORDER[0]);
  const [level, setLevel] = useState(0);
  const [flow, setFlow] = useState<Flow>(null);
  // Which tab the play/reveal flow was entered from, so × returns there.
  const [flowReturn, setFlowReturn] = useState<Tab>("home");

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          {t("Opening your session…", "Ouverture de votre session…")}
        </p>
      </>
    );
  }

  if (denied || !session || !role) {
    return (
      <section>
        <TopBar />
        <div className="banner" style={{ marginTop: 24 }}>
          {t(
            "This session isn’t available on your account. It may have been closed, or the code is wrong.",
            "Cette session n’est pas disponible sur votre compte. Elle a peut-être été fermée, ou le code est incorrect.",
          )}
        </div>
        <button className="btn out" type="button" onClick={onLeave}>
          {t("Back to start", "Retour au début")}
        </button>
      </section>
    );
  }

  const deck = session.decks?.[slug];
  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName =
    session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");

  // Leave the play/reveal flow, returning to whichever tab it was opened from.
  const exitFlow = () => {
    setFlow(null);
    setTab(flowReturn);
  };

  const openDeck = (s: string) => {
    setFlowReturn(tab); // remember where we came from (Home or Decks)
    setSlug(s);
    const d = session.decks?.[s];
    if (catComplete(s, d, role)) {
      // Finished deck → reopen the full breakdown so you can see what each of
      // you answered, not just the score.
      setFlow("reviewDeck");
      return;
    }
    const lvl = curLevel(s, d, role);
    setLevel(lvl);
    setFlow(levelDone(d, lvl, role) ? "review" : "play");
  };

  // From Results: always open the deck's revealed levels as a review, even if
  // the deck isn't finished yet (a row only exists once a level is revealed).
  const openReview = (s: string) => {
    if (!revealedQs(s, session.decks?.[s], role).length) {
      openDeck(s);
      return;
    }
    setFlowReturn(tab);
    setSlug(s);
    setFlow("reviewDeck");
  };

  // ---- In-flow screens (bottom nav hidden) ----
  if (flow === "play") {
    return (
      <PlayScreen
        code={code}
        slug={slug}
        level={level}
        role={role}
        deck={deck}
        partnerName={partnerName}
        onFinish={() => setFlow("review")}
        onExit={exitFlow}
      />
    );
  }

  // Reopen a deck's breakdown — every question from the levels the two of you
  // have both finished (the whole deck once it's complete).
  if (flow === "reviewDeck") {
    return (
      <RevealScreen
        slug={slug}
        level={0}
        role={role}
        deck={deck}
        myName={myName}
        partnerName={partnerName}
        questions={revealedQs(slug, deck, role)}
        review
        onDone={exitFlow}
      />
    );
  }

  if (flow === "review") {
    const ready =
      levelComplete(deck, level, role) &&
      jointQuestions(lvlQs(slug, level), deck ?? {}).length > 0;
    if (ready) {
      return (
        <RevealScreen
          slug={slug}
          level={level}
          role={role}
          deck={deck}
          myName={myName}
          partnerName={partnerName}
          onDone={exitFlow}
        />
      );
    }
    const total = lvlQs(slug, level).length;
    return (
      <section>
        <TopBar onExit={exitFlow} />
        {/* Waiting on the partner: a breathing caret, not an error-ish spinner. */}
        <div className="bwrap">
          <span className="bring" />
          <span className="bring b2" />
          <Logo size={42} word={false} />
        </div>
        <h2 className="h1 center" style={{ fontSize: 24 }}>
          {t("All yours are in.", "Les vôtres sont enregistrées.")}
        </h2>
        <p className="sub center" style={{ margin: "10px 24px 20px" }}>
          {t("Your agreement unlocks once you’ve ", "Votre accord se révèle une fois que vous avez ")}
          <b>{t("both", "tous les deux")}</b>
          {t(
            " finished — so you always see the same score.",
            " terminé — pour que vous voyiez toujours le même score.",
          )}
        </p>
        <p className="center" style={{ fontSize: 15 }}>
          <span style={{ color: "var(--berry)" }}>
            <b>{t("You", "Vous")}</b> {doneInLevel(slug, level, deck, role)}/{total}
          </span>
          <span style={{ margin: "0 14px", color: "var(--amber)" }}>
            <b>{partnerName}</b> {doneInLevel(slug, level, deck, other(role))}/{total}
          </span>
        </p>
        <button className="btn out" type="button" onClick={exitFlow}>
          {t("Keep exploring", "Continuer d’explorer")}
        </button>
      </section>
    );
  }

  // ---- Tab screens (bottom nav shown) ----
  return (
    <>
      <div className="tabwrap">
        {/* Home wears its own header (avatar chip + settings); other tabs keep
            the brand mark up top. */}
        {tab !== "home" && (
          <div className="brandhead" style={{ padding: "2px 0 10px" }}>
            <Logo size={30} word={tab === "profile"} />
          </div>
        )}
        {/* keyed per tab so each pane rises in on switch */}
        <div key={tab} className="pane-in">
          {tab === "home" && (
            <HomeScreen
              code={code}
              session={session}
              role={role}
              slug={slug}
              onPlay={openDeck}
              onBrowse={() => setTab("decks")}
              onReview={openReview}
              onProfile={() => setTab("profile")}
            />
          )}
          {tab === "decks" && (
            <DecksScreen session={session} role={role} onPlay={openDeck} />
          )}
          {tab === "results" && (
            <ResultsScreen session={session} role={role} onOpen={openReview} />
          )}
          {tab === "profile" && <ProfileScreen user={user} onLeave={onLeave} />}
        </div>
      </div>

      {/* Floating pill nav — the honey pill slides to whichever tab you pick. */}
      <PillNav
        items={TABS.map(({ key, en, fr, Icon }) => ({ key, label: t(en, fr), Icon }))}
        active={tab}
        onSelect={(k) => setTab(k as Tab)}
      />
    </>
  );
}
