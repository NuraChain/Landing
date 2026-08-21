// The one file that crosses into the server half - and it crosses with TYPES only. `typeof api`
// is erased at build, so no handler, no store and no server dependency can reach the browser
// bundle. The runtime half is the MANIFEST: embedded in a server-rendered page by the kit
// (readManifest, synchronous), and fetched once on a plain vite dev page.
import { createClient, readManifest, type Manifest } from '@azerothjs/http/api/shared';

import type { Api } from '../../server/src/app.ts';

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
