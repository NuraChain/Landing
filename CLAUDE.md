# Nura Landing — working notes

Marketing site for Nura Wallet. Ten languages, two right-to-left, three themes,
live chain figures read in the browser.

Everything below describes what is actually in this repository. If a rule here
disagrees with the code, the code is the source of truth — fix the note.

## Frontend architecture

| Piece | What it is |
| --- | --- |
| Framework | **AzerothJS 2.0.0-beta.2** — not React, Vue or Svelte |
| Components | `.azeroth` files, compiler syntax, no JSX and no hooks |
| Reactivity | `state` / `derived` / `effect` / `cleanup` blocks; `createSignal` / `createStore` from `azerothjs` |
| Language | TypeScript, strict |
| Styling | **Tailwind CSS v4**, CSS-first config in `src/styles.css` (`@theme inline`). There is no `tailwind.config.js` |
| Build | Vite 8 |
| Tests | Vitest 4 + happy-dom, through the real compiler |
| Browser QA | Playwright + axe, via `npm run qa:visual` |

Layout of `src/`:

```
components/   reusable UI  (Button, Card, Banner, CopyField, SectionHeading, icon helpers)
sections/     page sections (network, tokenomics, chain, explorer, social)
pages/        route components
stores/       locale and theme, each a createStore singleton
lib/          content/site.ts (every fact the site states), network.ts, wallet.ts, i18n/
styles.css    the design system
```

There is **no** Storybook, no component library, no CSS-in-JS and no state
manager. Do not add one to solve a problem the existing pieces already solve.

### Compiler traps

- Markup comments are `{ /* ... */ }` and go **between elements**. A comment
  inside an attribute list fails to compile with `Expression expected`.
- A route or component returns exactly **one** root node; `Portal` takes exactly
  one child.
- `<For each>` needs a mutable array — a readonly tuple collapses the row type.

## Design system

All tokens live at the top of `src/styles.css`, declared per `[data-theme]` for
**three** themes: `dark`, `light`, `contrast`. Tailwind reads them through
`@theme inline`.

- Colour: `--bg`, `--surface`, `--elevated`, `--ink`, `--muted`, `--faint`,
  `--line`, `--line-strong`, `--accent`, `--accent-ink`, `--warm`, `--danger`.
- Type: `--font-sans`, `--font-mono` → `var(--mono)`, which is redefined for
  `:lang(fa)` and `:lang(ar)` so Persian digits have a face that carries them.
- Also tokenised: radius, shadow, glow, scrollbar, and the `--brand-*` platform
  marks.

Rules:

1. **Never put a raw hex in a component.** Add a token, to all three themes.
2. A new colour must be **contrast-measured**, not eyeballed. Floor is WCAG AA:
   4.5:1 normal text, 3:1 large text and non-text indicators.
   `--faint` shipped at 3.56:1 and was raised to clear 4.5:1 on every surface —
   do not regress it.
3. `@theme inline` **inlines** a token's literal value into the utility. If a
   token must vary at runtime, point it at another variable
   (`--font-mono: var(--mono)`) — the colour tokens already work this way.

### Component rules

```
existing component -> reuse -> extend -> create new only if justified
```

A "new component" that differs from an existing one by a class or two is a prop,
not a component. Check `src/components/` before writing UI.

## Responsive

Target viewports, the ones `npm run qa:visual` drives:

```
desktop  1440 x 900
tablet   1024 x 768
mobile    390 x 844
```

Prefer `gap-*` over margins on children — `gap` is direction-neutral, so it
survives RTL without a second rule. Touch targets are enforced globally for
coarse pointers in `styles.css`; do not re-specify them per component.

## RTL / LTR

Two RTL locales ship: `fa` and `ar`. Load the **`i18n-rtl-ltr`** skill before
layout work.

