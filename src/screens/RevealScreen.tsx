import { useEffect, useRef, useState } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import {
  overall,
  knowScore,
  scoreQ,
  jointQuestions,
  type DeckData,
  type Role,
  type Verdict,
  type AnswerValue,
  type ScoreResult,
} from "../lib/scoring";
import { type Question } from "../lib/questions";
import { collectFlagRows } from "../lib/flags";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { ScorePair } from "../components/ScorePair";
import FlagsReview, { FlagBox } from "./FlagsReview";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { useT, useLang } from "../lib/i18n";

// Display labels for each verdict when the language is French.
const VERDICT_FR: Record<Verdict, string> = {
  Agreed: "D’accord",
  Close: "Proche",
  "Worth a chat": "À discuter",
  Complementary: "Complémentaire",
  Shared: "Partagé",
};

// "Worth a chat" is deliberately a calm, neutral ink — not alarm-red. Difference
// here is an invitation to talk, never a failure state (see the subline below).
const VERDICT_COLOR: Record<Verdict, string> = {
  Agreed: "var(--app-guess-ok)",
  Close: "var(--honeyD)",
  "Worth a chat": "var(--app-verdict-grey)",
  Complementary: "var(--app-complement)",
  Shared: "var(--sub)",
};

function optLabel(q: Question, v: AnswerValue | undefined): string {
  if (v == null) return "—";
  if (q.type === "scale") return `${v} / 5`;
  if (q.type === "open") return String(v);
  return q.opts?.[Number(v)] ?? String(v);
}

// Tiered copy for the guess-accuracy capsule. Always encouraging (no guilt
// mechanics): only a genuinely high score claims "you know each other well";
// lower scores frame the gap as discovery still ahead, never as failure.
function knowLine(pct: number, t: (en: string, fr: string) => string): string {
  if (pct >= 70) return t("You know each other well", "Vous vous connaissez bien");
  if (pct >= 40)
    return t("Still discovering each other", "Vous continuez à vous découvrir");
  return t("So much still to discover", "Encore tant à découvrir");
}

