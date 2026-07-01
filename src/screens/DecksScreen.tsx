import { DECKS, ORDER } from "../lib/questions";
import { stageOf, STAGES, nLevels } from "../lib/leveling";
import { curLevel, catComplete } from "../lib/progress";
import { type DeckData, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { ProgressRing } from "../components/Ring";

export default function DecksScreen({
  session,
  role,
  onPlay,
}: {
  session: Session;
  role: Role;
  onPlay: (slug: string) => void;
}) {
  const buckets: string[][] = [[], [], []];
  ORDER.forEach((slug) => buckets[stageOf(slug)].push(slug));

  const answered = (slug: string, deck: DeckData | undefined) =>
    DECKS[slug].questions.filter((q) => deck?.answers?.[q.id]?.[role] != null).length;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        The decks
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 20px" }}>
        Where to go next
      </h1>

      {buckets.map((bucket, i) =>
        bucket.length ? (
          <div key={i}>
            <div className="stagelabel">
              <span>{STAGES[i][0]}</span>
              <span className="muted">{STAGES[i][1]}</span>
            </div>
            {bucket.map((slug) => {
              const d = DECKS[slug];
              const deck = session.decks?.[slug];
              const total = d.questions.length;
              const mine = answered(slug, deck);
              const L = nLevels(slug);
              const lvl = curLevel(slug, deck, role);
              const sub =
                L > 1
                  ? catComplete(slug, deck, role)
                    ? `All ${L} levels done · ${total} questions`
                    : `Level ${lvl + 1} of ${L} · ${total} questions`
                  : mine > 0
                    ? `${mine} of ${total} answered`
                    : `${total} questions`;
              return (
                <div key={slug} className="row" onClick={() => onPlay(slug)}>
                  <div className="catico" style={{ background: `${d.color}1A`, color: d.color }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "block" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 600 }}>{d.name}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {sub}
                    </div>
                  </div>
                  <ProgressRing done={mine} total={total} size={46} />
                </div>
              );
            })}
          </div>
        ) : null,
      )}
      <p className="muted center" style={{ fontSize: 12, marginTop: 18 }}>
        {ORDER.filter((s) => catComplete(s, session.decks?.[s], role)).length} of{" "}
        {ORDER.length} decks complete
      </p>
    </section>
  );
}
