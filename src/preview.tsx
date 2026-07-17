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
import PlayScreen from "./screens/PlayScreen";
import StartScreen from "./screens/StartScreen";
import PartPicker from "./screens/PartPicker";
import Onboarding from "./screens/Onboarding";
import StartMenu from "./screens/StartMenu";
import ResultsScreen from "./screens/ResultsScreen";
import RevealScreen from "./screens/RevealScreen";
import AuthScreen from "./screens/AuthScreen";
import { Mark } from "./brand/Mark";
import { Wordmark } from "./brand/Wordmark";
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

// A deck engineered to show every flag shape: mutual blindSpot, one-sided
// blindSpot, and an unevenStakes gap on an otherwise-agreed question.
function flagDeck(): DeckData {
  const qs0 = lvlQs(slugB, 0);
  const mcqs = qs0.filter((q) => q.type === "mc");
  const scaleqs = qs0.filter((q) => q.type === "scale");
  const answers: DeckData["answers"] = {};
  const guesses: DeckData["guesses"] = {};
  const importance: DeckData["importance"] = {};
  if (scaleqs[0]) {
    answers[scaleqs[0].id] = { host: 3, guest: 3 }; // Agreed
    importance[scaleqs[0].id] = { host: 5, guest: 1 }; // unevenStakes
  }
  if (mcqs[0]) {
    answers[mcqs[0].id] = { host: 0, guest: 1 }; // Worth a chat
    guesses[mcqs[0].id] = { host: 0, guest: 1 }; // both guessed wrong → mutual
  }
  if (mcqs[1]) {
    answers[mcqs[1].id] = { host: 0, guest: 1 };
    guesses[mcqs[1].id] = { host: 0 }; // only host wrong → one-sided
  }
  qs0.forEach((q) => {
    if (answers[q.id]) return; // rest agree, so they add no flags
    const v =
      q.type === "scale" ? 3 : q.type === "rank" ? q.opts!.map((_, i) => i).join(",") : 0;
    answers[q.id] = { host: v, guest: v };
  });
  return { answers, guesses, importance, done: { 0: { host: true, guest: true } } };
}

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

// Solo-first: a session where only the host has joined and banked a few answers.
const soloSession: Session = {
  created: 0,
  members: { host: { name: "Sarah Elizabeth", uid: "u1" } },
  decks: { [slugC]: fakeDeck(slugC, 0, 4) },
} as Session;

function FakeNav({ on }: { on: string }) {
  // Interactive so the sliding pill can be exercised in the harness.
  const [active, setActive] = useState(on);
  const items = [
    { key: "home", label: "Home", Icon: IconHome },
    { key: "decks", label: "Talk", Icon: IconDecks },
    { key: "results", label: "Us", Icon: IconResults },
    { key: "profile", label: "You", Icon: IconProfile },
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
            <Wordmark size={fs} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Mark height={64} title="TwoAgree" colour="var(--berry)" />
          <span
            style={{ background: "var(--ta-claret)", padding: 24, display: "inline-flex" }}
          >
            <Mark height={64} title="TwoAgree" colour="var(--ta-honey)" />
          </span>
          <span
            style={{ background: "var(--ta-claret)", padding: 24, display: "inline-flex" }}
          >
            <Wordmark size={32} tone="onClaret" />
          </span>
        </div>
      </div>
    );
  if (view === "auth")
    return (
      <>
        <div className="brandhead brand-enter">
          <Wordmark size={32} />
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
  if (view === "solo")
    return (
      <div className="tabwrap">
        <HomeScreen
          code="ABCD"
          session={soloSession}
          role="host"
          slug={slugC}
          onPlay={noop}
          onBrowse={noop}
          onReview={noop}
          onProfile={noop}
        />
        <FakeNav on="home" />
      </div>
    );
  if (view === "picker") {
    // a multi-part deck where you've finished part 1, partner hasn't
    const pdeck = fakeDeck(slugA, 1, 4);
    pdeck.done = { 0: { host: true } }; // you done part 0, them not
    return (
      <PartPicker
        slug={slugA}
        deck={pdeck}
        role="host"
        partnerName="Judah"
        onSelect={noop}
        onExit={noop}
      />
    );
  }
  if (view === "onboard") return <Onboarding inviteToken={null} onDone={noop} />;
  if (view === "joinb") return <Onboarding inviteToken="demo" onDone={noop} />;
  if (view === "menu")
    return <StartMenu stage="engaged" onPick={noop} onSeeAll={noop} />;
  if (view === "start")
    return <StartScreen uid="u1" name="Sarah" onEnter={noop} />;
  if (view === "play")
    return (
      <PlayScreen
        code="ABCD"
        slug={slugC}
        level={0}
        role="host"
        deck={{}}
        partnerName="Judah"
        onFinish={noop}
        onExit={noop}
      />
    );
  if (view === "results")
    return (
      <div className="tabwrap">
        <ResultsScreen session={session} role="host" onOpen={noop} />
        <FakeNav on="results" />
      </div>
    );
  // reveal ceremony (fresh, normal or >90% grand), answers (review), flags
  const isReview = view === "answers" || view === "flags";
  const deck =
    view === "reveal90"
      ? fakeDeck(slugB, 1, 0, true)
      : view === "flags"
        ? flagDeck()
        : session.decks![slugB];
  return (
    <RevealScreen
      slug={slugB}
      level={0}
      role="host"
      deck={deck}
      myName="Sarah"
      partnerName="Judah"
      questions={isReview ? lvlQs(slugB, 0) : undefined}
      review={isReview}
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
