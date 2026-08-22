import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "../../test-results/student-e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  reporter: process.env.CI
    ? [["line"], ["html", { outputFolder: "../../playwright-report/student-e2e", open: "never" }]]
    : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "PORT=4173 pnpm --dir ../../artifacts/examtree serve",
    url: "http://127.0.0.1:4173",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /student-(timer-mobile-hardening|low-end-performance|cross-browser-polish)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      testMatch: /student-(production-hardening|timer-mobile-hardening|low-end-performance)\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "firefox-smoke",
      testMatch: /student-cross-browser-polish\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-smoke",
      testMatch: /student-cross-browser-polish\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
