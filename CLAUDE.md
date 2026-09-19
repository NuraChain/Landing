# Nura Landing — working notes

Marketing site for Nura Wallet, with a blog behind it. Ten languages,
two right-to-left, two themes, live chain figures read in the browser.

**Two npm workspaces.** `application/` is the site; `server/` is the HTTP API, the blog content
and the process that serves the built bundles. Paths below are relative to whichever
half they belong to - a bare `src/` in this file means `application/src/`.

**One process, one origin — in development as well as production.** The root manifest declares
`"azeroth": { "dev": "server" }`, so `npm run dev` starts the server half ALONE and the kit runs
vite inside it (`@azerothjs/kit/dev`, wired in `server/src/main.ts`). The pages, the api, the
PDFs and the HMR socket all answer on `http://127.0.0.1:3000`. There is no second port, no
proxy block in `application/vite.config.ts` (the session refuses one at startup) and no `dev`
script in either half - the root is the one entry point. `vite` is a devDependency of the
SERVER half at the application's range, because that is the copy the session loads; a
production image built with `npm ci --omit=dev` still carries none. `HOST=0.0.0.0` in
`server/.env` opens dev to another device.

Everything below describes what is actually in this repository. If a rule here
disagrees with the code, the code is the source of truth — fix the note.

## Frontend architecture

| Piece | What it is |
| --- | --- |
| Framework | **AzerothJS 2.1.0** — not React, Vue or Svelte |
| Components | `.azeroth` files, compiler syntax, no JSX and no hooks |
| Reactivity | `state` / `derived` / `effect` / `cleanup` blocks; `createSignal` / `createStore` from `azerothjs` |
| Motion | **anime.js v4**, but only through `src/lib/motion.ts` — the one authority that gates on `prefers-reduced-motion` and IntersectionObserver absence, so no section ever writes that guard itself |
| Scrolling | **Lenis v1** (`src/lib/smooth-scroll.ts`), wheel smoothing + hash-link glide, instantiated once in `main.azeroth`. Reduced-motion or no-ResizeObserver environments keep native scrolling; `scroll-behavior: smooth` is the no-JS fallback |
| Language | TypeScript, strict |
| Styling | **Tailwind CSS v4**, CSS-first config in `src/styles.css` (`@theme inline`). There is no `tailwind.config.js` |
| Build | Vite 8 |
| Tests | Vitest 4 + happy-dom, through the real compiler |
| Browser QA | Playwright + axe, via `npm run qa:visual` |
| Server | **`@azerothjs/http`** + `@azerothjs/kit`, no database, Vitest in-process |

Layout of `application/src/`:

```
components/       reusable UI  (Button, Card, Banner, CopyField, SectionHeading, icon helpers)
sections/         page sections (network, tokenomics, chain, explorer, social)
pages/            route components (home, about, blog, post)
stores/           locale and theme, each a createStore singleton
lib/              content/site.ts (every fact the site states), content/page-copy.ts,
                  head.ts (each page's <head>), loaders.ts + blog-query.ts + reader-locale.ts
                  + localized-loader.ts (the route data layer), network.ts, wallet.ts,
                  nura-link.ts, markdown.ts, overlay.ts, section-href.ts, i18n/
api.ts            the typed client - the ONLY file that crosses into server/, and with types only
routes.ts         the one route table, read by the client router, the SSR entry and the kit
styles.css        the design system
```

And of `server/src/`:

```
schemas.ts     every wire shape, declared once; the browser's types are inferred from it
app.ts         createApi/registerApi/buildApp - features, guards, and the kit's page mount
deploy-env.ts  two lines `npm start` imports first: NODE_ENV defaults to production for the
               RUNTIME's own dev flag, which is read before .env is ever loaded
blog/content.ts the blog, read off disk at boot - loadArticles + an in-memory index
blog/present.ts the fallback policy - which translation a given reader is served
market/price.ts the ONE outbound call this half makes - see below
seo/           article.ts (the whitepaper PDF's body), sitemap.ts, meta.ts (attr, directionOf)
main.ts        config, connections, the listening process
```

