import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: '../../../test-results/rnk-cp004-browser',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  reporter: process.env.CI
    ? [['line'], ['html', { outputFolder: '../../../playwright-report/rnk-cp004-browser', open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'ADMIN_PORT=4174 pnpm --dir ../../../artifacts/admin-app preview',
    url: 'http://127.0.0.1:4174/admin/rnk-cp004-renderer.html',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
