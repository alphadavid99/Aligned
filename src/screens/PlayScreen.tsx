import { useMemo, useState } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import { writeAnswer, writeGuess, writeImportance, markLevelDone } from "../lib/session";
import { type Question } from "../lib/questions";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { NOT_YET, type DeckData, type Role, type AnswerValue } from "../lib/scoring";
import { TopBar } from "../components/TopBar";
import { useT, useLang } from "../lib/i18n";

// Intensity words for the 1–5 scale. The endpoints are already labelled per
// question (q.lo / q.hi); these name the position so the middle is never
// ambiguous. Direction is carried by which orb the label sits under.
const SCALE_WORDS = [
  "Strongly",
  "Leaning",
  "Right in the middle",
  "Leaning",
  "Strongly",
];
const SCALE_WORDS_FR = [
  "Fortement",
  "Plutôt",
  "Pile au milieu",
  "Plutôt",
  "Fortement",
];

// Importance is asked only where a gap would actually cost the couple: the
// tier-3 questions and the deal-breaker set. Everything else silently rides the
// tier default so the user isn't taxed on every question (brief §2b). Open
// questions never score, so they're never asked.
const asksImportance = (q: Question): boolean =>
  q.type !== "open" && (Number(q.depth) >= 4 || q.id.startsWith("DEAL-"));

