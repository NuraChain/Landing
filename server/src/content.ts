import type { BlogContent } from './blog/content.ts';
import type { WhitepaperContent } from './whitepaper/content.ts';

/**
 * Everything this process serves that was read off disk at boot.
 *
 * One object rather than two parameters, so a consumer that describes the site - the api, the
 * head writer, the sitemap - takes the whole of it and cannot be handed the blog while quietly
 * forgetting the whitepaper. That is the failure a second loose argument invites: the sitemap
 * was `buildSitemap(store, siteUrl)` and a page added beside the blog would have gone uncrawled
 * with nothing red anywhere.
 */
export interface SiteContent
{
    store: BlogContent;
    whitepaper: WhitepaperContent;
}
