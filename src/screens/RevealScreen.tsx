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
import { type Question } from "../lib/questions";
import { deckName, localizeQuestion } from "../lib/questions.fr";
import { PctRing } from "../components/Ring";
import { TopBar } from "../components/TopBar";
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

// Level reveal: the shared alignment score plus a per-question breakdown.
// Both partners see the same number (it only unlocks once both have finished).
export default function RevealScreen({
  slug,
  level,
  role,
  deck,
  onDone,
  partnerName,
  questions,
  review = false,
}: {
  slug: string;
  level: number;
  role: Role;
  deck: DeckData | undefined;
  onDone: () => void;
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

  return (
    <section>
      <TopBar onExit={onDone} />
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
      {hasScore ? (
        <div className="center" style={{ margin: "18px 0 6px" }}>
          <PctRing pct={pct} size={180} label={t("aligned", "alignés")} />
        </div>
      ) : (
        <h1 className="h1 center" style={{ margin: "16px 0 6px" }}>
          {t("What you each said", "Ce que chacun a dit")}
        </h1>
      )}
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "0 24px 6px" }}>
        {t(
          "Not a verdict — a place to start talking.",
          "Pas un verdict — un point de départ pour discuter.",
        )}
      </p>
      {know.pct != null && (
        <div className="knowcard">
          <div className="knowpct">{know.pct}%</div>
          <div>
            <div className="knowtitle">
              {t("How well you know each other", "À quel point vous vous connaissez")}
            </div>
            <div className="knowsub">
              {t(
                `You guessed right ${know.right} of ${know.made} times`,
                `Vous avez deviné juste ${know.right} fois sur ${know.made}`,
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
        {joint.map((q) => {
          const r = scoreQ(q, data, role);
          const lq = localizeQuestion(q, lang);
          return (
            <div key={q.id} className="verrow">
              <div className="verq">{lq.q}</div>
              <div className="veranswers">
                <span>
                  {t("You:", "Vous :")} <b>{optLabel(lq, r.me)}</b>
                </span>
                <span>
                  {t("Them:", "L’autre :")} <b>{optLabel(lq, r.th)}</b>
                </span>
              </div>
              <span
                className="verbadge"
                style={{ color: VERDICT_COLOR[r.verdict], borderColor: VERDICT_COLOR[r.verdict] }}
              >
                {t(r.verdict, VERDICT_FR[r.verdict])}
              </span>
              {(r.guessed || r.theyGuessed) && (
                <div className="guessrow">
                  {r.guessed && (
                    <span className={`gtag ${r.guessRight ? "gok" : "gno"}`}>
                      {r.guessRight ? "✓" : "✗"}{" "}
                      {t("You guessed they'd pick", "Ton pari pour l’autre")}:{" "}
                      <b>{optLabel(lq, r.guess)}</b>
                    </span>
                  )}
                  {r.theyGuessed && (
                    <span className={`gtag ${r.theyGuessRight ? "gok" : "gno"}`}>
                      {r.theyGuessRight ? "✓" : "✗"} {partnerName}{" "}
                      {t("guessed you'd pick", "avait parié sur toi")}:{" "}
                      <b>{optLabel(lq, r.theirGuess)}</b>
                    </span>
                  )}
                </div>
              )}
              {r.verdict === "Differed" && (
                <div className="verline">
                  {t("Worth a conversation.", "Un sujet à aborder ensemble.")}
                </div>
              )}
            </div>
          );
        })}
        {joint.length === 0 && (
          <div className="verrow">
            <div className="muted">
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
    </section>
  );
}
