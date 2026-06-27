# Plenum — Launch Site

The product/marketing site for **Plenum**, *a digital operating environment for
statecraft simulation*, with the brand film authored in **Remotion** and embedded
live in the hero.

It is a self-contained Vite + React + TypeScript app. It does **not** touch the
simulation runtime that lives at the repository root.

```
site/
├── index.html
├── src/
│   ├── brand.ts              # shared brand tokens (palette, type, video config)
│   ├── index.css             # design-system variables + primitives
│   ├── app.css               # section styles
│   ├── App.tsx               # page composition (all sections)
│   ├── main.tsx              # React entry
│   ├── components/           # Nav, HeroSphere (canvas), icons
│   ├── sections/Hero.tsx     # hero + embedded Remotion <Player>
│   └── remotion/
│       ├── index.ts          # registerRoot — entry for the Remotion CLI
│       ├── Root.tsx          # <Composition> registration
│       ├── BrandFilm.tsx     # the 14s brand film
│       └── elements/ParticleSphere.tsx
└── public/brand/             # logos + scenario poster
```

## Develop

```bash
cd site
npm install
npm run dev          # http://localhost:5180
```

## Build the site

```bash
npm run build        # -> site/dist  (static, deploy anywhere)
npm run preview
```

## The brand film (Remotion)

The brand film is **not embedded on the site** — it lives as a rendered file in
[`out/plenum-brand-film.mp4`](out/plenum-brand-film.mp4) (1920×1080, 30fps) for
launch, conference, and social use. The Remotion source stays in
[`src/remotion/`](src/remotion) so it can be edited and re-rendered anytime:

```bash
npm run video:studio   # open the Remotion Studio to edit the film visually
npm run video:render   # -> site/out/plenum-brand-film.mp4  (1920x1080, 30fps)
npm run video:still    # -> site/out/plenum-poster.png      (a single key frame)
```

> The first render downloads a headless Chromium (~100 MB) once.

## Brand system

| Token            | Value      | Use                                   |
| ---------------- | ---------- | ------------------------------------- |
| W&M Green        | `#115740`  | primary institutional accent          |
| W&M Gold         | `#b9975b`  | accent, particle sphere, CTAs         |
| Chamber ink      | `#0a0f0d`  | background ground                     |
| Display / serif  | Source Serif 4 | wordmark, headlines              |
| UI / sans        | Inter      | body, navigation, buttons             |
| Mono             | JetBrains Mono | kickers, labels, the operating arc |

**The operating arc** — *Convene · Deliberate · Decide · Debrief* — anchors the
identity and drives the brand film and the "How it works" section.

All tokens live in [`src/brand.ts`](src/brand.ts) (TS, shared with the film) and
[`src/index.css`](src/index.css) (CSS variables). Change them in one place and
the page and the video stay in sync.

## Deploy (GitHub Pages)

This site is published to GitHub Pages by
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml).
It builds `site/` and deploys the static output — no backend or secrets.

**One-time setup:** in the repo, open **Settings → Pages** and set
**Build and deployment → Source** to **GitHub Actions**.

After that, any push to `main` that touches `site/**` (or the workflow) builds and
deploys automatically. You can also trigger it manually from the **Actions** tab
("Deploy GitHub Pages" → *Run workflow*).

The site is served at **https://seth-arc.github.io/Plenum/**, so the production
build uses base path `/Plenum/`. All `/public` assets must be referenced through
[`src/lib/asset.ts`](src/lib/asset.ts) so they resolve under that subpath.

### Custom domain

Set a domain in **Settings → Pages**, add a `site/public/CNAME` file containing
the domain, and build with `VITE_BASE_PATH=/ npm run build` (base path becomes
`/`).

### Other hosts

`npm run build` produces a fully static `site/dist` you can drop on Netlify,
Vercel, S3, etc. For a root-domain host, build with `VITE_BASE_PATH=/`.
