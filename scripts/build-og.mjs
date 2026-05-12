import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, 'og-image.html');
const outPath = path.resolve(__dirname, '..', 'public', 'og-image.jpg');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
});
const page = await context.newPage();
await page.goto('file://' + htmlPath);
await page.waitForLoadState('networkidle');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.locator('.og').screenshot({ path: outPath, type: 'jpeg', quality: 92 });
await browser.close();
console.log(`Saved ${outPath}`);