**The price relay is the only thing this server fetches.** Every other live figure is read
straight from the browser, because the RPC allows it. `swap.nurachain.net` does not: it sends
no `Access-Control-Allow-Origin` and an explicit `cross-origin-resource-policy: same-origin`,
so `GET /api/market/price` exists to read the swap's WNURA quote server-side and relay one
number. It memoises for the same minute the browser does, keeps answering with its last good
reading for fifteen minutes after the swap goes quiet, and answers 503 when it has nothing -
never an empty 200, because the tile distinguishes "asked and got nothing" from "still asking".
The gateway is injectable (`ApiDeps.market`) and the suite's harness defaults it to one that
always refuses, so no spec can reach the network by forgetting to stub it.

**Two ways to reach a wallet, one file each.** `lib/wallet.ts` is the only code that hands
anything to an extension - discovery is EIP-6963, the reader names the wallet in the picker, and
the request goes to that exact provider. Nura Wallet is a Tauri application, so outside its own
in-app browser there is nothing to inject into and `lib/nura-link.ts` carries the same request
over `nurawallet://dapp?request=<base64url>`, the answer returning in a FRESH tab as a `#nura=`
fragment that is forwarded to the waiting tab and then wiped. Two things fail silently if
changed: the callback must be `https:` - the wallet drops anything else without a word, so deep
links cannot be exercised over `http://localhost` - and `NURA_RDNS` is the rdns the wallet
ANNOUNCES (`net.nurachain.wallet`), not its Tauri bundle id.

A new chain field starts in `server/src/schemas.ts`. The browser's type is inferred from that
declaration, so the shape is decided in exactly one place and cannot drift.

**`TRUST_PROXY` must be on wherever anything sits in front of this process.** `createHandler`
in `app.ts` wraps the app in the edges production actually serves - request id, security
headers, and one rate limiter at 200 requests a minute. That limiter keys on the client
address, and without the flag the address is the TCP peer, which behind nginx or a tunnel is
the same proxy for every visitor alive: one global bucket, spent by whoever arrives first,
everyone after them refused until the window rolls. It presents as "the site sometimes does not
load" and never reproduces for the person checking. The limiter wraps the WHOLE app rather
than `/api`, so a cold page load spends a dozen of the budget on its own assets - which is why
`/assets` is served immutable and why the pipeline is exported rather than inlined in
`main.ts`: `tests/edge-pipeline.spec.ts` drives the composed handler, and every other spec
drives `app.handle`, where these edges do not exist.

**`registerApi` is the one list of routes that are not pages** - the api, its manifest, the
sitemap, the PDFs. The dev session registers it on the App it serves and `buildApp` on the
production one, so a route added to one exists in both; `tests/app.spec.ts` drives it on a bare
App. Keep `rateLimit` in the exported pipeline and out of `app.use`: an in-process api call from
a page loader enters at `app.handle`, where the limiter's default key has no peer to read and
answers 500.

There is **no** Storybook, no component library, no CSS-in-JS and no state
manager. Do not add one to solve a problem the existing pieces already solve.

### Compiler traps

- Markup comments are `{ /* ... */ }` and go **between elements**. A comment
  inside an attribute list fails to compile with `Expression expected`.
- A route or component returns exactly **one** root node; `Portal` takes exactly
  one child.
- **Component effects run before their nodes are in the document.** A bare
  `document.getElementById(...)` inside an `effect` body returns null and the
  effect silently does nothing — do not query the DOM directly there. Use
  `onReady(id, cb)` from `src/lib/motion.ts`, which retries per frame until the
  node exists and hands the cleanup block one release function. (DOM queries
  inside event callbacks — overlay.ts, tooltip — are fine; it is only the
  effect body itself that runs too early.)
- `<For each>` needs a mutable array — a readonly tuple collapses the row type. Spread it:
  `each={ [...LOCALES] }`.
- **Component props are compiled to getters; DOM attributes are not.** Pass a plain
  expression to a component (`label={ t().blog.all }`) and a thunk to an element
  (`class={ () => ... }`). A thunk passed as a component prop arrives as a function.
- **A component-level `cleanup { ... }` RUNS ON THE SERVER**, when the string render disposes
  the component's own scope (every compiled component owns one since 2.1.0). A cleanup inside
  an `effect` never does - effects are inert in string mode - but a bare one at the body level
  must not touch `window` or `document`. `add-chain-button` and `copy-field` clear a timer in
  one, and `window.clearTimeout` was a 500 on every blog request; the bare `setTimeout` /
  `clearTimeout` globals exist on both sides. `tests/ssr.spec.ts` renders every server route
  in a node environment so this is red in the suite, not in production.
