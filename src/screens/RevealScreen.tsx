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
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { PctRing } from "../components/Ring";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { useT, useLang } from "../lib/i18n";

// Display labels for each verdict when the language is French.
const VERDICT_FR: Record<Verdict, string> = {
  Matched: "Identique",
  Close: "Proche",
  Differed: "Différent",
  Complementary: "Complémentaire",
  Shared: "Partagé",
};

// "Differed" is deliberately a calm, neutral ink — not alarm-red. Difference
// here is an invitation to talk, never a failure state (see the subline below).
const VERDICT_COLOR: Record<Verdict, string> = {
  Matched: "#2fa96b",
  Close: "var(--honeyD)",
  Differed: "#6a5a66",
  Complementary: "#8250b8",
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

  // ---- The Gift Reveal ceremony (fresh reveals only) ----
  // Stage 1: the two avatars meet. Stage 2: the score owns the screen (with
  // petals >75% / doves >90%). Stage 3: the score docks up and the breakdown
  // flows in. Reopened decks and reduced-motion users get the flat render.
  const reduced =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const ceremony = !review && hasScore && !reduced;
  const [stage, setStage] = useState(ceremony ? 1 : 3);
  const [party, setParty] = useState(false);
  const skipped = useRef(false);

  useEffect(() => {
    if (!ceremony) return;
    const ts = [
      setTimeout(() => setStage((s) => Math.max(s, 2)), 1150),
      setTimeout(() => {
        if (!skipped.current && pct > 75) setParty(true);
      }, 2150),
      setTimeout(() => setStage((s) => Math.max(s, 3)), 3600),
      setTimeout(() => setParty(false), 7400),
    ];
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ceremony]);

  const skip = () => {
    skipped.current = true;
    setParty(false);
    setStage(3);
  };

  return (
    <section onClick={stage < 3 ? skip : undefined}>
      <TopBar onExit={onDone} />
      {party && <Celebration doves={pct > 90} />}
      <div className="eyebrow center" style={{ marginTop: 10 }}>
        {deckName(slug, lang).toUpperCase()}
        {review
          ? t(" · REVIEW", " · RÉCAP")
          : multi
            ? t(
                ` · LEVEL ${level + 1} OF ${nLevels(slug)}`,
                ` · NIVEAU ${level + 1} SUR ${nLevels(slug)}`,
              )
            : ""}
      </div>

      {stage === 1 && (
        <div className="meetstage">
          <div className="meetpair">
            <Avatar name={myName} tone="berry" size={58} />
            <Avatar name={partnerName} tone="honey" size={58} />
          </div>
          <div className="meetline">
            {t("You've both answered.", "Vous avez tous les deux répondu.")}
          </div>
        </div>
      )}

      {stage >= 2 && hasScore && (
        <div className={`herostage${stage === 2 ? " hero" : ""}`}>
          <div className="center" style={{ margin: "18px 0 6px" }}>
            {/* Bloom fires after the ring finishes drawing — the milestone moment. */}
            <span className="bloomwrap">
              <span className="glint g1" />
              <span className="glint g2" />
              <PctRing pct={pct} size={180} label={t("aligned", "alignés")} />
            </span>
          </div>
        </div>
      )}
      {stage >= 3 && !hasScore && (
        <h1 className="h1 center" style={{ margin: "16px 0 6px" }}>
          {t("What you each said", "Ce que chacun a dit")}
        </h1>
      )}

      {/* Called as a plain function (not <RevealBody/>) so re-renders while the
          overlay unmounts don't remount the body and replay its animations. */}
      {stage >= 3 && RevealBody()}
    </section>
  );

  // Afterglow content — extracted so the stages above stay readable.
  function RevealBody() {
    return (
      <>
      {know.pct != null && (
        <div className="knowcaps reveal-rise">
          <span className="knowpill">
            <b>{know.pct}%</b>
            <span>
              {knowLine(know.pct, t)}
              {" · "}
              {t(`${know.right} of ${know.made} right`, `${know.right} sur ${know.made}`)}
            </span>
          </span>
        </div>
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

      <button className="btn" type="button" onClick={onDone}>
        {t("Done", "Terminé")}
      </button>
      </>
    );
  }
}

// Full-screen celebration overlay, constrained to the app column.
// Petals (>75%) drift down in brand colours; doves (>90%) rise with them.
// Pointer-events pass through; the parent unmounts it after ~5s.
function Celebration({ doves }: { doves: boolean }) {
  const petals = Array.from({ length: 26 }, (_, i) => i);
  const colors = ["#7C3C69", "#E5A93C", "#D9963A", "#F1C8D2", "#9C4A6E"];
  return (
    <div className="celebrate" aria-hidden="true">
      <span className="wash" />
      {petals.map((i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            width: 8 + (i % 4) * 2,
            height: 11 + (i % 3) * 3,
            background: colors[i % colors.length],
            animationDelay: `${(i % 13) * 0.17}s`,
            animationDuration: `${2.7 + (i % 5) * 0.3}s`,
          }}
        />
      ))}
      {doves &&
        [12, 32, 52, 70, 85].map((left, i) => (
          <span
            key={left}
            className="dove"
            style={{
              left: `${left}%`,
              animationDelay: `${0.2 + i * 0.38}s`,
              animationDuration: `${2.8 + (i % 3) * 0.3}s`,
            }}
          >
            <svg width={i % 2 ? 52 : 64} viewBox="0 0 64 64" fill="#fff">
              <ellipse cx="33" cy="34" rx="11" ry="6.5" />
              <circle cx="43" cy="27.5" r="4.2" />
              <path d="M47 27 L52 28.5 L47 30 Z" />
              <path d="M23 33 L9 40 L24 38.5 Z" />
              <path className="wingL" d="M30 32 Q18 16 5 20 Q19 27 28 36 Z" />
              <path className="wingR" d="M36 32 Q48 16 61 20 Q47 27 38 36 Z" />
            </svg>
          </span>
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
      {r.verdict === "Differed" && (
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
