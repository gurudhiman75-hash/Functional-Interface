import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "test-timer-start-1";
const SESSION_ID = "attempt-session-timer-start-1";
const RESULT_ATTEMPT_ID = "attempt-timer-final-1";
const FIRST_DRAFT_PROBE = "examtree.e2e.first-active-draft";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

function fixedSectionTest(minutesPerSection: number) {
  return {
    id: TEST_ID,
    name: "Fixed Section Timer Mock",
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
      { name: "Quantitative Aptitude", minutes: minutesPerSection },
      { name: "Reasoning", minutes: minutesPerSection },
    ],
    sectionSettings: [
      { name: "Quantitative Aptitude", locked: true },
      { name: "Reasoning", locked: true },
    ],
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
      {
        id: "reasoning",
        name: "Reasoning",
        questions: [
          {
            id: 201,
            text: "Which number comes next: 2, 4, 6, ?",
            options: ["7", "8", "9", "10"],
            correct: 1,
            section: "Reasoning",
            explanation: "The sequence increases by two.",
          },
        ],
      },
    ],
    languages: ["en"],
    marksPerQuestion: 1,
    negativeMarks: 0,
    unattemptedMarks: 0,
  };
}

function committedAttempt() {
  const createdAt = "2026-08-19T10:00:00.000Z";
  return {
    id: RESULT_ATTEMPT_ID,
    userId: student.id,
    testId: TEST_ID,
    testName: "Fixed Section Timer Mock",
    category: "SSC",
    score: 0,
    actualScore: 0,
    marksPerQuestion: 1,
    negativeMarks: 0,
    correct: 0,
    wrong: 0,
    unanswered: 2,
    totalQuestions: 2,
    timeSpent: 0,
    createdAt,
    submittedAt: createdAt,
    attemptType: "REAL",
    isFirstAttempt: true,
    sectionStats: [],
    sectionTimeSpent: [],
    questionReview: [],
  };
}

type TimerObservations = {
  attemptSessionPosts: number;
  draftPatches: number;
  attemptPosts: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installTimerFixtures(
  page: Page,
  testDetail: ReturnType<typeof fixedSectionTest>,
): Promise<TimerObservations> {
  const observations: TimerObservations = {
    attemptSessionPosts: 0,
    draftPatches: 0,
    attemptPosts: 0,
  };
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
      observations.attemptSessionPosts += 1;
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
      observations.draftPatches += 1;
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

    if (path === "/attempts" && method === "POST") {
      observations.attemptPosts += 1;
      return fulfillJson(route, committedAttempt(), 201);
    }
    if (path === `/attempts/${RESULT_ATTEMPT_ID}` && method === "GET") {
      return fulfillJson(route, committedAttempt());
    }
    if (path === "/attempts" && method === "GET") return fulfillJson(route, [committedAttempt()]);

    return fulfillJson(route, { error: `Unhandled timer-start E2E API route: ${method} ${path}` }, 404);
  });

  return observations;
}

async function installFirstDraftProbe(page: Page) {
  await page.addInitScript(({ probeKey, testId }) => {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (key === "active_test_sessions" && !sessionStorage.getItem(probeKey)) {
        try {
          const parsed = JSON.parse(value) as Record<string, unknown>;
          if (parsed[testId]) sessionStorage.setItem(probeKey, value);
        } catch {
          // Ignore malformed writes; the production storage wrapper owns recovery.
        }
      }
      return nativeSetItem.call(this, key, value);
    };
  }, { probeKey: FIRST_DRAFT_PROBE, testId: TEST_ID });
}

async function seedStudentSession(page: Page) {
  await page.goto("/login/student");
  await page.evaluate(async ({ apiKey, token, profile, probeKey }) => {
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("attempts", JSON.stringify([]));
    sessionStorage.removeItem(probeKey);

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
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student, probeKey: FIRST_DRAFT_PROBE });
}

async function openRunner(page: Page, testDetail: ReturnType<typeof fixedSectionTest>) {
  await installFirstDraftProbe(page);
  const observations = await installTimerFixtures(page, testDetail);
  await seedStudentSession(page);
  await page.goto(`/test/${TEST_ID}`);
  await expect(page.getByRole("heading", { name: "Fixed Section Timer Mock" })).toBeVisible();
  await page.getByRole("button", { name: "Start Test" }).click();
  await expect(page.getByText("Question No 1")).toBeVisible();
  return observations;
}