- **`value` on a `<select>` whose options come from a `<For>` does not stick** — the options
  do not exist at the moment it is applied, and the control renders blank. Put `selected` on
  the option instead. Inline options are fine, which is what makes this easy to miss.

## The blog

`/blog` and `/blog/:slug`, and nothing else - **there is no dashboard and no database.** Both
were deleted: posts arrived through a seed script that read `server/content/blog/`, so sqlite
was a cache of the repository with an editor bolted to the side. A post is a commit now.

**An article is a directory.** `server/content/blog/<slug>/` holds one `.md` per language plus
`article.ts`, the typed head - title and summary per locale, tags, `defaultLocale`, `status`,
`publishedAt` and `updatedAt`. `heads` is a full `Record`, not a `Partial`, so an article
missing a language is a COMPILE error. `index.ts` lists them; adding one is a directory and a
line. `blog/content.ts` reads the lot at boot and refuses to start if a declared translation
has no file behind it, naming every missing path at once.

Editing an article on a running server changes nothing until it restarts - the same deal the
bundle already makes.

**One post, many translations, with a fallback.** A post carries any subset of the ten
languages plus a `defaultLocale`. A reader whose language is missing gets the fallback and is
told so, with the languages the post *does* have offered beside it. `server/src/blog/present.ts`
is the whole policy: the reader's language, else the post's default, else anything it holds.

- The **fallback language must be one the post has.** `heads` covers all ten and the loader
  refuses a missing `.md`, so the pair cannot drift - which is what makes the fallback safe.
  A `defaultLocale` naming a translation that does not exist breaks every reader at once.
- `POST_LOCALES` and the site's `LOCALES` must stay in step; `tests/blog-locales.spec.ts`
  fails if they drift.
- Bodies are markdown in the strict subset `lib/markdown.ts` parses into a **tree** - never
  `innerHTML`. Headings level against the document's own shallowest heading, so `#`/`##` and
  `##`/`###` both come out h2/h3 rather than skipping a level under the page's h1.

**Rendering, and the SEO that depends on it.** Every route is `render: 'server'` - the two
landing pages included.

A post route serves the REAL ARTICLE, not a loading skeleton, and it gets there through the
framework rather than around it:

- **The data comes from the route's `loader`** (`lib/loaders.ts`, wired in `routes.ts`). It
  runs before the render and reaches this app's own api IN PROCESS - no socket, the visitor's
  identity carried - so the document leaves with the article in it. The result rides the
  loader handoff, `bootClient` in `main.azeroth` HYDRATES it, and the browser makes no request
  to draw what it was already sent. Pages used to fetch inside an `effect`, which never runs on
  a server; that is why the body was empty and why the server patched it back in afterwards.
- **The head comes from the page**, through `pageHead` in `lib/head.ts` over the framework's
  `useHead`. One helper, five callers. The kit replaces the shell's `title`, `description` and
  `robots` BY KEY, so a document still carries exactly one of each, and the client updates the
  head in place on a navigation - which the old server-side splice could not do at all, so a
  reader's tab kept the title of whichever page they landed on first.
- **The head and the body resolve through the same loader**, so a page cannot describe one
  article and print another.
- Served in the READER's language, negotiated per request; the article itself is whichever
  translation the fallback policy picked, and carries its own `lang`/`dir`. One address per
  post, no hreflang - ten indexable addresses would want the locale in the path; see the
  comment in `routes.ts`.
- A slug that resolves to nothing throws `notFound()` from the loader, which the kit answers as
  a real 404 - never a soft one, and decided by the same lookup that fetches the post.
- `seo/article.ts` still exists and is NOT part of this path: it renders the markdown for
  `npm run whitepaper:pdf` alone. The served page uses the same `Markdown` component the
  browser does, on both sides.

## The whitepaper

`/whitepaper`, `render: 'server'` like a post, with one PDF per language under
`/whitepaper/nura-chain-whitepaper-<locale>.pdf`.

**It is content, not copy.** `server/content/whitepaper/` holds one `.md` per language plus
`whitepaper.ts`, the typed head - title and summary per locale, a `revision`, `publishedAt` and
`updatedAt`. `src/whitepaper/content.ts` reads it at boot, refuses a missing language, and
resolves a reader through the SAME `pick` the blog uses (`blog/present.ts`), so the two cannot
fall back differently. `GET /api/whitepaper?locale=` serves it; the page renders it through the
same `Markdown` component a post uses and shares its `TranslationNotice`.

