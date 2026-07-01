import { useState } from "react";
import type { User } from "firebase/auth";
import { ORDER } from "../lib/questions";
import { lvlQs } from "../lib/leveling";
import { curLevel, levelDone, levelComplete, catComplete, doneInLevel } from "../lib/progress";
import { jointQuestions, other } from "../lib/scoring";
import { useSession } from "../hooks/useSession";
import HomeScreen from "./HomeScreen";
import DecksScreen from "./DecksScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";
import PlayScreen from "./PlayScreen";
import RevealScreen from "./RevealScreen";

type Tab = "home" | "decks" | "results" | "profile";
type Flow = null | "play" | "review";

export default function SessionApp({
  code,
  user,
  onLeave,
}: {
  code: string;
  user: User;
  onLeave: () => void;
}) {
  const { session, role, loading, denied } = useSession(code, user.uid);
  const [tab, setTab] = useState<Tab>("home");
  const [slug, setSlug] = useState(ORDER[0]);
  const [level, setLevel] = useState(0);
  const [flow, setFlow] = useState<Flow>(null);

  if (loading) {
    return (
      <>
        <div className="spin" />
        <p className="muted center" style={{ fontSize: 14 }}>
          Opening your session…
        </p>
      </>
    );
  }

  if (denied || !session || !role) {
    return (
      <section>
        <div className="wordmark">aligned &#10022;</div>
        <div className="banner" style={{ marginTop: 24 }}>
          This session isn’t available on your account. It may have been closed,
          or the code is wrong.
        </div>
        <button className="btn out" type="button" onClick={onLeave}>
          Back to start
        </button>
      </section>
    );
  }

  const deck = session.decks?.[slug];
  const partnerName = session.members?.[other(role)]?.name ?? "your partner";

  const openDeck = (s: string) => {
    setSlug(s);
    const d = session.decks?.[s];
    if (catComplete(s, d, role)) {
      setFlow(null);
      setTab("results");
      return;
    }
    const lvl = curLevel(s, d, role);
    setLevel(lvl);
    setFlow(levelDone(d, lvl, role) ? "review" : "play");
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
          onDone={() => {
            setFlow(null);
            setTab("home");
          }}
        />
      );
    }
    const total = lvlQs(slug, level).length;
    return (
      <section>
        <div className="center">
          <div className="wordmark">aligned &#10022;</div>
        </div>
        <div className="spin" />
        <h2 className="h1 center" style={{ fontSize: 24 }}>
          All yours are in.
        </h2>
        <p className="sub center" style={{ margin: "10px 24px 20px" }}>
          Your alignment unlocks once you’ve <b>both</b> finished — so you always
          see the same score.
        </p>
        <p className="center" style={{ fontSize: 15 }}>
          <span style={{ color: "var(--berry)" }}>
            <b>You</b> {doneInLevel(slug, level, deck, role)}/{total}
          </span>
          <span style={{ margin: "0 14px", color: "var(--amber)" }}>
            <b>{partnerName}</b> {doneInLevel(slug, level, deck, other(role))}/{total}
          </span>
        </p>
        <button
          className="btn out"
          type="button"
          onClick={() => {
            setFlow(null);
            setTab("home");
          }}
        >
          Keep exploring
        </button>
      </section>
    );
  }

  // ---- Tab screens (bottom nav shown) ----
  return (
    <>
      <div className="tabwrap">
        {tab === "home" && (
          <HomeScreen
            code={code}
            session={session}
            role={role}
            slug={slug}
            onPlay={openDeck}
            onBrowse={() => setTab("decks")}
          />
        )}
        {tab === "decks" && (
          <DecksScreen session={session} role={role} onPlay={openDeck} />
        )}
        {tab === "results" && <ResultsScreen session={session} role={role} />}
        {tab === "profile" && <ProfileScreen user={user} onLeave={onLeave} />}
      </div>

      <nav className="bnav">
        {(["home", "decks", "results", "profile"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`bnav-item ${tab === t ? "on" : ""}`}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
    </>
  );
}
