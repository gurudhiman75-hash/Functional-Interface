import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-1";
const SESSION_ID = "attempt-session-conflict-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const testDetail = {
  id: TEST_ID,
  name: "Foundation Mock",
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
  sectionTimingMode: "none",
  sectionTimings: [],
  sectionSettings: [],
  sections: [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      questions: [
        {
          id: 101,
          text: "What is 2 + 2?",
          options: ["Four", "Five", "Six", "Seven"],
          correct: 0,
          section: "Quantitative Aptitude",
          explanation: "Adding two and two gives four.",
        },
        {
          id: 102,
          text: "What is 10% of 50?",
          options: ["2", "5", "10", "15"],
          correct: 1,
          section: "Quantitative Aptitude",
          explanation: "Ten per cent of fifty is five.",
        },
      ],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 1,
  negativeMarks: 0,
  unattemptedMarks: 0,
};

const authoritativeServerDraft = {
  testId: TEST_ID,
  testName: "Foundation Mock",
  category: "SSC",
  currentSectionIndex: 0,
  currentQuestionIndex: 1,
  answers: { 101: 1 },
  flags: { 101: true },
  timeLeft: 1_500,
  sectionTimeLeftByName: {},
  updatedAt: Date.now() + 30_000,
  attemptType: "REAL",
  lockedSections: [],
  sectionCompletionTimes: {},
  visitedQuestionIds: [101, 102],
};

type ConflictState = {
  conflictSent: boolean;
  patchAttempts: number;
  sessionPosts: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installConflictFixtures(page: Page): Promise<ConflictState> {
  const state: ConflictState = { conflictSent: false, patchAttempts: 0, sessionPosts: 0 };

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T00:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-19T00:00:00.000Z" });
    if (path === `/tests/${TEST_ID}` && method === "GET") return fulfillJson(route, testDetail);
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") {
      return fulfillJson(route, { purchased: true, testId: TEST_ID, access: "free", priceCents: null });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      state.sessionPosts += 1;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: state.conflictSent ? 5 : 1,
        seriesId: null,
        updatedAt: state.conflictSent ? "2026-08-19T00:05:00.000Z" : "2026-08-19T00:00:00.000Z",
        state: state.conflictSent ? authoritativeServerDraft : null,
      }, 201);
    }

    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      state.patchAttempts += 1;
      if (!state.conflictSent) {
        state.conflictSent = true;
        return fulfillJson(route, {
          error: "stale revision",
          session: {
            id: SESSION_ID,
            testId: TEST_ID,
            revision: 5,
            seriesId: null,
            updatedAt: "2026-08-19T00:05:00.000Z",
            state: authoritativeServerDraft,
          },
        }, 409);
      }

      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: Number(payload.expectedRevision ?? 5) + 1,
        seriesId: null,
        updatedAt: "2026-08-19T00:06:00.000Z",
        state: payload.state ?? authoritativeServerDraft,
      });
    }

    return fulfillJson(route, { error: `Unhandled conflict E2E API route: ${method} ${path}` }, 404);
  });

  return state;
}

async function seedStudentSession(page: Page) {
  await page.goto("/login/student");
  await page.evaluate(async ({ apiKey, token, profile }) => {
    localStorage.setItem("user", JSON.stringify(profile));

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
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student });
}

test.describe("CP01B stale revision recovery", () => {
  test("replaces an outdated local draft with the authoritative server state", async ({ page }) => {
    const state = await installConflictFixtures(page);
    await seedStudentSession(page);
    await page.goto(`/test/${TEST_ID}`);
    await expect(page.getByRole("heading", { name: "Foundation Mock" })).toBeVisible();
    await page.getByRole("button", { name: "Start Test" }).click();
    await expect(page.getByText("Question No 1")).toBeVisible();

    const dialogPromise = page.waitForEvent("dialog");
    await page.getByRole("button", { name: /Four/ }).click();

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain("updated in another tab or device");
    await dialog.accept();

    await expect(page.getByText(/saved session for this test/i)).toBeVisible({ timeout: 12_000 });
    expect(state.conflictSent).toBe(true);
    expect(state.patchAttempts).toBeGreaterThanOrEqual(1);
    expect(state.sessionPosts).toBeGreaterThanOrEqual(2);

    const recovered = await page.evaluate((testId) => {
      const rawDrafts = localStorage.getItem("active_test_sessions");
      const drafts = rawDrafts ? JSON.parse(rawDrafts) as Record<string, Record<string, unknown>> : {};
      const rawHandle = sessionStorage.getItem(`examtree.canonical-attempt.${testId}`);
      const handle = rawHandle ? JSON.parse(rawHandle) as Record<string, unknown> : null;
      return {
        draft: drafts[testId] ?? null,
        revision: Number(handle?.revision ?? -1),
      };
    }, TEST_ID);

    expect(recovered.revision).toBe(5);
    expect(recovered.draft?.currentQuestionIndex).toBe(1);
    expect((recovered.draft?.answers as Record<string, number> | undefined)?.["101"]).toBe(1);
    expect((recovered.draft?.flags as Record<string, boolean> | undefined)?.["101"]).toBe(true);

    await page.getByRole("button", { name: "Resume Test" }).click();
    await expect(page.getByText("Question No 2")).toBeVisible();
    await expect(page.getByText("What is 10% of 50?")).toBeVisible();
  });
});
