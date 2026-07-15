import { useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../firebase";
import { createSession, writeAnswer, writeGuess, recordConsent } from "../lib/session";
import { redeemInvite, createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import { DECKS } from "../lib/questions";
import { ONB_STAGES, type OnbStage } from "../lib/onboarding";
import type { Stage } from "../types";
import { Logo } from "../components/Logo";
import { TopBar } from "../components/TopBar";
import StartMenu from "./StartMenu";
import AuthScreen from "./AuthScreen";
import { useT } from "../lib/i18n";

// The first live question (§A5): a depth-1 Fun question, full mechanic, no
// instructions. Resolved from the bank so a reword follows it.
const A5_ID = "FUN-002";
const A5_SLUG = "fun-icebreakers";
const a5 = DECKS[A5_SLUG].questions.find((q) => q.id === A5_ID);

type FlowAStep = "welcome" | "names" | "stage" | "consent" | "first" | "wall" | "menu";
type FlowBStep = "arrive" | "name" | "consent" | "ready";

// Onboarding is recruitment, not setup (brief 2 Part B §0). Flow A: the person
// who arrives first, four screens then a real question, invite AFTER they've felt
// it. Flow B: the person they bring, three screens then a reveal in sixty seconds.
// No account to start — an anonymous session reaches a reveal; a real account
// layers on additively later (§5).
export default function Onboarding({
  inviteToken,
  onEnter,
}: {
  inviteToken: string | null;
  onEnter: (code: string, startSlug?: string) => void;
}) {
  const t = useT();
  const joining = !!inviteToken;

  // shared state
  const [myName, setMyName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [stage, setStage] = useState<OnbStage | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");
  const [bankedCount, setBankedCount] = useState(0);
  const [initiatorName, setInitiatorName] = useState("");

  const [stepA, setStepA] = useState<FlowAStep>("welcome");
  const [stepB, setStepB] = useState<FlowBStep>("arrive");
  // Safety net (deploy-safe): if anonymous auth is unavailable — e.g. not yet
  // enabled in the Firebase console — we fall back to the real account screen
  // rather than stranding the user mid-flow. The "no account" path lights up
  // automatically once anonymous auth is on.
  const [fallback, setFallback] = useState(false);

  const partner = partnerName.trim() || t("your partner", "votre partenaire");

  // Sign in anonymously; on failure, degrade to the account flow instead of a
  // dead end. Only the sign-in step triggers the fallback — later errors are
  // shown inline.
  const ensureUser = async () => {
    try {
      // Race against a timeout so a hung sign-in (not just a rejection —
      // e.g. anonymous auth disabled, or an unreachable endpoint) still
      // degrades to the account flow rather than spinning forever.
      const cred = await Promise.race([
        signInAnonymously(auth),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000)),
      ]);
      return cred.user;
    } catch {
      setFallback(true);
      return null;
    }
  };

  // ---- Flow A: create the session after consent ---------------------------
  const startFlowA = async () => {
    if (!agreed || busy) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) {
      setBusy(false);
      return;
    }
    try {
      await recordConsent(user.uid, myName.trim());
      const c = await createSession(user.uid, myName.trim(), (stage ?? undefined) as Stage);
      setCode(c);
      setStepA("first");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  // ---- Flow B: join after consent, then read the banked count -------------
  const startFlowB = async () => {
    if (!agreed || busy || !inviteToken) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) {
      setBusy(false);
      return;
    }
    try {
      await recordConsent(user.uid, myName.trim());
      const res = await redeemInvite({ token: inviteToken });
      const c = res.data.code;
      setCode(c);
      // Honest count for the joiner (§B1): how many the initiator has banked.
      try {
        const snap = await get(ref(db, `sessions/${c}`));
        const val = snap.val() ?? {};
        setInitiatorName(val?.members?.host?.name ?? "");
        const decks = (val.decks ?? {}) as Record<string, { answers?: Record<string, { host?: unknown }> }>;
        let n = 0;
        for (const slug in decks)
          for (const qid in decks[slug].answers ?? {})
            if (decks[slug].answers![qid].host != null) n++;
        setBankedCount(n);
      } catch {
        /* count is a nicety, not a gate */
      }
      setStepB("ready");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  const shell = (children: React.ReactNode, onExit?: () => void) => (
    <section className="screen-enter">
      {onExit ? <TopBar onExit={onExit} /> : <div className="brandhead brand-enter"><Logo size={40} /></div>}
      {children}
      {err && <div className="err">{err}</div>}
    </section>
  );

  // Anonymous auth unavailable → the real account screen, so no one is stranded.
  if (fallback) {
    return (
      <section className="screen-enter">
        <div className="brandhead brand-enter">
          <Logo size={40} />
        </div>
        <p className="sub center" style={{ margin: "14px 24px 0" }}>
          {t(
            "Let's set up a quick account to save your answers.",
            "Créons un compte rapide pour enregistrer vos réponses.",
          )}
        </p>
        <AuthScreen />
      </section>
    );
  }

  // =========================================================================
  // FLOW B — the joiner (3 screens: arrive, name, consent) → reveal
  // =========================================================================
  if (joining) {
    if (stepB === "arrive") {
      return shell(
        <>
          <div className="eyebrow center" style={{ marginTop: 30 }}>
            {t("You've been invited", "Vous êtes invité·e")}
          </div>
          <h1 className="h1 center" style={{ margin: "10px 24px 6px" }}>
            {t("Your partner has started.", "Votre partenaire a commencé.")}
          </h1>
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "10px 24px 26px" }}>
            {t(
              "They've answered some questions and they're waiting for you. Catching up is the easy part.",
              "Ils ont déjà répondu à quelques questions et vous attendent. Rattraper est la partie facile.",
            )}
          </p>
          <button className="btn pill" type="button" onClick={() => setStepB("name")}>
            {t("Catch up →", "Rattraper →")}
          </button>
        </>,
      );
    }
    if (stepB === "name") {
      return shell(
        <>
          <h1 className="h1 center" style={{ marginTop: 24 }}>
            {t("What should we call you?", "Comment doit-on vous appeler ?")}
          </h1>
          <label htmlFor="nm">{t("Your name", "Votre nom")}</label>
          <input
            className="input"
            id="nm"
            maxLength={20}
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
            placeholder={t("e.g. Sarah", "p. ex. Sarah")}
          />
          <button
            className="btn pill"
            type="button"
            disabled={!myName.trim()}
            onClick={() => setStepB("consent")}
          >
            {t("Continue →", "Continuer →")}
          </button>
        </>,
        () => setStepB("arrive"),
      );
    }
    if (stepB === "ready") {
      const who = initiatorName || t("Your partner", "Votre partenaire");
      return shell(
        <>
          <div className="bwrap">
            <span className="bring" />
            <Logo size={42} word={false} />
          </div>
          <h1 className="h1 center" style={{ marginTop: 8 }}>
            {bankedCount > 0
              ? t(
                  `${who} has answered ${bankedCount}.`,
                  `${who} a répondu à ${bankedCount}.`,
                )
              : t(`${who} is ready.`, `${who} est prêt·e.`)}
          </h1>
          <p className="sub center" style={{ margin: "10px 24px 24px" }}>
            {t(
              "Answer the same ones and they reveal the moment you finish.",
              "Répondez aux mêmes et tout se révèle dès que vous avez terminé.",
            )}
          </p>
          <button className="btn pill" type="button" onClick={() => onEnter(code)}>
            {t("Start answering →", "Commencer à répondre →")}
          </button>
        </>,
      );
    }
    // consent (identical to A4; one person cannot consent for two)
    return shell(
      <ConsentBody
        partner={partner}
        agreed={agreed}
        setAgreed={setAgreed}
        busy={busy}
        onStart={startFlowB}
        t={t}
      />,
      () => setStepB("name"),
    );
  }

  // =========================================================================
  // FLOW A — the initiator (4 screens → a live question → invite → A7)
  // =========================================================================
  if (stepA === "welcome") {
    return shell(
      <>
        <div className="obwelcome">
          <p className="verse serif center" style={{ marginTop: 24 }}>
            {t(
              "“Can two walk together, unless they are agreed?”",
              "« Deux hommes marchent-ils ensemble, sans s’être concertés ? »",
            )}
            <span className="verse-ref">Amos 3:3</span>
          </p>
          <p className="sub center" style={{ margin: "0 24px 28px" }}>
            {t(
              "You'll both answer the same questions, on your own. Then you'll see where you landed — and talk about it.",
              "Vous répondrez tous les deux aux mêmes questions, chacun de votre côté. Puis vous verrez où vous en êtes — et vous en parlerez.",
            )}
          </p>
        </div>
        <button className="btn pill" type="button" onClick={() => setStepA("names")}>
          {t("Start", "Commencer")}
        </button>
      </>,
    );
  }

  if (stepA === "names") {
    return shell(
      <>
        <h1 className="h1 center" style={{ marginTop: 22 }}>
          {t("What should we call you?", "Comment doit-on vous appeler ?")}
        </h1>
        <label htmlFor="me">{t("Your name", "Votre nom")}</label>
        <input
          className="input"
          id="me"
          maxLength={20}
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
          placeholder={t("e.g. Sarah", "p. ex. Sarah")}
        />
        <label htmlFor="them">{t("And who are you doing this with?", "Et avec qui faites-vous ceci ?")}</label>
        <input
          className="input"
          id="them"
          maxLength={20}
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder={t("e.g. Judah", "p. ex. Judah")}
        />
        <button
          className="btn pill"
          type="button"
          disabled={!myName.trim() || !partnerName.trim()}
          onClick={() => setStepA("stage")}
        >
          {t("Continue →", "Continuer →")}
        </button>
      </>,
      () => setStepA("welcome"),
    );
  }

  if (stepA === "stage") {
    return shell(
      <>
        <h1 className="h1 center" style={{ marginTop: 24 }}>
          {t("Where are you two right now?", "Où en êtes-vous tous les deux ?")}
        </h1>
        <div className="stagegrid" style={{ marginTop: 20, gridTemplateColumns: "1fr" }}>
          {ONB_STAGES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`stagechip ${stage === s.key ? "on" : ""}`}
              onClick={() => setStage(s.key)}
              aria-pressed={stage === s.key}
            >
              {t(s.en, s.fr)}
            </button>
          ))}
        </div>
        <button
          className="btn pill"
          type="button"
          disabled={!stage}
          onClick={() => setStepA("consent")}
        >
          {t("Continue →", "Continuer →")}
        </button>
      </>,
      () => setStepA("names"),
    );
  }

  if (stepA === "consent") {
    return shell(
      <ConsentBody
        partner={partner}
        agreed={agreed}
        setAgreed={setAgreed}
        busy={busy}
        onStart={startFlowA}
        t={t}
      />,
      () => setStepA("stage"),
    );
  }

  if (stepA === "first" && a5) {
    return (
      <FirstQuestion
        code={code}
        partner={partner}
        onDone={() => setStepA("wall")}
      />
    );
  }

  if (stepA === "wall") {
    return (
      <Wall
        code={code}
        partner={partner}
        onContinue={() => setStepA("menu")}
        t={t}
      />
    );
  }

  // A7 — after the invite, so it costs nothing against the screen budget.
  return (
    <StartMenu
      stage={stage ?? "dating"}
      onPick={(slug) => onEnter(code, slug)}
      onSeeAll={() => onEnter(code)}
    />
  );
}

