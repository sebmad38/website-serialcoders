import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  projects: [{ name: 'editorial' }, { name: 'modern' }],
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  use: {
    channel:
      process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
    trace: 'retain-on-failure',
  },
});
