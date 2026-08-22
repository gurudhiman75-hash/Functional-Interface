import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

const categories = [
  { id: "cat-ssc", name: "SSC", description: "Staff Selection Commission exams", icon: "ShieldCheck", color: "indigo", testsCount: 3 },
];

const subcategories = [
  {
    id: "ssc-cgl",
    categoryId: "cat-ssc",
    categoryName: "SSC",
    name: "SSC CGL",
    description: "Full-length, sectional and topic-wise SSC CGL practice.",
    icon: "ShieldCheck",
    languages: ["en", "hi"],
  },
];

const catalogTests = [
  {
    id: "ssc-full-1",
    name: "SSC CGL Full Mock 1",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "cat-ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    access: "free",
    priceCents: null,
    kind: "full-length",
    duration: 60,
    totalQuestions: 100,
    attempts: 420,
    avgScore: 58,
    difficulty: "Medium",
    sections: [],
    languages: ["en", "hi"],
  },
  {
    id: "ssc-sectional-1",
    name: "SSC CGL Quant Sectional 1",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "cat-ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    access: "free",
    priceCents: null,
    kind: "sectional",
    duration: 20,
    totalQuestions: 25,
    attempts: 260,
    avgScore: 62,
    difficulty: "Medium",
    sections: [],
    languages: ["en", "hi"],
  },
  {
    id: "ssc-topic-1",
    name: "SSC CGL Percentage Drill",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "cat-ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    access: "paid",
    priceCents: 4900,
    kind: "topic-wise",
    duration: 15,
    totalQuestions: 20,
    attempts: 180,
    avgScore: 64,
    difficulty: "Easy",
    sections: [],
    languages: ["en"],
  },
];

const student = {
  id: "visual-student",
  email: "visual.student@examtree.local",
  name: "Visual Student",
  role: "student" as const,
};

const savedAttempt = {
  id: "visual-attempt-1",
  userId: student.id,
  testId: "ssc-full-1",
  testName: "SSC CGL Full Mock 1",
  category: "SSC",
  score: 72,
  actualScore: 72,
  correct: 72,
  wrong: 18,
  unanswered: 10,
  totalQuestions: 100,
  timeSpent: 3_000,
  createdAt: "2026-08-21T12:00:00.000Z",
  submittedAt: "2026-08-21T12:00:00.000Z",
  attemptType: "REAL",
  isFirstAttempt: true,
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installVisualFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace(/^\/api/, "");
    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, subcategories);
    if (path === "/tests") return fulfillJson(route, catalogTests);
    if (path === "/attempts" && request.method() === "GET") return fulfillJson(route, [savedAttempt]);
    if (path === "/users/me" && request.method() === "GET") return fulfillJson(route, student);
    if (path === "/me/entitlements" || path === "/users/me/entitlements") return fulfillJson(route, { error: "unauthorized" }, 401);
    if (path.includes("packages")) return fulfillJson(route, []);
    if (path === "/bundles") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-21T00:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-21T00:00:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function seedStudent(page: Page) {
  await page.goto("/login/student");
  await page.evaluate((profile) => localStorage.setItem("user", JSON.stringify(profile)), student);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectTouchTarget(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

test.describe("Visual System V1 responsive public journey", () => {
  test("keeps homepage, navigation, category and exam detail mobile-safe at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installVisualFixtures(page);

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Prepare with tests that feel like the exam." })).toBeVisible();
    await expect(page.getByText("Published tests", { exact: true })).toBeVisible();
    await expect(page.getByText("SSC CGL Full Mock 1").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    await expectTouchTarget(menuButton);
    await menuButton.click();
    await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mock Tests", exact: true }).last()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/category/cat-ssc");
    await expect(page.getByRole("heading", { level: 1, name: "SSC", exact: true })).toBeVisible();
    const seriesCard = page.getByTestId("btn-open-exam-ssc-cgl");
    await expect(seriesCard).toBeVisible();
    await expect(seriesCard).toContainText("SSC CGL");
    await expect(seriesCard).toContainText("3");
    await expectNoHorizontalOverflow(page);
    await seriesCard.click();

    await expect(page.getByRole("heading", { level: 1, name: "SSC CGL", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Available tests", exact: true })).toBeVisible();
    await expect(page.getByText("SSC CGL Full Mock 1").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Full Length 1/ })).toHaveAttribute("aria-pressed", "true");
    await expectTouchTarget(page.getByRole("button", { name: /Full Length 1/ }));
    await expect(page.getByRole("button", { name: "List view", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Grid view", exact: true })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("keeps the redesigned public hierarchy readable at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await installVisualFixtures(page);

    await page.goto("/");
    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toBeVisible();
    await expect(primaryNavigation.getByRole("link", { name: "Exams", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Start a mock", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Prepare with tests that feel like the exam." })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/category/cat-ssc");
    await expect(page.getByTestId("btn-open-exam-ssc-cgl")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/subcategory/ssc-cgl");
    await expect(page.getByRole("heading", { level: 2, name: "Available tests", exact: true })).toBeVisible();
    await expect(page.getByText("SSC CGL Full Mock 1").first()).toBeVisible();
    await expect(page.getByText("Packages for this exam", { exact: true })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("Visual System V1 preparation workspace", () => {
  test("prioritizes the next preparation action and reflows at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installVisualFixtures(page);
    await seedStudent(page);
    await page.goto("/dashboard");

    await expect(page.getByTestId("preparation-workspace")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Welcome back, Visual Student" })).toBeVisible();
    const nextStep = page.getByTestId("preparation-next-step");
    await expect(nextStep).toContainText("Review your latest result");
    await expect(nextStep).toContainText("72%");
    await expect(page.getByTestId("preparation-metrics")).toBeVisible();
    const reviewLink = nextStep.getByRole("link", { name: "Review result" });
    await expectTouchTarget(reviewLink);
    await expect(reviewLink).toHaveAttribute("href", "/result?attemptId=visual-attempt-1&testId=ssc-full-1");
    await expect(page.getByRole("heading", { level: 2, name: "Recent attempts" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("keeps the preparation rail secondary at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await installVisualFixtures(page);
    await seedStudent(page);
    await page.goto("/dashboard");

    await expect(page.getByRole("link", { name: "Tests & Exams" })).toBeVisible();
    await expect(page.getByRole("link", { name: "My Activity" })).toBeVisible();
    await expect(page.getByTestId("preparation-next-step")).toBeVisible();
    await expect(page.getByText("Preparation snapshot", { exact: true })).toBeVisible();
    await expect(page.getByText("SSC CGL Full Mock 1", { exact: true }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
