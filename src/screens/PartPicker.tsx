import { nLevels, lvlQs, partDepthWord } from "../lib/leveling";
import { levelDone, levelComplete, curLevel } from "../lib/progress";
import { other, type DeckData, type Role } from "../lib/scoring";
import { deckName } from "../lib/questions.fr";
import { TopBar } from "../components/TopBar";
import { useT, useLang } from "../lib/i18n";

// The Part picker (brief 2 §A7d). Couples may open any Part — never gated
// sequentially. But reveals need BOTH partners to finish the SAME Part, so the
// picker shows per-Part state for both roles: choosing ahead is a visible
// decision to wait, not a silent dead end.
export default function PartPicker({
  slug,
  deck,
  role,
  partnerName,
  onSelect,
  onExit,
}: {
  slug: string;
  deck: DeckData | undefined;
  role: Role;
  partnerName: string;
  onSelect: (lvl: number) => void;
  onExit: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const n = nLevels(slug);
  const here = curLevel(slug, deck, role);

  return (
    <section>
      <TopBar onExit={onExit} />
      <div className="eyebrow center" style={{ marginTop: 10 }}>
        {deckName(slug, lang).toUpperCase()}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        {t("Choose a part", "Choisissez une partie")}
      </h1>
      <p className="muted center" style={{ fontSize: 13, margin: "0 24px 16px" }}>
        {t(
          "Start anywhere. A part reveals once you’ve both finished it.",
          "Commencez où vous voulez. Une partie se révèle quand vous l’avez tous deux terminée.",
        )}
      </p>

      <div className="partlist">
        {Array.from({ length: n }, (_, i) => {
          const youDone = levelDone(deck, i, role);
          const themDone = levelDone(deck, i, other(role));
          const both = levelComplete(deck, i, role);
          const total = lvlQs(slug, i).length;
          const word = t(...partDepthWord(slug, i));
          const state = both
            ? t("Revealed", "Révélé")
            : youDone
              ? t(`Waiting for ${partnerName}`, `En attente de ${partnerName}`)
              : themDone
                ? t(`${partnerName} is ready`, `${partnerName} est prêt·e`)
                : t(`${total} questions`, `${total} questions`);
          return (
            <button
              key={i}
              type="button"
              className={`partrow${i === here ? " here" : ""}${both ? " done" : ""}`}
              onClick={() => onSelect(i)}
            >
              <span className="partrow-main">
                <span className="partrow-t">
                  {t(`Part ${i + 1}`, `Partie ${i + 1}`)}
                  <span className="partrow-depth">{word}</span>
                </span>
                <span className="partrow-sub">{state}</span>
              </span>
              {/* Both partners' per-part state — the anti-dead-end (§A7d). */}
              <span className="partrow-track">
                <span className={`ptick ${youDone ? "on" : ""}`}>
                  {t("you", "vous")} {youDone ? "✓" : "–"}
                </span>
                <span className={`ptick ${themDone ? "on" : ""}`}>
                  {partnerName} {themDone ? "✓" : "–"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
