import { h } from 'azerothjs';
import type { IconNode } from 'lucide';
import type { Child } from 'azerothjs';

/**
 * The two ways an SVG glyph gets built on this site: from lucide's path data, and by hand
 * for the brand marks. Both are `aria-hidden` by construction - every icon here sits beside
 * real text or inside a control that carries its own accessible name, so announcing the
 * glyph too would read the label twice. An icon that is the ONLY content of a control needs
 * an `aria-label` on the control itself, not in these helpers.
 *
 * Both build through `h()` rather than through `document.createElementNS`, and that is what
 * lets them render on a SERVER. They used to answer null there, on the grounds that a glyph
 * is decoration and a crawler loses nothing - true, but every page renders on the server now
 * and the browser then hydrates the markup it was sent. A null on one side and an `<svg>` on
 * the other is a structural mismatch, which throws the whole server render away and rebuilds
 * the page client-side. `h()` emits the same element in both modes, so nothing diverges.
 */

/** The attributes every lucide glyph carries; the node data supplies only the geometry. */
const LUCIDE = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
} as const;

/**
 * A lucide glyph as an element, ready to drop into markup.
 *
 * `IconNode` is a list of `[tag, attributes]` pairs - the shapes that make up the drawing -
 * which are spread into children here exactly as lucide's own `createElement` does.
 */
export const icon = (node: IconNode, className = 'size-5'): Child =>
    h(
        'svg',
        { ...LUCIDE, class: className, 'aria-hidden': 'true' },
        ...node.map(([tag, attributes]) => h(tag, { ...attributes }))
    );

/**
 * The one place an SVG glyph is built by hand.
 *
 * `brandIcon` and `platformIcon` were the same eleven lines twice over - same viewBox, same
 * single `currentColor` path, same `aria-hidden`. They differ in which mark they carry and in
 * how colour reaches them, which is what their own files are for; the construction is here.
 */
export const svgMark = (path: string, className: string): Child =>
    h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', class: className, 'aria-hidden': 'true' },
        h('path', { d: path, fill: 'currentColor' })
    );
