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
    kind: "full-length",
    attempts: 12,
    sections: [],
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
    if (path === "/daily-challenge") return fulfillJson(route, {});
    return fulfillJson(route, []);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noOverflow).toBe(true);
}

test.describe("CP08 cross-browser shared shell polish", () => {
  test("desktop study routes use the detailed sidebar instead of duplicated top navigation", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByTestId("home-hero-carousel")).toBeVisible();
    await expect(page.getByTestId("home-exam-logo-row")).toBeVisible();
    await expect(page.getByTestId("home-testimonials-preview")).toHaveCount(0);

    const header = page.getByTestId("public-header");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("position", "sticky");
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();

    const sidebar = page.getByTestId("public-study-sidebar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", { name: "Explore Exams", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "My Tests", exact: true })).toBeVisible();
    await expect(sidebar.getByTestId("sidebar-disabled-analytics")).toHaveAttribute("aria-disabled", "true");
    await expect(sidebar.getByRole("link", { name: "Analytics", exact: true })).toHaveCount(0);
    await expect(sidebar.getByText("Bookmarks", { exact: true })).toBeVisible();
    await expect(sidebar.getByText("Downloads", { exact: true })).toBeVisible();
    await expect(sidebar.getByText("Study Plan", { exact: true })).toBeVisible();
    await expect(sidebar.getByText("Rewards", { exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Support", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Settings", exact: true })).toBeVisible();
    await expect(sidebar.locator('[aria-disabled="true"]')).toHaveCount(5);

    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();
    expect(sidebarBox?.width ?? 0).toBeGreaterThanOrEqual(248);
    expect(sidebarBox?.width ?? 0).toBeLessThanOrEqual(256);
    await expectNoHorizontalOverflow(page);

    await sidebar.getByRole("link", { name: "Explore Exams", exact: true }).click();
    await expect(page).toHaveURL(/\/exams$/);
    await expect(page.getByTestId("public-study-sidebar")).toBeVisible();
    await expect(page.getByTestId("public-study-sidebar").getByRole("link", { name: "Explore Exams", exact: true })).toHaveAttribute("aria-current", "page");

    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("mobile menu keeps 44px controls, truthful disabled analytics, Escape recovery, and bounded layout", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("public-study-sidebar")).toBeHidden();
    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menuButton).toBeVisible();

    const box = await menuButton.boundingBox();
    expect(box).not.toBeNull();
    const width = Math.round((box?.width ?? 0) * 1000) / 1000;
    const height = Math.round((box?.height ?? 0) * 1000) / 1000;
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);

    await menuButton.click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile primary navigation" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Explore Exams" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "My Tests" })).toBeVisible();
    await expect(mobileNav.getByTestId("mobile-disabled-analytics")).toHaveAttribute("aria-disabled", "true");
    await expect(mobileNav.getByRole("link", { name: "Analytics" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);

    const viewportFillsScreen = await page.evaluate(() => document.body.scrollHeight >= window.innerHeight);
    expect(viewportFillsScreen).toBe(true);
    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("sample Home is a marketing launchpad with carousel and preview-only testimonials", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?preview=sample");

    await expect(page.getByTestId("home-sample-preview-badge")).toContainText("Sample data preview");
    await expect(page.getByTestId("home-hero-carousel")).toBeVisible();
    await expect(page.getByText("98 published tests", { exact: true })).toBeVisible();
    await expect(page.getByTestId("home-exam-logo-row").getByRole("button")).toHaveCount(7);
    await expect(page.getByTestId("home-quick-start")).toBeVisible();
    await expect(page.getByTestId("home-featured-series").locator("article")).toHaveCount(3);
    await expect(page.getByTestId("home-free-start")).toBeVisible();
    await expect(page.getByTestId("home-why-examtree")).toBeVisible();
    await expect(page.getByTestId("home-how-it-works")).toBeVisible();
    await expect(page.getByTestId("home-testimonials-preview").locator("article")).toHaveCount(3);
    await expect(page.getByTestId("home-testimonials-preview")).toContainText("not real endorsements");
    await expect(page.getByTestId("home-faq")).toBeVisible();
    await expect(page.getByTestId("home-explore-gateway")).toBeVisible();
    await expect(page.getByTestId("catalog-test-browser")).toHaveCount(0);

    await page.getByRole("button", { name: "Show slide 2" }).click();
    await expect(page.getByRole("heading", { name: "Train in the format the exam actually demands." })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("home-explore-gateway").getByRole("button", { name: "Open Exams marketplace" }).click();
    await expect(page).toHaveURL(/\/exams\?preview=sample$/);

    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("sample Exams marketplace is fully populated and visually sectioned", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/exams?preview=sample");

    await expect(page.getByTestId("public-study-sidebar")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
    await expect(page.getByTestId("exams-sample-preview-badge")).toContainText("Sample data preview");
    await expect(page.getByText("98 published tests", { exact: true })).toBeVisible();
    await expect(page.getByTestId("exam-category-logo-row").getByRole("button")).toHaveCount(7);
    await expect(page.getByTestId("featured-series-section").locator("article")).toHaveCount(4);
    await expect(page.getByTestId("full-length-series-section").getByRole("button", { name: /Open series/ })).toHaveCount(4);
    await expect(page.getByTestId("free-practice-section").getByRole("button", { name: "Start Free" })).toHaveCount(6);
    await expect(page.getByTestId("daily-practice-section").getByRole("button")).toHaveCount(3);
    await expect(page.getByTestId("pyq-section")).toBeVisible();
    await expect(page.getByTestId("subject-practice-section")).toBeVisible();
    await expect(page.getByTestId("popular-tests-section").getByRole("button")).toHaveCount(5);
    await expect(page.getByTestId("catalog-result-count")).toContainText("Showing 1-18 of 98");
    await expect(page.getByTestId("catalog-page-grid").locator("article")).toHaveCount(18);
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("exams-sample-preview-badge").getByRole("button", { name: "Compare Home" }).click();
    await expect(page).toHaveURL(/\/\?preview=sample$/);

    expect(["firefox", "webkit"]).toContain(browserName);
  });
});
