import { useMemo, useState } from "react";
import { lvlQs, nLevels } from "../lib/leveling";
import { writeAnswer, writeGuess, markLevelDone } from "../lib/session";
import { DECKS, type Question } from "../lib/questions";
import type { DeckData, Role, AnswerValue } from "../lib/scoring";

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
}: {
  code: string;
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  partnerName: string;
  onFinish: () => void;
}) {
  const qs = useMemo(() => lvlQs(slug, level), [slug, level]);

  // Start at the first question this role hasn't answered.
  const firstUnanswered = useMemo(() => {
    let i = 0;
    while (i < qs.length && deck?.answers?.[qs[i].id]?.[role] != null) i++;
    return i;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, level]);

  const [idx, setIdx] = useState(firstUnanswered);
  const [guessPhase, setGuessPhase] = useState(false);
  const [pendAns, setPendAns] = useState<AnswerValue | null>(null);
  const [pendGuess, setPendGuess] = useState<AnswerValue | null>(null);
  const [rankOrder, setRankOrder] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const advance = async (fromIdx: number) => {
    setGuessPhase(false);
    setPendAns(null);
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
  const q = qs[idx];

  const submitAnswer = async () => {
    if (pendAns == null || busy) return;
    setBusy(true);
    await writeAnswer(code, slug, q.id, role, pendAns);
    setBusy(false);
    if (q.guessable && q.type !== "open") {
      setGuessPhase(true);
      setPendGuess(null);
    } else {
      advance(idx);
    }
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
    DECKS[slug].name.toUpperCase() +
    (multi ? ` · LEVEL ${level + 1} OF ${nLevels(slug)}` : "");

  if (guessPhase) {
    const yourText = q.type === "scale" ? `${pendAns} / 5` : q.opts?.[pendAns as number];
    return (
      <section>
        <div className="center">
          <div className="wordmark" style={{ color: "var(--amber)" }}>
            aligned &#10022;
          </div>
        </div>
        <div className="qcard" style={{ marginTop: 26, borderColor: "#F3E6CF" }}>
          <div className="qrow">
            <div className="eyebrow">{DECKS[slug].name.toUpperCase()}</div>
            <span className="badge honey">&#10022; GUESS</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                YOU SAID
              </div>
              <div className="yousaid-val">{yourText}</div>
            </div>
          </div>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            Now — what will <span style={{ color: "var(--amber)" }}>{partnerName}</span> say?
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
          Lock it in →
        </button>
        <button className="btn ghost" type="button" onClick={() => advance(idx)}>
          Skip
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="center">
        <div className="wordmark">aligned &#10022;</div>
      </div>
      <div className="qprog">
        <i style={{ width: `${Math.round(((idx + 1) / qs.length) * 100)}%` }} />
      </div>
      <div className="qcard" style={{ marginTop: 18 }}>
        <div className="qrow">
          <div className="eyebrow">{eyebrow}</div>
          <span className="badge">TIER {q.tier}</span>
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
        {idx + 1 === qs.length ? "Finish level →" : "Next →"}
      </button>
      <div className="hint">
        {idx + 1} OF {qs.length}
        {q.type === "open"
          ? " · OPEN REFLECTION"
          : q.type === "rank"
            ? " · RANK YOUR ORDER"
            : " · TAP TO ANSWER"}
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
      </>
    );
  }
  if (q.type === "open") {
    return (
      <textarea
        className="ta"
        placeholder="Write as much or as little as you like…"
        value={(value as string) ?? ""}
        onChange={(e) => setPend(e.target.value.trim() === "" ? null : e.target.value)}
      />
    );
  }
  if (q.type === "rank") {
    return (
      <>
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Tap in order of priority — 1 = most important.
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
