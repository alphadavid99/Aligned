import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  signInWithGoogleSmart,
  signInWithAppleSmart,
  appleAuthAvailable,
} from "../lib/device/auth";
import { prettyError } from "../lib/errors";
import { hasReturned } from "../lib/local";
import { useT } from "../lib/i18n";

type Mode = "signup" | "signin";

// Email/password + Google + password reset. On success, the top-level
// onAuthStateChanged (useAuth) swaps the view — this screen just kicks it off.
export default function AuthScreen() {
  const t = useT();
  // Returning devices land on "Sign in"; genuinely new visitors on "Create".
  const [mode, setMode] = useState<Mode>(hasReturned() ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isSignup = mode === "signup";

  const clear = () => {
    setErr("");
    setOk("");
  };

  const toggleMode = () => {
    setMode(isSignup ? "signin" : "signup");
    clear();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    if (!email.trim() || !pw) {
      setErr(
        t("Enter your email and a password.", "Saisissez votre e-mail et un mot de passe."),
      );
      return;
    }
    if (isSignup && !agreed) {
      setErr(
        t(
          "Please agree to the Privacy Policy to create an account.",
          "Veuillez accepter la politique de confidentialité pour créer un compte.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email.trim(), pw);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), pw);
      }
    } catch (e2) {
      setErr(prettyError(e2));
      setBusy(false);
    }
  };

  // Guard the consent gate on sign-up, then run whichever OAuth flow the
  // platform supports (native sheet on iOS, popup on web). onAuthStateChanged
  // swaps the view on success.
  const oauth = async (run: () => Promise<unknown>) => {
    clear();
    if (isSignup && !agreed) {
      setErr(
        t(
          "Please agree to the Privacy Policy to create an account.",
          "Veuillez accepter la politique de confidentialité pour créer un compte.",
        ),
      );
      return;
    }
    try {
      await run();
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const google = () => oauth(() => signInWithGoogleSmart(auth));
  const apple = () => oauth(() => signInWithAppleSmart(auth));

  const resetPw = async () => {
    clear();
    if (!email.trim()) {
      setErr(
        t(
          "Enter your email first, then tap reset.",
          "Saisissez d’abord votre e-mail, puis appuyez sur réinitialiser.",
        ),
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setOk(
        t(
          "Check your inbox for a reset link.",
          "Consultez votre boîte mail pour le lien de réinitialisation.",
        ),
      );
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  return (
    <section className="screen-enter">
      <div className="eyebrow center" style={{ marginTop: 34 }}>
        {t("Your account", "Votre compte")}
      </div>
      <h1 className="h1 center" style={{ marginTop: 8 }}>
        {isSignup
          ? t("Create your account", "Créez votre compte")
          : t("Welcome back", "Bon retour")}
      </h1>
      <p
        className="sub serif center"
        style={{ fontStyle: "italic", margin: "10px 20px 26px" }}
      >
        {isSignup
          ? t(
              "One profile that stays with you across every session.",
              "Un seul profil qui vous suit à chaque session.",
            )
          : t(
              "Sign in to pick up where you left off.",
              "Connectez-vous pour reprendre où vous en étiez.",
            )}
      </p>

      {isSignup && (
        <label className="consent" style={{ marginTop: 0 }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            {t("I agree to the", "J’accepte la")}{" "}
            <a className="link" href="/privacy.html" target="_blank" rel="noreferrer">
              {t("Privacy Policy", "politique de confidentialité")}
            </a>
            {t(
              ". TwoAgree collects sensitive answers (faith, values, intimacy) to show the two of you where you align.",
              ". TwoAgree recueille des réponses sensibles (foi, valeurs, intimité) pour vous montrer, à tous les deux, où vous vous rejoignez.",
            )}
          </span>
        </label>
      )}

      <button
        className="btn out google"
        type="button"
        onClick={google}
        style={{ marginTop: 18 }}
      >
        {/* Google's official "G" mark — brand colours are fixed by Google's
            guidelines and must NOT be tokenised or recoloured. */}
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        {t("Continue with Google", "Continuer avec Google")}
      </button>

      {/* Sign in with Apple — native iOS only. Mandatory (App Review 4.8)
          whenever Google is offered. The native plugin runs the OS sheet; the
          returned credential is bridged into the same Firebase session. */}
      {appleAuthAvailable() && (
        <button
          className="btn out apple"
          type="button"
          onClick={apple}
          style={{ marginTop: 12 }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.36 12.86c-.02-2.16 1.76-3.2 1.84-3.25-1-1.47-2.56-1.67-3.12-1.69-1.33-.13-2.59.78-3.26.78-.67 0-1.71-.76-2.81-.74-1.45.02-2.79.84-3.53 2.14-1.5 2.61-.38 6.47 1.08 8.59.71 1.04 1.56 2.2 2.68 2.16 1.07-.04 1.48-.69 2.78-.69 1.29 0 1.66.69 2.79.67 1.15-.02 1.88-1.06 2.59-2.1.81-1.21 1.15-2.38 1.17-2.44-.03-.01-2.24-.86-2.26-3.41zM14.2 6.6c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.19z"
            />
          </svg>
          {t("Continue with Apple", "Continuer avec Apple")}
        </button>
      )}

      <div className="authdiv">{t("or use email", "ou par e-mail")}</div>

      <form onSubmit={submit}>
        <label htmlFor="email">{t("Email", "E-mail")}</label>
        <input
          className="input"
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="pw">{t("Password", "Mot de passe")}</label>
        <input
          className="input"
          id="pw"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder={
            isSignup
              ? t("At least 6 characters", "Au moins 6 caractères")
              : t("Your password", "Votre mot de passe")
          }
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}

        <button className={busy ? "btn pill busy" : "btn pill"} type="submit" disabled={busy}>
          {busy
            ? t("One moment…", "Un instant…")
            : isSignup
              ? t("Create account →", "Créer le compte →")
              : t("Sign in →", "Se connecter →")}
        </button>
      </form>

      {!isSignup && (
        <button className="btn ghost" type="button" onClick={resetPw}>
          {t("Forgot password?", "Mot de passe oublié ?")}
        </button>
      )}

      <p className="muted center" style={{ fontSize: 14, marginTop: 8 }}>
        {isSignup
          ? t("Already have an account? ", "Vous avez déjà un compte ? ")
          : t("New here? ", "Nouveau ici ? ")}
        <button className="link" type="button" onClick={toggleMode}>
          {isSignup ? t("Sign in", "Se connecter") : t("Create one", "Créer un compte")}
        </button>
      </p>
    </section>
  );
}
