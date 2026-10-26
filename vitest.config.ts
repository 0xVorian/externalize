import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['engine/**/*.test.ts', 'src/**/*.test.ts', 'tools/**/*.test.ts', 'functions/**/*.test.ts'],
    poolOptions: {
      threads: { execArgv: ['--experimental-sqlite'] },
      forks: { execArgv: ['--experimental-sqlite'] },
    },
  },
});
