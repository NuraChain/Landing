---
name: i18n-rtl-ltr
description: Direction and localisation rules for this site - ten locales, two right-to-left. Load before any layout work, before adding a language, and before touching anything that prints a number, an address or a URL.
---

# Ten languages, two of them right-to-left

`en fa ar es pt hi zh ru fr tr`, in that order - it is also the order the switcher lists.
`fa` and `ar` are RTL. Everything below is enforced somewhere; the tests are named.

## One authority for direction

`src/stores/locale.ts` owns it. The store's effect stamps `lang` and `dir` on
`document.documentElement` - on the root, not per component, so scrollbars, text selection
and native form controls mirror too. Nothing else may write either attribute.

`directionOf(locale)` is **exported for a reason**: a component testing
`locale === 'fa' || locale === 'ar'` for itself is a copy of the RTL set that nobody will
update on the day an eleventh language arrives. The blog needs it because a post can be
written in a language the reader is not using - an English post inside a mirrored page is an
LTR island and has to be marked as one, or its trailing punctuation jumps to the wrong end.

### Three lists that must stay in step

`index.html` runs a pre-paint script that resolves theme and locale **before first paint** -
setting `dir` after hydration reflows the entire page in Persian. It carries its own copies
of the locale list, the RTL set and the theme list, and they must match `LOCALES` / `RTL` in
`stores/locale.ts` and the themes in `stores/theme.ts`. `tests/prepaint.spec.ts` fails if
they drift. `POST_LOCALES` in the blog must match `LOCALES` too - `tests/blog-locales.spec.ts`.

**Adding a language** is: a row in `LOCALES`, a file under `src/lib/i18n/`, an entry in
`TABLE`, and both lists in the pre-paint script. Miss the last one and the first paint
disagrees with the hydrated page.

## Utilities

**Logical only.** `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`/`text-end`,
`border-s`/`border-e`. A physical `ml-`, `pr-`, `left-`, `text-right` is a defect unless a
comment says it is deliberately physical:

- the centred language modal (`left-1/2` + `-translate-x-1/2`) - commented, the one standing
  exception;
- the hero crosshair and scanline transforms, which track a physical cursor position.

Prefer `gap-*` over margins on children. `gap` is direction-neutral and survives RTL with no
second rule.

## Pinning Latin runs

URLs, wallet addresses, hashes, chain ids, version strings and file paths go in
`<bdi dir="ltr">`.

**Put the pin on an inner element, never on the block carrying `text-start`.** `start`
resolves against the element's *own* direction, so an `ltr` block inside an RTL row aligns
to the opposite edge from its label. `components/chain/copy-field.component.azeroth` shows
the split; `pages/blog.page.azeroth` repeats it inside a flex child.

## Numbers

**Every number goes through `Intl.NumberFormat(locale())`.** No hand formatting, no template
interpolation of a raw figure - including years, which the footer formats with
`{ useGrouping: false }` so the copyright line does not read "۲٬۰۲۶".

Persian and Arabic render Arabic-Indic digits, and no Latin monospace face carries them.
That is why `--mono` is redefined under `:lang(fa)` / `:lang(ar)` to **append** Vazirmatn -
fallback is per glyph, so addresses stay monospaced while the digits beside them match the
body. `--display` (Space Grotesk) is Latin-only and falls through to Vazirmatn the same way.
Both reach the utilities through `var()` indirection because `@theme inline` inlines
literals - see the `tailwindcss` skill.

## Icons

Mirror **direction of travel** only: the outbound `↗` marker takes `rtl:-scale-x-100`, the
hero's onward arrow rotates. Brand marks, platform logos and flags never mirror.

## Verify

```bash
npm run test:i18n        # string tables, direction, the pre-paint script
npm run qa:visual -- --url http://localhost:<port>/
```

`qa:visual` drives `en`/ltr and `fa`/rtl across all three viewports and asserts the document
direction actually flipped. Then **open the Persian screenshots** - the assertions catch
overflow, not text wrapping badly or a label colliding with a mirrored icon.
