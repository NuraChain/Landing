import { useRoute } from 'azerothjs';

/**
 * Builds hrefs for the landing page's section anchors, from anywhere on the site.
 *
 * The sections are anchors in ONE document, so `#chain` is right while that document is on
 * screen and points at nothing from /blog or /about - the visitor gets a dead click and a URL
 * that now reads /blog#chain. Prefixing the path fixes that, but prefixing it unconditionally
 * is worse: a plain `<a href="/#chain">` on the landing page itself is a cross-document
 * navigation the router does not intercept, so the page it is already showing would reload to
 * scroll a few hundred pixels.
 *
 * So: a bare hash at home, a rooted one everywhere else.
 *
 * Used by the header and the footer, which are the two things rendered OUTSIDE `<Routes>` -
 * which is exactly why they are the two that outlive the landing page and need this.
 *
 * Call it during component setup, like any other router composable: it reads the router from
 * the surrounding `<RouterProvider>`. The function it returns is reactive - read it inside an
 * `href={ () => ... }` thunk so the link re-resolves when the route changes underneath it.
 */
export const useSectionHref = (): ((id: string) => string) =>
{
    const location = useRoute();

    return (id: string): string => (location().pathname === '/' ? `#${ id }` : `/#${ id }`);
};
