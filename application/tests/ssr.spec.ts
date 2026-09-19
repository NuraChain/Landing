// @vitest-environment node

// The pages as a SERVER renders them: no window, no document, no localStorage.
//
// Every other spec runs under happy-dom, where `window` exists - so a component that reached
// for it outside an effect passed the whole suite and threw on the first production request.
// Since AzerothJS 2.1.0 a component owns its own scope and its bare `cleanup` blocks run when
// the string render disposes, which is exactly where `window.clearTimeout` blew up. This file
// drives the real SSR entry through the real renderer, in node, so that class of mistake is
// red here before it is a 500 there.
import { describe, it, expect } from 'vitest';

import { renderPage, routes } from '../src/entry.server.ts';

/** The shape the built index.html has, reduced to what the renderer needs to find. */
const SHELL = '<!doctype html><html lang="en"><head><title>Nura</title></head><body><div id="root"></div></body></html>';

describe('server rendering', () =>
{
    it('renders every server route without touching a browser global', async () =>
    {
        // The two blog routes and the whitepaper are the ones the server renders today; the
        // landing pages arrive later. Every row is exercised so a page added as 'server'
        // cannot skip this check.
        const paths = routes.filter((route) => route.render === 'server').map((route) => route.path.replace(':slug', 'any'));

        expect(paths.length).toBeGreaterThan(0);

        for (const path of paths)
        {
            const result = await renderPage(path, SHELL);

            expect(result.kind, path).toBe('html');

            if (result.kind === 'html')
            {
                expect(result.status, path).toBe(200);
                expect(result.html, path).toContain('<main id="main">');
            }
        }
    });
});
