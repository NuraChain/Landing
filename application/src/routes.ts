// The one route table. The client router, the SSR entry and the kit's server half all read
// it, so there is no second manifest. Adding a page is one row plus its component under
// src/pages/; the router matches top-level absolute paths and renders the component into
// <Routes>.
import type { PageRoute } from '@azerothjs/kit';

import About from './pages/about.page.azeroth';
import Home from './pages/home.page.azeroth';

/*
 * `render` is PINNED to 'client' on both of these, and the pin is the point.
 *
 * The kit defaults a route to 'server' the moment a renderer is supplied, so introducing the
 * server half would otherwise have quietly begun server-rendering two pages written for a
 * browser: the locale and theme stores read localStorage and stamp `dir`, `lang` and
 * `data-theme` onto document.documentElement, and the network section reads live chain figures
 * through fetch. None of that means anything on a server, and the pre-paint script in
 * index.html already settles direction and theme before the first paint.
 *
 * A page written to be rendered ahead of time says so for itself.
 */
export const routes: PageRoute[] = [
    { path: '/', component: Home, render: 'client' },
    { path: '/about', component: About, render: 'client' }
];
