// defineConfig comes from vitest/config (not vite) so the `test` block below
// type-checks — tsc -b compiles this file as part of the build.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// A human-readable stamp baked at build time so any given bundle — web or the
// TestFlight build wrapping it — is identifiable by sight (brief §6). The native
// build number is appended at runtime from @capacitor/app (see BuildStamp.tsx).
const BUILD_STAMP =
  new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_STAMP__: JSON.stringify(BUILD_STAMP),
  },
  test: {
    // rules.test.ts needs the RTDB emulator, so it is not part of the default
    // `npm test` (which must stay runnable anywhere, including CI with no
    // emulator). Run it with `npm run test:rules`, which starts one for you.
    // functions/ is a separate package with its own runner (npm --prefix
    // functions test) — keep the app suite from reaching into it.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/rules.test.ts',
      'functions/**',
    ],
  },
})
