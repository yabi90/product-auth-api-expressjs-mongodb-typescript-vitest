/// <reference types="vitest/globals" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Allows to use global functions like 'describe', 'it', etc.
    environment: 'node', // Set the test environment to node (not jsdom)
    coverage: {
      provider: 'v8', // Enables code coverage
      reporter: ['text', 'json', 'html'], // Formats for the coverage report
      include: ['src/**/*.ts'], // Coverage should include source files
    },
  },
});