// Auth adapter — the single seam between the web OAuth flow and the native one.
//
// WHY THIS EXISTS (brief §3, the highest-risk section): Firebase's web OAuth
// (signInWithPopup / linkWithPopup) is unreliable inside a native iOS webview
// and, for Google, actively blocked. So on native we drive Google and Apple
// through the @capacitor-firebase/authentication plugin, which runs the OS
// native sign-in sheet, then bridge the returned provider credential BACK into
// the Firebase JS SDK. That keeps ONE Firebase Auth session — the JS-SDK one
// the whole app already reads via useAuth — so the resulting uid, the Article-9
// consent write, host/guest seating and the RTDB rules are byte-for-byte
// identical to web. Nothing downstream knows which door the user came through.
//
// The plugin is configured with skipNativeAuth (capacitor.config.ts) so it does
// NOT open its own parallel native Firebase session; it only hands us the
// credential. Email/Password is untouched and stays on the JS SDK everywhere.
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  linkWithPopup,
  signInWithCredential,
  linkWithCredential,
  type Auth,
  type User,
  type UserCredential,
  type AuthCredential,
} from "firebase/auth";
import { googleProvider } from "../../firebase";
import { isNativePlatform } from "./platform";

// Apple is offered on native only (that's where the mandated native flow lives,
// guideline 4.8). Callers use this to decide whether to render the Apple button.
export const appleAuthAvailable = (): boolean => isNativePlatform();

// A user dismissing the native sheet isn't an error to shout about. Tag it with
// the same code the web popup uses so prettyError() stays quiet for both.
const cancelled = () =>
  Object.assign(new Error("Sign-in was cancelled."), {
    code: "auth/popup-closed-by-user",
  });

// Run the native provider sheet and turn the returned tokens into a JS-SDK
// AuthCredential. Loaded lazily so the plugin's code never weighs on the web
// bundle path — web callers below never reach here.
async function nativeGoogleCredential(): Promise<AuthCredential> {
  const { FirebaseAuthentication } = await import(
    "@capacitor-firebase/authentication"
  );
  const { credential } = await FirebaseAuthentication.signInWithGoogle();
  if (!credential?.idToken) throw cancelled();
  return GoogleAuthProvider.credential(
    credential.idToken,
    credential.accessToken,
  );
}

async function nativeAppleCredential(): Promise<AuthCredential> {
  const { FirebaseAuthentication } = await import(
    "@capacitor-firebase/authentication"
  );
  const { credential } = await FirebaseAuthentication.signInWithApple();
  if (!credential?.idToken) throw cancelled();
  // Apple credentials must carry the raw nonce the plugin generated, or Firebase
  // rejects the token. accessToken here is Apple's authorization code.
  return new OAuthProvider("apple.com").credential({
    idToken: credential.idToken,
    rawNonce: credential.nonce,
    accessToken: credential.accessToken,
  });
}

// ---- Public API — same four verbs the screens already needed ---------------
// Fresh sign-in (AuthScreen): native → credential → JS session; web → popup.
export async function signInWithGoogleSmart(auth: Auth): Promise<UserCredential> {
  if (isNativePlatform()) {
    return signInWithCredential(auth, await nativeGoogleCredential());
  }
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithAppleSmart(auth: Auth): Promise<UserCredential> {
  // Apple is native-only; a web caller should never invoke this.
  return signInWithCredential(auth, await nativeAppleCredential());
}

// Link onto the existing (anonymous) onboarding user: native → credential →
// linkWithCredential; web → linkWithPopup. Preserves the onboarding graft so
// the anonymous session's uid is kept, not replaced.
export async function linkWithGoogleSmart(user: User): Promise<UserCredential> {
  if (isNativePlatform()) {
    return linkWithCredential(user, await nativeGoogleCredential());
  }
  return linkWithPopup(user, googleProvider);
}

export async function linkWithAppleSmart(user: User): Promise<UserCredential> {
  return linkWithCredential(user, await nativeAppleCredential());
}
