import { useState } from "react";
import {
  signInAnonymously,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
} from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db, googleProvider } from "../firebase";
import {
  createSession,
  writeAnswer,
  writeGuess,
  markLevelDone,
  recordConsent,
  writeProfile,
  writeMeetAt,
} from "../lib/session";
import { redeemInvite, createInvite } from "../lib/functions";
import { prettyError } from "../lib/errors";
import { fileToAvatarDataUrl } from "../lib/device/photo";
import { DECKS, type Question } from "../lib/questions";
import { ONB_STAGES, STARTER_QIDS, type OnbStage } from "../lib/onboarding";
import type { Stage } from "../types";
import { Mark } from "../brand/Mark";
import { Wordmark } from "../brand/Wordmark";
import { TopBar } from "../components/TopBar";
import StartMenu from "./StartMenu";
import AuthScreen from "./AuthScreen";
import { useT } from "../lib/i18n";

// The onboarding starter: a hand-picked set of warm "Who's more likely to…?"
// questions (STARTER_QIDS in ../lib/onboarding — chosen so every couple fits an
// option). Each guessable question is answered, then you predict your partner's
// answer (the "predict your partner" layer, same as the main play flow). Both
// partners answer the SAME questions so the reveal overlaps. The ids live in
// fun-icebreakers' level-0 slice, so marking that level done reveals exactly them.
const STARTER_SLUG = "fun-icebreakers";
const STARTER_BY_ID = new Map(
  DECKS[STARTER_SLUG].questions.map((q) => [q.id, q]),
);
const STARTER_QS: Question[] = STARTER_QIDS.map((id) => STARTER_BY_ID.get(id)).filter(
  (q): q is Question => !!q && (q.type === "mc" || q.type === "scale"),
);

type T = (en: string, fr: string) => string;
type AStep =
  | "welcome"
  | "names"
  | "stage"
  | "consent"
  | "questions"
  | "profile"
  | "invite"
  | "intention"
  | "menu";
type BStep = "arrive" | "name" | "consent" | "questions";

