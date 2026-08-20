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

    server: {
        port: 4000,

        // The whole dev wiring to the server half. In production the server serves the built
        // client itself, from one origin, so neither of these exists there.
        proxy: {
            '/api': 'http://localhost:3000',
            '/_image': 'http://localhost:3000'
        }
    },

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
