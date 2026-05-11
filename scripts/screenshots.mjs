/**
 * scripts/screenshots.mjs
 *
 * After `npm run build`, this script:
 *   1. Serves dist/ on a local port
 *   2. Takes full-page screenshots of every chapter + home
 *   3. Saves them to dist/screenshots/
 *
 * Run: node scripts/screenshots.mjs
 */

import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

const DIST = "dist";
const OUT = join(DIST, "screenshots");
const PORT = 4099;
// Base path is "/" (root). BASE_PATH override kept for ad-hoc local runs.
const BASE = (process.env.BASE_PATH ?? "/").replace(/\/$/, "");

const PAGES = [
  { name: "home", path: "/" },
  { name: "sydney", path: "/sydney/" },
  { name: "queensland", path: "/queensland/" },
  { name: "boonah", path: "/boonah/" },
  { name: "yulong", path: "/yulong/" },
  { name: "meili", path: "/meili/" },
];

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function serveDist() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let url = req.url.replace(BASE, "") || "/";
      if (url.endsWith("/")) url += "index.html";

      const filePath = join(DIST, url);
      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        // try with .html
        try {
          const data = readFileSync(filePath + ".html");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end("Not found");
        }
      }
    });
    server.listen(PORT, () => {
      console.log(`Serving dist/ on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function takeScreenshots() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

  const server = await serveDist();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const { name, path } of PAGES) {
    const url = `http://localhost:${PORT}${BASE}${path}`;
    console.log(`  Capturing ${name} <- ${url}`);

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for webfonts to finish loading.
    await page.evaluate(() => document.fonts.ready);

    // Disable all transitions/animations so reveal + stroke fade-ins
    // land in their completed state instead of mid-animation.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          animation-duration: 0s !important;
          animation-delay: 0s !important;
        }
      `,
    });

    // Force every IntersectionObserver-driven .reveal element into its
    // visible state — fullPage screenshots don't actually scroll, so
    // observers below the initial viewport never fire on their own.
    await page.evaluate(() => {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
    });

    // Walk down the page once so any lazy-loaded <img> hits the network,
    // then scroll back to top before we capture.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    await page.screenshot({
      path: join(OUT, `${name}.png`),
      fullPage: true,
    });
    await page.close();
  }

  await browser.close();
  server.close();
  console.log(`Done. Screenshots saved to ${OUT}/`);
}

takeScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
