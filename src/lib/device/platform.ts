// Platform adapter. The one place the app asks "am I inside the native shell?".
// Capacitor's web implementation ships in the browser bundle too, so this is
// safe to import anywhere — on the web it just reports "web".
import { Capacitor } from "@capacitor/core";

export const isNativePlatform = (): boolean => Capacitor.isNativePlatform();
export const isIOS = (): boolean => Capacitor.getPlatform() === "ios";
