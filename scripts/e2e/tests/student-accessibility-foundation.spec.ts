import { expect, test, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installPublicFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") {
      return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path === "/test-series") {
      return fulfillJson(route, { series: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    return fulfillJson(route, { error: `Unhandled accessibility E2E route: ${method} ${path}` }, 404);
  });
}

test.describe("CP02 accessibility foundation", () => {
  test("supports zoom keyboard skip navigation and reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installPublicFixtures(page);
    await page.goto("/about");

    // Begin keyboard certification only after the lazy route has replaced its
    // loading skeleton. Otherwise the focused tree can be remounted after Tab.
    await expect(
      page.getByRole("heading", { name: "A serious mock-test platform for serious aspirants." }),
    ).toBeVisible();

    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toBe("width=device-width, initial-scale=1.0");
    expect(viewport).not.toContain("maximum-scale");
    expect(viewport).not.toContain("user-scalable=no");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();

    const motion = await page.evaluate(() => {
      const routeShell = document.querySelector(".animate-fadeInUp");
      const main = document.querySelector("#main-content");
      return {
        animationDuration: routeShell ? getComputedStyle(routeShell).animationDuration : null,
        transitionDuration: main ? getComputedStyle(main).transitionDuration : null,
      };
    });

    expect(motion.animationDuration).not.toBeNull();
    expect(motion.transitionDuration).not.toBeNull();
    expect(Number.parseFloat(motion.animationDuration ?? "1")).toBeLessThan(0.001);
    expect(Number.parseFloat(motion.transitionDuration ?? "1")).toBeLessThan(0.001);
  });
});
