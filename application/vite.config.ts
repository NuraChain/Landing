import { azeroth } from '@azerothjs/compiler';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [azeroth(), tailwindcss()],

    // The SSR bundle (src/entry.server.ts) inlines the APPLICATION's dependencies, so a
    // production deploy needs no client node_modules at all. The `azerothjs` runtime is
    // deliberately external: the server process must hold ONE instance of it - @azerothjs/http
    // installs the request scope on the copy it resolves, and a second inlined copy would
    // silently split the per-request data cache - and server/package.json already declares it.
    ssr: {
        noExternal: true,
        external: ['azerothjs']
    },

    // Nothing declares a dev server here, and nothing may: `azeroth dev` runs vite INSIDE the
    // server process through @azerothjs/kit, which owns the port and the HMR socket and refuses
    // a `server.proxy` at startup. One origin serves the pages, the api, the PDFs and HMR.
    // Plugins, `ssr`, `resolve`, `css` and the rest of this file are read by that session as
    // they are.

    test: {
        environment: 'happy-dom',
        // Node's own experimental localStorage shadows the DOM's - see tests/setup.ts.
        setupFiles: ['tests/setup.ts'],

        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: 'coverage',

            // Everything that ships, whether a test currently touches it or not - otherwise
            // an untested module simply disappears from the report instead of showing 0%,
            // which is the one number worth seeing.
            include: ['src/**/*.{ts,azeroth}'],
            exclude: [
                // No branches to cover: a one-line mount, a type-only declaration, ten string
                // tables whose shape is asserted in i18n.spec.ts rather than by executing them,
                // and the SSR entry, which is two re-exports the server imports by name.
                'src/main.azeroth',
                'src/entry.server.ts',
                'src/vite-env.d.ts',
                'src/lib/i18n/**'
            ],

            // Ratchet, not aspiration: these sit just under the current numbers, so a change
            // that drops real coverage fails CI while ordinary work does not.
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80
            }
        }
    }
});
