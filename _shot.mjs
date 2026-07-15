import { chromium } from "playwright-core";
const OUT = process.env.OUT_DIR;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 420, height: 860 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:5199/preview.html?view=home", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/nav-0-home.png`, clip: { x: 0, y: 700, width: 420, height: 160 } });
// click Results, catch the pill mid-slide, then settled
await page.click('.bnav-item[aria-label="Results"]');
await page.waitForTimeout(120);
await page.screenshot({ path: `${OUT}/nav-1-midslide.png`, clip: { x: 0, y: 700, width: 420, height: 160 } });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/nav-2-settled.png`, clip: { x: 0, y: 700, width: 420, height: 160 } });
console.log("nav shots done");
await browser.close();