// Onboarding = recruitment (spec v2). Flow A: the person who arrives first —
// answers, then creates their profile at the invite gate, then invites. Flow B:
// the person they bring — reaches the reveal without ever needing an account.
// Anonymous auth carries the pre-account state; the account is layered on at the
// exact moment it earns its keep (the invite / the notification channel).
export default function Onboarding({
  inviteToken,
  onDone,
}: {
  inviteToken: string | null;
  onDone: (code: string) => void;
}) {
  const t = useT();
  const joining = !!inviteToken;

  const [myName, setMyName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [stage, setStage] = useState<OnbStage | null>(null);
  const [code, setCode] = useState("");
  const [role, setRole] = useState<"host" | "guest">("host");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [fallback, setFallback] = useState(false);

  const [stepA, setStepA] = useState<AStep>("welcome");
  const [stepB, setStepB] = useState<BStep>("arrive");
  const [initiatorName, setInitiatorName] = useState("");
  const [bankedCount, setBankedCount] = useState(0);

  const partner = partnerName.trim() || t("your partner", "votre partenaire");

  // Anonymous sign-in with a timeout backstop; on failure, degrade to the
  // account screen rather than stranding anyone.
  const ensureUser = async () => {
    if (auth.currentUser) return auth.currentUser;
    try {
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

  // Flow A: consent → create the session (answers need somewhere to live).
  const startFlowA = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) return setBusy(false);
    try {
      await recordConsent(user.uid);
      const c = await createSession(user.uid, myName.trim(), (stage ?? undefined) as Stage);
      setCode(c);
      setRole("host");
      setStepA("questions");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  // Flow B: consent → join → read the initiator's banked count → answer.
  const startFlowB = async () => {
    if (busy || !inviteToken) return;
    setBusy(true);
    setErr("");
    const user = await ensureUser();
    if (!user) return setBusy(false);
    try {
      await recordConsent(user.uid);
      const res = await redeemInvite({ token: inviteToken });
      const c = res.data.code;
      setCode(c);
      setRole("guest");
      try {
        const snap = await get(ref(db, `sessions/${c}`));
        const val = snap.val() ?? {};
        setInitiatorName(val?.members?.host?.name ?? "");
        const decks = (val.decks ?? {}) as Record<string, { answers?: Record<string, { host?: unknown }> }>;
        let n = 0;
        for (const s in decks)
          for (const qid in decks[s].answers ?? {})
            if (decks[s].answers![qid].host != null) n++;
        setBankedCount(n);
      } catch {
        /* count is a nicety */
      }
      setStepB("questions");
    } catch (e) {
      setErr(prettyError(e));
    } finally {
      setBusy(false);
    }
  };

  const shell = (children: React.ReactNode, onExit?: () => void) => (
    <section className="screen-enter">
      {onExit ? (
        <TopBar onExit={onExit} />
      ) : (
        <div className="brandhead brand-enter">
          <Wordmark size={32} />
        </div>
      )}
      {children}
      {err && <div className="err">{err}</div>}
    </section>
  );

  if (fallback) {
    return (
      <section className="screen-enter">
        <div className="brandhead brand-enter">
          <Wordmark size={32} />
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
  // FLOW B — the joiner: arrive → name → consent → answer → reveal
  // =========================================================================
  if (joining) {
    if (stepB === "arrive") {
      return shell(
        <>
          <div className="eyebrow center" style={{ marginTop: 30 }}>
            {t("You've been invited", "Vous êtes invité·e")}
          </div>
          <h1 className="h1 center" style={{ margin: "10px 24px 6px" }}>
            {t("Someone has started something.", "Quelqu'un a commencé quelque chose.")}
          </h1>
          <p className="sub serif center" style={{ fontStyle: "italic", margin: "10px 24px 26px" }}>
            {t(
              "It doesn't work without you. Answer the same questions and you'll see where you two land.",
              "Ça ne marche pas sans vous. Répondez aux mêmes questions et vous verrez où vous en êtes.",
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
            placeholder={t("e.g. Judah", "p. ex. Judah")}
          />
          <button className="btn pill" type="button" disabled={!myName.trim()} onClick={() => setStepB("consent")}>
            {t("Continue →", "Continuer →")}
          </button>
        </>,
        () => setStepB("arrive"),
      );
    }
    if (stepB === "consent") {
      return shell(
        <ConsentBody partner={partner} busy={busy} onStart={startFlowB} t={t} />,
        () => setStepB("name"),
      );
    }
    // questions → reveal
    return (
      <OnbQuestions
        code={code}
        role={role}
        t={t}
        partnerName={initiatorName || partner}
        heading={
          bankedCount > 0
            ? t(
                `${initiatorName || partner} answered ${bankedCount}. Your turn.`,
                `${initiatorName || partner} a répondu à ${bankedCount}. À vous.`,
              )
            : t("Your turn.", "À vous.")
        }
        onDone={() => onDone(code)}
      />
    );
  }

  // =========================================================================
  // FLOW A — the initiator
  // =========================================================================
  if (stepA === "welcome") {
    return shell(
      <>
        <div className="obwelcome">
          <p className="verse serif center" style={{ marginTop: 24 }}>
            {t(
              "“Can two walk together, unless they are agreed?”",
              "« Deux hommes marchent-ils ensemble, sans s'être concertés ? »",
            )}
            <span className="verse-ref">Amos 3:3</span>
          </p>
          <ul className="obfacts">
            <li>{t("It takes two — nothing happens until you're both in.", "Il en faut deux — rien ne se passe tant que vous n'êtes pas là tous les deux.")}</li>
            <li>{t("Neither of you sees the other's answers until you've both answered.", "Aucun de vous ne voit les réponses de l'autre avant que vous ayez tous deux répondu.")}</li>
            <li>{t("There's no winner and no score — it opens a conversation, it doesn't judge it.", "Il n'y a ni gagnant ni score — cela ouvre la conversation, sans la juger.")}</li>
          </ul>
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
        <input className="input" id="me" maxLength={20} value={myName} onChange={(e) => setMyName(e.target.value)} placeholder={t("e.g. Sarah", "p. ex. Sarah")} />
        <label htmlFor="them">{t("And who are you doing this with?", "Et avec qui faites-vous ceci ?")}</label>
        <input className="input" id="them" maxLength={20} value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder={t("e.g. Judah", "p. ex. Judah")} />
        <button className="btn pill" type="button" disabled={!myName.trim() || !partnerName.trim()} onClick={() => setStepA("stage")}>
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
            <button key={s.key} type="button" className={`stagechip ${stage === s.key ? "on" : ""}`} onClick={() => setStage(s.key)} aria-pressed={stage === s.key}>
              {t(s.en, s.fr)}
            </button>
          ))}
        </div>
        <button className="btn pill" type="button" disabled={!stage} onClick={() => setStepA("consent")}>
          {t("Continue →", "Continuer →")}
        </button>
      </>,
      () => setStepA("names"),
    );
  }

  if (stepA === "consent") {
    return shell(
      <ConsentBody partner={partner} busy={busy} onStart={startFlowA} t={t} />,
      () => setStepA("stage"),
    );
  }

  if (stepA === "questions") {
    return (
      <OnbQuestions
        code={code}
        role={role}
        t={t}
        partnerName={partner}
        heading={t("A few to start with.", "Quelques-unes pour commencer.")}
        onDone={() => setStepA("profile")}
      />
    );
  }

  if (stepA === "profile") {
    return (
      <ProfileStep
        partner={partner}
        name={myName.trim()}
        code={code}
        t={t}
        onDone={() => setStepA("invite")}
        onFallback={() => setFallback(true)}
      />
    );
  }

  if (stepA === "invite") {
    return (
      <InviteStep
        code={code}
        partner={partner}
        myName={myName.trim()}
        t={t}
        onContinue={() => setStepA("intention")}
      />
    );
  }

  if (stepA === "intention") {
    return <IntentionStep code={code} t={t} onNext={() => setStepA("menu")} />;
  }

  // A7 — "where would you like to start?" (spec §A7 / decision #3: reuse this as
  // the Path). It renders alternatives with real questions; picking one enters
  // the app.
  return (
    <StartMenu stage={stage ?? "dating"} onPick={() => onDone(code)} onSeeAll={() => onDone(code)} />
  );
}

// ---- Article 9 consent — two ticks, never one (spec v2 §2) ----------------
function ConsentBody({
  partner,
  busy,
  onStart,
  t,
}: {
  partner: string;
  busy: boolean;
  onStart: () => void;
  t: T;
}) {
  const [terms, setTerms] = useState(false);
  const [faith, setFaith] = useState(false);
  return (
    <>
      <h1 className="h1 center" style={{ marginTop: 22 }}>
        {t("Before we start.", "Avant de commencer.")}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 4px" }}>
        {t(
          "Because TwoAgree is about faith and marriage, we need your clear okay before we keep anything you write.",
          "Comme TwoAgree touche à la foi et au mariage, nous avons besoin de votre accord clair avant de conserver ce que vous écrivez.",
        )}
      </p>
      <p className="sub serif center" style={{ fontStyle: "italic", margin: "10px 24px 14px", color: "var(--berry)" }}>
        {t(
          "This won't tell you whether to get married. It'll tell you what you haven't talked about.",
          "Ceci ne vous dira pas s'il faut vous marier. Cela vous dira ce dont vous n'avez pas parlé.",
        )}
      </p>
      <label className="consent">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span>
          {t("I accept the ", "J'accepte les ")}
          <a className="link" href="/terms.html" target="_blank" rel="noreferrer">
            {t("Terms & Conditions", "Conditions générales")}
          </a>
        </span>
      </label>
      <label className="consent">
        <input type="checkbox" checked={faith} onChange={(e) => setFaith(e.target.checked)} />
        <span>
          {t(
            `I agree TwoAgree can save my answers about my faith and my relationship, so that ${partner} and I can see where we align once we've both answered.`,
            `J'accepte que TwoAgree conserve mes réponses sur ma foi et ma relation, afin que ${partner} et moi puissions voir où nous nous rejoignons une fois que nous aurons tous deux répondu.`,
          )}
        </span>
      </label>
      <button
        className={busy ? "btn pill busy" : "btn pill"}
        type="button"
        disabled={!terms || !faith || busy}
        onClick={onStart}
      >
        {busy ? t("One moment…", "Un instant…") : t("Start →", "Commencer →")}
      </button>
    </>
  );
}

// ---- Answer + predict-your-partner sequence --------------------------------
function OnbQuestions({
  code,
  role,
  heading,
  partnerName,
  onDone,
  t,
}: {
  code: string;
  role: "host" | "guest";
  heading: string;
  partnerName: string;
  onDone: () => void;
  t: T;
}) {
  const [idx, setIdx] = useState(0);
  const [pend, setPend] = useState<number | null>(null);
  const [pendGuess, setPendGuess] = useState<number | null>(null);
  const [guessing, setGuessing] = useState(false);
  const [busy, setBusy] = useState(false);
  const q = STARTER_QS[idx];
  const last = idx + 1 >= STARTER_QS.length;
  const guessable = !!q && q.guessable && q.type !== "open";

  // Move to the next question, or finish the level. Called from the answer step
  // (non-guessable questions) and from the guess step (lock or skip).
  const advance = async () => {
    if (last) {
      setBusy(true);
      await markLevelDone(code, STARTER_SLUG, 0, role);
      onDone();
      return;
    }
    setPend(null);
    setPendGuess(null);
    setGuessing(false);
    setIdx((i) => i + 1);
  };

  const submitAnswer = async () => {
    if (pend == null || busy || !q) return;
    setBusy(true);
    await writeAnswer(code, STARTER_SLUG, q.id, role, pend);
    setBusy(false);
    // Guessable → predict the partner before advancing; otherwise move on.
    if (guessable) {
      setPendGuess(null);
      setGuessing(true);
    } else {
      await advance();
    }
  };

  const lockGuess = async () => {
    if (pendGuess == null || busy || !q) return;
    setBusy(true);
    await writeGuess(code, STARTER_SLUG, q.id, role, pendGuess);
    setBusy(false);
    await advance();
  };

  if (!q) {
    onDone();
    return null;
  }

  // Shared input — the scale orbs / MC options, reused by answer and guess steps.
  const input = (value: number | null, onPick: (i: number) => void, guess?: boolean) =>
    q.type === "scale" ? (
      <>
        <div className="slabels">
          <span>{q.lo}</span>
          <span style={{ textAlign: "right" }}>{q.hi}</span>
        </div>
        <div className="scale">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`orb ${value === i ? "sel" : ""}`} onClick={() => onPick(i)}>
              {i}
            </div>
          ))}
        </div>
      </>
    ) : (
      <div style={{ marginTop: 4 }}>
        {q.opts?.map((o, i) => (
          <div
            key={i}
            className={`opt ${guess ? "guess" : ""} ${value === i ? "sel" : ""}`}
            onClick={() => onPick(i)}
          >
            {o}
            <span className="dot" />
          </div>
        ))}
      </div>
    );

  const progress = (
    <div className="qprog">
      <i style={{ width: `${Math.round(((idx + 1) / STARTER_QS.length) * 100)}%` }} />
    </div>
  );

  // ---- Guess step: predict the partner's answer ----
  if (guessing) {
    const yourText = q.type === "scale" ? `${pend} / 5` : q.opts?.[pend as number];
    return (
      <section className="screen-enter">
        <div className="brandhead brand-enter">
          <Mark height={30} title="TwoAgree" colour="var(--berry)" />
        </div>
        {progress}
        <div
          key={`${q.id}-guess`}
          className="qcard glide-in"
          style={{ marginTop: 12, borderColor: "var(--app-honey-line)" }}
        >
          <div className="qrow">
            <div className="eyebrow">{t("YOUR GUESS", "VOTRE INTUITION")}</div>
            <span className="badge honey">&#10022; {t("GUESS", "DEVINEZ")}</span>
          </div>
          <div className="qtext">{q.q}</div>
          <div className="yousaid">
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>
                {t("YOU SAID", "VOUS AVEZ DIT")}
              </div>
              <div className="yousaid-val">{yourText}</div>
            </div>
          </div>
          <p style={{ margin: "18px 0 14px", fontWeight: 600 }}>
            {t("Now — what will ", "Maintenant — que va répondre ")}
            <span style={{ color: "var(--amber)" }}>{partnerName}</span>
            {t(" say?", " ?")}
          </p>
          {input(pendGuess, setPendGuess, true)}
        </div>
        <button
          className="btn honey"
          type="button"
          disabled={pendGuess == null || busy}
          onClick={lockGuess}
        >
          {t("Lock it in →", "Je valide →")}
        </button>
        <button className="btn ghost" type="button" onClick={() => void advance()} disabled={busy}>
          {t("Skip", "Passer")}
        </button>
      </section>
    );
  }

  // ---- Answer step ----
  return (
    <section className="screen-enter">
      <div className="brandhead brand-enter">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      {progress}
      <p className="muted center" style={{ fontSize: 13, marginTop: 12 }}>{heading}</p>
      <div key={q.id} className="qcard glide-in" style={{ marginTop: 12 }}>
        <div className="qtext">{q.q}</div>
        {input(pend, setPend)}
      </div>
      <button className="btn" type="button" disabled={pend == null || busy} onClick={submitAnswer}>
        {guessable
          ? t("Next →", "Suivant →")
          : last
            ? t("Done →", "Terminé →")
            : t("Next →", "Suivant →")}
      </button>
      <div className="hint">{t(`${idx + 1} OF ${STARTER_QS.length}`, `${idx + 1} SUR ${STARTER_QS.length}`)}</div>
    </section>
  );
}

