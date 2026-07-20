import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { get, ref } from "firebase/database";
import { db } from "../firebase";
import type { Role } from "../lib/scoring";
import type { Session } from "../types";
import {
  pathReady,
  orderedSteps,
  currentIndex,
  lampLit,
  stepMeta,
} from "../lib/path";
import { INTAKE, PATH_STEPS, VERSES, type IntakeQuestion } from "../data/path.generated";
import { writeIntake } from "../lib/session";
import { generatePath } from "../lib/functions";
import { Mark } from "../brand/Mark";
import { Wordmark } from "../brand/Wordmark";
import { PathGlyph } from "../components/PathGlyph";
import { useT } from "../lib/i18n";
import PathStep from "./PathStep";

type T = (en: string, fr: string) => string;

// The Path tab. Routes: private intake → waiting for the path to lay → the trail
// map → a step → The Lookout. Generation runs server-side (generatePath); this
// screen only triggers it and reads the result live via the session listener.
export default function PathScreen({
  code,
  session,
  user,
  partnerName,
  onBrowseDecks,
  onOpenStep,
}: {
  code: string;
  session: Session;
  user: User;
  partnerName: string;
  onBrowseDecks: () => void;
  // Opening a step hands off to a full-screen flow in SessionApp (no bottom nav),
  // the same way deck play/reveal do.
  onOpenStep: (index: number) => void;
}) {
  const t = useT();
  const [intakeDone, setIntakeDone] = useState<boolean | null>(null);
  const ready = pathReady(session);

  // My own intake is author-only (rules) so I read it directly, not via the
  // session. I never read my partner's — the path's mere existence tells me
  // they're done, nothing about what they answered.
  useEffect(() => {
    let live = true;
    get(ref(db, `intake/${user.uid}`))
      .then((snap) => live && setIntakeDone(!!snap.val()))
      .catch(() => live && setIntakeDone(false));
    return () => {
      live = false;
    };
  }, [user.uid]);

  // Once my intake is in but the path isn't laid, nudge the generator. It's
  // generate-once and reads both intakes server-side, so calling it whenever
  // either partner lands here is safe — whoever finishes second lays the path.
  useEffect(() => {
    if (intakeDone && !ready) void generatePath({ code }).catch(() => {});
  }, [intakeDone, ready, code]);

  if (intakeDone === null) {
    return (
      <section className="screen-enter">
        <div className="spin" />
      </section>
    );
  }

  if (!intakeDone) {
    return (
      <PathIntake
        uid={user.uid}
        code={code}
        partnerName={partnerName}
        onBrowseDecks={onBrowseDecks}
        onDone={() => setIntakeDone(true)}
        t={t}
      />
    );
  }

  if (!ready) {
    return <PathWaiting partnerName={partnerName} onBrowseDecks={onBrowseDecks} t={t} />;
  }

  return <PathMap session={session} onOpen={onOpenStep} t={t} />;
}

// The full-screen step flow, rendered by SessionApp (no bottom nav). Resolves a
// waypoint index to its step, or The Lookout finale when the index has no data.
export function PathFlow({
  code,
  role,
  session,
  index,
  myName,
  partnerName,
  onExit,
}: {
  code: string;
  role: Role;
  session: Session;
  index: number;
  myName: string;
  partnerName: string;
  onExit: () => void;
}) {
  const t = useT();
  const found = orderedSteps(session).find((s) => s.index === index);
  if (found) {
    return (
      <PathStep
        code={code}
        role={role}
        session={session}
        index={found.index}
        step={found.data}
        myName={myName}
        partnerName={partnerName}
        onExit={onExit}
      />
    );
  }
  return <Lookout onBack={onExit} t={t} />;
}