**The PDFs are derived and committed.** `npm run whitepaper:pdf` renders every `<locale>.md`
through `seo/article.ts` - which exists for this and nothing else now; the served page renders
its body through the same `Markdown` component the browser uses - and prints it with Playwright's
Chromium into `content/whitepaper/pdf/`, beside a `manifest.json` recording the sha256 of the
markdown each file came from. Chromium is what gets Persian and Arabic shaped, Han and Devanagari
set in a real face, and page breaks that keep a heading with its text; it is a dev dependency and
never a runtime one. `main.ts` refuses to boot over a MISSING PDF and logs a STALE one;
`tests/content.spec.ts` fails on either. So: edit a body, bump `revision` and `updatedAt` in the
head, run the generator, commit the lot. Forgetting is red, not silent.

**It is written for a reader with no technical background, and it stays that way.** Plain
words, short sentences, an analogy where one helps (the shared notebook, postage, the cloakroom
ticket), no commands and no field names. The chain values a wallet asks for sit in one reference
section at the end; anything a developer needs beyond that is a link to the blog, not a paragraph.

Every figure a body states is bounded by `lib/content/site.ts` and by what the node answers over
RPC - the block-production section says only what block headers show, with the date it was read.
The same spec pins that every translation keeps the English outline, has no code fences, and
carries the same links in the same order, so a translator working in one file cannot lose a
section.

## The head, and the social card

`index.html` carries the head every path starts from - title, description, `robots`, the
favicons, the apple-touch-icon and the manifest. **Each PAGE then declares its own**, through
`pageHead` in `src/lib/head.ts` - one helper over the framework's `useHead`, called by all
five routes. The kit serializes that into the served document and REPLACES the shell's
title, description and robots by key, so a document carries exactly one of each without
anybody stripping anything; on the client the same declaration is applied to the live head and
rolled back when the page is left, which is what makes the title follow a navigation.

The server writes no head at all any more. It used to rewrite the finished document by string
surgery from a table of paths it kept in its own half, which worked for a crawler and did
nothing for a reader clicking between pages.

- **The `robots` line is stated, not omitted, and there must be exactly one per document.**
  Conflicting directives resolve to the MOST RESTRICTIVE, so a shell saying `index, follow`
  beside `/about`'s `noindex` de-indexes whatever it lands on, and the served markup looks
  right either way. `pageHead` always emits one, and the kit replaces the shell's by key -
  `tests/ssr.spec.ts` counts them per page.
- **A head value is a GETTER, and it must always answer something real.** A title getter that
  returns `''` is still a declaration and writes an empty `<title>`; only `undefined` falls
  back to the shell's. So a page whose document is still loading titles itself with its
  not-found or section string, never a bare suffix.
- **Match served markup on attributes, never on a literal tag.** Everything the head runtime
  writes carries `data-azeroth-head`, and the title carries `data-azeroth-title-base` holding
  the shell's original text for the client's restore. A check written as `<title>` finds
  nothing on a real page and reports a missing head that is perfectly present.
- **The manifest is `public/manifest.json`, not `.webmanifest`.** `staticFiles` maps
  extensions to Content-Types from a fixed table that has no entry for `.webmanifest`, so that
  name serves `application/octet-stream` and every browser drops the manifest without a word.
  Its colours are `--bg`, the same value the dark `theme-color` states.
- **`public/og-image.png` is derived and committed**, like the whitepaper PDFs.
  `npm run og:image` renders it through the same Playwright Chromium, from the site's own
  string table, `lib/content/site.ts` constants and dark-theme tokens. 1200x630, because every
  card layout in use lays out at ~1.91:1 and crops or letterboxes anything else. Change the
  size in `scripts/og-image.ts` and `SOCIAL_IMAGE` in `src/lib/head.ts` together;
  `tests/page-head.spec.ts` pins the pair and `tests/head.spec.ts` reads the file's pixels.

## Design system

All tokens live at the top of `src/styles.css`, declared per `[data-theme]` for
**two** themes: `dark` and `light`. Tailwind reads them through
`@theme inline`.

- Colour: `--bg`, `--surface`, `--elevated`, `--ink`, `--muted`, `--faint`,
  `--line`, `--line-strong`, `--accent`, `--accent-ink`, `--warm`, `--danger`.
