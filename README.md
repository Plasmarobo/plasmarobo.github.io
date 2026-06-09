# Millibyte Studios — Portfolio

Personal portfolio for **Austen D. Bartels** — embedded systems engineer (BSEE/BSCE).
A single-page site showcasing open hardware and firmware projects from the
[@Plasmarobo](https://github.com/Plasmarobo) and
[@millibyte-products](https://github.com/millibyte-products) workshops.

Live at **[austenbartels.dev](https://austenbartels.dev)**.

## Stack

Pure static HTML / CSS / vanilla JavaScript — no build step, no framework.
Served directly by GitHub Pages (`.nojekyll` bypasses the Jekyll build).

- **Live GitHub feed** — the repository grid is fetched client-side from the
  public GitHub REST API at page load, so it stays current with no backend.
- **Ambient canvas background** — a lightweight "digital rain" effect that
  honors `prefers-reduced-motion`.
- **Project detail page** — per-project write-ups with specs, tags, and an
  image-gallery lightbox.

## Structure

```
index.html        Single-page portfolio (hero, about, featured, live repos, consulting, contact)
projects.html     Detailed project write-ups with galleries + lightbox
blog.html         Redirect → index.html#featured (legacy URL)
consulting.html   Redirect → index.html#consulting (legacy URL)
css/style.css     Design system (dark / mono aesthetic)
js/visual.js      Background animation
js/github.js      Live GitHub repository grid
js/site.js        Nav state, mobile menu, active-section highlighting
js/projects.js    Gallery lightbox
img/ , assets/    Headshot and project photography
CNAME             Custom domain
.nojekyll         Serve files as-is (skip Jekyll)
```

## Develop locally

Any static file server works. For example:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

or, using the dev dependency in `package.json`:

```bash
npx http-server -p 8000 -c-1
```

## Deploy

Hosted on GitHub Pages — pushing to the deployment branch publishes the site as-is.

## About the author

Austen Bartels is a tinkerer, explorer, game-player, and creator who can't keep
away from electronics and microprocessors. He designs PCBs to break out new and
interesting parts, then builds new and interesting systems from them — favoring
FOSS tools and resource-constrained microcontrollers where every byte counts.

📫 [consulting@millibyte.io](mailto:consulting@millibyte.io)
