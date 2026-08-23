# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-08-23

### Added

- A **live price tile** in the network section. No exchange lists the coin, but Nura Swap
  runs a pool that quotes it, and the swap sends no `Access-Control-Allow-Origin`, so
  `GET /api/market/price` reads the WNURA quote server-side and relays one number. It
  memoises for the same minute the browser does, keeps answering with its last good reading
  for fifteen minutes after the swap goes quiet, refuses a zero, and answers 503 when it has
  nothing - never an empty 200, because the tile distinguishes "asked and got nothing" from
  "still asking". The tile names the thin liquidity and shows when the price was last read.
- A **ten-language SEO cluster**: ten articles, each in all ten locales, written from values
  verified against the live chain rather than from the constants file. `server/src/seo`
  rewrites the head per post - title, description, canonical, Open Graph, Twitter card and
  JSON-LD - where all ten would otherwise have shared `index.html`'s single title, and
  `/sitemap.xml` is generated from the posts, so publishing one IS listing it.
- **The post route serves the real article.** It was always `render: 'server'`, but the page
  fetched inside an `effect`, which never runs on a server - what a crawler indexed was a
  correct `<title>` over a loading skeleton. `seo/article.ts` renders the markdown into the
  same document, resolved through the same call the head uses, so a page cannot describe one
  article and print another.
- The **hero's choreography**, and `lib/motion.ts` as the one authority behind it: anime.js
  gated on `prefers-reduced-motion`, `onReady` for effects that run before their nodes
  attach, one-shot section reveals, scroll scrub, count-ups and the word-mask splitter.
  Blueprint grid, live status bar, headline rising out of per-word masks, scanline sweep,
  cursor crosshair, magnetic CTA and a scroll-reactive ticker of chain facts.
- **Lenis wheel smoothing** with a hash-link glide (`lib/smooth-scroll.ts`), and a **theme
  toggle that wipes circularly** from the button through the View Transitions API
  (`lib/theme-transition.ts`). Both fall back to native behaviour where the platform or the
  reader's preference asks for it.
- A **reusable UI layer** under `src/components/ui`: badge, banner, button, card, empty
  state, field, icon button, input, pagination, skeleton, toasts and tooltip, over shared
  variant and control helpers.
- A **roadmap section**, hidden while there are no milestones to put in it.
- **systemd service scripts** and their npm entries (`service:install`, `service:start`,
  `service:stop`, `service:restart`, `service:status`, `service:deploy`,
  `service:uninstall`).
- Specs for the pieces that had none: the composed edge pipeline, the theme transition -
  where every failure mode is silent, since a transition that never runs looks exactly like
  one that runs perfectly - and the blog cluster, which reads the repository on purpose,
  because that all ten articles load in all ten languages IS the assertion.

### Changed

- **The blog is served from the repository.** An article is a directory of markdown files
  beside a typed head; `blog/content.ts` reads the lot at boot and refuses to start if a
  declared translation has no file behind it, naming every missing path at once. A post is a
  commit. Dates are declared per article rather than taken from a clock, because `mtime`
  survives neither a clone nor a checkout and would redate the whole blog on a fresh deploy.
- **Hashed assets are served immutable for a year.** Vite writes content-addressed names, so
  those bytes cannot change, yet the kit was asking the browser to revalidate every one on
  every page view - a round trip per asset per visit, and a metered request per asset
  against the rate limiter. Registered before the page mount, whose `/*path` fallback would
  otherwise match first. Only `/assets`: `index.html`, the favicons and `robots.txt` keep
  stable names and must keep revalidating, or a deploy would never reach a returning reader.
- **The theme change no longer snaps under `prefers-reduced-motion`.** It cross-fades in
  200ms instead of sweeping. The preference is about movement, and a whole page flipping
  palettes in one frame is the harshest version of the change handed to the readers who
  asked for the gentlest.
- The top of the landing page is retuned: the header rail sits at `top-0` and the hero
  reclaims the 80px it occupies, so the grid and the scanline run to the top of the viewport
  behind the floating card; the explorer loses the rule that drew a second edge two pixels
  from its own, and closes the 160px gap to the chain table it is one thought with; the
  footer describes the chain rather than the wallet, in all ten languages.
- The four network tiles were drifting into two pairs - rounded against square, sentence
  case against the label face, one figure a size smaller from `lg` up. Square and uppercase
  now, with the figures sharing a baseline because each tile pushes its number to the bottom
  of a stretched row, not because the labels were given a magic minimum height.
- The allocation legend leads with the token count and shows the share at rest. A percentage
  of a supply the reader has to remember is a sum they do in their head, and half the table
  was behind a hover a touch screen does not have and a keyboard never makes.
- The hero's spec row is drawn as an engineering dimension - a datum rule, a hairline tick in
  the accent down the reading edge of each field, the value hung off it with no container -
  rather than three bordered cards boxing the blueprint grid out of its own hero. The
  figures step up to the second-largest type on the page, and the status strip is pinned
  `dir="ltr"` so the mainnet marker and the block height keep their edges in Persian and
  Arabic.