- Type: `--font-sans`, `--font-mono` → `var(--mono)`, which is redefined for
  `:lang(fa)` and `:lang(ar)` so Persian digits have a face that carries them.
  `--font-display` → `var(--display)` (Space Grotesk Variable) is the brutalist
  display face used by the hero and section headings; Latin-only, with
  Vazirmatn in the stack so fa/ar headings keep their face.
- `.font-label`, not `font-mono`, on section micro-labels: the test suite
  selects `.font-mono` to find live FIGURES, so labels must not wear it.
- Motion discipline (lib/motion.ts is the only motion code path): animate
  `transform`/`opacity` only; no `utils.set` from anime.js (namespace
  re-export can be `undefined` under Vite pre-bundling — plain style writes);
  `will-change` only for the continuously-animated ticker track and only
  during one-shot reveals; DOM lookups inside effects go through `onReady`.
  The ticker is rAF-driven with a scroll-velocity boost; section reveals are
  one-shot (spring staggers via `revealItems` + heading rule draws).
  Theme changes wipe circularly from the toggle (View Transitions API,
  `lib/theme-transition.ts`); it falls back to an instant swap when
  unsupported or under reduced motion.
- Also tokenised: radius, shadow, glow, scrollbar, and the `--brand-*` platform
  marks.

Rules:

1. **Never put a raw hex in a component.** Add a token, to both themes.
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

- **One authority for direction, and it is the SERVER.** `mountPages` is given the ten
  languages (`LOCALES` in `server/src/app.ts`, which is `POST_LOCALES`) and negotiates every
  request - the reader's `locale` cookie, then `Accept-Language` in preference order, then
  English - then stamps `lang` and `dir` on the `<html>` of the response. So the document
  arrives correctly labelled and correctly mirrored with no script at all, which is what a
  crawler and a reader with JavaScript off get. `src/stores/locale.ts` READS that stamp
  (`useLocale` from `azerothjs`) and writes the cookie on a switch (`setLocale`); it detects
  nothing and stamps nothing. The pre-paint script settles the THEME only, and
  `tests/prepaint.spec.ts` asserts it never touches `lang` or `dir`. `tests/blog-locales.spec.ts`
  still pins the application's `LOCALES` equal to the server's `POST_LOCALES`.
- **A reader's language and a DOCUMENT's language are different questions.** A post written in
  Persian shown to an English reader is an English page containing a Persian article: the
  article carries its own `lang`/`dir` where it is rendered (see `post.page.azeroth`), and
  nothing rewrites the document from it. The head says the same thing twice over: `og:locale`
  names the language the words are IN, which `pageHead` takes from the document rather than
  from the reader, while `<html lang>` stays the reader's.
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
- **Every number and date goes through the framework's bound formatters** -
  `useNumberFormat()` and `useDateFormat()` from `azerothjs`, called once during setup and
  used as plain functions. They follow the locale signal, so a language switch reformats a
  figure without the component knowing it held one, and they cache per (locale, options),
  which a `new Intl.NumberFormat(...)` per call does not - the ticker and the network tiles
  format on every frame. No hand formatting, including years: a year takes
  `{ useGrouping: false }`, because it is an identifier rather than a quantity.
- **Mirror only direction-of-travel icons.** Outbound `↗` markers mirror with
  `rtl:-scale-x-100`; the hero's onward arrow rotates. Brand marks, logos and
  flags never mirror.

## Accessibility

Load the **`accessibility-audit`** skill for review work.

- **Native semantics over ARIA.** Do not add ARIA speculatively — most ARIA in
  the wild makes things worse. A `<button>` beats `<div role="button">`.
  `aria-disabled` also SILENCES axe: the color-contrast rule exempts anything wearing
  it, under the WCAG carve-out for inactive controls. The download grid's coming-soon
  tiles hid a 2.48:1 failure behind it for as long as they claimed to be disabled links.
  A thing that is not a control does not get told it is a disabled one.
- **Dim with a token, never with `opacity`.** `--muted` and `--faint` are measured
  against every surface; an opacity multiplies whatever is underneath and nothing
  re-measures it. `--faint` needs ~90% before it clears 4.5:1 on `--surface`, which is
  no dim at all — so a dimmed ROW dims its background (`bg-bg` sinks a tile into a
  `bg-surface` panel), not its text.
