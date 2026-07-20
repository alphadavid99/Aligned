# iOS native app (Capacitor wrap)

TwoAgree ships to the App Store as a **Capacitor** wrap of the exact same Vite
web build — packaging only, no forked app logic. This doc is the handoff: what
was wired in code, and the Mac/console steps only you (Dave) can do.

- **Bundle ID (permanent): `app.twoagree`** — identical in Xcode, the Firebase
  iOS app, App Store Connect, and the Apple Developer App ID. Do not change it.
- **Firebase project: `twoagreeapp`** (europe-west1). Never the dead `aligned-9f843`.
- The app ships the **local** bundle (`dist/`) — there is deliberately no
  `server.url`. It does **not** load twoagree.app in a webview.

---

## What's already done in the repo

- Capacitor core + iOS platform (`ios/`), plus the `@capacitor/app`,
  `@capacitor/status-bar`, `@capacitor/splash-screen`, and
  `@capacitor-firebase/authentication` plugins. Wired into the SPM
  `Package.swift` (Capacitor 8 uses Swift Package Manager, not CocoaPods).
- `capacitor.config.ts` — `appId`, `appName`, `webDir: dist`, native auth
  configured with `skipNativeAuth` (bridge credentials into the JS SDK).
- **Native auth** (`src/lib/device/auth.ts`): on iOS, Google and Apple run
  through the OS-native sheet, then bridge into the same Firebase JS-SDK session
  the whole app already uses — so uid, Article-9 consent, host/guest seating and
  RTDB rules are identical to web. Email/Password is unchanged everywhere.
  Sign in with Apple button appears on native only.
- **Deep links** (`src/lib/device/deeplinks.ts`): a universal-link open delivers
  the invite token into the app and routes into the session. Web querystring
  path is untouched; web fallback intact for users without the app.
- **Native chrome**: safe-area insets (already in `.phone` CSS), status-bar style
  (see deviation note below), claret splash background.
- **Build stamp** (`src/components/BuildStamp.tsx`): visible in Profile → footer,
  shows the web build time + the iOS version/native build number.

### One-command native build

```bash
npm run cap:sync     # web build → cap sync ios
npm run cap:open     # open ios/App in Xcode
```

---

## Your steps (console / Xcode — Claude Code can't do these)

Do these once; then `npm run cap:sync && npm run cap:open` and build to a device.

### 1. Firebase → add the iOS app + config

Firebase console → project **`twoagreeapp`** → Add app → iOS → bundle ID
`app.twoagree`. Download **`GoogleService-Info.plist`** and drop it into the app
target in Xcode (into `ios/App/App/`, added to the **App** target). Confirm it's
the live `twoagreeapp` project, not `aligned-9f843`.

### 2. Google sign-in URL scheme (Info.plist)

Native Google sign-in returns via a URL scheme = your `REVERSED_CLIENT_ID` (it's
in `GoogleService-Info.plist`). Add to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <!-- Paste REVERSED_CLIENT_ID from GoogleService-Info.plist, e.g.: -->
      <string>com.googleusercontent.apps.XXXXXXXX-XXXXXXXX</string>
    </array>
  </dict>
</array>
```

### 3. Apple provider (Firebase + portal)

- Apple Developer portal → **Certificates, IDs & Profiles** → App ID
  `app.twoagree` → enable **Sign in with Apple** and **Associated Domains**.
- Firebase console → Authentication → **Apple** provider → configure the
  Service ID / Team ID / Key ID / key (needed for the credential to complete
  server-side).

### 4. Xcode → Signing & Capabilities

- Sign with your Apple Developer team.
- Add capability **Sign in with Apple**.
- Add capability **Associated Domains** → `applinks:twoagree.app`.

`ios/App/App/App.entitlements` in the repo already declares both — it's the
expected end state. When you add the capabilities in Xcode it wires the target to
this file (or generates matching contents).

### 5. Icons + splash (on the Mac)

```bash
npm run ios:assets
```

Generates the full icon/splash set from `assets/icon.png`, flattened on claret
`#3E1A2E` (opaque, no transparency). The staged source is 512×512 — drop the
1024×1024 brand master into `assets/icon.png` first for crisp large slots. See
`assets/README.md`.

---

## Verification checklist (brief §7) — run on the Mac

Code is in place for all of these; they can only be *exercised* in the simulator
/ on device, which needs macOS + Xcode (not available in the Linux CI where this
was built). Confirm each before TestFlight:

- [ ] `npm run cap:sync` completes clean; app launches in the iOS simulator.
- [ ] Email/Password sign-in works natively.
- [ ] Google sign-in works natively (native sheet, not a webview redirect).
- [ ] Sign in with Apple works natively and creates/links the Firebase user.
- [ ] A natively-created user writes `consents/{uid}` with version + timestamp
      exactly as web (it's the same `recordConsent` path — verify in RTDB).
- [ ] Locked RTDB rules apply identically to native sessions (no rule bypass).
- [ ] Partner-invite universal link opens the correct session in-app.
- [ ] Account deletion / delete-cascade reachable from Profile → Your data
      (Apple requires in-app deletion; the `deleteMyAccount` callable already
      backs it).
- [ ] Safe areas correct on a notched device; icon/splash render; BUILD stamp
      visible in Profile.

---

## Deliberate deviations (flag for review)

- **Status bar uses dark content, not light.** The brief (§5.2) said "light
  content on claret", picturing claret chrome behind the bar. But the running app
  sits on the light blush ground (brand Rule 2 — app screens are white, not
  claret), so light text would be invisible. `StatusBar` is set to `Style.Light`
  = *dark* text for light backgrounds. The splash stays claret with light content
  (owned by the SplashScreen plugin).
- **Apple sign-in is native-only.** It's shown on iOS (where 4.8 mandates it and
  the native flow exists), not on web, where it would need extra Apple Service
  configuration for no benefit. Web keeps Google + Email/Password.
- **Password-reset deep link.** Reset emails open Firebase's hosted reset page,
  which is a valid web fallback. Associated Domains route `twoagree.app` links
  into the app; a full in-app `oobCode` reset handler was out of scope for a
  packaging pass and isn't needed for review.

---

## Guardrail

Build and test freely. **Do not submit to the App Store** until the security /
GDPR gate is confirmed live end-to-end on the native build (locked rules, invite
function, delete-cascade, Article-9 consent) — App Review probes sensitive-data
apps hard, and the same users are already live on web.
