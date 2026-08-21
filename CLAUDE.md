# Nura Landing — working notes

Marketing site for Nura Wallet, with a blog and a dashboard behind it. Ten languages,
two right-to-left, three themes, live chain figures read in the browser.

**Two npm workspaces.** `application/` is the site; `server/` is the HTTP API, the sqlite
index and the process that serves the built bundles. Paths below are relative to whichever
half they belong to - a bare `src/` in this file means `application/src/`.

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
| Server | **`@azerothjs/http`** + `@azerothjs/kit`, `node:sqlite`, Vitest against `:memory:` |

Layout of `application/src/`:

```
components/       reusable UI  (Button, Card, Banner, CopyField, SectionHeading, icon helpers)
components/admin/ the dashboard's own pieces (login, posts list, editor, field, controls)
sections/         page sections (network, tokenomics, chain, explorer, social)
pages/            route components (home, about, blog, post, admin)
stores/           locale and theme, each a createStore singleton
lib/              content/site.ts (every fact the site states), network.ts, wallet.ts,
                  markdown.ts, overlay.ts, section-href.ts, i18n/
api.ts            the typed client - the ONLY file that crosses into server/, and with types only
routes.ts         the one route table, read by the client router, the SSR entry and the kit
styles.css        the design system
```

And of `server/src/`:

```
schemas.ts     every wire shape, declared once; the browser's types are inferred from it
app.ts         createApi/buildApp - features, guards, and the kit's page mount
blog/store.ts  sqlite: posts + post_translations, migrated by PRAGMA user_version
blog/present.ts the fallback policy - which translation a given reader is served
admin/         key.ts (timing-safe compare), sessions.ts, guard.ts
main.ts        config, connections, the listening process
```

A new chain field starts in `server/src/schemas.ts`. The browser's type is inferred from that
declaration, so the shape is decided in exactly one place and cannot drift.

There is **no** Storybook, no component library, no CSS-in-JS and no state
manager. Do not add one to solve a problem the existing pieces already solve.

### Compiler traps

- Markup comments are `{ /* ... */ }` and go **between elements**. A comment
  inside an attribute list fails to compile with `Expression expected`.
- A route or component returns exactly **one** root node; `Portal` takes exactly
  one child.
- `<For each>` needs a mutable array — a readonly tuple collapses the row type. Spread it:
  `each={ [...LOCALES] }`.
- **Component props are compiled to getters; DOM attributes are not.** Pass a plain
  expression to a component (`label={ t().admin.slug }`) and a thunk to an element
  (`class={ () => ... }`). A thunk passed as a component prop arrives as a function.
- **`value` on a `<select>` whose options come from a `<For>` does not stick** — the options
  do not exist at the moment it is applied, and the control renders blank. Put `selected` on
  the option instead. Inline options are fine, which is what makes this easy to miss.

## The blog and the dashboard

Reader-facing pages are `/blog` and `/blog/:slug`; the dashboard is `/admin`, reached by
typing the path. Nothing links to it, and `robots.txt` disallows it - the key is the guard,
the disallow is only a request to honest crawlers.

**One post, many translations, with a fallback.** A post carries any subset of the ten
languages plus a `defaultLocale`. A reader whose language is missing gets the fallback and is
told so, with the languages the post *does* have offered beside it. `server/src/blog/present.ts`
is the whole policy: the reader's language, else the post's default, else anything it holds.

- The **fallback language must be one the post has.** The editor only offers languages present,
  and the server refuses to delete the last one. A fallback naming a translation that does not
  exist is the single setting that breaks every reader at once.
- `POST_LOCALES` and the site's `LOCALES` must stay in step; `tests/blog-locales.spec.ts`
  fails if they drift.
- Bodies are markdown in the strict subset `lib/markdown.ts` parses into a **tree** - never
  `innerHTML`. Headings level against the document's own shallowest heading, so `#`/`##` and
  `##`/`###` both come out h2/h3 rather than skipping a level under the page's h1.

**Rendering.** `/blog` and `/blog/:slug` are `render: 'server'`, `/admin` is `render: 'client'`,
and the landing pages stay `'client'`. The blog server-renders the FRAME only - beta.2 splices
just the root div and the loader handoff into the shell, so `<title>` and meta stay as
index.html declared them, and a loader gets no request headers with which to resolve a
reader's language. Real per-post SSR wants the locale in the path; see the comment in
`routes.ts` before assuming otherwise.

**Admin auth.** A single key, compared with `timingSafeEqual` over SHA-256 digests, exchanged
for an httpOnly `__Host-` cookie with `SameSite=Strict`. Sessions are stored as digests, never
as tokens. `npm run admin:key` generates one. Production refuses to boot without `ADMIN_KEY`;
development runs with the dashboard disabled rather than unlocked.

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
survives RTL without a second rule.

**Touch targets are enforced globally for coarse pointers in `styles.css`; do not
re-specify them per component.** The rule gives every control 44px under a thumb, so a
component sizing itself by viewport is answering a question the sheet already answered —
and a browser reporting a *fine* pointer, which is what Playwright does by default, will
mislead you into adding one. The single exception is the TVL breakdown toggle in
`network.section.azeroth`, which was 20px and so failed WCAG 2.5.8's 24px floor for a
mouse as well; it is sized locally and says why. Every section shares `max-w-4xl`, so the
page has one left edge as you scroll.

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
- **Overlays go through `lib/overlay.ts`.** The drawer and the language dialog are both
  full-screen panels over a scrim, and one helper gives them all four obligations: Escape
  closes, the page behind stops scrolling, focus moves *into* the panel, and focus returns
  to whatever opened it. The focus half matters most because both mount through a `Portal`
  at the end of `document.body` — without it, Tab from the trigger walks the entire page
  underneath the scrim before reaching the panel covering it. The trap wraps at both ends.
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
npm test               # both halves
npm run test:shuffle   # both halves, shuffled - the isolation gate
npm run test:server    # the api and the store alone
npm run coverage       # the browser half, thresholds enforced in vite.config.ts
npm run test:unit          # wallet, stores, site constants, i18n, network
npm run test:integration   # sections, header, add-chain, app shell
npm run test:fuzz          # seeded property runs over the parsers
npm run test:security      # link safety, upstream failures, chain params
npm run test:i18n          # string tables, direction, pre-paint script
```

Use the framework that is here. Do not add a second test runner. Every spec stubs `fetch`,
and the server suite runs against `:memory:` sqlite with a stubbed chain gateway — nothing
binds a port or reaches the network, so a red build is always a real change.

**Both halves lean on module-level singletons, so `npm run test:shuffle` is a gate**: a test
that only passes in declaration order will fail for somebody else at random. Run it from the
workspace scripts, never a bare `npx vitest` — there is no vitest config at the repository
root, and the browser half needs its happy-dom environment and its setup file.

A component that renders the `Header` needs a router in scope: it uses `<Link>` and reads the
current path. `tests/header.spec.ts` shows the shape — `RouterProvider({ router, children:
() => Header({}) })`, with the children as a **thunk**, since an eager child is built before
the provider publishes its context.

## Performance

Measure before changing; an optimisation with no before/after number is a guess.

- The landing page is one document; sections are anchors, not routes. `/about`, `/blog` and
  `/admin` are real routes, so a link to a SECTION from one of them has to be rooted -
  `lib/section-href.ts` returns a bare `#chain` at home and `/#chain` everywhere else, and
  a plain `<a href="/#chain">` on the landing page itself would reload the page it is
  already showing.
- The server caches nothing the browser needs to re-cache. Repeated node reads are memoised
  server-side; do not add a second layer in the browser without a measurement.
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
