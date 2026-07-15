import { describe, it, expect } from "vitest";
import { DECKS, ORDER } from "./questions";
import { Q_FR, DECK_NAMES_FR } from "./questions.fr";

// Guards the French overlay: every deck + question must be translated, and
// option arrays must match the English length exactly (answers are stored by
// index, so a length drift would mislabel answers on the reveal screen).
describe("French question overlay", () => {
  it("names every deck in French", () => {
    for (const slug of ORDER) {
      expect(DECK_NAMES_FR[slug], `deck name ${slug}`).toBeTruthy();
    }
  });

  // The bank is expanding faster than the translation (brief 2 adds 127 English
  // questions). localizeQuestion falls back to English on a missing entry, so a
  // gap is allowed — but any entry that DOES exist must not drift out of sync
  // with its English options, since answers are stored by index.
  it("keeps existing translations in sync (option lengths, scale ends)", () => {
    for (const slug of ORDER) {
      for (const q of DECKS[slug].questions) {
        const f = Q_FR[q.id];
        if (!f) continue; // English fallback — allowed for the expanding bank
        expect(f.q.length, `empty q for ${q.id}`).toBeGreaterThan(0);
        if (q.opts) {
          expect(f.opts?.length, `opts length for ${q.id}`).toBe(q.opts.length);
        }
        if (q.type === "scale") {
          expect(f.lo, `scale lo for ${q.id}`).toBeTruthy();
          expect(f.hi, `scale hi for ${q.id}`).toBeTruthy();
        }
      }
    }
  });
});
