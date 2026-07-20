# Native app icon + splash source

`@capacitor/assets` reads this folder to generate the full iOS icon and splash
sets (brief §5.3). Run it on a **Mac** (the generator's `sharp` dependency needs
a native binary the Linux CI proxy can't fetch):

```bash
npm run ios:assets      # → npx @capacitor/assets generate --ios ...
```

That regenerates `ios/App/App/Assets.xcassets/AppIcon.appiconset` and the splash
image set, flattening onto claret `#3E1A2E` (passed via the script's
`--iconBackgroundColor` / `--splashBackgroundColor` flags).

## Files

- **`icon.png`** — currently the opaque, claret-bleeding maskable mark copied
  from `public/icon-maskable-512.png`. It is **square and fully opaque to the
  corners**, which is exactly what iOS requires (no transparency). It is only
  512×512, though — **drop the 1024×1024 master from the brand pack here** before
  a store build so the large icon slots aren't upscaled.
- **`splash.png` / `splash-dark.png`** *(optional)* — add 2732×2732 splash art if
  you want a marked splash. Without them the generator produces a solid-claret
  splash from `--splashBackgroundColor`, which matches the launch chrome. The
  mark must not animate (brand rule) — a static centred mark on claret is right.

Icons must have **no transparency** and be flattened on the brand ground; do not
redraw the mark — source it from the existing brand assets.