// ---- Consent (A4 / B3) — the one screen that cannot be cut ----------------
function ConsentBody({
  partner,
  agreed,
  setAgreed,
  busy,
  onStart,
  t,
}: {
  partner: string;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  busy: boolean;
  onStart: () => void;
  t: (en: string, fr: string) => string;
}) {
  return (
    <>
      <h1 className="h1 center" style={{ marginTop: 22 }}>
        {t("Before we start.", "Avant de commencer.")}
      </h1>
      <div className="consentcard">
        <p>
          {t(
            "This asks about your faith, your money, your past, and your sex life. That's the point — those are the conversations that matter, and most couples never quite have them.",
            "Ceci vous interroge sur votre foi, votre argent, votre passé et votre vie intime. C'est le but — ce sont les conversations qui comptent, et que la plupart des couples n'ont jamais vraiment.",
          )}
        </p>
        <p>
          {t(
            "It also means we're storing some genuinely private things about you. We need you to say yes to that, plainly.",
            "Cela veut dire aussi que nous conservons des choses vraiment privées sur vous. Nous avons besoin que vous l'acceptiez, clairement.",
          )}
        </p>
        <p>
          {t(
            `Your answers are visible to ${partner} and to no one else. You can export or delete everything, whenever you want.`,
            `Vos réponses sont visibles par ${partner} et personne d'autre. Vous pouvez tout exporter ou supprimer, quand vous voulez.`,
          )}
        </p>
        <p className="consent-not">
          {t(
            "This won't tell you whether to get married. It'll tell you what you haven't talked about.",
            "Ceci ne vous dira pas s'il faut vous marier. Cela vous dira ce dont vous n'avez pas parlé.",
          )}
        </p>
      </div>
      <label className="consent">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>
          {t(
            "I understand, and I agree to TwoAgree storing this.",
            "Je comprends et j'accepte que TwoAgree conserve ces données.",
          )}
        </span>
      </label>
      <button
        className={busy ? "btn pill busy" : "btn pill"}
        type="button"
        disabled={!agreed || busy}
        onClick={onStart}
      >
        {busy ? t("One moment…", "Un instant…") : t("Start →", "Commencer →")}
      </button>
    </>
  );
}

