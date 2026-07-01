// Callable Cloud Functions (region-pinned to europe-west1). Talks to the
// Functions emulator in dev, same gate as the rest of firebase.ts.
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { app } from "../firebase";

const functions = getFunctions(app, "europe-west1");

if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS !== "false") {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export const exportMyData = httpsCallable<void, unknown>(
  functions,
  "exportMyData",
);

export const deleteMyAccount = httpsCallable<
  void,
  { ok: boolean; sessionsUpdated: number; sessionsDeleted: number }
>(functions, "deleteMyAccount");
