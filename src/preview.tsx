// Dev-only visual harness: mounts session screens with fake data so the
// revamp can be screenshotted without Firebase. Not shipped (only reachable
// via preview.html, which is not linked and excluded from the build inputs).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ORDER } from "./lib/questions";
import { lvlQs, nLevels } from "./lib/leveling";
import type { DeckData, AnswerValue } from "./lib/scoring";
import type { Session } from "./types";
import HomeScreen from "./screens/HomeScreen";
import DecksScreen from "./screens/DecksScreen";
import ResultsScreen from "./screens/ResultsScreen";
import RevealScreen from "./screens/RevealScreen";
import AuthScreen from "./screens/AuthScreen";
import { Logo } from "./components/Logo";
import { IconHome, IconDecks, IconResults, IconProfile } from "./components/icons";

const noop = () => {};

function answerFor(qType: string, opts: string[] | undefined, who: "host" | "guest", i: number): AnswerValue {
  if (qType === "scale") return who === "host" ? 4 : i % 3 === 0 ? 4 : 5;
  if (qType === "mc") return who === "host" ? 0 : i % 2 === 0 ? 0 : Math.min(1, (opts?.length ?? 1) - 1);
  if (qType === "rank") {
    const n = opts?.length ?? 3;
    const base = Array.from({ length: n }, (_, k) => k);
    if (who === "guest" && n > 1) [base[0], base[1]] = [base[1], base[0]];
    return base.join(",");
  }
  return who === "host"
    ? "Prayer together every evening matters to me."
    : "I want us to keep a shared rhythm of prayer.";
}

// Fill `levels` levels of a deck with both partners' answers + done marks.
function fakeDeck(slug: string, levels: number, minePartialNext = 0): DeckData {
  const deck: DeckData = { answers: {}, guesses: {}, done: {} };
  for (let l = 0; l < levels; l++) {
    lvlQs(slug, l).forEach((q, i) => {
      deck.answers![q.id] = {
        host: answerFor(q.type, q.opts, "host", i),
        guest: answerFor(q.type, q.opts, "guest", i),
      };
      if (q.guessable && q.type !== "rank" && i % 2 === 0) {
        deck.guesses![q.id] = {
          host: deck.answers![q.id].guest!,
          guest: i % 4 === 0 ? deck.answers![q.id].host! : 99,
        };
      }
    });
    deck.done![l] = { host: true, guest: true };
  }
  if (minePartialNext > 0 && levels < nLevels(slug)) {
    lvlQs(slug, levels)
      .slice(0, minePartialNext)
      .forEach((q, i) => {
        deck.answers![q.id] = { host: answerFor(q.type, q.opts, "host", i) };
      });
  }
  return deck;
}

const slugA = ORDER.find((s) => nLevels(s) >= 3) ?? ORDER[0]; // featured, mid-deck
const slugB = ORDER[1]; // fully complete
const slugC = ORDER[0]; // one level revealed

const session: Session = {
  created: 0,
  members: {
    host: { name: "Sarah", uid: "u1" },
    guest: { name: "Judah", uid: "u2" },
  },
  decks: {
    [slugA]: fakeDeck(slugA, 1, 4), // level 1 revealed, level 2 in progress
    [slugB]: fakeDeck(slugB, nLevels(slugB)), // complete
    [slugC]: fakeDeck(slugC, 1), // one level revealed
  },
} as Session;

function FakeNav({ on }: { on: string }) {
  const items = [
    { key: "home", label: "Home", Icon: IconHome },
    { key: "decks", label: "Decks", Icon: IconDecks },
    { key: "results", label: "Results", Icon: IconResults },
    { key: "profile", label: "Profile", Icon: IconProfile },
  ];
  return (
    <nav className="bnav">
      {items.map(({ key, label, Icon }) => (
        <button key={key} type="button" className={`bnav-item ${on === key ? "on" : ""}`}>
          <Icon size={on === key ? 17 : 21} />
          {on === key && <span>{label}</span>}
        </button>
      ))}
    </nav>
  );
}

const view = new URLSearchParams(window.location.search).get("view") ?? "home";

function Preview() {
  if (view === "auth")
    return (
      <>
        <div className="brandhead brand-enter">
          <Logo size={40} />
        </div>
        <AuthScreen />
      </>
    );
  if (view === "home")
    return (
      <div className="tabwrap">
        <HomeScreen
          code="ABCD"
          session={session}
          role="host"
          slug={slugA}
          onPlay={noop}
          onBrowse={noop}
          onReview={noop}
          onProfile={noop}
        />
        <FakeNav on="home" />
      </div>
    );
  if (view === "decks")
    return (
      <div className="tabwrap">
        <DecksScreen session={session} role="host" onPlay={noop} />
        <FakeNav on="decks" />
      </div>
    );
  if (view === "results")
    return (
      <div className="tabwrap">
        <ResultsScreen session={session} role="host" onOpen={noop} />
        <FakeNav on="results" />
      </div>
    );
  // reveal ceremony (fresh) and answers (review)
  return (
    <RevealScreen
      slug={slugB}
      level={0}
      role="host"
      deck={session.decks![slugB]}
      myName="Sarah"
      partnerName="Judah"
      questions={view === "answers" ? lvlQs(slugB, 0) : undefined}
      review={view === "answers"}
      onDone={noop}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="phone">
      <Preview />
    </div>
  </StrictMode>,
);
