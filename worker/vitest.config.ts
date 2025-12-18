import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test environment
        environment: 'node',
        // Include test files
        include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
        // Coverage configuration
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/'],
        },
        // Globals for describe, it, expect
        globals: true,
    },
});
