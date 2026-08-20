import { azeroth } from '@azerothjs/compiler';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [azeroth(), tailwindcss()],
    server: {
        port: 4000
    },
    test: {
        environment: 'happy-dom',

        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: 'coverage',

            // Everything that ships, whether a test currently touches it or not - otherwise
            // an untested module simply disappears from the report instead of showing 0%,
            // which is the one number worth seeing.
            include: ['src/**/*.{ts,azeroth}'],
            exclude: [
                // No branches to cover: a one-line mount, a type-only declaration, and ten
                // string tables whose shape is asserted in i18n.spec.ts rather than by
                // executing them.
                'src/main.azeroth',
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
