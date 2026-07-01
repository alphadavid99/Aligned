// Friendlier text for Firebase auth / database errors.
// Ported verbatim from aligned-accounts.html's pretty().

const MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "That email already has an account — try signing in.",
  "auth/invalid-email": "That email doesn’t look right.",
  "auth/weak-password": "Use at least 6 characters.",
  "auth/wrong-password": "That password doesn’t match.",
  "auth/user-not-found": "No account with that email yet.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts — wait a moment and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
  "auth/operation-not-allowed":
    "That sign-in method isn’t enabled in your Firebase console yet.",
  PERMISSION_DENIED: "Database rules blocked that — check your security rules.",
};

export function prettyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = (err as { message?: string })?.message;
  return MESSAGES[code] || message || "Something went wrong.";
}