// ---- The Path intro: claret hero → a journey that ends at the payoff -------
// Three waypoints on a lit trail: what it is, what makes it theirs, and — the
// destination — the alignment they walk away with. Collaborative by design
// (a shared alignment, never "you beat your partner"; brief §1 "no winner").
const NodeStart = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={19} fill="var(--honey)" opacity={0.14} />
    <circle cx={20} cy={20} r={14} fill="var(--honey)" stroke="var(--honey)" strokeWidth={2} />
    <path d="M20 12.5a4.6 4.6 0 0 0-2.4 8.5v2h4.8v-2A4.6 4.6 0 0 0 20 12.5Z" fill="none" stroke="var(--berry)" strokeWidth={1.6} />
    <path d="M17.9 25.4h4.2" stroke="var(--berry)" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);
const NodeStep = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={13.5} fill="#fff" stroke="var(--app-orb-line)" strokeWidth={2} />
    <circle cx={20} cy={20} r={3.4} fill="var(--app-orb-line)" />
  </svg>
);
const NodeEnd = () => (
  <svg viewBox="0 0 40 40" width={38} height={38} aria-hidden="true">
    <circle cx={20} cy={20} r={19} fill="var(--ta-honey)" opacity={0.18} />
    <circle cx={20} cy={20} r={14} fill="var(--berry)" stroke="var(--ta-honey)" strokeWidth={2} />
    <path d="M20 13v14" stroke="var(--ta-honey)" strokeWidth={1.7} strokeLinecap="round" />
    <path d="M20 13.5c2.6 0 3.2 1.8 5.4 1.8v4.2c-2.2 0-2.8-1.8-5.4-1.8Z" fill="var(--ta-honey)" />
  </svg>
);

export function PathIntro({
  onBegin,
  onBrowseDecks,
  t,
}: {
  onBegin: () => void;
  onBrowseDecks: () => void;
  t: T;
}) {
  const steps: { node: ReactNode; end?: boolean; h: string; s: string }[] = [
    {
      node: <NodeStart />,
      h: t("A journey together", "Un chemin à deux"),
      s: t(
        "Ten steps, side by side — from light ground to the deepest questions.",
        "Dix étapes, côte à côte — du terrain léger aux questions les plus profondes.",
      ),
    },
    {
      node: <NodeStep />,
      h: t("Shaped by the two of you", "Façonné par vous deux"),
      s: t(
        "Each step is drawn from what you both say matters — tailored to where you are now.",
        "Chaque étape naît de ce qui compte pour vous deux — adaptée à là où vous en êtes.",
      ),
    },
    {
      node: <NodeEnd />,
      end: true,
      h: t("Where the two of you land", "Où vous vous retrouvez"),
      s: t(
        "You arrive at your alignment — how much you agree, how well you know each other, and what's worth talking about.",
        "Vous arrivez à votre accord — à quel point vous vous rejoignez, vous vous connaissez, et ce qui mérite d'être discuté.",
      ),
    },
  ];

  return (
    // Airy layout, sized to the viewport so the "Begin" button is in view
    // without scrolling (min-height fills the tab area; the CTA sits at the
    // bottom via margin-top:auto).
    <section className="screen-enter path-intro">
      <div className="pi-head">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>

      <div className="pi-top">
        <h1 className="pi-title">{t("The Path", "Le Chemin")}</h1>
        <p className="pi-verse">
          {t("“Can two walk together, unless they are agreed?”", "« Deux marchent-ils ensemble sans s'être accordés ? »")}
        </p>
        <p className="pi-vref">Amos 3:3</p>
      </div>

      <ol className="pi-trail">
        {steps.map((st, i) => (
          <li key={i} className={`pi-step${st.end ? " pi-end" : ""}`}>
            <span className="pi-node">{st.node}</span>
            <span className="pi-txt">
              <b>{st.h}</b>
              <i>{st.s}</i>
            </span>
          </li>
        ))}
      </ol>

      <p className="pi-privacy">
        <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true">
          <rect x={5} y={10.5} width={14} height={9} rx={2} fill="none" stroke="currentColor" strokeWidth={1.7} />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
        </svg>
        {t(
          `You each answer on your own — neither of you sees the other's until you land.`,
          `Vous répondez chacun de votre côté — aucun ne voit les réponses de l'autre avant l'arrivée.`,
        )}
      </p>

      <div className="pi-cta">
        <button className="btn pill" type="button" onClick={onBegin}>
          {t("Begin — just me", "Commencer — juste moi")}
        </button>
        <button className="btn ghost" type="button" onClick={onBrowseDecks}>
          {t("Browse the decks instead", "Parcourir les jeux plutôt")}
        </button>
      </div>
    </section>
  );
}

