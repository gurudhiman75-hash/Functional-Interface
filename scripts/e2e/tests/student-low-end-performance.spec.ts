import { expect, test, type Page, type Route } from "@playwright/test";

declare global {
  interface Window {
    __examtreeLowEndMetrics?: {
      lcp: number;
      cls: number;
    };
  }
}

const categories = [
  {
    id: "ssc",
    name: "SSC",
    description: "Staff Selection Commission exams",
    icon: "Landmark",
  },
];

const tests = [
  {
    id: "ssc-cgl-free-1",
    name: "SSC CGL Full Mock 1",
    category: "SSC",
    categoryId: "ssc",
    subcategoryId: null,
    subcategoryName: "SSC CGL",
    totalQuestions: 100,
    duration: 60,
    access: "free",
    difficulty: "Medium",
    testType: "Full Length",
    languages: ["en"],
  },
];

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, tests);
    if (path === "/published-tests") return fulfillJson(route, { tests, generatedAt: "2026-08-22T05:30:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-22T05:30:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function installWebVitalObservers(page: Page) {
  await page.addInitScript(() => {
    window.__examtreeLowEndMetrics = { lcp: 0, cls: 0 };

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries.at(-1);
      if (lastEntry && window.__examtreeLowEndMetrics) {
        window.__examtreeLowEndMetrics.lcp = lastEntry.startTime;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        if (!layoutShift.hadRecentInput && window.__examtreeLowEndMetrics) {
          window.__examtreeLowEndMetrics.cls += layoutShift.value ?? 0;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

function localDeferredChunks(page: Page) {
  return page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => /\/assets\/(?:MathJaxRouteProvider|auth|firebase)-[^/]+\.js(?:\?|$)/.test(name)),
  );
}

test.describe("CP07 low-end mobile acquisition performance", () => {
  test("Home remains stable and responsive under Pixel-class 4x CPU slowdown", async ({ page }) => {
    await installFixtures(page);
    await installWebVitalObservers(page);

    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Structured mock tests for serious exam practice." })).toBeVisible();
    await page.waitForLoadState("networkidle");

    const metrics = await page.evaluate(() => {
      const firstContentfulPaint = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
      return {
        firstContentfulPaint,
        lcp: window.__examtreeLowEndMetrics?.lcp ?? 0,
        cls: window.__examtreeLowEndMetrics?.cls ?? 0,
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    });

    expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
    expect(metrics.firstContentfulPaint).toBeLessThanOrEqual(3_000);
    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThanOrEqual(4_000);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    expect(metrics.noHorizontalOverflow).toBe(true);

    expect(await localDeferredChunks(page)).toEqual([]);

    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  });
});
