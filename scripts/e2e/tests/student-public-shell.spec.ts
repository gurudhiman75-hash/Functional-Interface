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

    return fulfillJson(route, { error: `Unhandled public-shell E2E route: ${method} ${path}` }, 404);
  });
}

test.describe("CP02 public and app shell split", () => {
  test("uses acquisition chrome publicly and preparation chrome on dashboard", async ({ page }) => {
    await installPublicFixtures(page);
    await page.goto("/about");

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ExamTree home" }).first()).toBeVisible();
    await expect(page.getByText("Built for exam discovery, mock tests, and saved review.")).toBeVisible();
    await expect(page.getByRole("button", { name: /Select Targeted Exam/i })).toHaveCount(0);
    await expect(page.getByText("Logic Engine v2.4")).toHaveCount(0);
    await expect(page.getByText("API Docs")).toHaveCount(0);

    await page.goto("/dashboard");

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Select Targeted Exam/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Your activity follows you across devices/i })).toBeVisible();
  });

  test("keeps the public mobile menu keyboard-operable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installPublicFixtures(page);
    await page.goto("/about");

    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    const closeButton = page.getByRole("button", { name: "Close navigation menu" });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse tests" })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeHidden();
  });
});
