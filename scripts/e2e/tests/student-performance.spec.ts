import { expect, test, type Page, type Route } from "@playwright/test";

const student = {
  id: "performance-student",
  email: "performance.student@examtree.local",
  name: "Performance Student",
  role: "student" as const,
};

const attempts = [
  {
    id: "perf-attempt-1",
    userId: student.id,
    testId: "bank-test-1",
    testName: "Banking Full Mock 01",
    category: "Banking",
    score: 48,
    correct: 12,
    wrong: 8,
    unanswered: 5,
    totalQuestions: 25,
    timeSpent: 1800,
    attemptType: "REAL",
    createdAt: "2026-08-20T10:00:00.000Z",
    sectionStats: [
      { name: "Quantitative Aptitude", correct: 4, wrong: 4, unanswered: 2, accuracy: 50 },
      { name: "Reasoning Ability", correct: 8, wrong: 4, unanswered: 3, accuracy: 67 },
    ],
    questionReview: [
      { questionId: 1, section: "Quantitative Aptitude", text: "Marked question", options: ["A", "B"], selected: 0, correct: 1, explanation: "Saved explanation", flagged: true },
    ],
  },
  {
    id: "perf-attempt-2",
    userId: student.id,
    testId: "ssc-test-1",
    testName: "SSC Full Mock 01",
    category: "SSC",
    score: 60,
    correct: 15,
    wrong: 5,
    unanswered: 5,
    totalQuestions: 25,
    timeSpent: 1740,
    attemptType: "REAL",
    createdAt: "2026-08-22T10:00:00.000Z",
    sectionStats: [
      { name: "Quantitative Aptitude", correct: 5, wrong: 3, unanswered: 2, accuracy: 63 },
      { name: "Reasoning Ability", correct: 10, wrong: 2, unanswered: 3, accuracy: 83 },
    ],
    questionReview: [],
  },
  {
    id: "perf-attempt-3",
    userId: student.id,
    testId: "bank-test-2",
    testName: "Banking Full Mock 02",
    category: "Banking",
    score: 68,
    correct: 17,
    wrong: 5,
    unanswered: 3,
    totalQuestions: 25,
    timeSpent: 1680,
    attemptType: "REAL",
    createdAt: "2026-08-25T10:00:00.000Z",
    sectionStats: [
      { name: "Quantitative Aptitude", correct: 6, wrong: 3, unanswered: 1, accuracy: 67 },
      { name: "Reasoning Ability", correct: 11, wrong: 2, unanswered: 2, accuracy: 85 },
    ],
    questionReview: [
      { questionId: 2, section: "Reasoning Ability", text: "Another marked question", options: ["A", "B"], selected: 1, correct: 1, explanation: "Saved explanation", flagged: true },
    ],
  },
  {
    id: "perf-attempt-4",
    userId: student.id,
    testId: "bank-test-3",
    testName: "Banking Full Mock 03",
    category: "Banking",
    score: 76,
    correct: 19,
    wrong: 4,
    unanswered: 2,
    totalQuestions: 25,
    timeSpent: 1620,
    attemptType: "REAL",
    createdAt: "2026-08-28T10:00:00.000Z",
    sectionStats: [
      { name: "Quantitative Aptitude", correct: 7, wrong: 3, unanswered: 0, accuracy: 70 },
      { name: "Reasoning Ability", correct: 12, wrong: 1, unanswered: 2, accuracy: 92 },
    ],
    questionReview: [],
  },
];

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/attempts") return fulfillJson(route, attempts);
    if (path === "/tests") return fulfillJson(route, [
      { id: "bank-test-4", name: "Banking Full Mock 04", category: "Banking", categoryName: "Banking", categoryId: "banking", access: "free", kind: "full-length", duration: 60, totalQuestions: 25, attempts: 0, avgScore: 0, difficulty: "Medium", sections: [] },
    ]);
    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-30T05:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-30T05:00:00.000Z" });
    if (path === "/users/me") return fulfillJson(route, student);
    return fulfillJson(route, []);
  });
}

async function seedStudent(page: Page) {
  await page.addInitScript((profile) => {
    window.localStorage.setItem("user", JSON.stringify(profile));
  }, student);
}

async function expectTouchTarget(locator: ReturnType<Page["locator"]>) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
}

test.describe("student Performance analytics", () => {
  test("Performance requires login and preserves the exact return path", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/performance");

    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe("/performance");
  });

  test("signed-in student sees canonical self-performance without fabricated peer metrics", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/performance");

    await expect(page.getByTestId("performance-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "See what your completed tests are actually telling you." })).toBeVisible();
    await expect(page.getByText("4", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Quantitative Aptitude", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Reasoning Ability", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Banking", { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId("performance-trend-chart")).toBeVisible();
    await expect(page.getByText(/Banking Full Mock 04/)).toBeVisible();
    await expect(page.getByText(/Your rank/i)).toHaveCount(0);
    await expect(page.getByText(/National average/i)).toHaveCount(0);
    await expect(page.getByText(/Leaderboard/i)).toHaveCount(0);
  });

  test("Performance history and actions stay usable on mobile", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/performance");

    await expectTouchTarget(page.getByRole("link", { name: /Take another test/ }));
    await expectTouchTarget(page.getByRole("link", { name: /Review bookmarks/ }).first());
    await expectTouchTarget(page.getByRole("link", { name: /View result/ }).first());

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