// ---- Create your profile at the invite gate (email/pw or Google + photo) --
function ProfileStep({
  partner,
  name,
  code,
  onDone,
  onFallback,
  t,
}: {
  partner: string;
  name: string;
  code: string;
  onDone: () => void;
  onFallback: () => void;
  t: T;
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const finish = async (emailUsed?: string) => {
    const u = auth.currentUser;
    if (u) await writeProfile(u.uid, { name, email: emailUsed, photo: photo ?? undefined });
    onDone();
  };

  const withEmail = async () => {
    if (!email.trim() || pw.length < 6 || busy) return;
    setBusy(true);
    setErr("");
    try {
      const u = auth.currentUser;
      if (!u) return onFallback();
      await linkWithCredential(u, EmailAuthProvider.credential(email.trim(), pw));
      await finish(email.trim());
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const withGoogle = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const u = auth.currentUser;
      if (!u) return onFallback();
      const res = await linkWithPopup(u, googleProvider);
      await finish(res.user.email ?? undefined);
    } catch (e) {
      setErr(prettyError(e));
      setBusy(false);
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await fileToAvatarDataUrl(file));
    } catch {
      /* ignore — photo is optional */
    }
  };

  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  void code;
  return (
    <section className="screen-enter">
      <div className="brandhead brand-enter">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        {t(`Set up your profile to invite ${partner}.`, `Créez votre profil pour inviter ${partner}.`)}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 10px" }}>
        {t("This is how we let you know when they answer.", "C'est ainsi que nous vous prévenons quand ils répondent.")}
      </p>

      <div className="avatarwrap" style={{ marginTop: 6 }}>
        <div className="avatar" style={{ width: 76, height: 76 }}>
          {photo ? <img src={photo} alt="" /> : initial}
        </div>
        <label className="photobtn" style={{ cursor: "pointer" }}>
          {photo ? t("Change photo", "Changer la photo") : t("Add a photo (optional)", "Ajouter une photo (facultatif)")}
          <input type="file" accept="image/*" hidden onChange={onPhoto} />
        </label>
      </div>

      <button className="btn out google" type="button" onClick={withGoogle} disabled={busy} style={{ marginTop: 14 }}>
        {t("Continue with Google", "Continuer avec Google")}
      </button>
      <div className="authdiv">{t("or use email", "ou par e-mail")}</div>

      <label htmlFor="oe">{t("Email", "E-mail")}</label>
      <input className="input" id="oe" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label htmlFor="op">{t("Password", "Mot de passe")}</label>
      <input className="input" id="op" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t("At least 6 characters", "Au moins 6 caractères")} />
      {err && <div className="err">{err}</div>}
      <button className={busy ? "btn pill busy" : "btn pill"} type="button" disabled={!email.trim() || pw.length < 6 || busy} onClick={withEmail}>
        {busy ? t("One moment…", "Un instant…") : t("Create profile →", "Créer le profil →")}
      </button>
    </section>
  );
}

