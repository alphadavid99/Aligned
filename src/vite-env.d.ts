/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_USE_EMULATORS?: string;
  // Feature flag: show the Path tab. Off unless "true" so the feature ships dark
  // (the generatePath function is deployed manually — see docs/DEPLOY.md).
  readonly VITE_PATH_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Build stamp baked in by Vite's `define` (see vite.config.ts, brief §6).
declare const __BUILD_STAMP__: string;
