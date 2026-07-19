import { useMemo, useState } from "react";
import type { Question } from "../lib/questions";
import type { Role } from "../lib/scoring";
import type { Session, PathStepData } from "../types";
import {
  stepMeta,
  stepQuestions,
  stepDeckData,
  stepRevealable,
  deckOf,
  AT_TABLE_SLUG,
  lampLit,
} from "../lib/path";
import { VERSES } from "../data/path.generated";
import { writeAnswer, writeGuess, lightLamp } from "../lib/session";
import { Mark } from "../brand/Mark";
import { PathGlyph } from "../components/PathGlyph";
import { TopBar } from "../components/TopBar";
import RevealScreen from "./RevealScreen";
import { useT } from "../lib/i18n";

type Phase = "arrival" | "play" | "reveal" | "lamp";
type T = (en: string, fr: string) => string;

// One waypoint of the Path: arrival → play (the existing answer/guess engine) →
// reveal (the existing RevealScreen) → light the lamp. A step is a sequencer;
// answers are written to each question's real deck, so nothing here is a new
// scoring path.
export default function PathStep({
  code,
  role,
  session,
  index,
  step,
  myName,
  partnerName,
  onExit,
}: {
  code: string;
  role: Role;
  session: Session;
  index: number;
  step: PathStepData;
  myName: string;
  partnerName: string;
  onExit: () => void;
}) {
  const t = useT();
  const meta = stepMeta(step.key);
  const qs = useMemo(() => stepQuestions(step), [step]);

  const answeredByMe = (q: Question): boolean => {
    if (q.type === "open") {
      return session.decks?.[AT_TABLE_SLUG]?.answers?.[step.key]?.[role] != null;
    }
    const slug = deckOf(q.id);
    return slug ? session.decks?.[slug]?.answers?.[q.id]?.[role] != null : false;
  };

  // Questions I still owe, frozen at step entry so my own answers don't shift the
  // list mid-play (the session updates live as I write). If none, I've already
  // walked this stretch → straight to the reveal.
  const [todo] = useState<Question[]>(() => qs.filter((q) => !answeredByMe(q)));
  const [phase, setPhase] = useState<Phase>(todo.length ? "arrival" : "reveal");

  if (!meta) return null;

  if (phase === "arrival") {
    return (
      <ArrivalScreen
        index={index}
        name={meta.name}
        glyph={meta.glyph}
        verse={meta.verse}
        vref={meta.ref}
        frame={meta.frame}
        onTake={() => setPhase("play")}
        onBack={onExit}
        t={t}
      />
    );
  }

  if (phase === "play") {
    return (
      <StepPlay
        code={code}
        role={role}
        step={step}
        stepName={meta.name}
        guessLayer={step.mechanic === "guess"}
        todo={todo}
        partnerName={partnerName}
        onDone={() => setPhase("reveal")}
        t={t}
      />
    );
  }

  if (phase === "reveal") {
    if (!stepRevealable(session, step, role)) {
      return (
        <WaitingForPartner
          partnerName={partnerName}
          glyph={meta.glyph}
          onBack={onExit}
          t={t}
        />
      );
    }
    return (
      <RevealScreen
        slug={step.key}
        level={0}
        role={role}
        deck={stepDeckData(session, step)}
        questions={qs}
        title={meta.name}
        myName={myName}
        partnerName={partnerName}
        onDone={() => setPhase("lamp")}
      />
    );
  }

  // lamp
  return (
    <LampScreen
      index={index}
      stepKey={step.key}
      name={meta.name}
      alreadyLit={lampLit(session, index)}
      onLight={() => void lightLamp(code, index)}
      onDone={onExit}
      t={t}
    />
  );
}