// ---- A5: the first live question (answer, then guess) ---------------------
function FirstQuestion({
  code,
  partner,
  onDone,
}: {
  code: string;
  partner: string;
  onDone: () => void;
}) {
  const t = useT();
  const [phase, setPhase] = useState<"answer" | "guess">("answer");
  const [ans, setAns] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  if (!a5) return null;

  const submitAnswer = async () => {
    if (ans == null || busy) return;
    setBusy(true);
    await writeAnswer(code, A5_SLUG, A5_ID, "host", ans);
    setBusy(false);
    setPhase("guess");
  };
  const submitGuess = async () => {
    if (guess == null || busy) return;
    setBusy(true);
    await writeGuess(code, A5_SLUG, A5_ID, "host", guess);
    setBusy(false);
    onDone();
  };

  return (
    <section>
      <div className="brandhead brand-enter">
        <Logo size={30} word={false} />
      </div>
      <div className="qcard glide-in" style={{ marginTop: 18 }}>
        <div className="qrow">
          <div className="eyebrow">{t("FUN", "DÉTENTE")}</div>
          {phase === "guess" && <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>}
        </div>
        <div className="qtext">
          {phase === "answer" ? (
            a5.q
          ) : (
            <>
              {t("What would ", "Que répondrait ")}
              <span style={{ color: "var(--amber)" }}>{partner}</span>
              {t(" say?", " ?")}
            </>
          )}
        </div>
        <div style={{ marginTop: 4 }}>
          {a5.opts?.map((o, i) => {
            const sel = (phase === "answer" ? ans : guess) === i;
            return (
              <div
                key={i}
                className={`opt ${phase === "guess" ? "guess" : ""} ${sel ? "sel" : ""}`}
                onClick={() => (phase === "answer" ? setAns(i) : setGuess(i))}
              >
                {o}
                <span className="dot" />
              </div>
            );
          })}
        </div>
      </div>
      {phase === "answer" ? (
        <button className="btn" type="button" disabled={ans == null || busy} onClick={submitAnswer}>
          {t("Next →", "Suivant →")}
        </button>
      ) : (
        <button className="btn honey" type="button" disabled={guess == null || busy} onClick={submitGuess}>
          {t("Lock it in →", "Je valide →")}
        </button>
      )}
    </section>
  );
}