// ---- Private intake (8 questions) ------------------------------------------
function PathIntake({
  uid,
  code,
  partnerName,
  onBrowseDecks,
  onDone,
  t,
}: {
  uid: string;
  code: string;
  partnerName: string;
  onBrowseDecks: () => void;
  onDone: () => void;
  t: T;
}) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<(number | number[] | null)[]>(
    INTAKE.map((q) => (q.type === "multi" ? [] : null)),
  );
  const [busy, setBusy] = useState(false);

  if (!started) {
    return <PathIntro onBegin={() => setStarted(true)} onBrowseDecks={onBrowseDecks} t={t} />;
  }

  const q: IntakeQuestion = INTAKE[idx];
  const a = ans[idx];
  const canNext = q.type === "multi" ? (a as number[]).length > 0 : a !== null;

  const pick = (oi: number) => {
    setAns((prev) => {
      const next = [...prev];
      if (q.type === "single") {
        next[idx] = oi;
      } else {
        let arr = [...((prev[idx] as number[]) ?? [])];
        const label = q.opts[oi];
        if (q.excl && label === q.excl) {
          arr = arr.includes(oi) ? [] : [oi];
        } else {
          arr = arr.filter((x) => q.opts[x] !== q.excl);
          if (arr.includes(oi)) arr = arr.filter((x) => x !== oi);
          else if (!(q.cap && arr.length >= q.cap)) arr.push(oi);
        }
        next[idx] = arr;
      }
      return next;
    });
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    const answers: Record<string, number | number[]> = {};
    INTAKE.forEach((iq, i) => {
      const v = ans[i];
      if (v != null) answers[iq.id] = v;
    });
    await writeIntake(uid, answers);
    // Kick generation now that my part is in (it waits for both intakes).
    void generatePath({ code }).catch(() => {});
    setBusy(false);
    onDone();
  };

  return (
    <section className="screen-enter">
      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <span className="badge" style={{ background: "var(--blush)", color: "var(--berry)", fontWeight: 700 }}>
          🔒 {t(`Just you — ${partnerName} won't see this`, `Rien que vous — ${partnerName} ne verra pas ceci`)}
        </span>
      </div>
      <div className="qprog" style={{ marginTop: 14 }}>
        <i style={{ width: `${Math.round((idx / INTAKE.length) * 100)}%` }} />
      </div>
      <p className="hint">{t(`${idx + 1} of ${INTAKE.length}`, `${idx + 1} sur ${INTAKE.length}`)}</p>
      <h1 className="h1" style={{ marginTop: 14, fontSize: 24 }}>{q.q}</h1>
      {q.hint && <p className="sub" style={{ marginTop: 6 }}>{q.hint}</p>}
      <div style={{ marginTop: 16 }}>
        {q.opts.map((o, oi) => {
          const sel = q.type === "multi" ? (a as number[]).includes(oi) : a === oi;
          return (
            <div key={oi} className={`opt ${sel ? "sel" : ""}`} onClick={() => pick(oi)}>
              {o}
              <span className="dot" />
            </div>
          );
        })}
      </div>
      <button
        className={busy ? "btn busy" : "btn"}
        type="button"
        disabled={!canNext || busy}
        onClick={() => (idx === INTAKE.length - 1 ? finish() : setIdx((i) => i + 1))}
      >
        {idx === INTAKE.length - 1 ? t("Finish my part", "Terminer ma part") : t("Next →", "Suivant →")}
      </button>
      {idx > 0 && (
        <button className="btn ghost" type="button" onClick={() => setIdx((i) => i - 1)}>
          {t("Back", "Retour")}
        </button>
      )}
    </section>
  );
}