async function readSavedDraft(page: Page) {
  return page.evaluate((testId) => {
    const raw = localStorage.getItem("active_test_sessions");
    if (!raw) return null;
    const sessions = JSON.parse(raw) as Record<string, Record<string, unknown>>;
    return sessions[testId] ?? null;
  }, TEST_ID);
}

async function readFirstSavedDraft(page: Page) {
  return page.evaluate(({ probeKey, testId }) => {
    const raw = sessionStorage.getItem(probeKey);
    if (!raw) return null;
    const sessions = JSON.parse(raw) as Record<string, Record<string, unknown>>;
    return sessions[testId] ?? null;
  }, { probeKey: FIRST_DRAFT_PROBE, testId: TEST_ID });
}

test.describe("CP01B timer start and sectional expiry", () => {
  test("creates and advances a sectional real-attempt draft before the first answer", async ({ page }) => {
    const observations = await openRunner(page, fixedSectionTest(0.1));

    await expect.poll(async () => readFirstSavedDraft(page)).not.toBeNull();
    const initial = await readFirstSavedDraft(page);
    expect(initial?.attemptType).toBe("REAL");
    expect(initial?.timerMode).toBe("sectional");
    expect(initial?.answers).toEqual({});
    expect(initial?.sectionTimeLeftByName).toEqual({
      "Quantitative Aptitude": 6,
      Reasoning: 6,
    });

    await expect.poll(() => observations.attemptSessionPosts).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => {
      const draft = await readSavedDraft(page);
      const sections = draft?.sectionTimeLeftByName as Record<string, number> | undefined;
      return sections?.["Quantitative Aptitude"] ?? 6;
    }, { timeout: 5_000 }).toBeLessThan(6);

    const advanced = await readSavedDraft(page);
    expect(advanced?.answers).toEqual({});
    expect(advanced?.timerMode).toBe("sectional");
  });

  test("reconciles a Chromium lifecycle freeze before the first answer", async ({ page, context }) => {
    const observations = await openRunner(page, fixedSectionTest(0.3));

    await expect.poll(async () => readSavedDraft(page)).not.toBeNull();
    const before = await readSavedDraft(page);
    const beforeSections = before?.sectionTimeLeftByName as Record<string, number> | undefined;
    const beforeRemaining = beforeSections?.["Quantitative Aptitude"] ?? 18;
    expect(before?.answers).toEqual({});
    expect(before?.timerMode).toBe("sectional");

    const cdp = await context.newCDPSession(page);
    await cdp.send("Page.setWebLifecycleState", { state: "frozen" });
    await new Promise((resolve) => setTimeout(resolve, 3_500));
    await cdp.send("Page.setWebLifecycleState", { state: "active" });

    await expect.poll(async () => {
      try {
        const draft = await readSavedDraft(page);
        const sections = draft?.sectionTimeLeftByName as Record<string, number> | undefined;
        return sections?.["Quantitative Aptitude"] ?? beforeRemaining;
      } catch {
        // The recovery contract reloads the runner after writing the corrected
        // draft, so page.evaluate can briefly lose its execution context.
        return beforeRemaining;
      }
    }, { timeout: 8_000 }).toBeLessThanOrEqual(beforeRemaining - 2);
    await expect(page).toHaveURL(new RegExp(`/test/${TEST_ID}`));

    const after = await readSavedDraft(page);
    const afterSections = after?.sectionTimeLeftByName as Record<string, number> | undefined;
    const afterRemaining = afterSections?.["Quantitative Aptitude"] ?? beforeRemaining;

    expect(after?.answers).toEqual({});
    expect(after?.timerMode).toBe("sectional");
    expect(beforeRemaining - afterRemaining).toBeGreaterThanOrEqual(2);
    expect(observations.attemptPosts).toBe(0);
  });

  test("rolls across fixed sections and submits when the final sectional clock expires", async ({ page }) => {
    const observations = await openRunner(page, fixedSectionTest(0.02));

    await expect.poll(() => observations.attemptPosts, { timeout: 8_000 }).toBe(1);
    await expect(page).toHaveURL(new RegExp(`attemptId=${RESULT_ATTEMPT_ID}`), { timeout: 8_000 });
    expect(observations.attemptSessionPosts).toBeGreaterThanOrEqual(1);
  });
});
