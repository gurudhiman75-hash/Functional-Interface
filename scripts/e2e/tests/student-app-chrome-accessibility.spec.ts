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
    if (path === "/published-tests") {
      return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path === "/test-series") {
      return fulfillJson(route, { series: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    return fulfillJson(route, { error: `Unhandled app-chrome E2E route: ${method} ${path}` }, 404);
  });
}

async function expectTouchTarget(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

test.describe("CP02 preparation chrome accessibility", () => {
  test("exposes keyboard-operable exam selector and 44px-class primary controls", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/dashboard");

    const selector = page.getByRole("button", { name: "Select Targeted Exam" });
    await expect(selector).toHaveAttribute("aria-expanded", "false");
    await expect(selector).toHaveAttribute("aria-controls", "exam-selector-panel");
    await expect(selector).toHaveAttribute("aria-haspopup", "dialog");

    await selector.click();
    await expect(selector).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("dialog", { name: "Choose exam or published test" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(selector).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("dialog", { name: "Choose exam or published test" })).toHaveCount(0);

    await expectTouchTarget(page.locator('[data-sidebar="trigger"]'));
    await expectTouchTarget(selector);
    await expectTouchTarget(page.getByRole("button", { name: "My activity" }));
    await expectTouchTarget(page.getByRole("button", { name: "User profile" }));
    await expectTouchTarget(page.getByRole("link", { name: "Tests & Exams" }));
    await expectTouchTarget(page.getByRole("link", { name: "Login" }));

    await expect(page.getByRole("link", { name: "ExamTree home" })).toBeVisible();
  });
});
