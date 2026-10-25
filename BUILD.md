# Build

Vercel does **not** build this site. It serves the files committed to the
repo exactly as they are. Everything the browser loads that is generated
(`index.html`, `dist/`, the critical CSS inlined in `index.html`) must be
rebuilt and committed together with the source change that produced it.

## After any change to CSS, JS, the template or a partial

```bash
npm run build:critical
```

Then commit the sources **and** the regenerated outputs. It needs Google
Chrome (set `CHROME_PATH` if it is not in the default location) and the local
preview server running on port 4180 (`node tools/preview-server.js . 4180`).

The pre-commit hook runs `npm run check:build` and blocks the commit if any
output is stale, with the message *"Run `npm run build:critical` before
committing."*

## Scripts

| Script | What it does | Needs Chrome |
| --- | --- | --- |
| `npm run build` | `build-html.js` assembles `index.html` from `src/template.html` + `src/partials/`; Tailwind writes `dist/output.css`; `build-assets.js` merges every stylesheet in `<head>` (in cascade order) into `dist/site.min.css`, inlines `src/critical.css`, loads the full CSS and Google Fonts without blocking render, and minifies `js/*.js` into `dist/js/*.min.js`. | No |
| `npm run build:critical` | `build`, then `build-critical.js` regenerates `src/critical.css` (rules for the header, hero and fixed elements, AR + EN, 375/768/1440), then `build` again to inline it. | Yes |
| `npm run check:build` | Rebuilds into a temp folder and compares with the committed outputs; also checks that `src/critical.css` was generated from the current CSS. Exits non-zero on any mismatch. | No |
| `npm run dev` / `npm run html` | Quick local preview: rebuilds `index.html` (and Tailwind in watch mode) **without** the asset step. Run `npm run build:critical` before committing. | No |
| `npm install` | `prepare` sets `git config core.hooksPath .githooks` so the pre-commit check runs. | No |

## Safety rails

- `npm run build` only *reads* `src/critical.css`. If the file is missing or
  under 10KB it stops with an error instead of shipping a page without its
  first-paint styles (`ALLOW_NO_CRITICAL=1` builds with a plain blocking
  stylesheet instead).
- `build-critical.js` refuses to write a result with fewer than 150 selectors
  or under 20KB (a broken page load matches almost nothing), and writes via a
  temp file + rename, so an interrupted run never leaves a partial file.
- Outputs and hashes are computed with line endings normalised, so a Windows
  checkout (`core.autocrlf=true`) and a Linux one produce the same files.
