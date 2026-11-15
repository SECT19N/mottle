# Contributing to Mottle

Thanks for your interest in contributing to Mottle! Mottle is a digital archive
of color combinations from Sanzo Wada's _A Dictionary of Color Combinations,
Vol. 1_ (360 combinations). It's a static Next.js site with a filterable gallery
and one page per combination.

## How to contribute

### 1. Fork and clone

```bash
git clone https://github.com/<your-username>/mottle.git
cd mottle
pnpm install
```

### 2. Run the dev server

```bash
pnpm dev          # http://localhost:3000
```

### 3. Make your changes

* **Data:** Color combinations live in `data/combinations.json` (edit and
  rebuild; there is no CMS).
* **UI:** Components are in `components/`, pages in `app/`.
* **Styling:** Tailwind via `globals.css` and component classes.

### 4. Lint and format

```bash
pnpm lint
pnpm format       # prettier --write
```

### 5. Build

```bash
pnpm build        # static export -> out/
```

### 6. Open a pull request

Push your branch and open a PR against `main`. Describe what you changed and
why. A maintainer will review it.

## Data format

Each combination in `data/combinations.json` looks like:

```json
{
  "id": 1,
  "type": "2-color",
  "colors": [
    { "hex": "#D96629", "name": "Vermilion" },
    { "hex": "#E8D5B2", "name": "Cream" }
  ]
}
```

`type` is one of `2-color`, `3-color`, `4-color`, or `5-color`.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.
