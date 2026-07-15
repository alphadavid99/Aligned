import { useState } from "react";
import type { Question } from "../lib/questions";
import type { AnswerValue } from "../lib/scoring";
import type { FlagRow } from "../lib/flags";
import { groupFlagRows } from "../lib/flags";
import { localizeQuestion } from "../lib/questions.fr";
import { TopBar } from "../components/TopBar";
import { useT, useLang, type Lang } from "../lib/i18n";

type T = (en: string, fr: string) => string;

function optLabel(q: Question, v: AnswerValue | undefined): string {
  if (v == null) return "—";
  if (q.type === "scale") return `${v} / 5`;
  if (q.type === "open") return String(v);
  return q.opts?.[Number(v)] ?? String(v);
}

// --- copy layer (verbatim from brief §4c; only the fill-ins vary) ------------
function kickerOf(row: FlagRow, t: T, partnerName: string): string {
  if (row.flag === "blindSpot") {
    return row.mutual
      ? t("Neither of you knew", "Aucun de vous ne le savait")
      : t("One of you knew", "L’un de vous le savait");
  }
  const meHigher = (row.r.impMe ?? 0) > (row.r.impTh ?? 0);
  return meHigher
    ? t("Matters more to you", "Compte plus pour vous")
    : t(`Matters more to ${partnerName}`, `Compte plus pour ${partnerName}`);
}

function bodyOf(row: FlagRow, q: Question, t: T, partnerName: string): string {
  if (row.flag === "blindSpot") {
    if (row.mutual) {
      return t(
        "You answered differently, and you’d each have guessed otherwise.",
        "Vous avez répondu différemment, et vous auriez tous deux deviné autrement.",
      );
    }
    // One-sided: describe whichever guess was wrong.
    if (row.r.theyGuessed && !row.r.theyGuessRight) {
      return t(
        `${partnerName} expected you to say ${optLabel(q, row.r.theirGuess)}. You said ${optLabel(q, row.r.me)}.`,
        `${partnerName} pensait que vous diriez ${optLabel(q, row.r.theirGuess)}. Vous avez dit ${optLabel(q, row.r.me)}.`,
      );
    }
    return t(
      `You expected ${partnerName} to say ${optLabel(q, row.r.guess)}. ${partnerName} said ${optLabel(q, row.r.th)}.`,
      `Vous pensiez que ${partnerName} dirait ${optLabel(q, row.r.guess)}. ${partnerName} a dit ${optLabel(q, row.r.th)}.`,
    );
  }
  // unevenStakes
  const meHigher = (row.r.impMe ?? 0) > (row.r.impTh ?? 0);
  const higher = meHigher ? t("you", "vous") : partnerName;
  const lower = meHigher ? partnerName : t("you", "vous");
  const same = row.r.me != null && row.r.me === row.r.th;
  if (same) {
    return t(
      `You both said “${optLabel(q, row.r.me)}”. It matters far more to ${higher} than to ${lower}.`,
      `Vous avez tous deux dit « ${optLabel(q, row.r.me)} ». Cela compte bien plus pour ${higher} que pour ${lower}.`,
    );
  }
  return t(
    `It matters far more to ${higher} than to ${lower}.`,
    `Cela compte bien plus pour ${higher} que pour ${lower}.`,
  );
}

// The box that sits on the reveal summary. Solid berry against the pale verdict
// chips is the whole differentiation — it must not read as a result row. One
// fixed line whatever the count (brief §5a). Renders only when flags exist.
export function FlagBox({
  count,
  onOpen,
  t,
}: {
  count: number;
  onOpen: () => void;
  t: T;
}) {
  return (
    <button className="flagbox" type="button" onClick={onOpen}>
      <span className="flagbox-n">{count}</span>
      <span className="flagbox-tx">
        <b>{t("Before you walk on", "Avant d’aller plus loin")}</b>
        <i>
          {t(
            "worth a closer look together",
            "à regarder de plus près ensemble",
          )}
        </i>
      </span>
      <span className="flagbox-go" aria-hidden="true">
        →
      </span>
    </button>
  );
}

// Five-dot importance track — the dots ARE the data, read before the words.
function ImpTrack({ value, tone, name }: { value: number; tone: "s" | "j"; name: string }) {
  return (
    <div className="imptrack">
      <span className="imptrack-nm">{name}</span>
      <span className="imptrack-dots">
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} className={`impdot ${tone} ${i <= value ? "on" : ""}`} />
        ))}
      </span>
    </div>
  );
}

function IndexRow({
  row,
  lang,
  t,
  myName,
  partnerName,
}: {
  row: FlagRow;
  lang: Lang;
  t: T;
  myName: string;
  partnerName: string;
}) {
  const q = localizeQuestion(row.q, lang);
  return (
    <div className="flagrow">
      <div className="flagrow-k">{kickerOf(row, t, partnerName)}</div>
      <div className="flagrow-q">{q.q}</div>
      <div className="flagrow-b">{bodyOf(row, q, t, partnerName)}</div>
      {row.flag === "unevenStakes" && (
        <div className="imptracks">
          <ImpTrack value={row.r.impMe ?? 0} tone="s" name={myName} />
          <ImpTrack value={row.r.impTh ?? 0} tone="j" name={partnerName} />
        </div>
      )}
    </div>
  );
}

