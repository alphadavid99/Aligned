// Friendlier text for Firebase auth / database errors.
// Ported from aligned-accounts.html's pretty(); now bilingual. Reads the
// current language non-reactively (errors surface at action time, so a live
// subscription isn't needed).
import { getLang } from "./i18n";

const MESSAGES: Record<string, { en: string; fr: string }> = {
  "auth/email-already-in-use": {
    en: "That email already has an account — try signing in.",
    fr: "Cet e-mail a déjà un compte — essayez de vous connecter.",
  },
  "auth/invalid-email": {
    en: "That email doesn’t look right.",
    fr: "Cet e-mail semble incorrect.",
  },
  "auth/weak-password": {
    en: "Use at least 6 characters.",
    fr: "Utilisez au moins 6 caractères.",
  },
  "auth/wrong-password": {
    en: "That password doesn’t match.",
    fr: "Ce mot de passe ne correspond pas.",
  },
  "auth/user-not-found": {
    en: "No account with that email yet.",
    fr: "Aucun compte avec cet e-mail pour l’instant.",
  },
  "auth/invalid-credential": {
    en: "Email or password is incorrect.",
    fr: "E-mail ou mot de passe incorrect.",
  },
  "auth/too-many-requests": {
    en: "Too many attempts — wait a moment and try again.",
    fr: "Trop de tentatives — patientez un instant et réessayez.",
  },
  "auth/popup-closed-by-user": {
    en: "Sign-in was closed before finishing.",
    fr: "La connexion a été fermée avant la fin.",
  },
  "auth/operation-not-allowed": {
    en: "That sign-in method isn’t enabled in your Firebase console yet.",
    fr: "Cette méthode de connexion n’est pas encore activée dans votre console Firebase.",
  },
  PERMISSION_DENIED: {
    en: "Database rules blocked that — check your security rules.",
    fr: "Les règles de la base ont bloqué cela — vérifiez vos règles de sécurité.",
  },
};

export function prettyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = (err as { message?: string })?.message;
  const known = MESSAGES[code];
  if (known) return getLang() === "fr" ? known.fr : known.en;
  return (
    message ||
    (getLang() === "fr" ? "Une erreur s’est produite." : "Something went wrong.")
  );
}
