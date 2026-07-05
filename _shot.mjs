// Screenshot harness (dev-only, not committed): renders preview views.
import { chromium } from "playwright-core";

const OUT = process.env.OUT_DIR;
const base = "http://localhost:5199/preview.html";
const shots = [
  { view: "auth", wait: 1600 },
  { view: "home", wait: 1600 },
  { view: "decks", wait: 1400 },
  { view: "results", wait: 1400 },
  { view: "reveal", wait: 2600, name: "reveal-levelup" },
  { view: "reveal", wait: 4600, name: "reveal-levelup-late" },
  { view: "answers", wait: 1800 },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({
  viewport: { width: 420, height: 860 },
  deviceScaleFactor: 2,
});
for (const s of shots) {
  await page.goto(`${base}?view=${s.view}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/${s.name ?? s.view}.png` });
  console.log("shot", s.name ?? s.view);
}
await browser.close();
