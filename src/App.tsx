import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import { getActiveCode, setActiveCode, clearActiveCode } from "./lib/local";
import { currentInviteToken, onInviteToken } from "./lib/invite";
import { redeemInvite } from "./lib/functions";
import { prettyError } from "./lib/errors";
import { getLang } from "./lib/i18n";
import ProfileScreen from "./screens/ProfileScreen";
import StartScreen from "./screens/StartScreen";
import SessionApp from "./screens/SessionApp";
import Onboarding from "./screens/Onboarding";
import { Wordmark } from "./brand/Wordmark";
import { IconSettings, IconBack } from "./components/icons";
import { useT } from "./lib/i18n";

const BrandHead = () => (
  <div className="brandhead brand-enter">
    <Wordmark size={32} />
  </div>
);

const Boot = ({ label }: { label: string }) => (
  <>
    <div className="spin" />
    <p className="muted center" style={{ fontSize: 14 }}>
      {label}
    </p>
  </>
);

// The signed-in-but-no-session landing: Start a session, with a settings gear
// that opens Profile (language, account, data controls, sign out) so this
// screen is never a dead end before a session exists.
function NoSession({
  user,
  name,
  inviteErr,
  onEnter,
}: {
  user: User;
  name: string;
  inviteErr: string;
  onEnter: (code: string) => void;
}) {
  const t = useT();
  const [view, setView] = useState<"start" | "profile">("start");
  const showProfile = view === "profile";
  return (
    <>
      <div className="landinghead brand-enter">
        <Wordmark size={24} />
        <button
          className="iconbtn landinghead-action"
          type="button"
          onClick={() => setView(showProfile ? "start" : "profile")}
          aria-label={showProfile ? t("Back", "Retour") : t("Settings", "Réglages")}
        >
          {showProfile ? <IconBack size={22} /> : <IconSettings size={22} />}
        </button>
      </div>
      {showProfile ? (
        <ProfileScreen user={user} />
      ) : (
        <>
          {inviteErr && (
            <div className="banner" style={{ marginTop: 16 }}>
              {inviteErr}
            </div>
          )}
          <StartScreen uid={user.uid} name={name} onEnter={onEnter} />
        </>
      )}
    </>
  );
}

