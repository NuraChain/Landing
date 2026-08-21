# Nura Landing Page

The marketing site for **Nura Wallet**: a self custody wallet for the Nura network.
Ten languages, two of them right to left, three themes, live chain and TVL figures read in
the browser, and a download path for every platform.

It also carries a **blog** in all ten languages and a **dashboard** to write it from.

[![Built with AzerothJS](https://img.shields.io/badge/built%20with-AzerothJS-2ad4b8)](https://github.com/AzerothJS/AzerothJS)
[![Node](https://img.shields.io/badge/node-%3E%3D20-5fb3e8)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

## Layout

Two npm workspaces:

| Workspace | What it holds |
| --- | --- |
| `application/` | the site: components, sections, pages, the design system, the i18n tables |
| `server/` | the HTTP API, the sqlite index, and the process that serves the built bundles |

`server/src/schemas.ts` declares every wire shape once; the browser infers its types from
that file, so a field is defined in exactly one place.

## Quick start

```bash
npm install
npm run dev        # both halves, with hot reload
```

| Script | What it does |
| --- | --- |
| `npm run dev` | dev servers for both halves |
| `npm run check` | typecheck and lint, both workspaces, in one pass |
| `npm run build` | client bundle, SSR bundle |
| `npm start` | run the built site (honours `PORT`) |
| `npm run admin:key` | generate a dashboard key |

## The blog and the dashboard

Posts live in sqlite. A post carries any subset of the ten languages and names one of them
as its fallback, so a reader whose language is missing still gets the post — told plainly
that it is not in their language, with the languages it does have offered beside it.

The dashboard is at **`/admin`**, reached by typing the path: nothing on the site links to
it. Sign in with a key:

```bash
npm run admin:key            # prints e.g. ABCD-EFGH-JKLM-NPQR
```

Put it in `server/.env` as `ADMIN_KEY`. In production the server **refuses to start**
without one; in development it starts with the dashboard disabled rather than unlocked. The
key is compared in constant time against a SHA-256 digest and exchanged for an httpOnly
`__Host-` cookie; only session digests are stored, never a token.

## Tests

Vitest over real DOM (happy-dom) through the AzerothJS compiler - the same pipeline that
serves the app, so a component test renders what a visitor would get.

```bash
npm test               # both halves
npm run test:shuffle   # both halves, shuffled - catches order dependence
npm run test:server    # the API and the store alone
npm run test:watch     # re-run on change
npm run coverage       # the browser half, with a report in coverage/
```

Run these through the workspace scripts. A bare `npx vitest` at the repository root finds
the specs but none of the configuration they need, and fails tests that are fine.

Slices, for driving one area without remembering file names:

| Script | Covers |
| --- | --- |
| `npm run test:unit` | pure logic: wallet, stores, site constants, string tables, the network module |
| `npm run test:integration` | component to store to network: sections, header, add-chain, app shell |
| `npm run test:fuzz` | seeded property runs over the hex and uint256 parsers |
| `npm run test:security` | link safety, upstream failure handling, EIP-3085 params, chain constants |
| `npm run test:i18n` | string-table shape, direction, and the pre-paint script |

### How the suite is built

* **No network, and no ports.** The three upstreams (Nura RPC, Nura explorer, CoinGecko) are
  stubbed at `fetch` in every spec that touches them, and the server suite runs against an
  in-memory sqlite database with a stubbed chain gateway — nothing listens, nothing dials
  out. A red build always means a real change and never a third party having a bad minute.
  No secrets or credentials are involved anywhere.
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
| `markdown.spec.ts` | the post-body subset, heading levels, and a hostile-payload sweep |
| `blog-locales.spec.ts` | the post languages and the site languages staying in step |

The server half carries its own suite: the store and its migrations, the fallback policy,
the public blog API, and the admin routes — sign-in, the same-origin guard, rate limiting,
and every write route refusing an unauthenticated caller.

## CI

`.github/workflows/ci.yml` runs four jobs on every push and pull request: typecheck and
lint, tests with coverage, a determinism pass, and a production build that smoke-checks the
bundle. Nothing depends on a secret, so it works on forks.

## License

MIT.
