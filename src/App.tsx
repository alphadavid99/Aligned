import { useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import { getActiveCode, clearActiveCode } from "./lib/local";
import AuthScreen from "./screens/AuthScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StartScreen from "./screens/StartScreen";
import SessionApp from "./screens/SessionApp";

const Wordmark = () => <div className="wordmark">aligned &#10022;</div>;

const Boot = ({ label }: { label: string }) => (
  <>
    <div className="spin" />
    <p className="muted center" style={{ fontSize: 14 }}>
      {label}
    </p>
  </>
);

function SignedIn({ user }: { user: User }) {
  const { profile, loading } = useProfile(user.uid);
  const [code, setCode] = useState<string | null>(() => getActiveCode(user.uid));

  if (loading) return <Boot label="Loading your profile…" />;

  // First run: no profile name yet → must complete the profile before playing.
  if (!profile?.name) {
    return (
      <>
        <Wordmark />
        <ProfileScreen user={user} />
      </>
    );
  }

  if (!code) {
    return (
      <>
        <Wordmark />
        <StartScreen uid={user.uid} name={profile.name} onEnter={setCode} />
      </>
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

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="phone">
      {loading ? (
        <>
          <Wordmark />
          <Boot label="Checking your account…" />
        </>
      ) : user ? (
        <SignedIn user={user} />
      ) : (
        <>
          <Wordmark />
          <AuthScreen />
        </>
      )}
    </div>
  );
}
