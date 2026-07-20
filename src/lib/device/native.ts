// One entry point the app calls at boot to wire up native-shell behaviour.
// No-op on web (each sub-step guards itself), so main.tsx can call it blindly.
import { isNativePlatform } from "./platform";
import { initNativeDeepLinks } from "./deeplinks";

export function initNative(): void {
  // Deep links guard internally and matter only on native.
  initNativeDeepLinks();
  if (!isNativePlatform()) return;

  void import("@capacitor/status-bar").then(({ StatusBar, Style }) => {
    // NOTE (deliberate deviation from brief §5.2): the brief says "light content
    // on claret", picturing claret chrome behind the status bar. But the running
    // app sits on the light blush ground (brand Rule 2 — app screens are white,
    // not claret), so light text would be invisible. Style.Light = DARK text for
    // LIGHT backgrounds, which is the legible, correct choice here. The claret
    // splash uses light content, but that's owned by the SplashScreen plugin.
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  });
}
