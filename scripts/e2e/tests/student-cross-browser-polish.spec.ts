import { expect, test, type Page, type Route } from "@playwright/test";

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
    if (path === "/published-tests") return fulfillJson(route, { tests, generatedAt: "2026-08-22T06:45:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-22T06:45:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  expect(noOverflow).toBe(true);
}

test.describe("CP08 cross-browser shared shell polish", () => {
  test("desktop public chrome remains stable and navigable", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Practice smarter\.\s*Score with confidence\./i })).toBeVisible();
    const header = page.getByTestId("public-header");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("position", "sticky");
    await expectNoHorizontalOverflow(page);

    const browseTests = header.getByRole("link", { name: "Browse tests" });
    await expect(browseTests).toBeVisible();
    await browseTests.click();
    await expect(page).toHaveURL(/\/exams$/);

    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("mobile menu keeps 44px controls, Escape recovery, and bounded layout", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();

    const box = await menuButton.boundingBox();
    expect(box).not.toBeNull();
    const width = Math.round((box?.width ?? 0) * 1000) / 1000;
    const height = Math.round((box?.height ?? 0) * 1000) / 1000;
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);

    await menuButton.click();
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);

    const viewportFillsScreen = await page.evaluate(() => document.body.scrollHeight >= window.innerHeight);
    expect(viewportFillsScreen).toBe(true);
    expect(["firefox", "webkit"]).toContain(browserName);
  });
});
