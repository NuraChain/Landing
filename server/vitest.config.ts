import { defineConfig } from 'vitest/config';

// The server's suite needs no environment beyond node. Every spec runs against an in-memory
// sqlite database and builds the app in-process, so nothing binds a port and nothing reaches
// the network - the same property the application half already holds.
export default defineConfig({
    test:
    {
        environment: 'node',
        // Fixtures live under tests/support and are not themselves tests.
        include: ['tests/**/*.spec.ts'],

        coverage:
        {
            provider: 'v8',
            // `all` so a file with NO tests still appears at 0% rather than vanishing from the
            // report - an untested module is the one worth seeing.
            all: true,
            include: ['src/**/*.ts'],
            exclude: [
                // The composition root: it binds a port, opens a real database file and reads
                // the environment. Covering it would mean starting the server, which the rest
                // of the suite exists to avoid; its parts are tested individually instead.
                'src/main.ts'
            ],
            reporter: ['text', 'text-summary', 'html', 'lcov'],
            reportsDirectory: 'coverage',

            // The same ratchet the application half uses: just under the real numbers, so a
            // change that drops coverage fails while ordinary work does not.
            thresholds:
            {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80
            }
        }
    }
});