// ---- A6: the wall, then the invite (the thing they now want) --------------
function Wall({
  code,
  partner,
  onContinue,
  t,
}: {
  code: string;
  partner: string;
  onContinue: () => void;
  t: (en: string, fr: string) => string;
}) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const share = async (link: string) => {
    const txt = t(`Join me on TwoAgree — ${link}`, `Rejoignez-moi sur TwoAgree — ${link}`);
    if (navigator.share) await navigator.share({ text: txt }).catch(() => {});
    else if (navigator.clipboard) await navigator.clipboard.writeText(link);
  };
  const invite = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await createInvite({ code });
      await share(`${window.location.origin}/?t=${res.data.token}`);
      setMsg(t("Invite ready — sent or copied.", "Invitation prête — envoyée ou copiée."));
    } catch {
      // fall back to sharing the bare code
      await share(code);
      setMsg(t(`Share your code: ${code}`, `Partagez votre code : ${code}`));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="screen-enter">
      <div className="bwrap">
        <span className="bring" />
        <span className="bring b2" />
        <Logo size={42} word={false} />
      </div>
      <h1 className="h1 center" style={{ fontSize: 24, marginTop: 8 }}>
        {t(`That's locked until ${partner} answers.`, `C'est verrouillé jusqu'à ce que ${partner} réponde.`)}
      </h1>
      <p className="sub center" style={{ margin: "10px 24px 22px" }}>
        {t(
          "You can keep going — your answers are saved and waiting. But nothing unlocks until you're both in.",
          "Vous pouvez continuer — vos réponses sont enregistrées et en attente. Mais rien ne se révèle tant que vous n'êtes pas tous les deux là.",
        )}
      </p>
      <button className={busy ? "btn pill busy" : "btn pill"} type="button" disabled={busy} onClick={invite}>
        {busy ? t("One moment…", "Un instant…") : t(`Bring ${partner} in →`, `Faites venir ${partner} →`)}
      </button>
      {msg && <div className="ok" style={{ textAlign: "center" }}>{msg}</div>}
      <button className="btn ghost" type="button" onClick={onContinue}>
        {t("I'll do that later", "Je le ferai plus tard")}
      </button>
    </section>
  );
}