- The global `prefers-reduced-motion` block left `styles.css`: its blanket
  `animation-duration: 0.01ms !important` fought the anime.js timelines it could not see,
  and every JS entry point already gates on `motionOk()`. Declarative keyframes that are not
  behind that gate - the hero's caret, the toast and the drawer - are unguarded until the
  rule is restored per-rule.

### Removed

- **The admin dashboard, and the database under it.** Posts arrived through a seed script
  that read the repository, so sqlite held a second copy of files already in git, the
  dashboard existed to edit that copy, and the admin key existed to guard the dashboard.
  Gone: the whole admin module, 497 lines of sqlite store, the seed and key scripts, the
  dashboard components and route, `ADMIN_KEY` and `DB_PATH`, and the dashboard-only wire
  shapes. `node:sqlite` appears in no source file, and the deployment has no mutable state
  left to back up.
- **The high-contrast theme**, with its token block, its grid override, its glyph and its
  string in all ten locales. A visitor whose `localStorage` still names it needs no
  migration: both the store and the pre-paint script validate against the list and fall back
  to the OS preference.

### Fixed

- **The rate limiter keyed on the proxy rather than the reader.** `TRUST_PROXY` was read and
  handed to the admin guard but not to the limiter beside it, so behind anything terminating
  TLS every visitor shared one address - two hundred requests a minute stopped being a
  per-reader budget and became one bucket for the whole internet, spent by whoever arrived
  first. It presented as "the site sometimes does not load" and never reproduced for the
  person checking. The flag was also absent from `.env.example` altogether, which is how a
  deployment that followed the template never set it.
- **The hero's pointer readout was inside the reduced-motion gate**, so readers with the
  preference set had no listeners attached and a hero permanently reading `X 0000 · Y 0000` -
  the markup's placeholder, not a measurement. It tracks the pointer 1:1 with no travel of
  its own, which is direct manipulation rather than autonomous motion, and now sits outside
  the gate. The magnetic CTA, which eases and springs by itself, stays in.
- `/blog/<unknown>` answered 200 with the shell's generic title - a soft 404 a crawler
  indexes as real content. It is a real 404.
- A fenced code block is `overflow-x-auto`, so on a phone it became a scrollable region with
  no keyboard access (WCAG 2.1.1); inline `<code>` carried no direction pin, so its
  bidi-neutral edges reordered inside Persian and Arabic (`personal_*` rendering as
  `*personal_`); and the selected tag chip kept `--faint` on its count against an `--accent`
  fill, measuring 1.84:1 against a 4.5:1 floor.
- **The visual QA gate was green for reasons that were not true.** axe ran the moment
  `<main>` existed and judged a page still mid-entrance, reporting the primary CTA at 3.12:1
  in the three RTL scenarios - a blend of colours the site does not have, where the tokens
  behind it measure 8.77:1. The page now says when its entrance is over. And the harness
  never scrolled: every section below the hero reveals on an IntersectionObserver, and a
  `fullPage` screenshot stitches from the top, so the artifacts were a hero, a footer and
  several thousand pixels of black between them - with axe auditing those two pieces while
  reporting a clean page.
- `app.spec` summed "the first `.font-mono` in each row" to assert the token split totals
  100. Both cells in that row are mono, so it had only ever read the right one by position;
  reordering them turned it into a sum of 400,000,000-scale numbers reaching 1000. The cells
  are named `data-share` and `data-amount`, and the spec asserts both.
- `network-section.spec.ts` selected tiles by index into every `.font-mono` in the section,
  which also collects the breakdown amounts and the holder addresses, so inserting a tile
  shifted all of it and reported failures about unrelated tiles. Figures are selected by
  their own class and named through one order array.
- The systemd unit's entry is pinned absolutely, and the installer starts the service it
  just wrote.
- A merge dropped the motion import on the landing page.

## [1.5.0] - 2026-08-21

### Added

- A **server workspace**. The repository is now two npm workspaces: `application/` for the
  site and `server/` for an `@azerothjs/http` API over a `node:sqlite` index. Every wire
  shape is declared once in `server/src/schemas.ts`, and the browser's types are inferred
  from that declaration, so a field is defined in exactly one place.
- A **blog** in all ten languages, at `/blog` and `/blog/:slug`. A post carries any subset
  of the languages and names one of them as its fallback: a reader whose language is missing
  gets the post anyway, told plainly that it is not in their language, with the languages it
  does have offered beside it.
- Post bodies render from a strict markdown subset parsed into a tree, never through
  `innerHTML`. Headings level against the document's own shallowest heading, so a body
  written in `##` starts at `h2` rather than skipping a level beneath the page's `h1`.
- A **dashboard** at `/admin`, reached by typing the path - nothing links to it, and
  `robots.txt` disallows it. Sign in with a key (`npm run admin:key`) compared in constant
  time against a SHA-256 digest and exchanged for an httpOnly `__Host-` cookie; only session
  digests are stored. Production refuses to start without `ADMIN_KEY`; development starts
  with the dashboard disabled rather than unlocked.
