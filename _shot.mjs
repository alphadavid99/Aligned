import { chromium } from "playwright-core";
const OUT = process.env.OUT_DIR;
const shots = [
  { view: "home", wait: 1600 },
  { view: "reveal", wait: 4600, name: "reveal-late" },
  { view: "answers", wait: 1800 },
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 420, height: 860 }, deviceScaleFactor: 2 });
for (const s of shots) {
  await page.goto(`http://localhost:5199/preview.html?view=${s.view}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(s.wait);
  await page.screenshot({ path: `${OUT}/claret-${s.name ?? s.view}.png` });
  console.log("shot", s.name ?? s.view);
}
await browser.close();
