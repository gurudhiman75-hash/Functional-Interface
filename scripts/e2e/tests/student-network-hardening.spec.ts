import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-1";
const SESSION_ID = "attempt-session-network-1";

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

type NetworkObservations = {
  draftPatchAttempts: number;
  draftPayloads: Record<string, unknown>[];
  attemptPosts: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installNetworkFixtures(
  page: Page,
  options: { failFirstDraftPatch?: boolean; failAttemptSubmission?: boolean } = {},
): Promise<NetworkObservations> {
  const observations: NetworkObservations = {
    draftPatchAttempts: 0,
    draftPayloads: [],
    attemptPosts: 0,
  };

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
      observations.draftPatchAttempts += 1;
      const payload = request.postDataJSON() as Record<string, unknown>;
      observations.draftPayloads.push(payload);

      if (options.failFirstDraftPatch && observations.draftPatchAttempts === 1) {
        return fulfillJson(route, { error: "temporary network outage" }, 503);
      }

      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: Number(payload.expectedRevision ?? 1) + 1,
        seriesId: null,
        updatedAt: "2026-08-19T00:00:10.000Z",
        state: payload.state ?? null,
      });
    }

    if (path === "/attempts" && method === "POST") {
      observations.attemptPosts += 1;
      if (options.failAttemptSubmission) {
        return fulfillJson(route, { error: "temporary network outage" }, 503);
      }
      return fulfillJson(route, { error: "unexpected submission in network fixture" }, 500);
    }

    return fulfillJson(route, { error: `Unhandled network E2E API route: ${method} ${path}` }, 404);
  });

  return observations;
}

async function seedStudentSession(page: Page, cachedAttempts: unknown[] = []) {
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

async function openRunner(page: Page, cachedAttempts: unknown[] = []) {
  await seedStudentSession(page, cachedAttempts);
  await page.goto(`/test/${TEST_ID}`);
  await expect(page.getByRole("heading", { name: "Foundation Mock" })).toBeVisible();
  await page.getByRole("button", { name: "Start Test" }).click();
  await expect(page.getByText("Question No 1")).toBeVisible();
}

async function readSavedDraft(page: Page) {
  return page.evaluate((testId) => {
    const raw = localStorage.getItem("active_test_sessions");
    if (!raw) return null;
    const sessions = JSON.parse(raw) as Record<string, Record<string, unknown>>;
    return sessions[testId] ?? null;
  }, TEST_ID);
}

test.describe("CP01B network recovery", () => {
  test("retries a failed canonical draft PATCH without losing the local answer", async ({ page }) => {
    const observations = await installNetworkFixtures(page, { failFirstDraftPatch: true });
    await openRunner(page);

    await page.getByRole("button", { name: /Four/ }).click();

    await expect.poll(async () => {
      const draft = await readSavedDraft(page);
      const answers = draft?.answers as Record<string, number> | undefined;
      return answers?.["101"];
    }).toBe(0);

    await expect.poll(() => observations.draftPatchAttempts, { timeout: 10_000 }).toBeGreaterThanOrEqual(2);

    const successfulRetry = observations.draftPayloads.slice(1).find((payload) => {
      const state = payload.state as Record<string, unknown> | undefined;
      const answers = state?.answers as Record<string, number> | undefined;
      return answers?.["101"] === 0;
    });
    expect(successfulRetry).toBeTruthy();
    await expect(page.getByText("Question No 1")).toBeVisible();
  });

  test("submission network loss shows no stale score and preserves the recoverable draft", async ({ page }) => {
    const staleAttempt = {
      id: "older-attempt",
      userId: student.id,
      testId: TEST_ID,
      testName: "Foundation Mock",
      category: "SSC",
      score: 50,
      correct: 1,
      wrong: 1,
      unanswered: 0,
      totalQuestions: 2,
      timeSpent: 10,
      createdAt: "2026-08-18T00:00:00.000Z",
      attemptType: "REAL",
      questionReview: [],
    };
    const observations = await installNetworkFixtures(page, { failAttemptSubmission: true });
    await openRunner(page, [staleAttempt]);

    await page.getByRole("button", { name: /Four/ }).click();
    await expect.poll(async () => Boolean(await readSavedDraft(page))).toBe(true);

    await page.getByRole("button", { name: "Submit test", exact: true }).click();
    await expect(page.getByTestId("submit-modal")).toBeVisible();
    await page.getByTestId("btn-confirm-submit").click();

    await expect(page).toHaveURL(new RegExp(`/result\\?testId=${TEST_ID}$`));
    await expect(page.getByRole("heading", { name: "Submission is not confirmed yet" })).toBeVisible();
    await expect(page.getByText("Canonical saved result")).toHaveCount(0);
    await expect(page.getByText("50%", { exact: true })).toHaveCount(0);
    expect(observations.attemptPosts).toBe(1);

    const recoveryState = await page.evaluate((testId) => {
      const rawDrafts = localStorage.getItem("active_test_sessions");
      const drafts = rawDrafts ? JSON.parse(rawDrafts) as Record<string, unknown> : {};
      const handle = sessionStorage.getItem(`examtree.canonical-attempt.${testId}`);
      return { hasDraft: Boolean(drafts[testId]), hasCanonicalHandle: Boolean(handle) };
    }, TEST_ID);

    expect(recoveryState.hasDraft).toBe(true);
    expect(recoveryState.hasCanonicalHandle).toBe(true);
  });
});
