import { createElement } from 'lucide';
import type { IconNode } from 'lucide';

/**
 * The two ways an SVG glyph gets built on this site: from lucide's path data, and by hand
 * for the brand marks. Both are `aria-hidden` by construction - every icon here sits beside
 * real text or inside a control that carries its own accessible name, so announcing the
 * glyph too would read the label twice. An icon that is the ONLY content of a control needs
 * an `aria-label` on the control itself, not in these helpers.
 */

/**
 * A lucide glyph as an element, ready to drop into markup.
 */
export const icon = (node: IconNode, className = 'size-5'): SVGElement | null =>
{
    // Null on a server, where there is no `document` to build into. Same call as
    // `svgMark`, and for the reasons written there.
    if (typeof document === 'undefined')
    {
        return null;
    }

    const svg = createElement(node);

    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');

    return svg;
};

/**
 * The one place an SVG glyph is built by hand.
 *
 * `brandIcon` and `platformIcon` were the same eleven lines twice over - same viewBox, same
 * single `currentColor` path, same `aria-hidden`. They differ in which mark they carry and in
 * how colour reaches them, which is what their own files are for; the construction is here.
 *
 * Returns null on a server, which is not a failure.
 *
 * A glyph is built with `document.createElementNS`, and the blog routes render where there is
 * no document - with the header and footer, which together hold every icon on the site.
 *
 * Skipping them costs nothing that carries meaning: each one is `aria-hidden` beside real text,
 * so a crawler and a screen reader lose none of it, and each sits in a box already sized by CSS,
 * so the glyph arriving at hydration moves no layout. What it does cost is a reader with
 * JavaScript off, who gets the labels without the marks - the right side to fail on for a
 * decoration.
 */
export const svgMark = (path: string, className: string): SVGElement | null =>
{
    if (typeof document === 'undefined')
    {
        return null;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const glyph = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    glyph.setAttribute('d', path);
    glyph.setAttribute('fill', 'currentColor');

    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    svg.append(glyph);

    return svg;
};