// Level reveal: the shared alignment score plus a per-question breakdown.
// Both partners see the same number (it only unlocks once both have finished).
export default function RevealScreen({
  slug,
  level,
  role,
  deck,
  onDone,
  myName,
  partnerName,
  questions,
  review = false,
}: {
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  onDone: () => void;
  myName: string;
  partnerName: string;
  // Review mode passes the whole deck's questions so a finished deck can be
  // reopened to see the full per-question breakdown (what each of you answered).
  questions?: Question[];
  review?: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const qs = questions ?? lvlQs(slug, level);
  const data = deck ?? {};
  const pct = overall(qs, data, role);
  const know = knowScore(qs, data, role);
  const joint = jointQuestions(qs, data);
  const multi = nLevels(slug) > 1;
  // Reflection-only decks have nothing to score — show the answers, not a 0% ring.
  const hasScore = joint.some((q) => q.type !== "open");
  // "Before you walk on" — the flagged questions worth a closer look (§4/§5).
  const flagRows = collectFlagRows(qs, data, role);
  const [showFlags, setShowFlags] = useState(false);

  // ---- The Level-Up moment (fresh reveals only) ----
  // The reveal and the review are now distinct screens. A fresh reveal is a
  // full-screen ceremony: the avatars meet, then the score owns the whole
  // screen (confetti >75%, denser >90%) with the know-each-other capsule —
  // and only a deliberate "See your answers" step opens the breakdown.
  // Reopening from Results/Decks goes straight to the breakdown.
  const reduced =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const ceremony = !review && hasScore;
  const [phase, setPhase] = useState<"ceremony" | "answers">(
    ceremony ? "ceremony" : "answers",
  );
  // Within the ceremony: 1 = the two of you meet, 2 = the score takes over.
  // Reduced-motion users get stage 2 immediately, statically.
  const [stage, setStage] = useState(reduced ? 2 : 1);
  const [party, setParty] = useState(false);
  const skipped = useRef(false);

  useEffect(() => {
    if (phase !== "ceremony" || reduced) return;
    const ts = [
      setTimeout(() => setStage((s) => Math.max(s, 2)), 1150),
      setTimeout(() => {
        if (!skipped.current && pct > 75) setParty(true);
      }, 2150),
      setTimeout(() => setParty(false), 7400),
    ];
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const skipMeet = () => {
    skipped.current = true;
    setStage(2);
  };

  const eyebrow = (
    <div className="eyebrow center" style={{ marginTop: 10 }}>
      {deckName(slug, lang).toUpperCase()}
      {review
        ? t(" · REVIEW", " · RÉCAP")
        : multi
          ? t(
              ` · PART ${level + 1} OF ${nLevels(slug)}`,
              ` · PARTIE ${level + 1} SUR ${nLevels(slug)}`,
            )
          : ""}
    </div>
  );

  if (showFlags) {
    return (
      <FlagsReview
        rows={flagRows}
        myName={myName}
        partnerName={partnerName}
        onClose={() => setShowFlags(false)}
      />
    );
  }

  if (phase === "ceremony") {
    return (
      <section onClick={stage < 2 ? skipMeet : undefined}>
        <TopBar onExit={onDone} />
        {party && <Celebration big={pct > 90} />}
        {eyebrow}

        {stage === 1 && (
          <div className="meetstage tall">
            <div className="meetpair">
              <Avatar name={myName} tone="berry" size={58} />
              <Avatar name={partnerName} tone="honey" size={58} />
            </div>
            <div className="meetline">
              {t("You've both answered.", "Vous avez tous les deux répondu.")}
            </div>
          </div>
        )}

        {stage >= 2 && (
          <div className="levelup">
            {/* The two axes at equal weight — agreement and Known — are the
                whole point of the reveal (brief §3a). */}
            <div className="lvlup-rise r1">
              <ScorePair agreed={pct} known={know.pct} t={t} size={140} />
            </div>
            {know.pct != null && (
              <p className="knowline lvlup-rise r1">{knowLine(know.pct, t)}</p>
            )}
            <p
              className="sub serif center lvlup-rise r2"
              style={{ fontStyle: "italic", margin: "10px 24px 0" }}
            >
              {t(
                "Not a verdict — a place to start talking.",
                "Pas un verdict — un point de départ pour discuter.",
              )}
            </p>
            <div className="lvlup-cta lvlup-rise r3">
              <button
                className="btn pill"
                type="button"
                onClick={() => setPhase("answers")}
              >
                {t("See your answers →", "Voir vos réponses →")}
              </button>
              <button className="btn ghost" type="button" onClick={onDone}>
                {t("Done for now", "Terminé pour l’instant")}
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section>
      <TopBar onExit={onDone} />
      {eyebrow}

      {hasScore ? (
        <ScorePair agreed={pct} known={know.pct} t={t} size={120} />
      ) : (
        <h1 className="h1 center" style={{ margin: "16px 0 6px" }}>
          {t("What you each said", "Ce que chacun a dit")}
        </h1>
      )}

      {/* The berry box — renders only when there are flags (no empty state). */}
      {flagRows.length > 0 && (
        <FlagBox count={flagRows.length} onOpen={() => setShowFlags(true)} t={t} />
      )}

      {/* Called as a plain function (not <RevealBody/>) so re-renders don't
          remount the body and replay its animations. */}
      {RevealBody()}
    </section>
  );

  // Afterglow content — extracted so the stages above stay readable.
  function RevealBody() {
    return (
      <>
      {know.pct != null && (
        <p className="knowline reveal-rise">
          {knowLine(know.pct, t)}
          {" · "}
          {t(`${know.right} of ${know.made} right`, `${know.right} sur ${know.made}`)}
        </p>
      )}
      <p className="sub serif center reveal-rise" style={{ fontStyle: "italic", margin: "0 24px 6px" }}>
        {t(
          "Not a verdict — a place to start talking.",
          "Pas un verdict — un point de départ pour discuter.",
        )}
      </p>

      <div className="qbreak" style={{ marginTop: 20 }}>
        {joint.map((q, i) => {
          const r = scoreQ(q, data, role);
          const lq = localizeQuestion(q, lang);
          return (
            <QCard
              key={q.id}
              q={lq}
              r={r}
              t={t}
              myName={myName}
              partnerName={partnerName}
              delay={Math.min(i * 50, 500)}
            />
          );
        })}
        {joint.length === 0 && (
          <div className="qc" style={{ borderLeftColor: "var(--sub)" }}>
            <div className="muted" style={{ fontSize: 13 }}>
              {t(
                "Open reflections here — compare them together.",
                "Des réflexions libres ici — comparez-les ensemble.",
              )}
            </div>
          </div>
        )}
      </div>

      <button className="btn pill" type="button" onClick={onDone}>
        {t("Done", "Terminé")}
      </button>
      </>
    );
  }
}

// Full-screen celebration overlay, constrained to the app column.
// Petals drift down in brand colours; over 90% the fall is roughly twice as
// dense, larger, and runs in two waves. Pointer-events pass through; the
// parent unmounts it after ~5s.
function Celebration({ big }: { big: boolean }) {
  const count = big ? 96 : 26;
  const petals = Array.from({ length: count }, (_, i) => i);
  const colors = big
    ? [
        "var(--berry2)",
        "var(--honey)",
        "var(--honeyD)",
        "var(--app-petal-pink)",
        "var(--rose)",
        "var(--app-spark)",
      ]
    : [
        "var(--berry2)",
        "var(--honey)",
        "var(--honeyD)",
        "var(--app-petal-pink)",
        "var(--rose)",
      ];
  return (
    <div className="celebrate" aria-hidden="true">
      <span className="wash" />
      {petals.map((i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            width: (big ? 9 : 8) + (i % 4) * 2,
            height: (big ? 12 : 11) + (i % 3) * 3,
            background: colors[i % colors.length],
            animationDelay: `${(i % (big ? 19 : 13)) * (big ? 0.13 : 0.17)}s`,
            animationDuration: `${2.7 + (i % 5) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

const initialOf = (n: string) => (n || "?").trim().charAt(0).toUpperCase() || "?";

// One airy card per question, with a body tailored to the question type:
// scale → a 1–5 alignment bar; mc → matched/split chips; rank → paired ordered
// lists with matching positions highlighted; open → quoted blocks with avatars.
function QCard({
  q,
  r,
  t,
  myName,
  partnerName,
  delay,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
  delay: number;
}) {
  const vcol = VERDICT_COLOR[r.verdict];
  return (
    <div
      className="qc row-rise"
      style={{ borderLeftColor: vcol, animationDelay: `${delay}ms` }}
    >
      <div className="qc-head">
        <div className="qc-q">{q.q}</div>
        {q.type !== "open" && (
          <span className="qc-badge" style={{ color: vcol, borderColor: vcol }}>
            {t(r.verdict, VERDICT_FR[r.verdict])}
          </span>
        )}
      </div>

      {q.type === "scale" && <ScaleBar q={q} r={r} myName={myName} partnerName={partnerName} />}

      {q.type === "mc" && <McBody q={q} r={r} t={t} myName={myName} partnerName={partnerName} />}

      {q.type === "rank" && r.A && r.B && (
        <RankBody q={q} r={r} t={t} myName={myName} partnerName={partnerName} />
      )}

      {q.type === "open" && (
        <div className="openq">
          <Quote name={myName} tone="s" text={String(r.me ?? "—")} />
          <Quote name={partnerName} tone="j" text={String(r.th ?? "—")} />
        </div>
      )}

      {r.verdict === "Complementary" && (
        <div className="qc-note comp">
          {t(
            "Different — and that works well together.",
            "Différent — et cela se complète bien.",
          )}
        </div>
      )}
      {r.verdict === "Worth a chat" && (
        <div className="qc-note">
          {t("Worth a conversation.", "Un sujet à aborder ensemble.")}
        </div>
      )}

      {(r.guessed || r.theyGuessed) && (
        <div className="guessrow">
          {r.guessed && (
            <span className={`gtag ${r.guessRight ? "gok" : "gno"}`}>
              {r.guessRight ? "✓" : "✗"}{" "}
              {t("You guessed they'd pick", "Ton pari pour l’autre")}:{" "}
              <b>{optLabel(q, r.guess)}</b>
            </span>
          )}
          {r.theyGuessed && (
            <span className={`gtag ${r.theyGuessRight ? "gok" : "gno"}`}>
              {r.theyGuessRight ? "✓" : "✗"} {partnerName}{" "}
              {t("guessed you'd pick", "avait parié sur toi")}:{" "}
              <b>{optLabel(q, r.theirGuess)}</b>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ScaleBar({
  q,
  r,
  myName,
  partnerName,
}: {
  q: Question;
  r: ScoreResult;
  myName: string;
  partnerName: string;
}) {
  const mv = Number(r.me);
  const tv = Number(r.th);
  const posMe = ((mv - 1) / 4) * 100;
  const posTh = ((tv - 1) / 4) * 100;
  const same = mv === tv;
  const lo = Math.min(posMe, posTh);
  const hi = Math.max(posMe, posTh);
  return (
    <div className="sbar">
      <div className="sbar-track">
        {!same && <span className="sbar-fill" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />}
        {same ? (
          <span className="sbar-dot both" style={{ left: `${posMe}%` }}>
            ♥
          </span>
        ) : (
          <>
            <span className="sbar-dot s" style={{ left: `${posMe}%` }}>
              {initialOf(myName)}
            </span>
            <span className="sbar-dot j" style={{ left: `${posTh}%` }}>
              {initialOf(partnerName)}
            </span>
          </>
        )}
      </div>
      <div className="sbar-ends">
        <span>{q.lo}</span>
        <span>{q.hi}</span>
      </div>
    </div>
  );
}

function McBody({
  q,
  r,
  t,
  myName,
  partnerName,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
}) {
  if (r.me === r.th) {
    return (
      <div className="mcboth">
        <span className="mccheck">✓</span> {t("You both said", "Vous avez tous deux dit")}{" "}
        <b>{optLabel(q, r.me)}</b>
      </div>
    );
  }
  return (
    <div className="mctwo">
      <span className="mcchip s">
        <i>{myName}</i>
        <b>{optLabel(q, r.me)}</b>
      </span>
      <span className="mcchip j">
        <i>{partnerName}</i>
        <b>{optLabel(q, r.th)}</b>
      </span>
    </div>
  );
}

function RankBody({
  q,
  r,
  t,
  myName,
  partnerName,
}: {
  q: Question;
  r: ScoreResult;
  t: (en: string, fr: string) => string;
  myName: string;
  partnerName: string;
}) {
  const A = r.A ?? [];
  const B = r.B ?? [];
  return (
    <>
      <div className="rank2">
        <div className="rank2-col">
          <div className="rank2-h s">{myName}</div>
          <ol>
            {A.map((idx, k) => (
              <li key={k} className={B[k] === idx ? "rmatch" : ""}>
                {q.opts?.[idx] ?? idx}
              </li>
            ))}
          </ol>
        </div>
        <div className="rank2-col">
          <div className="rank2-h j">{partnerName}</div>
          <ol>
            {B.map((idx, k) => (
              <li key={k} className={A[k] === idx ? "rmatch" : ""}>
                {q.opts?.[idx] ?? idx}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {A[0] != null && A[0] === B[0] && (
        <div className="qc-note ok">
          ✓ {t("You agree on your top priority", "Vous êtes d’accord sur votre priorité n°1")}
        </div>
      )}
    </>
  );
}

function Quote({ name, tone, text }: { name: string; tone: "s" | "j"; text: string }) {
  return (
    <div className="oq">
      <span className={`oav ${tone}`}>{initialOf(name)}</span>
      <div>
        <span className="oq-who">{name}</span>
        <div className="oq-text">{text}</div>
      </div>
    </div>
  );
}
