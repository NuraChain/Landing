import { azeroth } from '@azerothjs/compiler';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [azeroth(), tailwindcss()],
    server: {
        port: 4000
    },
    test: {
        environment: 'happy-dom'
    }
});
