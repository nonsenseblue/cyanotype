# cyanotype

A small multilingual photo magazine. EN / 日本語 / 中文.

Live: <https://cyanotype3030.vercel.app/>

> *We live in a handful of moments.*

## Issues

- **Vol.01 · China**: Yulong Snow Mountain (incl. Houniao Wan /
  Migratory Bird Bay), Shangri-La, Meili Snow Mountain
- **Vol.02 · Australia**: Sydney, Brisbane & Gold Coast (Lone Pine),
  Boonah

## Stack

- **React 18 + TypeScript + Vite**
- **React Router 6** — `/`, `/about`, `/settings`, `/:chapterKey/`
- **vite-react-ssg** — every route is pre-rendered to a static
  `index.html` at build time, so the page is readable (and crawlable)
  before any JS runs
- **i18n** — single JSON tree, language stored in `localStorage`
- Hand-drawn SVG marks animated with `stroke-dashoffset`
- Mini calendar with hover circles
- About page with hand-drawn cat / moon / stars around a portrait
- Photo resizing + OG image generation via small Python scripts
  (Pillow)

## Run

```bash
npm install
npm run dev      # http://localhost:4030
```

## Build

```bash
npm run build    # vite-react-ssg → dist/, then about.html / settings.html
                 # are moved into folders so they are served at
                 # /about/ and /settings/ cleanly
npm run preview  # serve dist/
```

`vite.config.ts` keeps `base: '/'` because the site is deployed at the
domain root on Vercel.

The build emits one `index.html` per route:

```
dist/
  index.html               home (current issue + calendar + chapter grid)
  about/index.html         portrait + hand-drawn marks
  settings/index.html      language / display settings
  yulong/index.html        Vol.01 — Yulong Snow Mountain
  shangrila/index.html     Vol.01 — Shangri-La
  meili/index.html         Vol.01 — Meili Snow Mountain
  sydney/index.html        Vol.02 — Sydney
  queensland/index.html    Vol.02 — Brisbane & Gold Coast
  boonah/index.html        Vol.02 — Boonah
```

Each file already contains the chapter title, lede, photos, and
guardian marks; React then hydrates on top.

## Adding a new roll

1. Drop originals into `public/photos/YYYY-MM-DD-slug/originals/`
   (the `originals/` folder is gitignored — RAWs stay local)
2. Run the resizer:

   ```bash
   pip install -r requirements.txt
   python scripts/resize_photos.py
   # or one roll only:
   python scripts/resize_photos.py --roll 2026-05-04-boonah
   ```

   Generates `large/*.jpg` (long edge 1600px) and `thumbs/*.jpg`
   (long edge 600px).
3. Create `src/data/rolls/YYYY-MM-DD-slug.json` (copy an existing
   one; each text field is `{ en, jp, cn }`).
4. Register it in `src/lib/days.ts` (`DAYS_BY_ID`).
5. Reference it from a chapter in `src/data/issue.json` under
   `chapters[].days`.

## Regenerating the OG image

```bash
python scripts/make_og.py
```

Outputs `public/og-image.jpg` (1200×630) — deep cyanotype-blue
canvas with paper-white wordmark, hand-drawn camera, moon, stars.

## Project layout

All imports use the `@/` alias (configured in `vite.config.ts` +
`tsconfig.json`) so moving files never breaks paths.

```
src/
  main.tsx                       ViteReactSSG entry + CSS imports
  routes.tsx                     route table + getStaticPaths
  App.tsx                        layout: <SiteHeader> + <Outlet> + <Lightbox>
  pages/
    HomePage.tsx                 home: tagline, hero marks, calendar, chapter grid
    AboutPage.tsx                portrait + hand-drawn cat / moon / stars
    ChapterRoute.tsx             chapter masthead + day sections + viewer + next-chapter
    SettingsPage.tsx             language + display settings
  components/
    layout/
      SiteHeader.tsx             logo + lang switcher + hamburger drawer
      ColophonRow.tsx            shared footer row (issue colophon + settings link)
    viewer/
      Viewer.tsx                 photo stage + thumbs + previous/next
      Lightbox.tsx               fullscreen photo modal with swipe nav
      Essay.tsx                  paragraphs (lede / body / dropline)
      Calendar.tsx               mini calendar with hover circles
    decor/
      HandRule.tsx               hand-drawn horizontal rule
      DotsRule.tsx               dot separator
      ChapterMarks.tsx           per-chapter "guardian" SVG icons
      Colophon.tsx               film / camera credits line
    cursor/
      CustomCursor.tsx           PC-only custom cursor
      OpeningSequence.tsx        first-visit animation
      cursorOptions.tsx          cursor shape definitions
  contexts/
    LanguageContext.tsx           EN/JP/CN provider + useLang() + useT()
    CursorContext.tsx             cursor style provider
  hooks/
    useLightbox.ts               open/close fullscreen image
    useReveal.ts                 IntersectionObserver → .is-visible
  lib/
    photoUrl.ts                  R2 base URL + photo path resolver
    days.ts                      DAYS_BY_ID — roll-id → JSON map
  data/
    issue.json                   brand, chapters, ui strings, calendar marks
    rolls/*.json                 one file per shooting day
  styles/
    base.css                     tokens, reset, film frames, lightbox
    layout/
      header.css                 site header, nav, burger, drawer
      lang.css                   language switcher
    pages/
      home.css                   hero, vol sections, chapter grid
      about.css                  about page
      chapter.css                chapter page, marks, next-chapter nav
    components/
      viewer.css                 viewer, calendar, colophon
      cursor.css                 custom cursor, settings, opening sequence
      content.css                essay typography
public/
  favicon.svg
  og-image.jpg                   generated by scripts/make_og.py
  photos/{date-slug}/{originals,large,thumbs}/*.jpg
  photos/about/profile.jpg       about page portrait
scripts/
  resize_photos.py               Pillow originals → large/thumbs
  upload_photos.mjs              push large/thumbs to R2
  make_og.py                     Pillow OG card generator
```

## i18n model

Every translatable field is a `{ en, jp, cn }` object. `useT()`
returns a translator that reads `lang` from context:

```ts
const t = useT();
t(chapter.title);      // → "Sydney" | "シドニー" | "悉尼"
```

Switching language updates `<html lang>` so per-language CSS rules
(`html[lang="ja"] ...`) kick in for font stacks and type sizes.

Names that have an established English form use it (e.g. *Migratory
Bird Bay* for 鴻雁湾 — verified against People's Daily / CGTN, not a
direct pinyin transliteration).

## Deploy

The site is hosted on **Vercel** at
<https://cyanotype3030.vercel.app/>. Pushes to `main` auto-deploy via
Vercel's GitHub integration — no in-repo workflow file is required.

`vercel.json` sets:

```jsonc
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "trailingSlash": true
}
```

(GitHub Pages was used during early development; the workflow has been
removed and the Pages site is unpublished.)