// ---- Arrival: claret full-bleed waypoint intro -----------------------------
function ArrivalScreen({
  index,
  name,
  glyph,
  verse,
  vref,
  frame,
  onTake,
  onBack,
  t,
}: {
  index: number;
  name: string;
  glyph: string;
  verse: string;
  vref: string;
  frame: string;
  onTake: () => void;
  onBack: () => void;
  t: T;
}) {
  return (
    <section className="path-claret screen-enter">
      <div className="eyebrow center" style={{ color: "var(--honey)" }}>
        {t(`Step ${index + 1} of 10`, `Étape ${index + 1} sur 10`)}
      </div>
      <div style={{ margin: "22px 0 18px", color: "var(--honey)" }}>
        <PathGlyph id={glyph} size={78} />
      </div>
      <h1 className="h1 center" style={{ color: "#fff", fontSize: 34 }}>
        {name}
      </h1>
      <div className="path-hairline" />
      <p className="verse serif center" style={{ color: "#fff", maxWidth: 320, fontStyle: "italic" }}>
        &ldquo;{verse}&rdquo;
      </p>
      <p className="vref center" style={{ color: "var(--honey)" }}>{vref}</p>
      <p className="center" style={{ color: "rgba(255,255,255,.88)", maxWidth: 320, marginTop: 20, lineHeight: 1.55 }}>
        {frame}
      </p>
      <div style={{ marginTop: 32, width: "100%", maxWidth: 340 }}>
        <button className="btn honey" type="button" onClick={onTake}>
          {t("Take the step", "Faire ce pas")}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={onBack}
          style={{ color: "rgba(255,255,255,.75)" }}
        >
          {t("Back to the path", "Retour au chemin")}
        </button>
      </div>
    </section>
  );
}