// The answering flow for one level: answer each question, and for guessable
// (non-open) questions, predict your partner. Ported from the legacy question
// flow. When the level is exhausted, mark it done and hand back to the shell.
export default function PlayScreen({
  code,
  slug,
  level,
  role,
  deck,
  partnerName,
  onFinish,
  onExit,
}: {
  code: string;
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  partnerName: string;
  onFinish: () => void;
  onExit: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const qs = useMemo(() => lvlQs(slug, level), [slug, level]);

  // Start at the first question this role hasn't answered.
  const firstUnanswered = useMemo(() => {
    let i = 0;
    while (i < qs.length && deck?.answers?.[qs[i].id]?.[role] != null) i++;
    return i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  const [idx, setIdx] = useState(firstUnanswered);
  const [impPhase, setImpPhase] = useState(false);
  const [guessPhase, setGuessPhase] = useState(false);
  const [pendAns, setPendAns] = useState<AnswerValue | null>(null);
  const [pendImp, setPendImp] = useState<number | null>(null);
  const [pendGuess, setPendGuess] = useState<AnswerValue | null>(null);
  const [rankOrder, setRankOrder] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const advance = async (fromIdx: number) => {
    setImpPhase(false);
    setGuessPhase(false);
    setPendAns(null);
    setPendImp(null);
    setPendGuess(null);
    setRankOrder([]);
    let n = fromIdx + 1;
    while (n < qs.length && deck?.answers?.[qs[n].id]?.[role] != null) n++;
    if (n >= qs.length) {
      setBusy(true);
      await markLevelDone(code, slug, level, role);
      onFinish();
      return;
    }
    setIdx(n);
  };

  if (idx >= qs.length) return null;
  const q = localizeQuestion(qs[idx], lang);

  // After the answer is banked: qualifying questions get the importance ask
  // first, then (if guessable) the guess step, then advance. Non-qualifying
  // questions skip straight to the guess step or the next question.
  const afterAnswer = () => {
    if (q.guessable && q.type !== "open") {
      setGuessPhase(true);
      setPendGuess(null);
    } else {
      advance(idx);
    }
  };

  const submitAnswer = async () => {
    if (pendAns == null || busy) return;
    setBusy(true);
    await writeAnswer(code, slug, q.id, role, pendAns);
    setBusy(false);
    if (asksImportance(q)) {
      setImpPhase(true);
      setPendImp(null);
    } else {
      afterAnswer();
    }
  };

  // "Not yet" — a deliberate, unscored answer (only on flagged questions). It
  // banks a sentinel and moves on, skipping the importance and guess steps
  // entirely: there's nothing to weight and nothing to predict.
  const answerNotYet = async () => {
    if (busy) return;
    setBusy(true);
    await writeAnswer(code, slug, q.id, role, NOT_YET);
    setBusy(false);
    advance(idx);
  };

  const submitImportance = async () => {
    if (busy) return;
    if (pendImp != null) {
      setBusy(true);
      await writeImportance(code, slug, q.id, role, pendImp);
      setBusy(false);
    }
    setImpPhase(false);
    afterAnswer();
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy) return;
    setBusy(true);
    await writeGuess(code, slug, q.id, role, pendGuess);
    setBusy(false);
    advance(idx);
  };

  const multi = nLevels(slug) > 1;
  const eyebrow =
    deckName(slug, lang).toUpperCase() +
    (multi
      ? t(
          ` · PART ${level + 1} OF ${nLevels(slug)}`,
          ` · PARTIE ${level + 1} SUR ${nLevels(slug)}`,
        )
      : "");

  if (impPhase) {
    return (
      <section>
        <TopBar onExit={onExit} />
        <div
          key={`${q.id}-imp`}
          className="qcard glide-in"
          style={{ marginTop: 20 }}
        >
          <div className="qrow">
            <div className="eyebrow">{deckName(slug, lang).toUpperCase()}</div>
            <span className="badge">{t("HOW MUCH", "IMPORTANCE")}</span>
          </div>
          <div className="qtext">
            {t(
              "How much does this matter to you?",
              "À quel point est-ce important pour vous ?",
            )}
          </div>
          <div className="slabels">
            <span>{t("Not much", "Peu")}</span>
            <span style={{ textAlign: "right" }}>
              {t("A great deal", "Énormément")}
            </span>
          </div>
          <div className="scale">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`orb ${pendImp === i ? "sel" : ""}`}
                onClick={() => setPendImp(i)}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn"
          type="button"
          disabled={pendImp == null || busy}
          onClick={submitImportance}
        >
          {t("Next →", "Suivant →")}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setImpPhase(false);
            afterAnswer();
          }}
        >
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  if (guessPhase) {
    const yourText = q.type === "scale" ? `${pendAns} / 5` : q.opts?.[pendAns as number];
    return (
      <section>
        <TopBar onExit={onExit} />
        <div
          key={`${q.id}-guess`}
          className="qcard glide-in"
          style={{ marginTop: 20, borderColor: "#F3E6CF" }}
        >
          <div className="qrow">
            <div className="eyebrow">{deckName(slug, lang).toUpperCase()}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                {t("YOU SAID", "VOUS AVEZ DIT")}
              </div>
              <div className="yousaid-val">{yourText}</div>
            </div>
          </div>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            {t("Now — what will ", "Maintenant — que va répondre ")}
            <span style={{ color: "var(--amber)" }}>{partnerName}</span>
            {t(" say?", " ?")}
          </p>
          <QuestionInput
            q={q}
            value={pendGuess}
            guess
            onPick={setPendGuess}
            rankOrder={rankOrder}
            setRankOrder={setRankOrder}
            setPend={setPendGuess}
          />
        </div>
        <button
          className="btn honey"
          type="button"
          disabled={pendGuess == null || busy}
          onClick={lockGuess}
        >
          {t("Lock it in →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={() => advance(idx)}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  return (
    <section>
      <TopBar onExit={onExit} />
      <div className="qprog">
        <i style={{ width: `${Math.round(((idx + 1) / qs.length) * 100)}%` }}>
          {/* keyed per question so the leading edge pulses once per advance */}
          <span key={idx} className="qtick" />
        </i>
      </div>
      <div key={q.id} className="qcard glide-in" style={{ marginTop: 18 }}>
        <div className="qrow">
          <div className="eyebrow">{eyebrow}</div>
          {/* The numeric TIER badge is gone (brief 2 §A7c) — depth is never a
              number in the UI. The eyebrow's Part label carries the ramp. */}
        </div>
        <div className="qtext">{q.q}</div>
        <QuestionInput
          q={q}
          value={pendAns}
          onPick={setPendAns}
          rankOrder={rankOrder}
          setRankOrder={setRankOrder}
          setPend={setPendAns}
        />
      </div>
      <button
        className="btn"
        type="button"
        disabled={pendAns == null || busy}
        onClick={submitAnswer}
      >
        {idx + 1 === qs.length
          ? t("Finish part →", "Terminer la partie →")
          : t("Next →", "Suivant →")}
      </button>
      {q.notYet && (
        <button
          className="btn ghost"
          type="button"
          onClick={answerNotYet}
          disabled={busy}
        >
          {t("Not yet", "Pas encore")}
        </button>
      )}
      <div className="hint">
        {t(`${idx + 1} OF ${qs.length}`, `${idx + 1} SUR ${qs.length}`)}
        {q.type === "open"
          ? t(" · OPEN REFLECTION", " · RÉFLEXION LIBRE")
          : q.type === "rank"
            ? t(" · RANK YOUR ORDER", " · CLASSEZ PAR ORDRE")
            : t(" · TAP TO ANSWER", " · APPUYEZ POUR RÉPONDRE")}
      </div>
    </section>
  );
}

function QuestionInput({
  q,
  value,
  guess,
  onPick,
  rankOrder,
  setRankOrder,
  setPend,
}: {
  q: Question;
  value: AnswerValue | null;
  guess?: boolean;
  onPick: (v: AnswerValue) => void;
  rankOrder: number[];
  setRankOrder: (v: number[]) => void;
  setPend: (v: AnswerValue | null) => void;
}) {
  const t = useT();
  if (q.type === "scale") {
    return (
      <>
        <div className="slabels">
          <span>{q.lo}</span>
          <span style={{ textAlign: "right" }}>{q.hi}</span>
        </div>
        <div className="scale">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`orb ${value === i ? "sel" : ""}`}
              onClick={() => onPick(i)}
            >
              {i}
            </div>
          ))}
        </div>
        {/* Live label anchored under the chosen orb — names the middle so the
            user never has to work out "is 3 neutral or a lean?" (Pillar 3). */}
        <div className="orblabels" aria-hidden={value == null}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="orblabel-cell">
              {value === i && (
                <>
                  <span className="caret" />
                  <span className="orblabel">
                    {t(SCALE_WORDS[i - 1], SCALE_WORDS_FR[i - 1])}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }
  if (q.type === "open") {
    return (
      <textarea
        className="ta"
        placeholder={t(
          "Write as much or as little as you like…",
          "Écrivez autant ou aussi peu que vous le souhaitez…",
        )}
        value={(value as string) ?? ""}
        onChange={(e) => setPend(e.target.value.trim() === "" ? null : e.target.value)}
      />
    );
  }
  if (q.type === "rank") {
    return (
      <>
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          {t(
            "Tap in order of priority — 1 = most important.",
            "Appuyez par ordre de priorité — 1 = le plus important.",
          )}
        </div>
        {q.opts?.map((o, i) => {
          const pos = rankOrder.indexOf(i);
          const ranked = pos >= 0;
          return (
            <div
              key={i}
              className={`opt rankopt ${ranked ? "sel" : ""}`}
              onClick={() => {
                const next = [...rankOrder];
                const p = next.indexOf(i);
                if (p >= 0) next.splice(p, 1);
                else next.push(i);
                setRankOrder(next);
                setPend(next.length === q.opts!.length ? next.join(",") : null);
              }}
            >
              <span className="rankno">{ranked ? pos + 1 : ""}</span>
              <span style={{ flex: 1 }}>{o}</span>
            </div>
          );
        })}
      </>
    );
  }
  // mc
  return (
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
}
