import { expect, test, type Page, type Route } from "@playwright/test";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "Flow Student",
  role: "student" as const,
};

const categories = [
  { id: "ssc", name: "SSC", description: "Staff Selection Commission exams", icon: "Landmark", color: "blue", testsCount: 1 },
  { id: "banking", name: "Banking", description: "Bank recruitment exams", icon: "Banknote", color: "teal", testsCount: 1 },
  { id: "punjab-state", name: "Punjab State Exams", description: "Punjab state recruitment exams", icon: "BadgeCheck", color: "amber", testsCount: 1 },
];

const subcategories = [
  { id: "ssc-cgl", categoryId: "ssc", categoryName: "SSC", name: "SSC CGL", description: "SSC CGL preparation", icon: "Landmark", languages: ["en", "hi"] },
  { id: "ibps-po", categoryId: "banking", categoryName: "Banking", name: "IBPS PO", description: "IBPS PO preparation", icon: "Banknote", languages: ["en", "hi"] },
  { id: "punjab-police", categoryId: "punjab-state", categoryName: "Punjab State Exams", name: "Punjab Police", description: "Punjab Police preparation", icon: "BadgeCheck", languages: ["en", "hi", "pa"] },
];

const tests = [
  {
    id: "ssc-test-1",
    name: "SSC CGL Full Mock 01",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    access: "free",
    priceCents: null,
    kind: "full-length",
    duration: 60,
    totalQuestions: 100,
    attempts: 1200,
    avgScore: 61,
    difficulty: "Medium",
    sections: [],
    languages: ["en", "hi"],
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    unattemptedMarks: 0,
  },
  {
    id: "banking-test-1",
    name: "IBPS PO Full Mock 01",
    category: "Banking",
    categoryName: "Banking",
    categoryId: "banking",
    subcategoryId: "ibps-po",
    subcategoryName: "IBPS PO",
    access: "free",
    priceCents: null,
    kind: "full-length",
    duration: 60,
    totalQuestions: 100,
    attempts: 1100,
    avgScore: 58,
    difficulty: "Medium",
    sections: [],
    languages: ["en", "hi"],
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    unattemptedMarks: 0,
  },
  {
    id: "punjab-test-1",
    name: "Punjab Police Full Mock 01",
    category: "Punjab State Exams",
    categoryName: "Punjab State Exams",
    categoryId: "punjab-state",
    subcategoryId: "punjab-police",
    subcategoryName: "Punjab Police",
    access: "free",
    priceCents: null,
    kind: "full-length",
    duration: 60,
    totalQuestions: 100,
    attempts: 900,
    avgScore: 55,
    difficulty: "Medium",
    sections: [],
    languages: ["en", "hi", "pa"],
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    unattemptedMarks: 0,
  },
];

