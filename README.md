# Mottle

A digital archive of color combinations from Sanzo Wada's _A Dictionary of Color Combinations, Vol. 1_ (360 combinations).
Static Next.js site: a filterable gallery plus one page per combination (`/combo/1` … `/combo/360`).

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm format       # prettier --write
pnpm build        # static export -> out/
```

Data lives in `data/combinations.json` (edit it and rebuild; there is no CMS).

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. In the repo: **Settings -> Pages -> Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and publishes.

The workflow sets the base path automatically: `https://<user>.github.io/<repo>/`,
or the root if the repo is named `<user>.github.io`. For a custom domain, set
`NEXT_PUBLIC_SITE_URL=https://your.domain` and leave `NEXT_PUBLIC_BASE_PATH` empty
(edit the two `export` lines in the workflow).

Build locally the way Pages does:

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io NEXT_PUBLIC_BASE_PATH=/<repo> pnpm build
```
