import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

function attempt(id: string, score = 100, offsetMinutes = 0) {
  const createdAt = new Date(Date.UTC(2026, 6, 21, 6, offsetMinutes, 0)).toISOString();
  return {
    id,
    userId: student.id,
    testId: TEST_ID,
    testName: "Foundation Mock",
    category: "SSC",
    score,
    actualScore: score === 100 ? 2 : 1,
    marksPerQuestion: 1,
    negativeMarks: 0,
    correct: score === 100 ? 2 : 1,
    wrong: score === 100 ? 0 : 1,
    unanswered: 0,
    totalQuestions: 2,
    timeSpent: 4,
    createdAt,
    submittedAt: createdAt,
    attemptType: "REAL",
    isFirstAttempt: id === "attempt-result-1",
    sectionStats: [],
    questionReview: [],
  };
}

type FixtureObservations = {
  attemptByIdGets: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installApiFixtures(page: Page, attempts: ReturnType<typeof attempt>[]): Promise<FixtureObservations> {
  const observations: FixtureObservations = { attemptByIdGets: 0 };

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-07-21T06:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-07-21T06:00:00.000Z" });
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/analytics") {
      return fulfillJson(route, {
        totalAttempts: attempts.length,
        averageScore: attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length) : 0,
        highestScore: attempts.length ? Math.max(...attempts.map((item) => item.score)) : 0,
        recentAttempts: [],
      });
    }
    if (path === "/packages/user/my-packages") return fulfillJson(route, []);
    if (path === "/attempts" && method === "GET") return fulfillJson(route, attempts);
    if (path.startsWith("/attempts/") && method === "GET") {
      observations.attemptByIdGets += 1;
      const id = decodeURIComponent(path.slice("/attempts/".length));
      const found = attempts.find((item) => item.id === id);
      return found ? fulfillJson(route, found) : fulfillJson(route, { error: "not found" }, 404);
    }

    return fulfillJson(route, { error: `Unhandled CP01B E2E API route: ${method} ${path}` }, 404);
  });

  return observations;
}

async function seedStudentSession(page: Page, cachedAttempts: ReturnType<typeof attempt>[] = []) {
  await page.goto("/login/student");
  await page.evaluate(async ({ apiKey, token, profile, attempts }) => {
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("attempts", JSON.stringify(attempts));

    const now = Date.now();
    const firebaseUser = {
      uid: profile.id,
      email: profile.email,
      emailVerified: true,
      displayName: profile.name,
      isAnonymous: false,
      providerData: [
        {
          providerId: "password",
          uid: profile.email,
          displayName: profile.name,
          email: profile.email,
          phoneNumber: null,
          photoURL: null,
        },
      ],
      stsTokenManager: {
        refreshToken: "examtree-e2e-refresh-token",
        accessToken: token,
        expirationTime: now + 60 * 60 * 1000,
      },
      createdAt: String(now - 60_000),
      lastLoginAt: String(now),
      apiKey,
      appName: "[DEFAULT]",
    };

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("firebaseLocalStorageDb", 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("firebaseLocalStorage")) {
          database.createObjectStore("firebaseLocalStorage", { keyPath: "fbase_key" });
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("firebaseLocalStorage", "readwrite");
        transaction.objectStore("firebaseLocalStorage").put({
          fbase_key: `firebase:authUser:${apiKey}:[DEFAULT]`,
          value: firebaseUser,
        });
        transaction.onerror = () => reject(transaction.error);
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
      };
    });
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student, attempts: cachedAttempts });
}

async function openAsStudent(page: Page, path: string, cachedAttempts: ReturnType<typeof attempt>[] = []) {
  await seedStudentSession(page, cachedAttempts);
  await page.goto(path);
}

test.describe("CP01B student production hardening", () => {
  test("test-only result links never resurrect an older cached score", async ({ page }) => {
    const staleAttempt = attempt("older-attempt", 50);
    const observations = await installApiFixtures(page, [staleAttempt]);

    await openAsStudent(page, `/result?testId=${encodeURIComponent(TEST_ID)}`, [staleAttempt]);

    await expect(page.getByRole("heading", { name: "Submission is not confirmed yet" })).toBeVisible();
    await expect(page.getByText("Canonical saved result")).toHaveCount(0);
    expect(observations.attemptByIdGets).toBe(0);
  });

  test("profile exposes only canonical attempt navigation and remains mobile-safe", async ({ page }) => {
    const attempts = Array.from({ length: 5 }, (_, index) => attempt(`attempt-result-${index + 1}`, 100 - index * 10, index));
    await installApiFixtures(page, attempts);

    await openAsStudent(page, "/profile");

    await expect(page.getByRole("heading", { name: /Welcome back, E2E Student/ })).toBeVisible();
    await expect(page.getByText("Member since")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Performance" })).toHaveCount(0);

    const firstAttemptLink = page.locator('a[href^="/result?"]').first();
    await expect(firstAttemptLink).toHaveAttribute("href", /attemptId=attempt-result-1/);
    await expect(firstAttemptLink).toHaveAttribute("href", /testId=test-1/);
    await expect(page.getByRole("link", { name: "View all attempts" })).toHaveAttribute("href", "/dashboard");
    await expect(page.getByRole("link", { name: "My Activity" })).toHaveAttribute("href", "/dashboard");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
