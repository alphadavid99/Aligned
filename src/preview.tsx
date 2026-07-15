// Dev-only visual harness: mounts session screens with fake data so the
// revamp can be screenshotted without Firebase. Not shipped (only reachable
// via preview.html, which is not linked and excluded from the build inputs).
import { StrictMode, useState } from "react";
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
import { PillNav } from "./components/PillNav";
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
// `perfect` makes the partners agree on everything (a >90% ceremony).
function fakeDeck(slug: string, levels: number, minePartialNext = 0, perfect = false): DeckData {
  const deck: DeckData = { answers: {}, guesses: {}, done: {} };
  for (let l = 0; l < levels; l++) {
    lvlQs(slug, l).forEach((q, i) => {
      const host = answerFor(q.type, q.opts, "host", i);
      deck.answers![q.id] = {
        host,
        guest: perfect ? host : answerFor(q.type, q.opts, "guest", i),
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
    host: { name: "Sarah Elizabeth", uid: "u1" },
    guest: { name: "Judah Michael", uid: "u2" },
  },
  decks: {
    [slugA]: fakeDeck(slugA, 1, 4), // level 1 revealed, level 2 in progress
    [slugB]: fakeDeck(slugB, nLevels(slugB)), // complete
    [slugC]: fakeDeck(slugC, 1), // one level revealed
  },
} as Session;

function FakeNav({ on }: { on: string }) {
  // Interactive so the sliding pill can be exercised in the harness.
  const [active, setActive] = useState(on);
  const items = [
    { key: "home", label: "Home", Icon: IconHome },
    { key: "decks", label: "Decks", Icon: IconDecks },
    { key: "results", label: "Results", Icon: IconResults },
    { key: "profile", label: "Profile", Icon: IconProfile },
  ];
  return <PillNav items={items} active={active} onSelect={setActive} />;
}

const view = new URLSearchParams(window.location.search).get("view") ?? "home";

function Preview() {
  if (view === "brand")
    // §6 check: wordmark at 16/32/64px — feet on the baseline (the underline),
    // apex level with or a hair above the T capline. Plus both mark colourways.
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 30 }}>
        {[16, 32, 64].map((fs) => (
          <div key={fs} style={{ textDecoration: "underline", textUnderlineOffset: 0 }}>
            <Logo size={fs / 0.8} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Logo size={64} word={false} />
          <span
            className="on-claret"
            style={{ background: "var(--twoagree-claret)", padding: 24, display: "inline-flex" }}
          >
            <Logo size={64} word={false} />
          </span>
          <span
            className="on-claret"
            style={{ background: "var(--twoagree-claret)", padding: 24, display: "inline-flex" }}
          >
            <Logo size={40} />
          </span>
        </div>
      </div>
    );
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
  // reveal ceremony (fresh, normal or >90% grand) and answers (review)
  const deck =
    view === "reveal90" ? fakeDeck(slugB, 1, 0, true) : session.decks![slugB];
  return (
    <RevealScreen
      slug={slugB}
      level={0}
      role="host"
      deck={deck}
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