- **One authority for direction.** `src/stores/locale.ts` stamps `dir` and `lang`
  on `<html>`, and the pre-paint script in `index.html` does the same before
  first paint. Their three lists (locales, RTL set, themes) must stay in step —
  `tests/prepaint.spec.ts` fails if they drift.
- **Logical utilities only**: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`/`text-end`, `border-s`/`border-e`. A physical `ml-`, `pr-`,
  `left-`, `text-right` is a defect unless commented as deliberately physical.
  The centred language modal (`left-1/2` + `-translate-x-1/2`) is the one
  standing exception, and it is commented.
- **Pin Latin/numeric runs** — URLs, wallet addresses, hashes, chain ids,
  version strings — with `<bdi dir="ltr">`. Put the pin on an **inner** element,
  never on the block carrying `text-start`: `start` resolves against the
  element's own direction, so an `ltr` block inside an RTL row aligns to the
  opposite edge from its label.
- **Every number goes through `Intl.NumberFormat(locale())`.** No hand
  formatting, including years.
- **Mirror only direction-of-travel icons.** Outbound `↗` markers mirror with
  `rtl:-scale-x-100`; the hero's onward arrow rotates. Brand marks, logos and
  flags never mirror.

## Accessibility

Load the **`accessibility-audit`** skill for review work.

- **Native semantics over ARIA.** Do not add ARIA speculatively — most ARIA in
  the wild makes things worse. A `<button>` beats `<div role="button">`.
- Icon-only controls carry `aria-label`; the icons themselves are `aria-hidden`.
- One `h1` per document (the hero). Sections use `h2` via `SectionHeading`.
- The skip link is the first tab stop and targets `#main`.
- Escape closes the drawer, the language modal and the TVL breakdown, and each
  restores the page's previous `overflow` rather than clearing it.
- `prefers-reduced-motion` is honoured globally in `styles.css`.

## Visual QA workflow

```bash
npm run dev                                     # note the port; 4000 may be taken
npm run qa:visual -- --url http://localhost:<port>/
```

For every scenario (3 viewports x 2 directions) it asserts the document
direction flipped, detects horizontal scroll and elements escaping the viewport
(ignoring anything an ancestor legitimately clips), runs the axe WCAG 2.1 AA
rule set, and writes a screenshot plus `report.json` to `artifacts/visual-qa/`.

Warnings do not fail the run; a real regression exits non-zero.

**Then look at the screenshots.** The assertions catch overflow and contrast.
They do not catch a heading colliding with an icon or Persian text wrapping
badly — only your eyes do.

## Testing

```bash
npm test               # everything (239 tests)
npm run coverage       # thresholds enforced in vite.config.ts
npm run test:unit          # wallet, stores, site constants, i18n, network
npm run test:integration   # sections, header, add-chain, app shell
npm run test:fuzz          # seeded property runs over the parsers
npm run test:security      # link safety, upstream failures, chain params
npm run test:i18n          # string tables, direction, pre-paint script
```

Use the framework that is here. Do not add a second test runner. Every spec
stubs `fetch` — no test touches the network, so a red build is always a real
change.

## Performance

Measure before changing; an optimisation with no before/after number is a guess.

- The site is static, one document, no router hops between sections.
- Fonts are self-hosted with per-script `unicode-range` subsets, so a Latin
  visitor never downloads the Arabic file.
- Images carry intrinsic `width`/`height` so they cannot shift layout.
- Animate `transform` and `opacity`. Animating `width`, `height`, `top` or
  `left` forces layout every frame.
- Live figures are memoised for 60s per source in `lib/network.ts`; concurrent
  callers join one request.

## Agents

- **`frontend-ui-ux`** — implements UI changes, verifies in a browser.
- **`frontend-reviewer`** — reviews, read-only by default.

## MCP

`context7` (live library docs), `filesystem` (scoped to this project only) and
`playwright` are configured. Prefer Context7 over memory for Tailwind, Vite,
TypeScript and Playwright specifics — this repo runs Tailwind v4 and Vite 8,
both recent enough that training data is often wrong about them.
