import { expect, test, type Page, type Route } from "@playwright/test";

const ATTEMPT_ID = "attempt-startup-performance-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

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

type CatalogRequestCounts = {
  categories: number;
  subcategories: number;
  tests: number;
};

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page, counts?: CatalogRequestCounts) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/categories") {
      if (counts) counts.categories += 1;
      return fulfillJson(route, []);
    }
    if (path === "/subcategories") {
      if (counts) counts.subcategories += 1;
      return fulfillJson(route, []);
    }
    if (path === "/tests") {
      if (counts) counts.tests += 1;
      return fulfillJson(route, []);
    }
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T06:45:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-20T06:45:00.000Z" });
    if (path === `/attempts/${ATTEMPT_ID}`) return fulfillJson(route, attempt);
    if (path === "/attempts") return fulfillJson(route, [attempt]);
    if (path === "/users/me") return fulfillJson(route, student);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    return fulfillJson(route, []);
  });
}

function resourceNames(page: Page) {
  return page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
}

async function matchingResources(page: Page, pattern: RegExp) {
  return (await resourceNames(page)).filter((name) => pattern.test(name));
}

function localMathProviderChunks(page: Page) {
  return matchingResources(page, /\/assets\/MathJaxRouteProvider-[^/]+\.js(?:\?|$)/);
}

function localAuthChunks(page: Page) {
  return matchingResources(page, /\/assets\/auth-[^/]+\.js(?:\?|$)/);
}

function localFirebaseChunks(page: Page) {
  return matchingResources(page, /\/assets\/firebase-[^/]+\.js(?:\?|$)/);
}

test.describe("CP05 route-scoped startup runtime", () => {
  test("anonymous information pages download neither MathJax auth Firebase nor the exam catalog", async ({ page }) => {
    const counts: CatalogRequestCounts = { categories: 0, subcategories: 0, tests: 0 };
    await installFixtures(page, counts);
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "A serious mock-test platform for serious aspirants." })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(await localMathProviderChunks(page)).toEqual([]);
    expect(await localAuthChunks(page)).toEqual([]);
    expect(await localFirebaseChunks(page)).toEqual([]);
    expect(counts).toEqual({ categories: 0, subcategories: 0, tests: 0 });
  });

  test("exam discovery loads the catalog on demand without loading auth or Firebase", async ({ page }) => {
    const counts: CatalogRequestCounts = { categories: 0, subcategories: 0, tests: 0 };
    await installFixtures(page, counts);
    await page.goto("/exams");
    await expect(page.getByRole("heading", { name: "Explore the catalog hierarchy" })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(counts.categories).toBeGreaterThan(0);
    expect(counts.subcategories).toBeGreaterThan(0);
    expect(counts.tests).toBeGreaterThan(0);
    expect(await localAuthChunks(page)).toEqual([]);
    expect(await localFirebaseChunks(page)).toEqual([]);
  });

  test("student login loads Firebase-backed auth on demand without waking the exam catalog", async ({ page }) => {
    const counts: CatalogRequestCounts = { categories: 0, subcategories: 0, tests: 0 };
    await installFixtures(page, counts);

    // The reliability build supplies a synthetic Firebase currentUser. Keep the
    // canonical profile lookup pending so this test can certify the signed-out
    // login surface before that listener redirects to Dashboard.
    await page.route("**/api/users/me", async () => {
      await new Promise<void>(() => {});
    });

    await page.goto("/login/student");
    await expect(page.getByRole("heading", { name: "Welcome to examtree" })).toBeVisible();
    await expect(page.getByTestId("tab-login")).toBeVisible();

    await expect.poll(async () => (await localAuthChunks(page)).length).toBeGreaterThan(0);
    await expect.poll(async () => (await localFirebaseChunks(page)).length).toBeGreaterThan(0);
    expect(counts).toEqual({ categories: 0, subcategories: 0, tests: 0 });
  });

  test("saved question review loads the isolated MathJax bundle on demand", async ({ page }) => {
    await installFixtures(page);
    await page.goto(`/result?attemptId=${ATTEMPT_ID}`);
    await expect(page.getByRole("heading", { name: "Math Rendering Performance Test" })).toBeVisible();
    await expect(page.getByText("Solution review")).toBeVisible();

    await expect.poll(async () => (await localMathProviderChunks(page)).length).toBeGreaterThan(0);
    await expect(page.getByText(/what is/i).first()).toBeVisible();
  });
});
