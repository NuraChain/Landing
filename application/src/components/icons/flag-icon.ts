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
