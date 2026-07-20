import type { CapacitorConfig } from "@capacitor/cli";

// TwoAgree — native shell config (CAPACITOR iOS WRAP brief).
//
// This wraps the SAME Vite build (dist/) as a native app. It ships the built
// bundle LOCALLY — there is deliberately NO `server.url`. Loading the live
// twoagree.app in a webview would (a) be rejected under App Review guideline
// 4.2 and (b) break the native Google/Apple auth flow, which needs a native
// origin, not a remote page. See §2 of the brief.
const config: CapacitorConfig = {
  // Permanent bundle identifier. Must be IDENTICAL in Xcode, the Firebase iOS
  // app registration, App Store Connect and the Apple Developer App ID.
  appId: "app.twoagree",
  appName: "TwoAgree",
  webDir: "dist",
  ios: {
    // Claret chrome behind the status bar; content insets are handled in CSS
    // via env(safe-area-inset-*), so let the web view own the full height.
    contentInset: "never",
    backgroundColor: "#3E1A2E",
  },
  plugins: {
    // Native Firebase Auth. skipNativeAuth keeps the plugin from establishing
    // its OWN native Firebase session — instead it hands us back the provider
    // credential, which we bridge into the Firebase JS SDK (signInWith/
    // linkWithCredential). That keeps ONE auth session — the JS SDK one the
    // whole app already reads — so host/guest, consent and RTDB rules are
    // byte-for-byte identical to web. See src/lib/device/auth.ts.
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ["google.com", "apple.com"],
    },
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: "#3E1A2E",
      showSpinner: false,
      // No fade so the claret ground meets the claret status bar cleanly.
      launchAutoHide: true,
    },
  },
};

export default config;
