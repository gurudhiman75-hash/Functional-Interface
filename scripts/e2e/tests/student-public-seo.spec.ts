import { expect, test, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installEmptyApi(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/published-tests")) return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T06:00:00.000Z" });
    if (path.endsWith("/test-series")) return fulfillJson(route, { series: [], generatedAt: "2026-08-20T06:00:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function metadata(page: Page) {
  return page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "",
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content") ?? "",
  }));
}

test.describe("CP03 public SEO metadata", () => {
  test.beforeEach(async ({ page }) => {
    await installEmptyApi(page);
  });

  test("home exposes runtime-origin canonical and social metadata", async ({ page }) => {
    await page.goto("/?utm_source=e2e");
    await expect(page.locator("main#main-content")).toBeVisible();
    const meta = await metadata(page);
    const origin = new URL(page.url()).origin;
    expect(meta.title).toBe("Mock Tests & Exam Preparation | ExamTree");
    expect(meta.description.length).toBeGreaterThan(40);
    expect(meta.robots).toBe("index,follow");
    expect(meta.canonical).toBe(`${origin}/`);
    expect(meta.ogUrl).toBe(meta.canonical);
    expect(meta.ogImage).toBe(`${origin}/opengraph.jpg`);
    expect(meta.twitterCard).toBe("summary_large_image");
  });

  test("page-owned public metadata keeps a clean canonical URL", async ({ page }) => {
    await page.goto("/about?utm_source=e2e");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const meta = await metadata(page);
    const origin = new URL(page.url()).origin;
    expect(meta.title).toContain("About");
    expect(meta.title).toContain("ExamTree");
    expect(meta.robots).toBe("index,follow");
    expect(meta.canonical).toBe(`${origin}/about`);
    expect(meta.ogUrl).toBe(meta.canonical);
    expect(meta.ogImage).toBe(`${origin}/opengraph.jpg`);
  });

  test("discovery aliases resolve to a single canonical route", async ({ page }) => {
    await page.goto("/tests?source=e2e");
    await expect(page.locator("main#main-content")).toBeVisible();
    const meta = await metadata(page);
    const origin = new URL(page.url()).origin;
    expect(meta.robots).toBe("index,follow");
    expect(meta.canonical).toBe(`${origin}/exams`);
    expect(meta.ogUrl).toBe(meta.canonical);
  });

  test("account utility metadata is explicitly noindex and strips next parameters", async ({ page }) => {
    // The reliability build supplies a synthetic Firebase currentUser. Keep the
    // profile lookup pending so this test measures the signed-out login route
    // instead of being auto-redirected to Dashboard by the auth listener.
    await page.route("**/api/users/me", async () => {
      await new Promise<void>(() => {});
    });

    await page.goto("/login/student?next=%2Fdashboard");
    await expect(page.getByRole("heading", { name: "Welcome to examtree" })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/login/student");
    const meta = await metadata(page);
    const origin = new URL(page.url()).origin;
    expect(meta.robots).toBe("noindex,follow");
    expect(meta.canonical).toBe(`${origin}/login/student`);
    expect(meta.ogUrl).toBe(meta.canonical);
  });
});
