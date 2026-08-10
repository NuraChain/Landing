import { siAndroid, siApple, siLinux } from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

import type { PlatformId } from '../lib/content/site';

/**
 * The real mark for each platform, not a generic stand-in.
 *
 * These replaced lucide's `Monitor`/`Smartphone`/`Terminal` shapes, which said "a computer"
 * rather than "Windows" and left a visitor scanning labels to find their own OS.
 *
 * `simple-icons` supplies Apple, Android and Linux as official CC0 path data. It does NOT
 * ship Windows - Microsoft's marks were removed from the set over trademark - so that one
 * path is written out below. Drawing a logo by hand is normally how you get a shape that is
 * recognisably wrong, which is safe here only because the Windows flag is four
 * quadrilaterals: exact geometry, nothing to approximate.
 *
 * iOS and macOS deliberately share the Apple mark, as do the two Android rows. Each pair is
 * one brand, so giving either row an invented alternative would be the inaccurate choice;
 * the labels beside them are what tell them apart.
 */
const WINDOWS_PATH = 'M0 3.449 9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699'
    + 'M10.949 12.6H24V24l-12.9-1.801';

const MARK: Record<PlatformId, SimpleIcon | string> =
{
    ios: siApple,
    android: siAndroid,
    apk: siAndroid,
    windows: WINDOWS_PATH,
    macos: siApple,
    linux: siLinux
};

/**
 * Colour comes from a `--brand-*` token, never the brand hex baked in here.
 *
 * The published hexes fail outright on at least one of this site's three themes: Apple's
 * #000000 measures 1.14:1 on the dark surface and 1.00:1 on the contrast theme - black on
 * black - while Linux yellow lands at 1.59:1 against white. Each token therefore carries a
 * per-theme step of the same hue, every one measured past 3:1. See styles.css.
 */
export const platformIcon = (id: PlatformId, className = 'size-5'): SVGElement =>
{
    const mark = MARK[id];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('d', typeof mark === 'string' ? mark : mark.path);
    path.setAttribute('fill', 'currentColor');

    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    svg.append(path);

    return svg;
};
