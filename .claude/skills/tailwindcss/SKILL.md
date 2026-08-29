---
name: tailwindcss
description: Tailwind CSS v4 conventions for this repository - CSS-first config in src/styles.css, the @theme inline indirection trap, token rules, logical utilities and custom utilities. Load before writing or changing any class list, token or stylesheet in application/.
---

# Tailwind CSS v4 here

`tailwindcss@4.3.3`, driven by `@tailwindcss/vite` in `application/vite.config.ts`.
**There is no `tailwind.config.js` and there will not be one** - v4 is configured in CSS.
The whole configuration is `application/src/styles.css`, which opens with
`@import 'tailwindcss';`.

Your training data is largely v3. Reach for Context7 (`/websites/tailwindcss`) over memory
whenever a directive, a utility name or a config shape is in question - `/websites/v3_tailwindcss`
is the wrong library for this repo.

## Tokens

Two layers, and the order matters:

1. **Raw values** are declared per theme on `:root[data-theme='dark']` and
   `:root[data-theme='light']` - `--bg`, `--ink`, `--accent`, `--line`, and the rest.
   A new colour is added to **both** themes or it is not added.
2. **`@theme inline`** maps them into utilities: `--color-bg: var(--bg)`.

`@theme inline` **inlines the literal value** of what you give it into the generated utility.
Write `--color-accent: #2ad4b8` there and `.bg-accent` is frozen at that hex, and the theme
attribute stops reaching it. Every runtime-varying token must therefore point at another
variable. Two non-colour tokens work the same way for the same reason:

- `--font-mono: var(--mono)`, because `--mono` is redefined under `:lang(fa)` / `:lang(ar)`
  to append Vazirmatn - no Latin mono face carries Arabic-Indic digits, and every live
  figure on this site is `font-mono`.
- `--font-display: var(--display)`, same indirection, so the fa/ar stack can be reordered.

Rules that do not bend:

- **Never a raw hex in a component**, and never an arbitrary colour class
  (`bg-[#0d141f]`, `text-[rgb(...)]`). Add a token to both themes and use it.
- A new colour is **contrast-measured**, not eyeballed. WCAG AA floor: 4.5:1 normal text,
  3:1 large text and non-text indicators. `--faint` was raised from 3.56:1 for exactly this
  reason - do not regress it.
- `.font-label` is the mono face for micro-labels; `.font-mono` is **reserved for live
  figures**, because the test suite selects `.font-mono` to find the numbers. Do not put
  `font-mono` on a label.

## Custom utilities

Existing custom classes (`.glow`, `.font-label`, `.blueprint`, the hero pieces) live in
`@layer utilities` at the bottom of `styles.css`. Follow that for a plain class.

If the new class needs to compose with **variants** (`hover:`, `md:`, `rtl:`), use v4's
`@utility` directive instead - a `@layer utilities` rule is not variant-aware. Say in a
comment why it earned one.

`@apply` is a last resort. In v4 a separately-bundled stylesheet has no access to theme
variables without `@reference`; this project has one stylesheet, so the situation should
never arise - if you think it has, you are probably adding a second sheet, which is the
actual mistake.

## Direction

Two RTL locales ship (`fa`, `ar`). **Logical utilities only**: `ms-`/`me-`, `ps-`/`pe-`,
`start-`/`end-`, `text-start`/`text-end`, `border-s`/`border-e`. A physical `ml-`, `pr-`,
`left-`, `text-right` is a defect unless a comment says it is deliberately physical - the
centred language modal (`left-1/2` + `-translate-x-1/2`) is the one standing exception.

Prefer `gap-*` over margins on children: `gap` is direction-neutral and survives RTL without
a second rule.

Mirror direction-of-travel icons only (`rtl:-scale-x-100`). Never brand marks, logos or flags.

## Layout

- Every section shares `max-w-4xl`, so the page keeps one left edge as you scroll.
- Target viewports: 1440x900, 1024x768, 390x844.
- **Do not size touch targets per component.** `styles.css` gives every control 44px under a
  coarse pointer, globally. The one local exception is the TVL breakdown toggle in
  `network.section.azeroth`, and it says why. Playwright reports a *fine* pointer by
  default, which will tempt you into re-specifying a rule that is already there.
- Animate `transform` and `opacity`. `width`, `height`, `top`, `left` force layout every frame.

## Before you claim it works

```bash
npm run dev                                     # note the port; 4000 may be taken
npm run qa:visual -- --url http://localhost:<port>/
```

3 viewports x 2 directions: direction flip, horizontal-scroll and escaped-element detection,
axe WCAG 2.1 AA. Then **look at the screenshots** in `artifacts/visual-qa/` - the assertions
catch overflow and contrast, not a heading colliding with an icon or Persian wrapping badly.