const initialOf = (n: string) => (n || "?").trim().charAt(0).toUpperCase() || "?";

// One flag per card in the walkthrough — reuses the reveal breakdown vocabulary.
function WalkCard({
  row,
  lang,
  t,
  myName,
  partnerName,
}: {
  row: FlagRow;
  lang: Lang;
  t: T;
  myName: string;
  partnerName: string;
}) {
  const q = localizeQuestion(row.q, lang);
  const r = row.r;
  return (
    <div className="walkcard">
      <div className="flagrow-k">{kickerOf(row, t, partnerName)}</div>
      <div className="walkcard-q">{q.q}</div>

      {row.flag === "blindSpot" ? (
        <div className="cmp2">
          <div className="cmp2-col">
            <span className="cmp2-who s">
              <span className="cmp2-av s">{initialOf(myName)}</span>
              {myName}
            </span>
            <div className="cmp2-said">{optLabel(q, r.me)}</div>
            {r.guessed && (
              <div className={`cmp2-guess ${r.guessRight ? "ok" : "no"}`}>
                {t(`guessed ${partnerName}:`, `pari sur ${partnerName} :`)}{" "}
                <b>{optLabel(q, r.guess)}</b>
              </div>
            )}
          </div>
          <div className="cmp2-col">
            <span className="cmp2-who j">
              <span className="cmp2-av j">{initialOf(partnerName)}</span>
              {partnerName}
            </span>
            <div className="cmp2-said">{optLabel(q, r.th)}</div>
            {r.theyGuessed && (
              <div className={`cmp2-guess ${r.theyGuessRight ? "ok" : "no"}`}>
                {t(`guessed ${myName}:`, `pari sur ${myName} :`)}{" "}
                <b>{optLabel(q, r.theirGuess)}</b>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="imptracks big">
          <ImpTrack value={r.impMe ?? 0} tone="s" name={myName} />
          <ImpTrack value={r.impTh ?? 0} tone="j" name={partnerName} />
        </div>
      )}

      <div className="walktalk">
        <div className="walktalk-h">{t("Talk about it", "À discuter")}</div>
        <p className="walktalk-b">{bodyOf(row, q, t, partnerName)}</p>
        {row.flag === "blindSpot" && (
          <p className="walktalk-p">
            {t(
              "Start with what you each expected the other to say — that’s usually the more interesting half.",
              "Commencez par ce que chacun pensait que l’autre dirait — c’est souvent la moitié la plus intéressante.",
            )}
          </p>
        )}
        {q.ref && <p className="walktalk-ref">{q.ref}</p>}
      </div>
    </div>
  );
}

// The index → walkthrough pair (brief §5b/§5c). The box that opens this lives on
// the reveal; this component owns everything from the grouped list inward.
export default function FlagsReview({
  rows,
  myName,
  partnerName,
  onClose,
}: {
  rows: FlagRow[];
  myName: string;
  partnerName: string;
  onClose: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [phase, setPhase] = useState<"index" | "walk">("index");
  const [idx, setIdx] = useState(0);
  const groups = groupFlagRows(rows);

  if (phase === "walk") {
    const row = rows[idx];
    const last = idx + 1 >= rows.length;
    return (
      <section>
        <TopBar onExit={onClose} />
        <div className="eyebrow center" style={{ marginTop: 10 }}>
          {t(`${idx + 1} OF ${rows.length}`, `${idx + 1} SUR ${rows.length}`)}
        </div>
        <div key={idx} className="pane-in">
          <WalkCard row={row} lang={lang} t={t} myName={myName} partnerName={partnerName} />
        </div>
        <button
          className="btn pill"
          type="button"
          onClick={() => (last ? onClose() : setIdx((i) => i + 1))}
        >
          {last ? t("Done", "Terminé") : t("Next →", "Suivant →")}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => (last ? onClose() : setIdx((i) => i + 1))}
        >
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  return (
    <section>
      <TopBar onExit={onClose} />
      <div className="eyebrow center" style={{ marginTop: 10 }}>
        {t("Before you walk on", "Avant d’aller plus loin")}
      </div>
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "8px 24px 18px" }}>
        {t(
          "Nothing here is a problem — it’s just where the talking is.",
          "Rien ici n’est un problème — c’est simplement là où la conversation compte.",
        )}
      </p>

      {groups.blindSpot.length > 0 && (
        <>
          <div className="flaggrp">
            {t("Didn’t know", "Ce qu’on ignorait")} · {groups.blindSpot.length}
          </div>
          {groups.blindSpot.map((row) => (
            <IndexRow key={`b-${row.q.id}`} row={row} lang={lang} t={t} myName={myName} partnerName={partnerName} />
          ))}
        </>
      )}

      {groups.unevenStakes.length > 0 && (
        <>
          <div className="flaggrp">
            {t("Matters more", "Compte davantage")} · {groups.unevenStakes.length}
          </div>
          {groups.unevenStakes.map((row) => (
            <IndexRow key={`u-${row.q.id}`} row={row} lang={lang} t={t} myName={myName} partnerName={partnerName} />
          ))}
        </>
      )}

      <button
        className="btn pill"
        type="button"
        onClick={() => {
          setIdx(0);
          setPhase("walk");
        }}
      >
        {t("Walk through them →", "Parcourez-les →")}
      </button>
    </section>
  );
}
