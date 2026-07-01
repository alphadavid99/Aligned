# Deploy & operations

## Manual deploy (works today)

From the project root, with the Firebase CLI logged in (`firebase login`):

```bash
npm run build
firebase deploy --only hosting                 # web app
firebase deploy --only database                # security rules
firebase deploy --only functions               # Cloud Functions
# or everything at once:
firebase deploy
```

Live site: https://aligned-9f843.web.app

## Automated deploy (GitHub Actions)

`.github/workflows/ci.yml` runs lint + tests + build on every push/PR — active now, no setup.

`.github/workflows/deploy.yml` auto-deploys **Hosting** on push to `main`, but is
**dormant** until you complete this one-time setup:

1. **Service account secret.** Easiest path — run once locally:
   ```bash
   firebase init hosting:github
   ```
   It creates a service account and stores the `FIREBASE_SERVICE_ACCOUNT` secret
   in the repo for you. (Or add a "Firebase Hosting Admin" service-account JSON
   key manually as the repo secret `FIREBASE_SERVICE_ACCOUNT`.)
2. **Public web config as repo Variables** (Settings → Secrets and variables →
   Actions → **Variables**): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
   `VITE_FIREBASE_APP_ID`. (These are public by design — safe as variables.)
3. **Enable it:** add repo Variable `DEPLOY_ENABLED = true`.

Functions + rules stay manual (they change rarely and deploying them from CI
needs broader IAM). Deploy them with `firebase deploy --only functions,database`.

## Still Dave's calls (Phase 4 launch polish)

These need your accounts/decisions — none are code I can finish blind:

- **Custom domain.** Firebase Console → Hosting → Add custom domain. Needs a
  domain you own + a DNS record. Point me at the domain and I'll wire it.
- **Analytics (privacy-respecting).** Recommend **Plausible** or **Umami**
  (cookieless, GDPR-friendly) over Google Analytics, given we hold
  special-category data. Both need an account + a script snippet.
- **Error monitoring.** Recommend **Sentry** (generous free tier). Needs a
  project DSN; then a small `initSentry()` behind an env var.
- **Staging project.** Optional: a second Firebase project (e.g.
  `aligned-staging`) as a `.firebaserc` alias for preview before prod.

## Deferred: Phase 5 (native)

Per CLAUDE.md, Capacitor packaging is intentionally **not** started — it waits
until web retention proves out. When ready it's a packaging step (wrap this
build, swap the `lib/device/*` adapters to native plugins), not a rewrite.
