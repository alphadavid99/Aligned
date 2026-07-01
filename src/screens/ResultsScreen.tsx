import { DECKS, ORDER } from "../lib/questions";
import { catComplete } from "../lib/progress";
import { overall, jointQuestions, type DeckData, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { PctRing } from "../components/Ring";

// Overall alignment across every deck both partners have fully finished.
export default function ResultsScreen({
  session,
  role,
}: {
  session: Session;
  role: Role;
}) {
  const completed = ORDER.filter((slug) =>
    catComplete(slug, session.decks?.[slug], role),
  );

  // Overall = average of all scoreable joint answers across completed decks.
  let sum = 0;
  let n = 0;
  const rows: { slug: string; pct: number }[] = [];
  for (const slug of completed) {
    const deck: DeckData | undefined = session.decks?.[slug];
    const qs = DECKS[slug].questions;
    const joint = jointQuestions(qs, deck ?? {}).filter((q) => q.type !== "open");
    if (!joint.length) continue;
    rows.push({ slug, pct: overall(qs, deck ?? {}, role) });
    // fold into overall
    sum += overall(qs, deck ?? {}, role) * joint.length;
    n += joint.length;
  }
  const overallPct = n ? Math.round(sum / n) : null;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        The two of you
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        Where you landed
      </h1>

      {overallPct == null ? (
        <p className="sub serif center" style={{ fontStyle: "italic", margin: "20px 24px" }}>
          Finish a deck together and your shared alignment appears here — not to
          judge, but to open the conversation.
        </p>
      ) : (
        <>
          <div className="center" style={{ margin: "16px 0 6px" }}>
            <PctRing pct={overallPct} size={190} />
          </div>
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "0 24px 20px" }}>
            Across {rows.length} completed {rows.length === 1 ? "deck" : "decks"}.
          </p>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {rows.map(({ slug, pct }) => (
              <div key={slug} className="resrow">
                <span style={{ flex: 1, fontWeight: 600 }}>{DECKS[slug].name}</span>
                <span style={{ color: "var(--berry)", fontWeight: 700 }}>{pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
