import { revealedRows, overallAll, knownAll, isCore } from "../lib/results";
import { other, type Role } from "../lib/scoring";
import type { Session } from "../types";
import { CoreScore } from "./CoreScore";
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

  // The headline is the fixed Core, computed over the 70 and nothing else
  // (brief 2 §C6). It exists from question one — a finished Fun barely moves it,
  // and the denominator on screen keeps a big number honest.
  const coreAgreed = overallAll(session.decks, role, isCore);
  const coreKnown = knownAll(session.decks, role, isCore);
  const myName = session.members?.[role]?.name ?? t("You", "Vous");
  const partnerName =
    session.members?.[other(role)]?.name ?? t("your partner", "votre partenaire");

  // Per-conversation rows stay local (not Core) — the lowest deck is the topic
  // most worth a conversation, so rank ascending and name it.
  const { rows } = revealedRows(session.decks, role);
  const ranked = [...rows].sort((a, b) => a.pct - b.pct);
  const lowest = ranked[0];
  const closest = ranked[ranked.length - 1];
  const showSynth = ranked.length >= 2 && lowest.slug !== closest.slug;

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 24 }}>
        {t("The two of you", "Vous deux")}
      </div>
      <h1 className="h1 center" style={{ margin: "8px 0 12px" }}>
        {t("Where you landed", "Où vous en êtes")}
      </h1>

      <CoreScore
        agreed={coreAgreed}
        known={coreKnown}
        myName={myName}
        partnerName={partnerName}
        t={t}
      />

      {rows.length > 0 && (
        <>
          <div className="shead" style={{ marginTop: 24 }}>
            {t("By conversation", "Par conversation")}
          </div>

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
