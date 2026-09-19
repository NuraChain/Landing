import { createEffect, useLoader, type Resource } from 'azerothjs';

import { useLocale } from '../stores/locale';

/**
 * This level's loader data, re-asked when the reader switches language.
 *
 * Which translation a document resolves to is the SERVER's decision - the reader's language if
 * the post holds it, the post's default if not, anything it holds otherwise - so a language
 * switch cannot be answered in the browser by re-rendering what is already in hand. It has to
 * be a new request.
 *
 * A loader re-runs when its own inputs change, and the language is not one of them: it rides a
 * cookie and a header, not the params or the query. So the watch lives here, once, for every
 * page that shows a localized document - rather than in whichever switcher happened to be
 * clicked, which is how the header and the fallback notice would drift apart.
 *
 * The comparison is against what the data ASKED for, not against what came back: a post with
 * no Persian translation answers in English for a Persian reader, and comparing the SERVED
 * language would re-ask on every single render, forever.
 */
export function useLocalizedLoader<T extends { requestedLocale: string }>(): Resource<T>
{
    const data = useLoader<T>();
    const { locale } = useLocale();

    createEffect(() =>
    {
        const served = data.data();

        if (served !== undefined && served.requestedLocale !== locale())
        {
            void data.refetch();
        }
    }, { name: 'localized-loader' });

    return data;
}
