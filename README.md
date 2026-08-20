# Nura Landing Page

The marketing site for **Nura Wallet**: a self custody wallet for the Nura network.
Ten languages, two of them right to left, three themes, live chain and TVL figures read in
the browser, and a download path for every platform.

[![Built with AzerothJS](https://img.shields.io/badge/built%20with-AzerothJS-2ad4b8)](https://github.com/AzerothJS/AzerothJS)
[![Node](https://img.shields.io/badge/node-%3E%3D20-5fb3e8)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

## Quick start

```bash
npm install
npm run dev        # http://localhost:4000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | dev server with hot reload |
| `npm run check` | typecheck and lint in one pass |
| `npm run build` | production bundle into `dist/` |
| `npm run preview` | serve the built bundle |

## Tests

Vitest over real DOM (happy-dom) through the AzerothJS compiler - the same pipeline that
serves the app, so a component test renders what a visitor would get.

```bash
npm test               # everything
npm run test:watch     # re-run on change
npm run coverage       # everything, with a coverage report in coverage/
```

Slices, for driving one area without remembering file names:

| Script | Covers |
| --- | --- |
| `npm run test:unit` | pure logic: wallet, stores, site constants, string tables, the network module |
| `npm run test:integration` | component to store to network: sections, header, add-chain, app shell |
| `npm run test:fuzz` | seeded property runs over the hex and uint256 parsers |
| `npm run test:security` | link safety, upstream failure handling, EIP-3085 params, chain constants |
| `npm run test:i18n` | string-table shape, direction, and the pre-paint script |

### How the suite is built

* **No network, ever.** The three upstreams (Nura RPC, Nura explorer, CoinGecko) are stubbed
  at `fetch` in every spec that touches them, so a red build always means a real change and
  never a third party having a bad minute. No secrets or credentials are involved anywhere.
* **Deterministic.** No sleeps and no wall clock: TTLs and confirmation timers run on
  `vi.useFakeTimers()`, and the property tests draw from a seeded PRNG, so a failing case is
  reproducible from the message rather than "it went red once". CI runs the suite twice, the
  second time with `--sequence.shuffle`, to catch order dependence between files.
* **Coverage thresholds** live in `vite.config.ts` and fail the run if real coverage drops.

### What each spec is for

| Spec | What it guards |
| --- | --- |
| `network.spec.ts` | the one-minute memo, batch id matching, decimals, zero-supply short circuit |
| `network.fuzz.spec.ts` | hex quantity and uint256 parsing under generated input |
| `network-http.spec.ts` | every upstream answering 4xx/5xx, CORS rejections, malformed bodies |
| `network-section.spec.ts` | tile states: loading, failed, stale-but-real, per-source failure |
| `wallet.spec.ts` | EIP-3085 outcomes and the chain params a wallet actually stores |
| `add-chain.spec.ts` | the button's status machine, including the double-click guard |
| `content.spec.ts` | allocations summing to 100, the public-sale price coupling, link safety |
| `i18n.spec.ts` | ten tables with identical shape, no empty strings, no untranslated prose |
| `prepaint.spec.ts` | the inline script in `index.html` agreeing with the stores |
| `stores.spec.ts` | theme and locale resolution, persistence, blocked storage |
| `components.spec.ts` | the reusable components and their interaction contracts |
| `header.spec.ts` | drawer, language modal, scroll lock, theme control |
| `app-shell.spec.ts` | routing, landmarks, heading outline, link and image safety |
| `direction.spec.ts` | RTL/LTR direction and the bidi isolation of technical values |

## CI

`.github/workflows/ci.yml` runs four jobs on every push and pull request: typecheck and
lint, tests with coverage, a determinism pass, and a production build that smoke-checks the
bundle. Nothing depends on a secret, so it works on forks.

## License

MIT.