// ---- The invite: editable draft + share link (spec v2 §A4) ----------------
function InviteStep({
  code,
  partner,
  myName,
  onContinue,
  t,
}: {
  code: string;
  partner: string;
  myName: string;
  onContinue: () => void;
  t: T;
}) {
  const [msg, setMsg] = useState(
    t(
      `Hey ${partner} — I started something on TwoAgree and it needs you. It takes 5 minutes. `,
      `Coucou ${partner} — j'ai commencé quelque chose sur TwoAgree et j'ai besoin de toi. Ça prend 5 minutes. `,
    ),
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const send = async () => {
    setBusy(true);
    setStatus("");
    let link = "";
    try {
      const res = await createInvite({ code });
      link = `${window.location.origin}/?t=${res.data.token}`;
    } catch {
      link = `${window.location.origin}/?c=${code}`; // fallback: bare code link
    }
    const text = `${msg}${link}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setStatus(t("Copied — paste it to ", "Copié — collez-le à ") + partner);
      }
    } catch {
      /* user dismissed the share sheet */
    }
    setBusy(false);
  };

  void myName;
  return (
    <section className="screen-enter">
      <div className="brandhead brand-enter">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        {t(`Now bring ${partner} in.`, `Faites venir ${partner}.`)}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 6px" }}>
        {t("You've answered — now they can see where you two land. Send them this:", "Vous avez répondu — ils peuvent maintenant voir où vous en êtes. Envoyez-leur ceci :")}
      </p>
      <textarea className="input" style={{ minHeight: 96 }} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={220} />
      <button className={busy ? "btn pill busy" : "btn pill"} type="button" onClick={send} disabled={busy}>
        {busy ? t("One moment…", "Un instant…") : t(`Send ${partner} the link →`, `Envoyer le lien à ${partner} →`)}
      </button>
      {status && <div className="ok center">{status}</div>}
      <button className="btn ghost" type="button" onClick={onContinue}>
        {t("I'll do that in a moment", "Je le ferai dans un instant")}
      </button>
    </section>
  );
}

// ---- Implementation intention (spec v2 §A6) -------------------------------
function IntentionStep({ code, onNext, t }: { code: string; onNext: () => void; t: T }) {
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (busy) return;
    setBusy(true);
    if (when) {
      const ms = Date.parse(when);
      if (!Number.isNaN(ms)) await writeMeetAt(code, ms);
    }
    setBusy(false);
    onNext();
  };
  return (
    <section className="screen-enter">
      <div className="brandhead brand-enter">
        <Mark height={30} title="TwoAgree" colour="var(--berry)" />
      </div>
      <h1 className="h1 center" style={{ marginTop: 20 }}>
        {t("When will you two sit down for this together?", "Quand vous poserez-vous ensemble pour cela ?")}
      </h1>
      <p className="sub center" style={{ margin: "8px 24px 14px" }}>
        {t(
          "Couples who pick a moment actually have the conversation. No reminders, no nagging.",
          "Les couples qui choisissent un moment ont vraiment la conversation. Aucun rappel, aucune relance.",
        )}
      </p>
      <input className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      <button className="btn pill" type="button" disabled={busy} onClick={save}>
        {when ? t("Set it →", "C'est noté →") : t("Skip for now →", "Passer pour l'instant →")}
      </button>
    </section>
  );
}