// ---- Waiting for the partner's intake --------------------------------------
function PathWaiting({
  partnerName,
  onBrowseDecks,
  t,
}: {
  partnerName: string;
  onBrowseDecks: () => void;
  t: T;
}) {
  return (
    <section className="screen-enter">
      <div className="brandhead brand-enter">
        <Wordmark size={24} />
      </div>
      <div className="center" style={{ minHeight: "60dvh" }}>
        <h1 className="h1 center">{t("Your part is done.", "Votre part est terminée.")}</h1>
        <p className="sub center" style={{ margin: "12px 24px 0", maxWidth: 340 }}>
          {t(
            `The path is drawn from both of you, so it lays out the moment ${partnerName} finishes their own questions. Your answers stay yours alone.`,
            `Le chemin se trace à partir de vous deux : il apparaît dès que ${partnerName} termine ses propres questions. Vos réponses restent les vôtres.`,
          )}
        </p>
        <button className="btn ghost" type="button" onClick={onBrowseDecks} style={{ marginTop: 24 }}>
          {t("Browse the decks meanwhile", "Parcourir les jeux en attendant")}
        </button>
      </div>
    </section>
  );
}

// ---- The trail map ---------------------------------------------------------
export function PathMap({
  session,
  onOpen,
  t,
}: {
  session: Session;
  onOpen: (index: number) => void;
  t: T;
}) {
  const [toast, setToast] = useState("");
  const cur = currentIndex(session);
  const completed = useMemo(
    () => orderedSteps(session).filter((s) => lampLit(session, s.index)).length,
    [session],
  );
  const nodeCount = PATH_STEPS.length; // 10 (nine steps + The Lookout)

  const W = 390;
  const dy = 128;
  const y0 = 92;
  const H = y0 + dy * (nodeCount - 1) + 120;
  const px = (i: number) => (i % 2 === 0 ? 118 : 272);
  const py = (i: number) => y0 + dy * i;

  const tap = (i: number) => {
    if (i === cur) return onOpen(i);
    if (i < cur) return onOpen(i); // a lit step reopens to its reveal
    setToast(t("The path opens one step at a time.", "Le chemin s'ouvre une étape à la fois."));
    setTimeout(() => setToast(""), 2400);
  };

  const fullPath = () => {
    let d = `M ${px(0)} ${py(0)}`;
    for (let i = 1; i < nodeCount; i++) {
      const my = (py(i - 1) + py(i)) / 2;
      d += ` C ${px(i - 1)} ${my}, ${px(i)} ${my}, ${px(i)} ${py(i)}`;
    }
    return d;
  };
  const walkedPath = () => {
    if (cur < 1) return "";
    let d = `M ${px(0)} ${py(0)}`;
    for (let i = 1; i <= cur; i++) {
      const my = (py(i - 1) + py(i)) / 2;
      d += ` C ${px(i - 1)} ${my}, ${px(i)} ${my}, ${px(i)} ${py(i)}`;
    }
    return d;
  };

  return (
    <section className="screen-enter">
      <p className="eyebrow" style={{ marginTop: 4 }}>{t("The Path", "Le Chemin")}</p>
      <h1 className="h1" style={{ fontSize: 28, marginTop: 6 }}>
        {cur >= nodeCount - 1
          ? t("The Lookout", "Le Belvédère")
          : t(`Step ${cur + 1} of 10`, `Étape ${cur + 1} sur 10`)}
      </h1>
      <p className="sub" style={{ marginTop: 6 }}>
        {completed === 0
          ? t("The trail starts here.", "Le sentier commence ici.")
          : completed === 1
            ? t("1 lamp lit along the way.", "1 lampe allumée en chemin.")
            : t(`${completed} lamps lit along the way.`, `${completed} lampes allumées en chemin.`)}
      </p>

      <div style={{ marginTop: 8 }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} role="group" aria-label={t("Trail map", "Carte du sentier")}>
          <path d={fullPath()} strokeWidth={3} strokeDasharray="1 10" strokeLinecap="round" style={{ fill: "none", stroke: "var(--app-card-line)" }} />
          {cur > 0 && (
            <path d={walkedPath()} strokeWidth={3} strokeLinecap="round" style={{ fill: "none", stroke: "var(--berry)" }} />
          )}
          {PATH_STEPS.map((meta, i) => {
            const x = px(i);
            const y = py(i);
            const done = lampLit(session, i) || (i < cur && i < nodeCount - 1);
            const isCur = i === cur;
            const r = isCur ? 30 : 26;
            const fill = done || isCur ? "var(--berry)" : "#fff";
            const stroke = done || isCur ? "var(--berry)" : "var(--app-card-line)";
            const gcol = done ? "var(--honey)" : isCur ? "#fff" : "var(--sub)";
            const lx = i % 2 === 0 ? x + 46 : x - 46;
            const anchor = i % 2 === 0 ? "start" : "end";
            return (
              <g key={meta.key} onClick={() => tap(i)} style={{ cursor: "pointer" }} role="button" aria-label={meta.name}>
                {done && (
                  <circle cx={x} cy={y} r={r + 15} opacity={0.16} className="path-halo" style={{ fill: "var(--honey)" }} />
                )}
                <circle cx={x} cy={y} r={r} strokeWidth={2.2} style={{ fill, stroke }} />
                <g transform={`translate(${x - 14},${y - 14})`}>
                  <PathGlyph id={meta.glyph} size={28} color={gcol} />
                </g>
                <text x={lx} y={y - 2} textAnchor={anchor} fontSize={14.5} fontWeight={700} style={{ fill: done || isCur ? "var(--ink)" : "var(--sub)" }}>
                  {meta.name}
                </text>
                <text x={lx} y={y + 15} textAnchor={anchor} fontSize={11.5} style={{ fill: "var(--sub)" }}>
                  {meta.theme}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {toast && <div className="path-toast">{toast}</div>}
    </section>
  );
}

// ---- The Lookout — journey's end -------------------------------------------
function Lookout({ onBack, t }: { onBack: () => void; t: T }) {
  const meta = stepMeta("lookout");
  const verses = VERSES["lookout"] ?? [];
  return (
    <section className="path-claret screen-enter" style={{ justifyContent: "flex-start", paddingTop: 56 }}>
      <div style={{ color: "var(--honey)", marginBottom: 18 }}>
        <Mark height={40} title="TwoAgree" colour="var(--honey)" />
      </div>
      <h1 className="h1 center" style={{ color: "#fff", fontSize: 32 }}>{meta?.name ?? "The Lookout"}</h1>
      <p className="center" style={{ color: "rgba(255,255,255,.88)", maxWidth: 320, marginTop: 12, lineHeight: 1.55 }}>
        {meta?.frame ?? t("Turn around. The whole road behind you is lit.", "Retournez-vous. Toute la route derrière vous est éclairée.")}
      </p>
      <div style={{ marginTop: 18, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {verses.map((v, i) => (
          <div key={i} className="path-verse-card">
            <p className="verse serif" style={{ color: "#fff", fontStyle: "italic" }}>&ldquo;{v.v}&rdquo;</p>
            <p className="vref" style={{ color: "var(--honey)" }}>{v.ref}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, width: "100%", maxWidth: 340 }}>
        <button className="btn honey" type="button" onClick={onBack}>
          {t("Back to the path", "Retour au chemin")}
        </button>
      </div>
    </section>
  );
}
