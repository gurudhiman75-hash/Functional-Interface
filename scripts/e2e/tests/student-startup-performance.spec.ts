import { expect, test, type Page, type Route } from "@playwright/test";

const ATTEMPT_ID = "attempt-startup-performance-1";

const attempt = {
  id: ATTEMPT_ID,
  userId: "e2e-student",
  testId: "math-performance-test",
  testName: "Math Rendering Performance Test",
  category: "SSC",
  score: 100,
  actualScore: 2,
  marksPerQuestion: 2,
  negativeMarks: 0.5,
  correct: 1,
  wrong: 0,
  unanswered: 0,
  totalQuestions: 1,
  timeSpent: 2,
  createdAt: "2026-08-20T06:45:00.000Z",
  submittedAt: "2026-08-20T06:47:00.000Z",
  attemptType: "REAL",
  isFirstAttempt: true,
  sectionStats: [],
  sectionTimeSpent: [],
  questionReview: [
    {
      questionId: 101,
      section: "Quantitative Aptitude",
      text: "If $x = 2$, what is $x^2 + 1$?",
      options: ["$3$", "$4$", "$5$", "$6$"],
      selected: 2,
      correct: 2,
      flagged: false,
      explanation: "Substitute $x=2$: $2^2 + 1 = 5$.",
    },
  ],
};

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/categories" || path === "/subcategories" || path === "/tests") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T06:45:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-20T06:45:00.000Z" });
    if (path === `/attempts/${ATTEMPT_ID}`) return fulfillJson(route, attempt);
    if (path === "/attempts") return fulfillJson(route, [attempt]);
    return fulfillJson(route, []);
  });
}

function localMathChunks(page: Page) {
  return page.evaluate(() => performance.getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((name) => /\/assets\/mathjax-[^/]+\.js(?:\?|$)/.test(name)));
}

test.describe("CP05 route-scoped math runtime", () => {
  test("public acquisition pages do not download the MathJax bundle", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "Built for exam practice, not vanity metrics." })).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(await localMathChunks(page)).toEqual([]);
  });

  test("saved question review loads the isolated MathJax bundle on demand", async ({ page }) => {
    await installFixtures(page);
    await page.goto(`/result?attemptId=${ATTEMPT_ID}`);
    await expect(page.getByRole("heading", { name: "Math Rendering Performance Test" })).toBeVisible();
    await expect(page.getByText("Solution review")).toBeVisible();

    await expect.poll(async () => (await localMathChunks(page)).length).toBeGreaterThan(0);
    await expect(page.getByText(/what is/i).first()).toBeVisible();
  });
});
