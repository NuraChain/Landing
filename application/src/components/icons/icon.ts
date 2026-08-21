import { createElement } from 'lucide';
import type { IconNode } from 'lucide';

/**
 * A lucide glyph as an element, ready to drop into markup.
 *
 * Always `aria-hidden`: every icon on this site sits beside real text or inside a control
 * that carries its own accessible name, so announcing the glyph too would read the label
 * twice. An icon that is the ONLY content of a control needs an `aria-label` on the
 * control itself, not here.
 */
export const icon = (node: IconNode, className = 'size-5'): SVGElement | null =>
{
    // Null on a server, where lucide has no `document` to build into. Same call as
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