function SignedIn({ user, inviteToken }: { user: User; inviteToken: string | null }) {
  const t = useT();
  const { profile, loading } = useProfile(user.uid);
  const [code, setCode] = useState<string | null>(() => getActiveCode(user.uid));
  const [redeeming, setRedeeming] = useState(!!inviteToken);
  const [inviteErr, setInviteErr] = useState("");
  // Attempt the redeem exactly once, so a state change can never re-trigger it
  // and no branch can leave us stuck on the "Joining…" spinner.
  const redeemed = useRef(false);

  // Redeem an invite link once the user is signed in and has a name.
  useEffect(() => {
    if (!inviteToken || redeemed.current) return;

    // Already seated in a session (e.g. the host opened the link they sent, or
    // a stale token from a previous visit): don't try to redeem into it — that
    // used to hang on "Joining…" forever. Drop the token and stay put.
    if (code) {
      redeemed.current = true;
      setRedeeming(false);
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    // Wait until the profile is loaded (need a name for the guest slot); keep
    // showing the spinner in the meantime.
    if (!profile?.name) return;

    redeemed.current = true;
    let cancelled = false;
    setRedeeming(true);
    // Backstop a slow/hung callable so we surface an error instead of spinning.
    const withTimeout = Promise.race([
      redeemInvite({ token: inviteToken }),
      new Promise<never>((_, rej) =>
        setTimeout(
          () =>
            rej(
              new Error(
                getLang() === "fr"
                  ? "Cela a pris trop de temps — vérifiez votre connexion et rouvrez le lien."
                  : "That took too long — check your connection and open the link again.",
              ),
            ),
          20000,
        ),
      ),
    ]);
    withTimeout
      .then((res) => {
        if (cancelled) return;
        setActiveCode(user.uid, res.data.code);
        setCode(res.data.code);
      })
      .catch((e) => !cancelled && setInviteErr(prettyError(e)))
      .finally(() => {
        if (cancelled) return;
        setRedeeming(false);
        window.history.replaceState({}, "", window.location.pathname);
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.name, code, user.uid, inviteToken]);

  if (loading)
    return (
      <Boot label={t("Loading your profile…", "Chargement de votre profil…")} />
    );

  // First run: no profile name yet → must complete the profile before playing.
  if (!profile?.name) {
    return (
      <>
        <BrandHead />
        <ProfileScreen user={user} />
      </>
    );
  }

  if (redeeming)
    return (
      <Boot
        label={t(
          "Joining your partner’s session…",
          "Connexion à la session de votre partenaire…",
        )}
      />
    );

  if (!code) {
    return (
      <NoSession
        user={user}
        name={profile.name}
        inviteErr={inviteErr}
        onEnter={setCode}
      />
    );
  }

  return (
    <SessionApp
      code={code}
      user={user}
      onLeave={() => {
        clearActiveCode(user.uid);
        setCode(null);
      }}
    />
  );
}

// The no-account front door (onboarding spec v2 §5). Onboarding owns the whole
// flow and only hands back a code when it's finished — critically, it stays
// mounted THROUGH the mid-flow account upgrade (linkWithCredential flips
// isAnonymous, but this gate doesn't re-route on that).
function OnboardingGate({ inviteToken }: { inviteToken: string | null }) {
  const [doneCode, setDoneCode] = useState<string | null>(null);
  const u = auth.currentUser;
  if (doneCode && u) {
    return (
      <SessionApp
        code={doneCode}
        user={u}
        onLeave={() => {
          clearActiveCode(u.uid);
          setDoneCode(null);
        }}
      />
    );
  }
  return (
    <Onboarding
      inviteToken={inviteToken}
      onDone={(c) => {
        // Persist the session so returning to the app (a fresh load, now a real
        // signed-in account) reopens it instead of dropping to "Start a session".
        const cu = auth.currentUser;
        if (cu) setActiveCode(cu.uid, c);
        setDoneCode(c);
      }}
    />
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const t = useT();
  // The invite token can arrive after mount on native (a universal link), so
  // track it in state and re-render when the deep-link bridge delivers one.
  const [inviteToken, setInviteTokenState] = useState<string | null>(
    currentInviteToken,
  );
  useEffect(() => onInviteToken(setInviteTokenState), []);
  // Decide the entry mode ONCE, when auth first settles, and lock it. A
  // pre-existing real account goes to the app; everyone else (no user, or an
  // anonymous user) enters onboarding and stays there even after the account is
  // upgraded mid-flow. Reset to the front door on sign-out.
  const [mode, setMode] = useState<null | "onboard" | "app">(null);
  // Track the previous auth state so we can tell a fresh real sign-in
  // (null → real) apart from the mid-onboarding account upgrade (anonymous →
  // real via linkWithCredential), which must NOT re-route out of onboarding.
  const prevUser = useRef<User | null>(null);
  useEffect(() => {
    if (loading) return;
    const wasAnon = !!prevUser.current?.isAnonymous;
    prevUser.current = user;
    if (!mode) {
      setMode(user && !user.isAnonymous ? "app" : "onboard");
    } else if (mode === "app" && !user) {
      setMode("onboard");
    } else if (mode === "onboard" && user && !user.isAnonymous && !wasAnon) {
      // A real account appeared with no anonymous session before it — the
      // onboarding anonymous-auth fallback, where the user creates an account
      // on AuthScreen. That screen hands off via onAuthStateChanged and has no
      // forward navigation of its own, so without this it would sit on
      // "One moment…" forever. Route into the app.
      setMode("app");
    }
  }, [loading, user, mode]);

  return (
    <div className="phone">
      {loading || !mode ? (
        <>
          <BrandHead />
          <Boot label={t("Checking your account…", "Vérification de votre compte…")} />
        </>
      ) : mode === "app" && user ? (
        <SignedIn user={user} inviteToken={inviteToken} />
      ) : (
        <OnboardingGate inviteToken={inviteToken} />
      )}
    </div>
  );
}
