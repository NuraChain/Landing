---
name: accessibility-audit
description: How accessibility is done and checked in this repository - native semantics, the overlay contract, globally enforced touch targets, contrast floors, the reduced-motion split, and the axe run behind npm run qa:visual. Load for review work and before shipping any interactive UI.
---

# Accessibility here

## Semantics

**Native over ARIA.** Do not add ARIA speculatively - most ARIA in the wild makes things
worse. A `<button>` beats `<div role="button">`, `<summary>` beats a click handler.

- Icon-only controls carry `aria-label`; the icon itself is `aria-hidden`.
- **One `h1` per document** - the hero. Sections use `h2` through `SectionHeading`.
- The skip link is the **first tab stop** and targets `#main`. It lives in `App.azeroth`,
  outside `<Routes>`, so it survives navigation.
- Blog markdown levels headings against the document's own shallowest heading, so `#`/`##`
  and `##`/`###` both come out h2/h3 rather than skipping a level under the page's h1.

## Overlays

**The drawer and the language dialog go through `lib/overlay.ts`, and so must anything new.**
`captureOverlay(close, panelSelector)` returns the closer and owns four obligations that
share one lifetime:

1. Escape closes;
2. the page behind stops scrolling;
3. focus moves **into** the panel;
4. focus returns to whatever opened it.

The focus half is the one that matters most: both panels mount through a `Portal` at the end
of `document.body`, so without the trap a Tab from the trigger walks the whole page
underneath the scrim - which the pointer cannot reach - before arriving at the panel covering
it. The trap wraps at both ends. `[tabindex="-1"]` is excluded on purpose: focusable, not
tabbable.

`panelSelector` resolves on the next frame, because the caller is the effect reacting to the
state change that mounts the panel.

## Targets and contrast

**Touch targets are global. Do not re-specify them per component.** `styles.css` gives
`button`, `[role='button']`, `summary` and navigation links 44px under `@media (pointer:
coarse)`. A component sizing itself by viewport is answering a question the sheet already
answered - and Playwright reports a *fine* pointer by default, which will mislead you into
adding a rule that is already there. The single exception is the TVL breakdown toggle in
`network.section.azeroth`: it was 20px, which fails WCAG 2.5.8's 24px floor for a mouse too,
so it is sized locally and says why.

Colour is **measured, not eyeballed**. WCAG AA floor: 4.5:1 normal text, 3:1 large text and
non-text indicators, on every surface the token appears over (`--bg`, `--surface`,
`--elevated`) and in **both** themes. `--faint` shipped at 3.56:1 and was raised - do not
regress it. Never a raw hex in a component.

## Reduced motion

`motionOk()` in `lib/motion.ts` is the gate, and **it is JavaScript, not a CSS rule** - every
JS entry point in that module checks it, as do `smooth-scroll.ts` and the hero's
choreography. Two things sit outside it deliberately:

- `theme-transition.ts` cross-fades rather than sweeping. The preference is about MOVEMENT;
  snapping a whole page between palettes in one frame is the harshest version of the change
  handed to the readers who asked for the gentlest.
- The hero crosshair and `X/Y` readout track the pointer 1:1, no easing, no travel of their
  own. That is direct manipulation. Inside the gate, those readers got a hero permanently
  reading `X 0000 · Y 0000`.

The distinction to hold: **suppress what moves on its own, keep what follows a hand.**

`motionOk()` is read once when the effect runs, so a visitor toggling the OS setting
mid-visit keeps what they loaded with. `createScope`'s `mediaQueries: { reducedMotion:
'(prefers-reduced-motion)' }` is the reactive alternative if that ever matters.

## The audit run

```bash
npm run dev                                     # note the port; 4000 may be taken
npm run qa:visual -- --url http://localhost:<port>/
```

`scripts/visual-qa.mjs` drives 3 viewports x 2 directions (1440x900, 1024x768, 390x844;
`en`/ltr and `fa`/rtl) and per scenario asserts the document direction flipped, detects
horizontal scroll and elements escaping the viewport, and runs axe over
`wcag2a wcag2aa wcag21a wcag21aa`. A **critical or serious** violation is a FAIL and exits
non-zero; anything lighter is a WARN and does not.

Two things the script does that you should not undo when editing it: it settles the hero's
one-shot timeline before auditing (mid-animation opacity read as a serious `color-contrast`
failure), and it scrolls the page in steps first, because the full-page screenshot stitches
from the top without scrolling - so lazy sections were never revealed and axe was auditing a
page the artifacts did not show.

**Then look at the screenshots** in `artifacts/visual-qa/`, next to `report.json`. The
assertions catch overflow and contrast. A heading colliding with an icon, or Persian
wrapping badly, only your eyes catch.
