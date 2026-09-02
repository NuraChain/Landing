// The one route table. The client router, the SSR entry and the kit's server half all read
// it, so there is no second manifest. Adding a page is one row plus its component under
// src/pages/; the router matches top-level absolute paths and renders the component into
// <Routes>.
import type { PageRoute } from '@azerothjs/kit';

import About from './pages/about.page.azeroth';
import Blog from './pages/blog.page.azeroth';
import Home from './pages/home.page.azeroth';
import Post from './pages/post.page.azeroth';
import Whitepaper from './pages/whitepaper.page.azeroth';

/*
 * `render` is PINNED on every row, and the pin is the point.
 *
 * The kit defaults a route to 'server' the moment a renderer is supplied, so introducing the
 * server half would otherwise have quietly begun server-rendering two pages written for a
 * browser: the locale and theme stores read localStorage and stamp `dir`, `lang` and
 * `data-theme` onto document.documentElement, and the network section reads live chain figures
 * through fetch. None of that means anything on a server, and the pre-paint script in
 * index.html already settles direction and theme before the first paint.
 *
 * A page written to be rendered ahead of time says so for itself - see the blog below.
 *
 * `'client'` is about the BODY only. Both landing pages are still served a head written on the
 * server - title, description, canonical, Open Graph and JSON-LD, per path - because the kit
 * hands a `'client'` route the shell verbatim, which had `/` and `/about` sharing index.html's
 * single title. See the landing handler in `server/src/app.ts`, which owns those two paths for
 * that reason and serves exactly the same shell the kit would.
 */
export const routes: PageRoute[] = [
    { path: '/', component: Home, render: 'client' },
    { path: '/about', component: About, render: 'client' },

    /*
     * These two serve the REAL ARTICLE, head and body, not a loading frame.
     *
     * This note used to say the opposite - that a crawler got the header, the footer and the
     * word "Loading" - and it was true when the kit was doing all of the work. It is not any
     * more: the kit still leaves `<head>` alone and still splices only `<div id="root">`, so
     * the server half does both jobs itself. `server/src/seo/pages.ts` writes the head and
     * `seo/article.ts` renders the markdown into the same document, wired in `app.ts` by the
     * wrapper around the page renderer. A slug that resolves to nothing is a real 404 rather
     * than a soft one.
     *
     * What HAS NOT changed is the locale, and it is the reason there is still one address per
     * post. The renderer is handed a url and a shell and no request headers, so there is no
     * reader to resolve a translation against; a post is served in its own `defaultLocale` and
     * the switcher moves the rest client-side. Ten indexable addresses would want the locale
     * in the path - `/fa/blog/...` - which is a routing change for the whole site and not
     * something to smuggle in behind a blog. `seo/sitemap.ts` and `seo/meta.ts` both point
     * back here for it: no `hreflang`, because there is no other url to name.
     */
    { path: '/blog', component: Blog, render: 'server' },
    { path: '/blog/:slug', component: Post, render: 'server' },

    /*
     * The whitepaper is served the way a post is: the head from `seo/pages.ts`, the body from
     * `seo/article.ts`, both resolved through one call in the document's own default language.
     * It is the one page on the site a reader is most likely to cite, so it is the one that
     * most needs to be indexed as the document rather than as a loading frame. The PDFs sit
     * under the same prefix - `/whitepaper/<file>.pdf` - and are served by the server half
     * ahead of the kit; see `PDF_ROUTE` in `server/src/whitepaper/content.ts`.
     */
    { path: '/whitepaper', component: Whitepaper, render: 'server' }
];
