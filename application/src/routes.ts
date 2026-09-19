// The one route table. The client router, the SSR entry and the kit's server half all read
// it, so there is no second manifest. Adding a page is one row plus its component under
// src/pages/; the router matches top-level absolute paths and renders the component into
// <Routes>.
import type { PageRoute } from '@azerothjs/kit';

import { blogQuery } from './lib/blog-query.ts';
import { loadBlogIndex, loadPost, loadWhitepaper } from './lib/loaders.ts';
import { readerLocale } from './lib/reader-locale.ts';

import About from './pages/about.page.azeroth';
import Blog from './pages/blog.page.azeroth';
import Home from './pages/home.page.azeroth';
import Post from './pages/post.page.azeroth';
import Whitepaper from './pages/whitepaper.page.azeroth';

/*
 * Every page renders on the SERVER, and the ones with content declare a loader.
 *
 * Both halves of that are recent and they belong together. The kit hands a `'server'` route a
 * real `Request`, so the language is negotiated per reader and stamped on the document before
 * a byte leaves - and it runs the route's loader before the render, so the markup a crawler
 * and a no-JavaScript reader receive is the actual article rather than a loading skeleton.
 * The loader's result rides the handoff into the page, so the hydrating browser draws it
 * without asking again.
 *
 * `/` and `/about` carry no loader because they state no fetched content: the landing sections
 * read live chain figures inside effects, which never run on a server and are not what anybody
 * indexes, and the pre-paint script settles the theme before first paint. They render on the
 * server all the same, for their heads and for their copy - which is translated, and was being
 * served in English to every reader.
 *
 * One address per post, still. The whole site negotiates one url per page rather than giving
 * each language its own (`/fa/blog/...`), so there is no second url for `hreflang` to name;
 * `seo/sitemap.ts` says the same. Prefix routing is a change to every address the site has
 * ever shared, which is a decision to take on purpose rather than to inherit from a blog.
 */
export const routes: PageRoute[] = [
    { path: '/', component: Home, render: 'server' },
    { path: '/about', component: About, render: 'server' },

    {
        path: '/blog',
        component: Blog,
        render: 'server',
        // The page and the tag come from the URL, so the loader keys on them and a link to
        // page two is a real address rather than a click somebody has to repeat.
        loader: ({ query, request }) => loadBlogIndex(blogQuery(query), readerLocale(request))
    },

    {
        path: '/blog/:slug',
        component: Post,
        render: 'server',
        // A slug nobody has published throws `notFound()` in here, which is a real 404 rather
        // than the soft one this site used to serve: a mistyped address was answered 200 with
        // the shell's generic title, so every wrong link became a duplicate of the home page
        // in the index.
        loader: ({ params, request }) => loadPost(params.slug ?? '', readerLocale(request))
    },

    {
        path: '/whitepaper',
        component: Whitepaper,
        render: 'server',
        // The page a reader is most likely to cite, so the one that most needs to be indexed
        // as the document rather than as a frame. The PDFs sit under the same prefix -
        // `/whitepaper/<file>.pdf` - and are served ahead of the kit; see `PDF_ROUTE`.
        loader: ({ request }) => loadWhitepaper(readerLocale(request))
    }
];
