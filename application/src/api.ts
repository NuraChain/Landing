// The one file that crosses into the server half - and it crosses with TYPES only. `typeof api`
// is erased at build, so no handler, no store and no server dependency can reach the browser
// bundle. The runtime half is the MANIFEST: embedded in a server-rendered page by the kit
// (readManifest, synchronous), and fetched once on a plain vite dev page.
import { ApiError, createClient, readManifest, type Manifest } from '@azerothjs/http/api/shared';

import type { Api } from '../../server/src/app.ts';

// Re-exported so a call site imports its error from the same module as the client that
// throws it, rather than reaching into the framework for a type it already has in hand.
export { ApiError };

export type {
    PostCard,
    PostDetail,
    PostEditor,
    PostLocale,
    PostPage,
    PostRecord,
    SessionState,
    TagCount
} from '../../server/src/schemas.ts';

/**
 * The price relay's wire shape.
 *
 * Aliased on the way through because `lib/network.ts` exports its own `NuraPrice` - the same
 * figure with `at` already parsed into a Date - and two types of that name in one module
 * graph is a confusion waiting to be imported from the wrong side. This one is what arrives;
 * that one is what the page uses.
 *
 * Re-exported here rather than imported from the server directly, so this file stays the
 * single crossing: `grep -rn 'server/src'` in this half is still one file long.
 */
export type { NuraPrice as NuraPriceWire } from '../../server/src/schemas.ts';

/**
 * SSR loads with an EMPTY manifest and that is deliberate: pages fetch inside `effect`, which
 * runs only in the browser, so no call is ever made server-side. An unreachable manifest degrades
 * to `{}` rather than throwing, so a failed boot request costs one page its data instead of
 * taking the whole module graph down and painting nothing.
 */
const manifest: Manifest = typeof document === 'undefined'
    ? {}
    : readManifest() ?? await fetch('/api/_manifest')
        .then((response) => response.json() as Promise<Manifest>)
        .catch(() => ({}));

export const client = createClient<Api>(manifest, { baseUrl: '/api' });