// ---- Play: answer + (optionally) predict, over the step's questions ---------
function StepPlay({
  code,
  role,
  step,
  stepName,
  guessLayer,
  todo,
  partnerName,
  onDone,
  t,
}: {
  code: string;
  role: Role;
  step: PathStepData;
  stepName: string;
  guessLayer: boolean;
  todo: Question[];
  partnerName: string;
  onDone: () => void;
  t: T;
}) {
  const [idx, setIdx] = useState(0);
  const [pend, setPend] = useState<number | null>(null);
  const [pendText, setPendText] = useState("");
  const [pendGuess, setPendGuess] = useState<number | null>(null);
  const [guessing, setGuessing] = useState(false);
  const [busy, setBusy] = useState(false);

  const q = todo[idx];
  const last = idx + 1 >= todo.length;
  const isOpen = q?.type === "open";
  const guessable = !!q && guessLayer && q.guessable === true && !isOpen;

  const reset = () => {
    setPend(null);
    setPendText("");
    setPendGuess(null);
    setGuessing(false);
  };

  const advance = () => {
    if (last) return onDone();
    reset();
    setIdx((i) => i + 1);
  };

  const submitAnswer = async () => {
    if (busy || !q) return;
    if (isOpen) {
      if (!pendText.trim()) return;
      setBusy(true);
      await writeAnswer(code, AT_TABLE_SLUG, step.key, role, pendText.trim());
      setBusy(false);
      return advance();
    }
    if (pend == null) return;
    setBusy(true);
    const slug = deckOf(q.id)!;
    await writeAnswer(code, slug, q.id, role, pend);
    setBusy(false);
    if (guessable) {
      setPendGuess(null);
      setGuessing(true);
    } else {
      advance();
    }
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy || !q) return;
    setBusy(true);
    await writeGuess(code, deckOf(q.id)!, q.id, role, pendGuess);
    setBusy(false);
    advance();
  };

  if (!q) {
    onDone();
    return null;
  }

  const progress = (
    <div className="qprog">
      <i style={{ width: `${Math.round(((idx + 1) / todo.length) * 100)}%` }} />
    </div>
  );

  const input = (value: number | null, onPick: (i: number) => void, guess?: boolean) =>
    q.type === "scale" ? (
      <>
        <div className="slabels">
          <span>{q.lo}</span>
          <span style={{ textAlign: "right" }}>{q.hi}</span>
        </div>
        <div className="scale">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`orb ${value === i ? "sel" : ""}`} onClick={() => onPick(i)}>
              {i}
            </div>
          ))}
        </div>
      </>
    ) : (
      <div style={{ marginTop: 4 }}>
        {q.opts?.map((o, i) => (
          <div
            key={i}
            className={`opt ${guess ? "guess" : ""} ${value === i ? "sel" : ""}`}
            onClick={() => onPick(i)}
          >
            {o}
            <span className="dot" />
          </div>
        ))}
      </div>
    );

  const header = (
    <>
      <div className="brandhead brand-enter">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      {progress}
      <p className="eyebrow" style={{ marginTop: 12 }}>
        {stepName} &middot; {t(`${idx + 1} of ${todo.length}`, `${idx + 1} sur ${todo.length}`)}
      </p>
    </>
  );

  // Guess step
  if (guessing) {
    const yourText = q.type === "scale" ? `${pend} / 5` : q.opts?.[pend as number];
    return (
      <section className="screen-enter">
        {header}
        <div className="qcard glide-in" style={{ marginTop: 12, borderColor: "var(--app-honey-line)" }}>
          <div className="qrow">
            <div className="eyebrow">{t("YOUR GUESS", "VOTRE INTUITION")}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("YOU SAID", "VOUS AVEZ DIT")}</div>
              <div className="yousaid-val">{yourText}</div>
            </div>
          </div>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            {t("Now — what will ", "Maintenant — que va répondre ")}
            <span style={{ color: "var(--amber)" }}>{partnerName}</span>
            {t(" say?", " ?")}
          </p>
          {input(pendGuess, setPendGuess, true)}
        </div>
        <button className="btn honey" type="button" disabled={pendGuess == null || busy} onClick={lockGuess}>
          {t("Lock it in →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={advance} disabled={busy}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  // Answer step
  return (
    <section className="screen-enter">
      {header}
      {isOpen ? (
        <div className="qcard glide-in" style={{ marginTop: 12, background: "var(--blush)", border: "none" }}>
          <div className="eyebrow" style={{ color: "var(--berry)" }}>{t("At the table", "À table")}</div>
          <div className="qtext" style={{ marginTop: 8 }}>{q.q}</div>
          <p className="sub" style={{ marginTop: 10 }}>
            {t(
              `Share something you want the two of you to address. ${partnerName} shares theirs — you'll see both sides together.`,
              `Partagez ce que vous voulez aborder à deux. ${partnerName} partage de son côté — vous verrez les deux ensemble.`,
            )}
          </p>
          <textarea
            className="input"
            style={{ minHeight: 120, marginTop: 14 }}
            value={pendText}
            onChange={(e) => setPendText(e.target.value)}
            placeholder={t("A few honest lines is plenty…", "Quelques lignes sincères suffisent…")}
          />
        </div>
      ) : (
        <div className="qcard glide-in" style={{ marginTop: 12 }}>
          <div className="qtext">{q.q}</div>
          {input(pend, setPend)}
        </div>
      )}
      <button
        className="btn"
        type="button"
        disabled={busy || (isOpen ? !pendText.trim() : pend == null)}
        onClick={submitAnswer}
      >
        {isOpen ? t("Share my side →", "Partager →") : guessable ? t("Next →", "Suivant →") : last ? t("Done →", "Terminé →") : t("Next →", "Suivant →")}
      </button>
    </section>
  );
}

// ---- You're done; your partner hasn't walked this stretch yet --------------
function WaitingForPartner({
  partnerName,
  glyph,
  onBack,
  t,
}: {
  partnerName: string;
  glyph: string;
  onBack: () => void;
  t: T;
}) {
  return (
    <section className="screen-enter">
      <TopBar onExit={onBack} />
      <div className="center" style={{ minHeight: "60dvh", textAlign: "center" }}>
        <div style={{ color: "var(--berry)", opacity: 0.5 }}>
          <PathGlyph id={glyph} size={64} />
        </div>
        <h1 className="h1 center" style={{ marginTop: 18 }}>
          {t("You've walked this stretch.", "Vous avez parcouru cette étape.")}
        </h1>
        <p className="sub center" style={{ margin: "10px 24px 0", maxWidth: 320 }}>
          {t(
            `The lamp lights once you've both been honest here. We'll let you know when ${partnerName} has walked it too.`,
            `La lampe s'allume quand vous avez tous deux été sincères ici. Nous vous préviendrons quand ${partnerName} l'aura parcourue aussi.`,
          )}
        </p>
        <button className="btn pill" type="button" onClick={onBack} style={{ marginTop: 26 }}>
          {t("Back to the path", "Retour au chemin")}
        </button>
      </div>
    </section>
  );
}

// ---- The lamp: honesty marked, then the Word for this stretch ---------------
function LampScreen({
  index,
  stepKey,
  name,
  alreadyLit,
  onLight,
  onDone,
  t,
}: {
  index: number;
  stepKey: string;
  name: string;
  alreadyLit: boolean;
  onLight: () => void;
  onDone: () => void;
  t: T;
}) {
  const [lit, setLit] = useState(alreadyLit);
  const verses = VERSES[stepKey] ?? [];
  const light = () => {
    setLit(true);
    if (!alreadyLit) onLight();
  };
  return (
    <section className="path-claret screen-enter" style={{ justifyContent: "flex-start", paddingTop: 60 }}>
      <div className="eyebrow center" style={{ color: "var(--honey)" }}>
        {t(`Step ${index + 1}`, `Étape ${index + 1}`)} &middot; {name}
      </div>
      <div style={{ margin: "24px 0 8px", color: lit ? "var(--honey)" : "var(--berry2)", transition: "color .7s ease" }}>
        <PathGlyph id="g-lamp" size={80} />
      </div>
      {lit ? (
        <>
          <h1 className="h1 center" style={{ color: "#fff", fontSize: 28 }}>
            {t("The lamp is lit.", "La lampe est allumée.")}
          </h1>
          <p className="center" style={{ color: "rgba(255,255,255,.85)", maxWidth: 320, marginTop: 10 }}>
            {t("The Word for this part of the road:", "La Parole pour cette partie du chemin :")}
          </p>
          <div style={{ marginTop: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {verses.map((v, i) => (
              <div key={i} className="path-verse-card path-fadein" style={{ animationDelay: `${i * 0.28}s` }}>
                <p className="verse serif" style={{ color: "#fff", fontStyle: "italic" }}>&ldquo;{v.v}&rdquo;</p>
                <p className="vref" style={{ color: "var(--honey)" }}>{v.ref}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, width: "100%", maxWidth: 340 }}>
            <button className="btn honey" type="button" onClick={onDone}>
              {t("Back to the path", "Retour au chemin")}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="h1 center" style={{ color: "#fff", fontSize: 28 }}>
            {t("You've walked this stretch honestly.", "Vous avez parcouru cette étape avec sincérité.")}
          </h1>
          <p className="center" style={{ color: "rgba(255,255,255,.85)", maxWidth: 320, marginTop: 12, lineHeight: 1.55 }}>
            {t("Now the Word for this part of the road.", "Maintenant, la Parole pour cette partie du chemin.")}
          </p>
          <div style={{ marginTop: 32, width: "100%", maxWidth: 340 }}>
            <button className="btn honey" type="button" onClick={light}>
              {t("Light the lamp", "Allumer la lampe")}
            </button>
          </div>
        </>
      )}
      <p className="path-inscription">
        {t(
          "“Your word is a lamp to my feet, and a light to my path.” — Psalm 119:105",
          "“Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.” — Psaume 119:105",
        )}
      </p>
    </section>
  );
}
