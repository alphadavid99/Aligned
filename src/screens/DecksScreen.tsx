import { DECKS, ORDER } from "../lib/questions";
import { stageOf, STAGES, deckDepthWord } from "../lib/leveling";
import { catComplete } from "../lib/progress";
import { revealedRows } from "../lib/results";
import { type DeckData, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { ProgressRing } from "../components/Ring";
import { DeckIcon } from "../components/icons";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// French labels for the three stages (parallel to STAGES in leveling.ts).
const STAGES_FR: [string, string][] = [
  ["Échauffement", "Des débuts légers et simples"],
  ["Cœur", "L’essentiel du quotidien"],
  ["Profond et honnête", "Convictions et vérités plus difficiles"],
];

export default function DecksScreen({
  session,
  role,
  onPlay,
}: {
  session: Session;
  role: Role;
  onPlay: (slug: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const buckets: string[][] = [[], [], []];
  ORDER.forEach((slug) => buckets[stageOf(slug)].push(slug));

  const answered = (slug: string, deck: DeckData | undefined) =>
    DECKS[slug].questions.filter((q) => deck?.answers?.[q.id]?.[role] != null).length;

  // Completed decks wear their alignment score right in the list.
  const { rows, overallPct } = revealedRows(session.decks, role);
  const pctOf = (slug: string) => rows.find((r) => r.slug === slug)?.pct;
  const done = ORDER.filter((s) => catComplete(s, session.decks?.[s], role)).length;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("Conversations", "Les conversations")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        {t("Where to go next", "Où aller ensuite")}
      </h1>
      <p className="muted center" style={{ fontSize: 13, margin: "0 0 14px" }}>
        {t(`${done} of ${ORDER.length} complete`, `${done} sur ${ORDER.length} terminées`)}
        {overallPct != null &&
          t(` · ${overallPct}% agreed so far`, ` · ${overallPct}% d’accord jusqu’ici`)}
      </p>

      {buckets.map((bucket, i) =>
        bucket.length ? (
          <div key={i}>
            <div className="stagelabel">
              <span>{t(STAGES[i][0], STAGES_FR[i][0])}</span>
              <span className="muted">{t(STAGES[i][1], STAGES_FR[i][1])}</span>
            </div>
            {bucket.map((slug) => {
              const d = DECKS[slug];
              const deck = session.decks?.[slug];
              const total = d.questions.length;
              const mine = answered(slug, deck);
              const complete = catComplete(slug, deck, role);
              // The deck's depth word — "what this is like" (brief 2 §A7c).
              const word = t(...deckDepthWord(slug));
              const sub = complete
                ? t(`${word} · complete`, `${word} · terminé`)
                : mine > 0
                  ? t(
                      `${word} · ${mine} of ${total} answered`,
                      `${word} · ${mine} sur ${total} répondues`,
                    )
                  : t(`${word} · ${total} questions`, `${word} · ${total} questions`);
              const pct = complete ? pctOf(slug) : undefined;
              return (
                <div key={slug} className="row" onClick={() => onPlay(slug)}>
                  <div className="catico" style={{ background: `${d.color}1A`, color: d.color }}>
                    <DeckIcon icon={d.icon} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{deckName(slug, lang)}</div>
                    <div className="muted" style={{ fontSize: 12.5 }}>
                      {sub}
                    </div>
                  </div>
                  {pct != null ? (
                    <span className="pctpill">{pct}%</span>
                  ) : (
                    <ProgressRing done={mine} total={total} size={44} />
                  )}
                </div>
              );
            })}
          </div>
        ) : null,
      )}
    </section>
  );
}
