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

async function expectMinHeight(locator: ReturnType<Page["getByRole"]>) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

test.describe("CP02 public and app shell split", () => {
  test("uses sidebar-first acquisition chrome publicly and preparation chrome on dashboard", async ({ page }) => {
    await installPublicFixtures(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contact");

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
    await expect(page.getByTestId("public-study-sidebar")).toBeVisible();
    await expect(page.getByTestId("public-study-sidebar").getByRole("link", { name: "Support", exact: true })).toHaveAttribute("aria-current", "page");

    const sidebarExploreCta = page.getByTestId("sidebar-explore-cta");
    await expect(sidebarExploreCta).toBeVisible();
    const sidebarExploreBox = await sidebarExploreCta.boundingBox();
    expect(sidebarExploreBox).not.toBeNull();
    expect(sidebarExploreBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await expect(page.getByRole("link", { name: "ExamTree home" }).first()).toBeVisible();
    await expect(page.getByText("Built for exam discovery, mock tests, and saved review.")).toBeVisible();
    await expect(page.getByRole("button", { name: /Select Targeted Exam/i })).toHaveCount(0);
    await expect(page.getByText("Logic Engine v2.4")).toHaveCount(0);
    await expect(page.getByText("API Docs")).toHaveCount(0);

    await page.goto("/dashboard");

    await expect(page.getByTestId("public-study-sidebar")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Select Targeted Exam/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Your activity follows you across devices/i })).toBeVisible();
  });

  test("keeps non-study desktop header navigation at the 44px interaction contract", async ({ page }) => {
    await installPublicFixtures(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/privacy-policy");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toBeVisible();

    await expectMinHeight(primaryNavigation.getByRole("link", { name: "Tests", exact: true }));
    await expectMinHeight(page.getByRole("link", { name: "Sign in", exact: true }));
    await expectMinHeight(page.getByRole("link", { name: "Browse tests", exact: true }));
    await expectMinHeight(page.getByRole("link", { name: "ExamTree home" }).first());
  });

  test("keeps the public mobile menu keyboard-operable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installPublicFixtures(page);
    await page.goto("/contact");

    await expect(page.getByTestId("public-study-sidebar")).toBeHidden();
    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    const closeButton = page.getByRole("button", { name: "Close navigation menu" });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");
    const mobileNavigation = page.getByRole("navigation", { name: "Mobile primary navigation" });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: "Explore Exams", exact: true })).toBeVisible();
    await expect(mobileNavigation.getByTestId("mobile-disabled-analytics")).toHaveAttribute("aria-disabled", "true");
    await expect(mobileNavigation.getByRole("link", { name: "Analytics", exact: true })).toHaveCount(0);
    await expect(mobileNavigation.getByRole("link", { name: "Support", exact: true })).toHaveAttribute("aria-current", "page");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(mobileNavigation).toBeHidden();
  });
});
