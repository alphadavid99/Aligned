import { revealedRows } from "../lib/results";
import type { Role } from "../lib/scoring";
import type { Session } from "../types";
import { ScorePair } from "../components/ScorePair";
import { deckName } from "../lib/questions.fr";
import { useT, useLang } from "../lib/i18n";

// Overall alignment across every mutually-revealed level — a deck counts as
// soon as the two of you have finished any level of it, not only when the
// whole deck is done. Partial decks show which levels are in.
export default function ResultsScreen({
  session,
  role,
  onOpen,
}: {
  session: Session;
  role: Role;
  onOpen?: (slug: string) => void;
}) {
  const t = useT();
  const lang = useLang();

  // Overall = weighted mean of all scoreable joint answers across revealed
  // levels; knownPct = guess accuracy over the same ground.
  const { rows, overallPct, knownPct } = revealedRows(session.decks, role);

  // Surface the signal, don't bury it: the lowest deck IS the product — the
  // topic most worth a conversation. Rank ascending so the eye lands on it
  // first, and call out the closest + the one worth talking about by name.
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const lowest = ranked[0];
  const closest = ranked[ranked.length - 1];
  const showSynth = ranked.length >= 2 && lowest.slug !== closest.slug;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 4px" }}>
        {t("Where you landed", "Où vous en êtes")}
      </h1>

      {overallPct == null ? (
        <p className="sub serif center" style={{ fontStyle: "italic", margin: "20px 24px" }}>
          {t(
            "Finish a part together and your shared agreement appears here — not to judge, but to open the conversation.",
            "Terminez une partie ensemble et votre accord commun apparaît ici — non pour juger, mais pour ouvrir la conversation.",
          )}
        </p>
      ) : (
        <>
          <ScorePair agreed={overallPct} known={knownPct} t={t} size={150} />
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "0 24px 20px" }}>
            {t(
              `Across ${rows.length} ${rows.length === 1 ? "conversation" : "conversations"} so far.`,
              `Sur ${rows.length} conversation${rows.length === 1 ? "" : "s"} jusqu’ici.`,
            )}
          </p>

          {showSynth && (
            <div className="synth">
              <div className="scall">
                <div>
                  <div className="lb">{t("Closest agreement", "Accord le plus fort")}</div>
                  <div className="nm">{deckName(closest.slug, lang)}</div>
                </div>
                <div className="pc">{closest.pct}%</div>
              </div>
              <div className="scall warm">
                <div>
                  <div className="lb">
                    {t("Most worth a conversation", "À aborder en priorité")}
                  </div>
                  <div className="nm">{deckName(lowest.slug, lang)}</div>
                </div>
                <div className="pc">{lowest.pct}%</div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 14 }}>
            {ranked.map(({ slug, pct, known, lvls, of }) => (
              <div
                key={slug}
                className={`resrow${showSynth && slug === lowest.slug ? " hot" : ""}`}
                onClick={() => onOpen?.(slug)}
                style={onOpen ? { cursor: "pointer" } : undefined}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, display: "block" }}>
                    {deckName(slug, lang)}
                  </span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {lvls === of
                      ? t("Complete", "Terminé")
                      : t(
                          `${lvls} of ${of} parts revealed`,
                          `${lvls} partie${lvls === 1 ? "" : "s"} sur ${of} révélée${lvls === 1 ? "" : "s"}`,
                        )}
                  </span>
                </span>
                <span className="resrow-scores">
                  <span className="rs">
                    <b>{pct}%</b>
                    <i>{t("agreed", "d’accord")}</i>
                  </span>
                  {known != null && (
                    <span className="rs kn">
                      <b>{known}%</b>
                      <i>{t("known", "connus")}</i>
                    </span>
                  )}
                </span>
                {onOpen && (
                  <span style={{ color: "var(--mut)", marginLeft: 10 }}>&#8250;</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