const homeSeries = {
  id: "home-series-banking",
  code: "HOME-BANKING",
  name: "IBPS PO Complete Mock Series",
  description: "Banking mock series",
  availabilityStartAt: null,
  availabilityEndAt: null,
  progressionMode: "open" as const,
  completionThreshold: null,
  examCode: "IBPS-PO",
  examName: "IBPS PO",
  examFamilyCode: "BANKING",
  examFamilyName: "Banking",
  testCount: 12,
  liveTestCount: 12,
  fullLengthTestCount: 8,
  durationSeconds: 43200,
  questionCount: 1200,
  attemptCount: 2400,
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installStudentFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, subcategories);
    if (path === "/tests" && method === "GET") return fulfillJson(route, tests);
    if (path === "/published-tests") {
      return fulfillJson(route, { tests: [], generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/test-series/home-series-banking") {
      return fulfillJson(route, {
        series: {
          id: homeSeries.id,
          code: homeSeries.code,
          name: homeSeries.name,
          description: homeSeries.description,
          examVersionId: "ibps-po-v1",
          examCode: homeSeries.examCode,
          examName: homeSeries.examName,
          examFamilyCode: homeSeries.examFamilyCode,
          examFamilyName: homeSeries.examFamilyName,
          versionNumber: 1,
          availabilityStartAt: null,
          availabilityEndAt: null,
          progressionMode: "open",
          completionThreshold: null,
        },
        eligibility: {
          available: true,
          availabilityCode: null,
          availabilityReason: null,
          completedRequiredCount: 0,
          requiredCount: 0,
          completedCount: 0,
          totalCount: 0,
          progressPercent: 0,
          nextTestId: null,
          members: [],
        },
        generatedAt: "2026-08-29T00:00:00.000Z",
      });
    }
    if (path === "/test-series") {
      return fulfillJson(route, { series: [homeSeries], generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/users/me") return fulfillJson(route, student);
    if (path === "/analytics") {
      return fulfillJson(route, { averageScore: 0, highestScore: 0, totalAttempts: 0, recentAttempts: [] });
    }
    if (path === "/attempts") return fulfillJson(route, []);
    if (path === "/learning-resources") {
      return fulfillJson(route, { resources: [], filters: { category: null, format: null, language: null }, generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/daily-challenge") return fulfillJson(route, {});

    return fulfillJson(route, []);
  });
}

async function seedStudent(page: Page) {
  await page.addInitScript((profile) => {
    window.localStorage.setItem("user", JSON.stringify(profile));
  }, student);
}

test.describe("student workflow hardening", () => {
  test("home Sign up targets the signup state instead of the login state", async ({ page }) => {
    await installStudentFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const signup = page.getByTestId("public-header-actions").getByRole("link", { name: "Sign up", exact: true });
    await expect(signup).toHaveAttribute("href", "/login/student?mode=signup");
  });

  test("account-specific result routes require login and preserve the exact internal return path", async ({ page }) => {
    await installStudentFixtures(page);
    await page.goto("/result?attemptId=attempt-flow-1&testId=test-flow-1");

    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe("/result?attemptId=attempt-flow-1&testId=test-flow-1");
  });

  test("logged-in shell keeps canonical exam navigation and a stable exam selector", async ({ page }) => {
    await installStudentFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Welcome back, Flow Student" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tests & Exams", exact: true })).toHaveAttribute("href", "/exams");
    await expect(page.getByRole("button", { name: "Select Targeted Exam", exact: true })).toBeVisible();
  });

  test("profile logout clears the local session before returning home", async ({ page }) => {
    await installStudentFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Welcome back, Flow Student" })).toBeVisible();
    await page.getByRole("button", { name: "Log out", exact: true }).click();

    await expect(page).toHaveURL(/\/$/);
    const savedUser = await page.evaluate(() => window.localStorage.getItem("user"));
    expect(savedUser).toBeNull();
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Log in", exact: true })).toBeVisible();
  });

  test("homepage opens SSC Banking Punjab categories, all exams, and the selected test series", async ({ page }) => {
    await installStudentFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const categoryGrid = page.getByTestId("home-category-grid");
    const ssc = categoryGrid.getByRole("button").filter({ hasText: "SSC" });
    const banking = categoryGrid.getByRole("button").filter({ hasText: "Banking" });
    const punjab = categoryGrid.getByRole("button").filter({ hasText: "Punjab State Exams" });
    await expect(ssc).toBeVisible();
    await expect(banking).toBeVisible();
    await expect(punjab).toBeVisible();

    await ssc.click();
    await expect(page).toHaveURL(/\/category\/ssc$/);

    await page.goto("/");
    await categoryGrid.getByRole("button").filter({ hasText: "Banking" }).click();
    await expect(page).toHaveURL(/\/category\/banking$/);

    await page.goto("/");
    await categoryGrid.getByRole("button").filter({ hasText: "Punjab State Exams" }).click();
    await expect(page).toHaveURL(/\/category\/punjab-state$/);

    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Exams", exact: true }).click();
    await expect(page).toHaveURL(/\/exams$/);

    await page.goto("/");
    const seriesCard = page.getByRole("article").filter({ hasText: homeSeries.name });
    await expect(seriesCard).toBeVisible();
    await seriesCard.getByRole("button", { name: "View series", exact: true }).click();
    await expect(page).toHaveURL(/\/test-series\/home-series-banking$/);
    await expect(page.getByRole("heading", { name: homeSeries.name, exact: true })).toBeVisible();
  });
});