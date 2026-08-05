# NuraLanding

The marketing site for **Nura Wallet**: a self custody wallet for the Nura network.
Bilingual English and Persian, three themes, and a download path for every platform.

[![Built with AzerothJS](https://img.shields.io/badge/built%20with-AzerothJS-2ad4b8)](https://github.com/AzerothJS/AzerothJS)
[![Node](https://img.shields.io/badge/node-%3E%3D20-5fb3e8)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

![Desktop, dark theme](docs/screenshots/desktop-dark.png)

## What it is

A single page in the class of tonkeeper.com or metamask.io, whose one job is to get a
visitor onto the wallet for whatever device they are holding. Seven sections: header,
tokenomics, chain information, the wallet itself, the explorer, community, and footer.

Frontend only. No server, no API, no build time data fetching.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5174
```

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server with hot reload |
| `npm run check` | typecheck and lint in one pass |
| `npm run build` | production bundle into `dist/` |
| `npm run preview` | serve the built bundle |
| `npm test` | vitest, when specs exist |

## Before you launch

**Every number and link on this site is a placeholder.** They live in one file,
`src/lib/content/site.ts`, so replacing them is a single edit. While `PROVISIONAL` is
`true`, the tokenomics and chain sections render a visible warning.

Replace, then set `PROVISIONAL = false`:

| Constant | What it needs |
| --- | --- |
| `SUPPLY` | total and circulating supply |
| `ALLOCATIONS` | distribution split, must sum to 100 |
| `CHAIN` | chain ID, RPC endpoint, explorer URL, block time, token symbol |
| `DOWNLOADS` | a real URL per platform, or `null` for a labelled "coming soon" |
| `SOCIALS`, `EXPLORER_URL` | real destinations |

A wrong chain ID or RPC endpoint is not a cosmetic bug. Somebody pastes it into a wallet
and sends funds. Verify those against the official announcement before flipping the flag.

## Bilingual and RTL

English and Persian are both first class. The locale sets `dir` and `lang` on the document
root, so mirroring reaches scrollbars, text selection and native form controls, not only
elements carrying a class.

Two rules worth knowing before editing:

- **Use logical properties.** `ms-`/`me-`/`ps-`/`pe-`/`text-start`, never `ml-`/`text-left`.
  A single physical direction is a bug in Persian.
- **Never write Persian through PowerShell, curl, or a shell heredoc.** It mojibakes. Edit
  `src/lib/i18n/fa.ts` with an editor or a Node script.

`Strings` in `src/lib/i18n/types.ts` is a declared type, not inferred from English, so a key
added to `en.ts` and forgotten in `fa.ts` fails the typecheck rather than rendering blank.

![Persian, right to left](docs/screenshots/desktop-fa.png)

## Theming

Three themes on `:root[data-theme]`: `dark`, `light`, and `contrast`. The system preference
is the initial signal; an explicit choice overrides it and persists.

An inline script in `index.html` resolves the theme **before first paint**. Without it the
page paints the default and repaints on hydration, which is the most visible bug a themed
site can ship. It shares `THEME_KEY` with `src/stores/theme.ts`; change one and you must
change the other.

`contrast` is not "dark but more". It drops the decorative layers entirely, because visual
noise is what makes a low vision reader lose the edge of a control.

![Desktop, light theme](docs/screenshots/desktop-light.png)

## Structure

```
src/
  lib/
    content/site.ts     every fact the site states, placeholders included
    i18n/               types.ts + en.ts + fa.ts
  stores/               locale.ts, theme.ts
  components/           button, card, banner, section-heading, copy-field, header, footer
  sections/             tokenomics, chain, explorer, social
  pages/                home.page.azeroth, about.page.azeroth
  App.azeroth           shell: skip link, header, routes, footer
  styles.css            theme tokens, scrollbar, touch targets, reduced motion
```

Suffixes are load bearing: `.page.azeroth`, `.section.azeroth`, `.component.azeroth`.

## Accessibility

Not aspirational, measured:

- One `h1`, section headings fixed at `h2` so the outline cannot be broken by a component.
- Skip link as the first tab stop.
- 44px minimum touch targets under `pointer: coarse` only, so desktop controls stay dense.
  Inline links inside prose are deliberately exempt.
- The tokenomics palette is validated, not eyeballed. The first attempt paired two hues at
  a colour distance of 0.3 under protanopia; the shipped set holds 13.9 or better on every
  adjacent pair, and every segment is direct labelled so identity never rests on colour.
- `prefers-reduced-motion: reduce` suppresses motion globally rather than per animation.
- Verified across 30 viewport, theme and locale combinations with no horizontal overflow.
- Social marks are the official brand paths from `simple-icons`, rendered with
  `currentColor` so they stay legible on every theme. Do not recolour or distort them.

![Mobile](docs/screenshots/mobile-dark.png)

## Known gaps

- Safe area insets for notched devices are implemented but not verified on real hardware.
- `/privacy` and `/terms` are linked from the footer but not yet written.

## License

MIT.
