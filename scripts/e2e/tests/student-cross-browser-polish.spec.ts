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

const series = [
  {
    id: "series-ssc-cgl-2026",
    code: "SSC-CGL-2026",
    name: "SSC CGL 2026 Complete Mock Series",
    description: "A focused full-length and sectional preparation series for SSC CGL.",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "open",
    completionThreshold: null,
    examCode: "SSC-CGL",
    examName: "SSC CGL",
    examFamilyCode: "SSC",
    examFamilyName: "SSC",
    testCount: 24,
    liveTestCount: 24,
    fullLengthTestCount: 16,
    durationSeconds: 86400,
    questionCount: 2400,
    attemptCount: 18200,
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
    if (path === "/test-series") return fulfillJson(route, { series, generatedAt: "2026-08-27T07:00:00.000Z" });
    if (path === "/learning-resources") return fulfillJson(route, { resources: [], filters: { category: null, format: null, language: null }, generatedAt: "2026-08-27T06:15:00.000Z" });
    if (path === "/daily-challenge") return fulfillJson(route, {});
    return fulfillJson(route, []);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noOverflow).toBe(true);
}

test.describe("CP08 cross-browser shared shell polish", () => {
  test("desktop Home matches the approved reference while deeper study routes retain the detailed sidebar", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(page.getByTestId("home-reference")).toBeVisible();
    await expect(page.getByTestId("home-exam-categories")).toBeVisible();
    await expect(page.getByTestId("home-category-grid").getByRole("button")).toHaveCount(1);
    await expect(page.getByTestId("home-popular-series")).toContainText("Popular test series");
    await expect(page.getByTestId("home-popular-series")).toContainText("SSC CGL 2026 Complete Mock Series");
    await expect(page.getByTestId("home-examtree-edge")).toContainText("Don’t just take tests.");
    await expect(page.getByTestId("home-final-cta")).toContainText("Ready to move ahead");
    await expect(page.getByTestId("public-study-sidebar")).toHaveCount(0);

    const header = page.getByTestId("public-header");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("position", "sticky");
    const primaryNav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNav).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Exams", exact: true })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Test Series", exact: true })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Previous Papers", exact: true })).toBeVisible();
    await expect(primaryNav.getByRole("link", { name: "Practice", exact: true })).toBeVisible();
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Sign up" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await primaryNav.getByRole("link", { name: "Exams", exact: true }).click();
    await expect(page).toHaveURL(/\/exams$/);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();

    const sidebar = page.getByTestId("public-study-sidebar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Explore Exams", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(sidebar.getByRole("link", { name: "My Tests", exact: true })).toBeVisible();
    await expect(sidebar.getByTestId("sidebar-disabled-analytics")).toHaveAttribute("aria-disabled", "true");
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();
    expect(sidebarBox?.width ?? 0).toBeGreaterThanOrEqual(248);
    expect(sidebarBox?.width ?? 0).toBeLessThanOrEqual(256);
    await expectNoHorizontalOverflow(page);

    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("logged-in Home keeps the reference layout and swaps auth actions for Dashboard", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.addInitScript(() => {
      window.localStorage.setItem("user", JSON.stringify({
        id: "student-1",
        email: "learner@example.com",
        name: "Aman Singh",
        role: "student",
      }));
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(page.getByTestId("home-reference")).toBeVisible();
    await expect(page.getByTestId("home-popular-series")).toContainText("18k attempts");
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Log in" })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("mobile Home uses reference navigation, keeps 44px menu controls, and deeper study routes preserve truthful disabled states", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("home-reference")).toBeVisible();
    await expect(page.getByTestId("home-exam-categories")).toBeVisible();
    await expect(page.getByTestId("public-study-sidebar")).toHaveCount(0);
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
    await expect(mobileNav.getByRole("link", { name: "Exams", exact: true })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Test Series", exact: true })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Previous Papers", exact: true })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Practice", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expectNoHorizontalOverflow(page);

    await page.goto("/exams");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const studyMobileNav = page.getByRole("navigation", { name: "Mobile primary navigation" });
    await expect(studyMobileNav.getByRole("link", { name: "Explore Exams" })).toBeVisible();
    await expect(studyMobileNav.getByRole("link", { name: "My Tests" })).toBeVisible();
    await expect(studyMobileNav.getByTestId("mobile-disabled-analytics")).toHaveAttribute("aria-disabled", "true");
    await expect(studyMobileNav.getByRole("link", { name: "Analytics" })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);

    const viewportFillsScreen = await page.evaluate(() => document.body.scrollHeight >= window.innerHeight);
    expect(viewportFillsScreen).toBe(true);
    expect(["firefox", "webkit"]).toContain(browserName);
  });

  test("sample Home uses the same approved reference with preview-backed categories and series", async ({ page, browserName }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?preview=sample");

    await expect(page.getByTestId("home-sample-preview-badge")).toContainText("Sample data preview");
    await expect(page.getByTestId("home-reference")).toBeVisible();
    await expect(page.getByTestId("home-category-grid").getByRole("button")).toHaveCount(6);
    await expect(page.getByTestId("home-popular-series")).toBeVisible();
    await expect(page.getByTestId("home-examtree-edge")).toBeVisible();
    await expect(page.getByTestId("home-final-cta")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByTestId("home-category-grid").getByRole("button").first().click();
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
