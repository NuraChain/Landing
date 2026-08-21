import { siDiscord, siGithub, siInstagram, siTelegram, siX, siYoutube } from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

import { svgMark } from './svg-mark';
import type { SocialId } from '../lib/content/site';

/**
 * Official brand marks, not lookalikes.
 *
 * lucide removed its brand icons over trademark, and hand-drawing a logo produces a shape
 * that is recognisably wrong. `simple-icons` ships the real path data (CC0), which leaves
 * only the trademark question, and that is answered by USE: these link to Nura Chain's own
 * profiles on each platform, which is the nominative use every one of these brands permits
 * in its guidelines. Do not recolour or distort them.
 */
const MARK: Record<SocialId, SimpleIcon> =
{
    github: siGithub,
    telegram: siTelegram,
    x: siX,
    discord: siDiscord,
    youtube: siYoutube,
    instagram: siInstagram
};

/**
 * Renders with `currentColor` rather than the brand hex, so a mark stays legible on all
 * three themes. The contrast theme in particular needs full-strength ink; GitHub's own
 * near-black would vanish into that background.
 */
export const brandIcon = (id: SocialId, className = 'size-[18px]'): SVGElement | null =>
{
    return svgMark(MARK[id].path, className);
};
