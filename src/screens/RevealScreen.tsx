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
} from "../lib/scoring";
import { DECKS, type Question } from "../lib/questions";
import { PctRing } from "../components/Ring";

const VERDICT_COLOR: Record<Verdict, string> = {
  Matched: "#2fa96b",
  Close: "var(--honeyD)",
  Differed: "var(--rose)",
  Complementary: "#8250b8",
  Shared: "var(--sub)",
};

function optLabel(q: Question, v: AnswerValue | undefined): string {
  if (v == null) return "—";
  if (q.type === "scale") return `${v} / 5`;
  if (q.type === "open") return String(v);
  return q.opts?.[Number(v)] ?? String(v);
}

// Level reveal: the shared alignment score plus a per-question breakdown.
// Both partners see the same number (it only unlocks once both have finished).
export default function RevealScreen({
  slug,
  level,
  role,
  deck,
  onDone,
}: {
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  onDone: () => void;
}) {
  const qs = lvlQs(slug, level);
  const data = deck ?? {};
  const pct = overall(qs, data, role);
  const know = knowScore(qs, data, role);
  const joint = jointQuestions(qs, data);
  const multi = nLevels(slug) > 1;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {DECKS[slug].name.toUpperCase()}
        {multi ? ` · LEVEL ${level + 1} OF ${nLevels(slug)}` : ""}
      </div>
      <div className="center" style={{ margin: "18px 0 6px" }}>
        <PctRing pct={pct} size={180} />
      </div>
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "0 24px 6px" }}>
        Not a verdict — a place to start talking.
      </p>
      {know.pct != null && (
        <p className="muted center" style={{ fontSize: 14 }}>
          You guessed each other right {know.pct}% of the time ({know.right}/{know.made}).
        </p>
      )}

      <div className="card" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
        {joint.map((q) => {
          const r = scoreQ(q, data, role);
          return (
            <div key={q.id} className="verrow">
              <div className="verq">{q.q}</div>
              <div className="veranswers">
                <span>
                  You: <b>{optLabel(q, r.me)}</b>
                </span>
                <span>
                  Them: <b>{optLabel(q, r.th)}</b>
                </span>
              </div>
              <span
                className="verbadge"
                style={{ color: VERDICT_COLOR[r.verdict], borderColor: VERDICT_COLOR[r.verdict] }}
              >
                {r.verdict}
              </span>
            </div>
          );
        })}
        {joint.length === 0 && (
          <div className="verrow">
            <div className="muted">Open reflections here — compare them together.</div>
          </div>
        )}
      </div>

      <button className="btn" type="button" onClick={onDone}>
        Done
      </button>
    </section>
  );
}
