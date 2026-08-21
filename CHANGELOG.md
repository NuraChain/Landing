# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
