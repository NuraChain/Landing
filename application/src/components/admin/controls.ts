/**
 * The class strings every dashboard control shares.
 *
 * Data rather than a component per control: an input, a textarea and a select need the same
 * surface and the same focus ring but cannot be one element, and three near-identical class
 * strings in three files is how the focus ring ends up different on one of them.
 */

/** The common surface: border, background, focus ring. */
const BASE = 'w-full rounded-xl border border-line bg-bg px-3 text-ink placeholder:text-faint '
    + 'transition-colors focus:border-accent focus:outline-none';

/** A single-line control. */
export const CONTROL = `${ BASE } h-10`;

/**
 * A slug, a tag list, a url - values that are Latin and machine-shaped whatever the interface
 * language is. `dir="ltr"` belongs on the ELEMENT in the markup, not here; this only supplies
 * the face, because a slug set in the Persian text face is hard to proofread.
 */
export const CONTROL_MONO = `${ CONTROL } font-mono text-sm`;

/**
 * A multi-line control. `field-sizing-content` grows the box with the text where it is
 * supported and is ignored where it is not, so the `min-h` is what actually guarantees the
 * size - a body editor that starts one line tall is unusable, and browser support is not
 * something to bet the layout on.
 */
export const CONTROL_AREA = `${ BASE } min-h-40 resize-y py-2 leading-relaxed [field-sizing:content]`;

/** The same, for markdown: a body is read back in a mono face while it still has its syntax in it. */
export const CONTROL_BODY = `${ CONTROL_AREA } font-mono text-sm`;