- The post editor shows **all ten languages**, not only the ones written, because the
  question it exists to answer is what is still missing. Each language keeps its own draft,
  so switching tabs never discards unsent typing.

### Fixed

- Section links in the header and footer were bare `#anchor` hrefs, so from `/about` or
  `/blog` they pointed at nothing and left the visitor on a URL that had moved nowhere. They
  are rooted off the landing page and bare on it - a plain `/#chain` at home would reload the
  page it is already showing.
- The active navigation entry announced `aria-current="page"` but rendered in the muted
  colour: `activeClass` appends, and two colour utilities of equal specificity were racing.
  The colour now hangs off the `aria-current` attribute, which outranks both and cannot drift
  from the signal a screen reader is given.
- The drawer and the language dialog trapped neither focus nor the keyboard. Both mount
  through a `Portal` at the end of `document.body`, so a Tab from the trigger walked the whole
  page underneath the scrim before reaching the panel covering it. One helper now moves focus
  in, traps it, returns it to the opener, closes on Escape and locks the page behind.
- On a phone the chain facts put the label and the value on one line, leaving about 118px for
  the value - enough to render `https://rpc.nu...` and stop, on the one section whose purpose
  is letting somebody add the chain by hand. The value takes its own line below `sm:`.
- The wallet section was `max-w-5xl` where every other section is `max-w-4xl`, so the page's
  left edge stepped out and back again as it scrolled past.
- The TVL breakdown toggle was 20px, under WCAG 2.5.8's 24px floor for a pointer.
- The CI determinism job ran a bare `npx vitest` from the repository root, which has no
  vitest configuration: it found the specs, loaded neither workspace's environment, and
  failed tests that were fine. It runs `npm run test:shuffle` through the workspace scripts.

## [1.4.0] - 2026-08-20

### Added

- Visual and accessibility QA harness (`npm run qa:visual`): three viewports by two
  text directions, asserting document direction, horizontal overflow and the axe
  WCAG 2.1 AA rule set, with a screenshot and a JSON report per scenario.
- `frontend-ui-ux` and `frontend-reviewer` agents, and a `CLAUDE.md` recording the
  design system, direction rules and QA workflow this repository actually uses.

### Fixed

- The `--faint` token failed WCAG AA for normal-size text in both the dark and light
  themes (3.56:1 at worst, against a 4.5:1 floor). Every caption, platform note and
  the copyright line were affected; the token now clears 4.5:1 on all three surfaces
  and stays visually dimmer than `--muted`.
- The AzerothJS link in the footer sits inside a line of prose and was distinguished
  by colour alone at 1.92:1 against the surrounding text. It is now underlined at
  rest rather than only on hover.

## [1.3.1] - 2026-08-20

### Added

- Test suite covering the wallet, stores, site constants, string tables and every component,
  run over real DOM through the compiler; plus CI for typecheck, lint, coverage, determinism
  and the production build.

### Fixed

- Chain values sit beside their labels in Persian and Arabic again, instead of at the far
  edge of the row.
- Outbound arrows point away from the card in right-to-left layouts rather than back into it.
- Persian and Arabic figures render in a face that actually carries their digits, and the
  copyright year follows the active locale.
- The about page keeps a container, and its file paths and commands no longer lose trailing
  characters to bidi.
- A truncated block height from the RPC is refused rather than parsed up to the first bad
  character, which used to render a plausible but wrong figure.

### Security

- The footer's swap link uses `https`. The origin already redirected to TLS, so the plaintext
  hop added nothing but a redirect an on-path attacker could strip - on the one link that
  leads to connecting a wallet.

## [1.3.0] - 2026-08-19

### Added

- Instagram link (`https://www.instagram.com/nura.chain/`) in the footer's social network row.
- Swap link (`http://swap.nurachain.net/`) in the footer's product column, translated across all ten languages.

### Fixed

- The last rule on the page now runs the full width of the viewport, like every other section rule.

## [1.2.0] - 2026-08-15

### Added

- TVL figure read live from the bridge tokens, priced in USD, with the total open for inspection.
- Public sale terms, the last allocation that had none.
- Airdrop replaces the validator slice, and each allocation slice explains itself.
- Network section that reads the chain instead of describing it.
- Language picker as a flag-marked modal; ten languages now supported.
- One-click add-to-wallet button, chain id 1020.

### Changed

- Total supply is confirmed, and the sale price rides on it.

## [1.1.1] - 2026-08-10

### Changed

- Copy describes the chain as open and decentralized.

## [1.1.0] - 2026-08-10

### Added

- Real download links, per-platform marks, and one uniform download grid.

## [1.0.0] - 2026-08-10

### Added

- Initial release of the Nura Wallet landing page.
- Bilingual (Persian/English) landing page with real chain data and a floating header.
- Built on AzerothJS 2.0.0-beta.2, adopting its control-flow and `For`-row contracts.