- Icon-only controls carry `aria-label`; the icons themselves are `aria-hidden`.
- One `h1` per document (the hero). Sections use `h2` via `SectionHeading`.
- The skip link is the first tab stop and targets `#main`.
- **Overlays go through `lib/overlay.ts`.** The drawer and the language dialog are both
  full-screen panels over a scrim, and one helper gives them all four obligations: Escape
  closes, the page behind stops scrolling, focus moves *into* the panel, and focus returns
  to whatever opened it. The focus half matters most because both mount through a `Portal`
  at the end of `document.body` — without it, Tab from the trigger walks the entire page
  underneath the scrim before reaching the panel covering it. The trap wraps at both ends.
- `prefers-reduced-motion` is honoured in JS, through `motionOk()` in `lib/motion.ts` -
  there is no global CSS rule for it in `styles.css` (the only `@media` there is
  `pointer: coarse`), and the touch-target comment claiming one sits "below" is stale.

## Motion

Anime.js v4, behind `lib/motion.ts`. Everything animated routes through that module so two
rules cannot be forgotten by a section written later - see its header.

**The framework pattern.** Anime.js documents `createScope` for component frameworks
(`animejs.com/documentation/getting-started/using-with-react`), and the React example
translates to AzerothJS one line at a time:

| React | here |
| --- | --- |
| `useRef` + `ref={root}` | `onReady('hero', (section) => ...)` - effects run before the node attaches, so the helper waits for it |
| `useEffect(() => {...}, [])` | an `effect` block |
| `return () => scope.revert()` | the effect's `cleanup` block |
| `scope.current.methods.x()` | a closure captured in the effect |

```ts
effect
{
    const release = onReady('hero', (section) =>
    {
        const scope = createScope({ root: section }).add(() =>
        {
            animate('.thing', { opacity: [0, 1] });

            // Returned from the constructor: run by revert(), for anything anime.js
            // did not create itself - a listener, a class, a raf loop.
            return () => section.classList.remove('running');
        });

        return () => scope.revert();
    });

    cleanup { release(); }
}
```

`revert()` undoes every anime.js object declared inside the scope AND runs that returned
cleanup, which is the whole reason to reach for it: the alternative is the hand-rolled
`playing` and `detach` arrays `hero.section.azeroth` currently keeps, one push per animation,
where a forgotten push is a leak nothing reports. A scope per section is the shape to move
toward; the hero has not been converted yet.

`createScope` also takes `mediaQueries`, and `{ reducedMotion: '(prefers-reduced-motion)' }`
is a first-class entry with the state on `self.matches.reducedMotion`. It is a real
alternative to `motionOk()` and it is reactive, which `motionOk()` is not - the hand-rolled
gate is read once when the effect runs, so a visitor toggling the OS setting mid-visit keeps
whatever they loaded with until a reload.

**`utils` stays out of this file.** It is a namespace re-export (`export * as utils`) and
Vite's dependency pre-bundling has handed back `undefined` for such bindings at runtime.
Plain style writes and `document.querySelector` cost nothing and cannot. This is why the
scope example above does not use the scoped `utils.$()` the docs show.

**What `prefers-reduced-motion` suppresses, and what it must not.** Every JS entry point in
`lib/motion.ts` gates on `motionOk()`, and so do `smooth-scroll.ts` and the hero's own
choreography. Two things deliberately do NOT:

- `theme-transition.ts` cross-fades instead of sweeping. The preference is about MOVEMENT;
  a layer changing opacity in place is not movement, and snapping a whole page between
  palettes in one frame is the harshest version of the change handed to the readers who
  asked for the gentlest.
- The hero's crosshair and `X/Y` readout track the pointer 1:1 with no easing and no travel
  of their own. That is direct manipulation, not autonomous motion. It used to sit inside
  the gate, which left those readers a hero permanently reading `X 0000 · Y 0000`.

The distinction is worth holding: suppress what moves on its own, keep what follows a hand.

## Browser QA workflow

Two scripts, both driving real browsers against a running server. Run them against
`npm run dev` while working, and against a production `npm start` before shipping - the
second is the one that exercises the built bundle, the prerender output and the real cache
headers.

```bash
npm run dev                                          # one process, one origin: http://127.0.0.1:3000
npm run qa:visual  -- --url http://127.0.0.1:3000/   # how it LOOKS
npm run qa:browser -- --url http://127.0.0.1:3000/   # what it DOES
```

