import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T16:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-19T16:00:00.000Z" });
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    return fulfillJson(route, { error: `Unhandled touch-target E2E route: ${method} ${path}` }, 404);
  });
}

async function expectTouchTarget(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, "interactive control should have a measurable box").not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
}

test.describe("CP02 page-level touch targets", () => {
  test("login custom controls and recovery shortcut meet 44px targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixtures(page);
    await page.goto("/login/student");

    await expectTouchTarget(page.getByTestId("tab-login"));
    await expectTouchTarget(page.getByTestId("tab-signup"));
    await expectTouchTarget(page.getByTestId("btn-toggle-password"));
    await expectTouchTarget(page.getByTestId("btn-forgot-password"));
    await expectTouchTarget(page.getByTestId("btn-submit"));
    await expectTouchTarget(page.getByTestId("btn-google-login"));
    await expectTouchTarget(page.getByTestId("btn-back"));
    await expectTouchTarget(page.getByRole("link", { name: "Can’t access your account?" }));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("shared page actions keep 44px targets across preparation and result surfaces", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixtures(page);

    await page.goto("/dashboard");
    await expectTouchTarget(page.getByRole("link", { name: "Sign in" }).last());

    await page.goto("/profile");
    await expectTouchTarget(page.getByRole("button", { name: "Go to Login" }));

    await page.goto("/result");
    await expectTouchTarget(page.getByRole("button", { name: "Open My Activity" }));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
