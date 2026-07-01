import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { prettyError } from "../lib/errors";

type Mode = "signup" | "signin";

// Email/password + Google + password reset. On success, the top-level
// onAuthStateChanged (useAuth) swaps the view — this screen just kicks it off.
export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

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
      setErr("Enter your email and a password.");
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

  const google = async () => {
    clear();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  const resetPw = async () => {
    clear();
    if (!email.trim()) {
      setErr("Enter your email first, then tap reset.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setOk("Check your inbox for a reset link.");
    } catch (e2) {
      setErr(prettyError(e2));
    }
  };

  return (
    <section>
      <div className="eyebrow center" style={{ marginTop: 34 }}>
        Your account
      </div>
      <h1 className="h1 center" style={{ marginTop: 8 }}>
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p
        className="sub serif center"
        style={{ fontStyle: "italic", margin: "10px 20px 26px" }}
      >
        {isSignup
          ? "One profile that stays with you across every session."
          : "Sign in to pick up where you left off."}
      </p>

      <form onSubmit={submit}>
        <label htmlFor="email">Email</label>
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

        <label htmlFor="pw">Password</label>
        <input
          className="input"
          id="pw"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="At least 6 characters"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {err && <div className="err">{err}</div>}
        {ok && <div className="ok">{ok}</div>}

        <button className="btn" type="submit" disabled={busy}>
          {busy
            ? "One moment…"
            : isSignup
              ? "Create account →"
              : "Sign in →"}
        </button>
      </form>

      <button className="btn out google" type="button" onClick={google}>
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
        Continue with Google
      </button>

      <button className="btn ghost" type="button" onClick={resetPw}>
        Forgot password?
      </button>

      <p className="muted center" style={{ fontSize: 14, marginTop: 8 }}>
        {isSignup ? "Already have an account? " : "New here? "}
        <button className="link" type="button" onClick={toggleMode}>
          {isSignup ? "Sign in" : "Create one"}
        </button>
      </p>
    </section>
  );
}