**`qa:visual`** — for every scenario (3 viewports x 2 directions) it asserts the document
direction flipped, detects horizontal scroll and elements escaping the viewport (ignoring
anything an ancestor legitimately clips), runs the axe WCAG 2.1 AA rule set, and writes a
screenshot plus `report.json` to `artifacts/visual-qa/`. Chromium by default;
`--browser all` adds Firefox and prefixes every scenario and screenshot with the engine.

**`qa:browser`** — the behaviour contract, in Chromium AND Firefox, which nothing else covers:
the document served with JavaScript DISABLED (one title, one description, one robots
directive, a canonical, the article's own `<h2>`, JSON-LD that parses), the language the
server negotiated from a header and from a cookie, real 404s, hydration with no console error
and no refetch in both themes, the head following a client-side navigation and coming back on
Back, and a language switch writing the cookie and re-stamping the document.

Both take `--browser chromium|firefox|all`. `scripts/browsers.mjs` launches them and falls
back to an installed Chrome or Edge when Playwright's own Chromium build is not on disk,
saying which binary it used - a download that will not run is not a reason to skip an engine.

**`qa:browser` runs inside the site's own rate limit, and that is a design constraint rather
than a detail.** The limiter wraps the whole app at 200 requests a minute per address, so a
cold page load spends a dozen of the budget on its own assets - and a run that walks twenty
pages twice spends all of it, after which every later check reports a missing element and the
site looks broken rather than throttled. Three things keep it under: the checks that only
PARSE served markup fetch the document and nothing else, the light-theme pass visits one page
rather than all of them, and the interactive checks share one warm context. A 429 is also
reported as itself, once, naming the budget - so if the run is ever extended and tips over,
the output says so instead of lying. Measured at 195 requests for both engines.

It also blocks every request that leaves the origin. The landing page reads live figures from
the RPC, the explorer and a price feed; letting a QA run depend on three third parties being
up is the same mistake the suites avoid by stubbing `fetch`. Network-level console noise from
those blocked requests is filtered by SHAPE, since Chromium reports them with no url.

Warnings do not fail either run; a real regression exits non-zero.

**Then look at the screenshots.** The assertions catch overflow and contrast. They do not
catch a heading colliding with an icon or Persian text wrapping badly — only your eyes do.

## Testing

```bash
npm test               # both halves
npm run test:shuffle   # both halves, shuffled - the isolation gate
npm run test:server    # the api and the store alone
npm run coverage       # the browser half, thresholds enforced in vite.config.ts
npm run test:unit          # wallet, stores, site constants, the head's parts, i18n, network
npm run test:integration   # sections, header, add-chain, app shell, server rendering
npm run test:fuzz          # seeded property runs over the parsers
npm run test:security      # link safety, upstream failures, chain params
npm run test:i18n          # string tables, direction, pre-paint script (theme)
```

**`tests/ssr.spec.ts` is the one spec that runs the SERVER**, in a node environment, over the
real `buildApp` and the real renderer with the shell handed in as text. It is where the page
contract lives: the article in the served document, the reader's negotiated language on it, a
real 404 for a slug nobody published, and exactly one title, description and robots directive
per page. Nothing else can see any of that - every other spec runs under happy-dom against
components, where `window` exists and there is no status line.

Use the framework that is here. Do not add a second test runner. Every spec stubs `fetch`,
and the server suite builds its blog from posts declared inline with a stubbed chain gateway —
nothing binds a port, touches the disk or reaches the network, so a red build is always a real
change. `tests/content.spec.ts` is the one exception and reads the repository's own cluster on
purpose: that it loads in all ten languages IS the assertion.

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

- The landing page is one document; sections are anchors, not routes. `/about` and `/blog`
  are real routes, so a link to a SECTION from one of them has to be rooted -
  `lib/section-href.ts` returns a bare `#chain` at home and `/#chain` everywhere else, and
  a plain `<a href="/#chain">` on the landing page itself would reload the page it is
  already showing.
- The server caches nothing the browser needs to re-cache. Repeated node reads are memoised
  server-side; do not add a second layer in the browser without a measurement.
- Vite hashes asset filenames, so `/assets` is served `immutable` for a year - by the kit
  itself since 2.1.0, which registers that mount ahead of its `/*path` fallback. Registering
  the pattern again in `app.ts` is a `Route conflict` at boot, which is why the app no longer
  does. Everything at the root (`index.html`, the favicons, `robots.txt`) keeps the
  revalidate-always default: those names are stable across deploys, so pinning them would
  strand a returning reader on the previous build.
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
