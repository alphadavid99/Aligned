import { useAuth } from "./hooks/useAuth";
import AuthScreen from "./screens/AuthScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="phone">
      <div className="wordmark">aligned &#10022;</div>

      {loading ? (
        <>
          <div className="spin" />
          <p className="muted center" style={{ fontSize: 14 }}>
            Checking your account…
          </p>
        </>
      ) : user ? (
        <ProfileScreen user={user} />
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}
