---
name: i18n-rtl-ltr
description: Direction and localisation rules for this site - ten locales, two right-to-left. Load before any layout work, before adding a language, and before touching anything that prints a number, an address or a URL.
---

# Ten languages, two of them right-to-left

`en fa ar es pt hi zh ru fr tr`, in that order - it is also the order the switcher lists.
`fa` and `ar` are RTL. Everything below is enforced somewhere; the tests are named.

## One authority for direction, and it is the SERVER

`mountPages` is handed the ten languages (`LOCALES` in `server/src/app.ts`, which is the
blog's `POST_LOCALES`) and negotiates every request: the reader's `locale` cookie first,
because it is an answer they gave; then `Accept-Language` **in preference order**, which is
the half hand-rolled detectors get backwards; then English. It stamps `lang` and `dir` on the
`<html>` of the response, on the root, so scrollbars, text selection and native form controls
mirror too.

That means the document arrives correctly labelled and correctly mirrored **before any script
runs** - which is what a crawler reads, what a screen reader announces in, and what lays a
Persian page out right-to-left on its first paint.

`src/stores/locale.ts` READS that stamp through `useLocale()` from `azerothjs` and writes the
cookie on a switch through `setLocale()`. It detects nothing and stamps nothing. Nothing else
may write either attribute, and the pre-paint script in `index.html` settles the **theme
only** - `tests/prepaint.spec.ts` asserts it never touches `lang` or `dir`.

`directionOf(locale)` is **exported for a reason**: a component testing
`locale === 'fa' || locale === 'ar'` for itself is a copy of the RTL set that nobody will
update on the day an eleventh language arrives. The blog needs it because a post can be
written in a language the reader is not using - an English post inside a mirrored page is an
LTR island and has to be marked as one, or its trailing punctuation jumps to the wrong end.
It answers through `Intl`, the same way the framework decides the document's own direction,
so a page and an island inside it cannot disagree.

### A reader's language is not a document's

Two different questions that look alike. A post written in Persian shown to an English reader
is an English page containing a Persian article: the article carries its own `lang`/`dir`
where it is rendered, and nothing rewrites the document from it. `server/src/seo/pages.ts`
used to, which mirrored the header, the footer and the whole interface around one paragraph.

### Two lists that must stay in step

`LOCALES` here and `POST_LOCALES` in `server/src/schemas.ts` - `tests/blog-locales.spec.ts`
fails if they drift, and the failure it prevents is quiet: the site offers an eleventh
language, the reader picks it, and every blog request 422s on a locale the server has never
heard of. The theme list in the pre-paint script must match `THEMES` in `stores/theme.ts`.

**Adding a language** is: a row in `LOCALES`, a row in `POST_LOCALES`, a file under
`src/lib/i18n/`, and an entry in `TABLE`. The pre-paint script is no longer part of it.

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
npm run test:i18n        # string tables, direction, the pre-paint script (theme)
npm run qa:visual -- --url http://127.0.0.1:3000/
```

`qa:visual` drives `en`/ltr and `fa`/rtl across all three viewports and asserts the document
direction actually flipped. Then **open the Persian screenshots** - the assertions catch
overflow, not text wrapping badly or a label colliding with a mirrored icon.
