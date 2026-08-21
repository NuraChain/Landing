// The one route table. The client router, the SSR entry and the kit's server half all read
// it, so there is no second manifest. Adding a page is one row plus its component under
// src/pages/; the router matches top-level absolute paths and renders the component into
// <Routes>.
import type { PageRoute } from '@azerothjs/kit';

import About from './pages/about.page.azeroth';
import Admin from './pages/admin.page.azeroth';
import Blog from './pages/blog.page.azeroth';
import Home from './pages/home.page.azeroth';
import Post from './pages/post.page.azeroth';

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
 */
export const routes: PageRoute[] = [
    { path: '/', component: Home, render: 'client' },
    { path: '/about', component: About, render: 'client' },

    /*
     * The blog server-renders the FRAME, not the post. Said plainly because the difference
     * is easy to assume away: what a crawler receives from these two paths today is the
     * header, the footer and the word "Loading" - the text arrives on hydration.
     *
     * Two things in 2.0.0-beta.2 stop it going further, and both are the framework's, not
     * this page's:
     *
     *   - the kit splices only `<div id="root">` and the loader handoff into the built
     *     shell, leaving `<title>` and every meta tag exactly as index.html declared them.
     *     Route loaders would put the post's text in the HTML, but all ten posts would
     *     still share one title and one description - the parts a search result and a link
     *     preview are actually built from;
     *   - a loader is handed `{ params, query, signal }` and no request headers, and this
     *     site keeps the reader's language in a store rather than in the URL. So a loader
     *     could not resolve WHICH translation to render, and would serve every reader the
     *     default language followed by a swap on hydration.
     *
     * The second is the one that decides it. Real per-post SSR wants the locale in the
     * path - `/fa/blog/...` - which is a routing change for the whole site and not
     * something to smuggle in behind a blog.
     *
     * `'server'` still earns its place: the frame is markup rather than an empty root, so
     * the first paint is the site instead of a blank page. It just is not SEO, and this
     * comment is not going to say that it is.
     */
    { path: '/blog', component: Blog, render: 'server' },
    { path: '/blog/:slug', component: Post, render: 'server' },

    /*
     * Not linked from anywhere on the site, and not an oversight: a single shared key is
     * the only thing guarding this, so the door is not advertised. robots.txt disallows
     * it as well - that stops an honest crawler indexing the path, and nothing else.
     *
     * 'client' because every branch of the page depends on a session cookie. Rendering it
     * on the server would produce a signed-out shell for a signed-in operator, replaced a
     * moment later - slower than not rendering it at all, and briefly wrong.
     */
    { path: '/admin', component: Admin, render: 'client' }
];
