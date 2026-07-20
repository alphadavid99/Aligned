// Native deep-link bridge. On web this is a no-op — the querystring already
// carries the invite token. On native iOS, a universal link (the partner-invite
// link from the Cloud Function, or an auth callback) opens the installed app
// instead of Safari; Capacitor delivers that URL here, and we pull the invite
// token out of it and hand it to the shared store so App.tsx can redeem it.
//
// The web fallback stays intact: users WITHOUT the app installed just open the
// same https link in the browser, which is the existing flow. Associated
// Domains (Dave configures these in Xcode/portal — see docs/IOS.md) are what
// route the link into the app in the first place.
import { setInviteToken } from "../invite";
import { isNativePlatform } from "./platform";

function tokenFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("t");
  } catch {
    return null;
  }
}

export function initNativeDeepLinks(): void {
  if (!isNativePlatform()) return;
  void import("@capacitor/app").then(({ App }) => {
    // Cold start: the app was launched BY the link.
    void App.getLaunchUrl().then((res) => {
      const t = res?.url ? tokenFromUrl(res.url) : null;
      if (t) setInviteToken(t);
    });
    // Warm: a link tapped while the app is already running/backgrounded.
    void App.addListener("appUrlOpen", (event) => {
      const t = tokenFromUrl(event.url);
      if (t) setInviteToken(t);
    });
  });
}
