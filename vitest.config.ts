import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/engine/**/*.ts'],
      thresholds: {
        statements: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})


