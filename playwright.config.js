import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  globalSetup: './tests/e2e/global-setup.js',
  globalTeardown: './tests/e2e/global-teardown.js',
  use: {
    baseURL: process.env.WEB_BASE_URL ?? 'http://127.0.0.1:3000',
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH ?? '/snap/bin/chromium',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
    trace: 'retain-on-failure',
  },
});
