import br from 'flag-icons/flags/4x3/br.svg';
import cn from 'flag-icons/flags/4x3/cn.svg';
import esFlag from 'flag-icons/flags/4x3/es.svg';
import fr from 'flag-icons/flags/4x3/fr.svg';
import ind from 'flag-icons/flags/4x3/in.svg';
import ir from 'flag-icons/flags/4x3/ir.svg';
import ru from 'flag-icons/flags/4x3/ru.svg';
import sa from 'flag-icons/flags/4x3/sa.svg';
import tr from 'flag-icons/flags/4x3/tr.svg';
import us from 'flag-icons/flags/4x3/us.svg';

import type { Locale } from '../../stores/locale';

/**
 * A flag per language for the picker. A language is not a country, so every row of this
 * table is a judgment call, recorded here so changing one is a one-line edit: US over GB
 * because that is the flag most of the web reaches for; Brazil because the Portuguese copy
 * leans pt-BR and Brazil holds most of its speakers; Saudi Arabia as the conventional
 * stand-in for Arabic. The imports resolve to asset URLs, so a flag is only ever fetched
 * once the modal actually renders it.
 */
const FLAG: Record<Locale, string> =
{
    en: us,
    fa: ir,
    ar: sa,
    es: esFlag,
    pt: br,
    hi: ind,
    zh: cn,
    ru,
    fr,
    tr
};

export const flagSrc = (locale: Locale): string => FLAG[locale];

/** Set once the warm-up has run, so every approach after the first costs nothing. */
let warmed = false;

/**
 * Fetch every flag ahead of the picker that will show them.
 *
 * The dialog's rows paint at once and their flags arrive afterwards, so the modal appears to
 * assemble itself. Four of the ten are the whole cause: Vite inlines an asset under 4KB into
 * the bundle, so `fr`, `ru`, `tr`, `us`, `cn` and `in` are already in memory - but `es`
 * (79KB, the full coat of arms), `ir`, `sa` and `br` stay separate files and are not
 * requested until a row renders them.
 *
 * Called on INTENT - the drawer opening, or a pointer or focus reaching the trigger - and
 * never on load. A visitor who does not go near the picker should not pay 111KB for it,
 * which is the same bargain the per-script font subsets already make.
 */
export const preloadFlags = (): void =>
{
    // No document on the server, where the blog routes render this component's neighbours.
    if (warmed || typeof document === 'undefined')
    {
        return;
    }

    warmed = true;

    for (const src of Object.values(FLAG))
    {
        // The request is the point; the element is never mounted and the decode is the
        // browser's to schedule.
        new Image().src = src;
    }
};
