import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-auth-expiry-1";
const SESSION_ID = "attempt-session-auth-expiry-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const testDetail = {
  id: TEST_ID,
  name: "Session Security Mock",
  category: "SSC",
  categoryName: "SSC",
  categoryId: "ssc",
  subcategoryId: "ssc-cgl",
  subcategoryName: "SSC CGL",
  access: "free",
  priceCents: null,
  kind: "full-length",
  duration: 30,
  totalQuestions: 1,
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
      ],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 1,
  negativeMarks: 0,
  unattemptedMarks: 0,
};

type AuthFixtureState = {
  revoked: boolean;
  profileChecks: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installApiFixtures(page: Page): Promise<AuthFixtureState> {
  const state: AuthFixtureState = { revoked: false, profileChecks: 0 };

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

    if (path === "/users/me" && method === "GET") {
      state.profileChecks += 1;
      if (state.revoked) {
        return fulfillJson(route, {
          code: "SESSION_REVOKED",
          error: "This session has been revoked.",
        }, 401);
      }
      return fulfillJson(route, student);
    }

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
        revision: 1,
        seriesId: null,
        updatedAt: "2026-08-19T00:00:00.000Z",
        state: null,
      }, 201);
    }

    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: Number(payload.expectedRevision ?? 1) + 1,
        seriesId: null,
        updatedAt: "2026-08-19T00:01:00.000Z",
        state: payload.state ?? null,
      });
    }

    return fulfillJson(route, { error: `Unhandled auth-expiry E2E API route: ${method} ${path}` }, 404);
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

test.describe("CP01B active-session revocation", () => {
  test("ejects an already-open test when the canonical session is revoked", async ({ page }) => {
    const state = await installApiFixtures(page);
    await seedStudentSession(page);
    await page.goto(`/test/${TEST_ID}`);

    await expect(page.getByRole("heading", { name: "Session Security Mock" })).toBeVisible();
    await page.getByRole("button", { name: "Start Test" }).click();
    await page.getByRole("button", { name: /Four/ }).click();

    await expect.poll(async () => page.evaluate((testId) => {
      const rawDrafts = localStorage.getItem("active_test_sessions");
      const drafts = rawDrafts ? JSON.parse(rawDrafts) as Record<string, unknown> : {};
      const handle = sessionStorage.getItem(`examtree.canonical-attempt.${testId}`);
      return Boolean(drafts[testId]) && Boolean(handle);
    }, TEST_ID)).toBe(true);

    const checksBeforeRevocation = state.profileChecks;
    const dialogPromise = page.waitForEvent("dialog", { timeout: 10_000 });
    state.revoked = true;

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain("session was ended by an administrator");
    await dialog.accept();

    await expect(page).toHaveURL(/\/login\?reason=session-revoked/, { timeout: 10_000 });
    expect(state.profileChecks).toBeGreaterThan(checksBeforeRevocation);

    const cleared = await page.evaluate((testId) => ({
      user: localStorage.getItem("user"),
      activeSessions: localStorage.getItem("active_test_sessions"),
      canonicalHandle: sessionStorage.getItem(`examtree.canonical-attempt.${testId}`),
    }), TEST_ID);

    expect(cleared.user).toBeNull();
    expect(cleared.activeSessions).toBeNull();
    expect(cleared.canonicalHandle).toBeNull();
  });
});
