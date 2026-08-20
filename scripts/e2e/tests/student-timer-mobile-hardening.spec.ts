import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-timer-mobile-1";
const SESSION_ID = "attempt-session-timer-mobile-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const testDetail = {
  id: TEST_ID,
  name: "SSC CGL Tier I Full Length Mock Test 01",
  category: "SSC",
  categoryName: "SSC",
  categoryId: "ssc",
  subcategoryId: "ssc-cgl",
  subcategoryName: "SSC CGL",
  access: "free",
  priceCents: null,
  kind: "full-length",
  duration: 30,
  totalQuestions: 2,
  attempts: 0,
  avgScore: 0,
  difficulty: "Medium",
  sectionTimingMode: "fixed",
  sectionTimings: [
    { name: "Quantitative Aptitude", minutes: 10 },
    { name: "General Intelligence and Reasoning", minutes: 10 },
  ],
  sectionSettings: [
    { name: "Quantitative Aptitude", locked: true },
    { name: "General Intelligence and Reasoning", locked: true },
  ],
  sections: [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      questions: [
        {
          id: 101,
          text: "A shopkeeper marks an article at ₹800 and allows a 10% discount. What is the selling price?",
          options: ["₹700", "₹720", "₹740", "₹760"],
          correct: 1,
          section: "Quantitative Aptitude",
          explanation: "Ten per cent of ₹800 is ₹80, so the selling price is ₹720.",
        },
      ],
    },
    {
      id: "reasoning",
      name: "General Intelligence and Reasoning",
      questions: [
        {
          id: 201,
          text: "Find the next term: 3, 6, 12, 24, ?",
          options: ["36", "42", "48", "54"],
          correct: 2,
          section: "General Intelligence and Reasoning",
          explanation: "Each term is twice the preceding term.",
        },
      ],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 2,
  negativeMarks: 0.5,
  unattemptedMarks: 0,
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installFixtures(page: Page) {
  let revision = 1;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    if (path === `/tests/${TEST_ID}` && method === "GET") return fulfillJson(route, testDetail);
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") {
      return fulfillJson(route, { purchased: true, testId: TEST_ID, access: "free", priceCents: null });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision,
        seriesId: null,
        updatedAt: "2026-08-19T10:00:00.000Z",
        state: null,
      }, 201);
    }

    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      revision += 1;
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision,
        seriesId: null,
        updatedAt: "2026-08-19T10:00:05.000Z",
        state: payload.state ?? null,
      });
    }

    return fulfillJson(route, { error: `Unhandled timer-mobile E2E route: ${method} ${path}` }, 404);
  });
}

async function seedStudentSession(page: Page) {
  await page.goto("/login/student");
  await page.evaluate(async ({ apiKey, token, profile }) => {
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("attempts", JSON.stringify([]));

    const now = Date.now();
    const firebaseUser = {
      uid: profile.id,
      email: profile.email,
      emailVerified: true,
      displayName: profile.name,
      isAnonymous: false,
      providerData: [{
        providerId: "password",
        uid: profile.email,
        displayName: profile.name,
        email: profile.email,
        phoneNumber: null,
        photoURL: null,
      }],
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
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student });
}

test.describe("CP01B mobile runner certification", () => {
  test("keeps the real fixed-sectional runner usable on a Pixel-class viewport", async ({ page }) => {
    await installFixtures(page);
    await seedStudentSession(page);
    await page.goto(`/test/${TEST_ID}`);

    await expect(page.getByRole("heading", { name: testDetail.name })).toBeVisible();
    await page.getByRole("button", { name: "Start Test" }).click();

    await expect(page.getByText("Question No 1")).toBeVisible();
    await expect(page.getByText(/Time Left:/)).toBeVisible();
    await expect(page.getByText(/Section time:/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Pause & Exit" })).toBeVisible();
    await expect(page.getByRole("button", { name: /₹720/ })).toBeVisible();

    const initialOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(initialOverflow).toBeLessThanOrEqual(1);

    await page.getByRole("button", { name: /₹720/ }).click();
    await expect(page.getByRole("button", { name: /₹720/ })).toHaveClass(/bg-blue-50/);

    await expect(page.getByRole("button", { name: /Prev/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Next/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Submit$/ })).toBeVisible();

    await page.getByRole("button", { name: "Pause & Exit" }).click();
    await expect(page.getByRole("heading", { name: "Pause & Exit?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue Test" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save & Exit" })).toBeVisible();

    const modalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(modalOverflow).toBeLessThanOrEqual(1);

    await page.getByRole("button", { name: "Continue Test" }).click();
    await expect(page.getByRole("button", { name: /₹720/ })).toHaveClass(/bg-blue-50/);

    await expect.poll(async () => page.evaluate((testId) => {
      const raw = localStorage.getItem("active_test_sessions");
      const drafts = raw ? JSON.parse(raw) as Record<string, Record<string, unknown>> : {};
      const draft = drafts[testId];
      const answers = draft?.answers as Record<string, number> | undefined;
      return {
        answer: answers?.["101"],
        timerMode: draft?.timerMode,
      };
    }, TEST_ID)).toEqual({ answer: 1, timerMode: "sectional" });
  });
});
