import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const SERIES_ID = "series-1";
const TEST_ID = "test-1";
const SECOND_TEST_ID = "test-2";
const SESSION_ID = "attempt-session-1";
const RESULT_ID = "attempt-result-1";

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

const canonicalResult = {
  id: RESULT_ID,
  userId: student.id,
  testId: TEST_ID,
  testName: "Foundation Mock",
  category: "SSC",
  score: 100,
  actualScore: 2,
  marksPerQuestion: 1,
  negativeMarks: 0,
  correct: 2,
  wrong: 0,
  unanswered: 0,
  totalQuestions: 2,
  timeSpent: 4,
  createdAt: "2026-07-21T06:00:00.000Z",
  submittedAt: "2026-07-21T06:00:00.000Z",
  attemptType: "REAL",
  isFirstAttempt: true,
  seriesId: SERIES_ID,
  sectionStats: [
    {
      name: "Quantitative Aptitude",
      correct: 2,
      wrong: 0,
      unanswered: 0,
      totalQuestions: 2,
      accuracy: 100,
    },
  ],
  questionReview: [
    {
      questionId: 101,
      section: "Quantitative Aptitude",
      text: "What is 2 + 2?",
      options: ["Four", "Five", "Six", "Seven"],
      selected: 0,
      correct: 0,
      flagged: false,
      explanation: "Adding two and two gives four.",
    },
    {
      questionId: 102,
      section: "Quantitative Aptitude",
      text: "What is 10% of 50?",
      options: ["2", "5", "10", "15"],
      selected: 1,
      correct: 1,
      flagged: false,
      explanation: "Ten per cent of fifty is five.",
    },
  ],
};

type FixtureState = {
  completedFirst: boolean;
  serverDraft: Record<string, unknown> | null;
};

type Observations = {
  attemptPosts: number;
  resultGets: number;
  testSeriesIds: string[];
  sessionAuthorization: string[];
  attemptAuthorization: string[];
  lastAttemptBody: Record<string, unknown> | null;
};

function seriesSummary() {
  return {
    id: SERIES_ID,
    code: "SSC-CGL-STARTER",
    name: "SSC CGL Starter Series",
    description: "Two canonical mocks with score-gated progression.",
    availabilityStartAt: null,
    availabilityEndAt: null,
    progressionMode: "score_gated",
    completionThreshold: 60,
    examCode: "SSC-CGL",
    examName: "SSC CGL",
    examFamilyCode: "SSC",
    examFamilyName: "Staff Selection Commission",
    testCount: 2,
    liveTestCount: 2,
    durationSeconds: 3_600,
    questionCount: 4,
  };
}

function member(options: {
  id: string;
  testId: string;
  order: number;
  title: string;
  completed: boolean;
  unlocked: boolean;
  lockReason?: string | null;
}) {
  return {
    id: options.id,
    testId: options.testId,
    publicCode: options.testId === TEST_ID ? "T-FOUNDATION" : "T-ADVANCED",
    sortOrder: options.order,
    title: options.title,
    description: null,
    durationSeconds: 1_800,
    totalMarks: 2,
    questionCount: 2,
    isRequired: true,
    unlockAt: null,
    minimumScore: 60,
    testStatus: "live",
    attemptCount: options.completed ? 1 : 0,
    bestScore: options.completed ? 100 : null,
    lastAttemptAt: options.completed ? canonicalResult.submittedAt : null,
    completed: options.completed,
    scoreRequirement: 60,
    scoreRequirementMet: options.completed,
    unlocked: options.unlocked,
    lockCode: options.unlocked ? null : "PREVIOUS_SCORE_REQUIRED",
    lockReason: options.unlocked ? null : options.lockReason ?? "Complete the previous required test with at least 60%.",
  };
}

function seriesDetail(completedFirst: boolean) {
  return {
    series: {
      id: SERIES_ID,
      code: "SSC-CGL-STARTER",
      name: "SSC CGL Starter Series",
      description: "Two canonical mocks with score-gated progression.",
      examVersionId: "exam-version-1",
      examCode: "SSC-CGL",
      examName: "SSC CGL",
      examFamilyCode: "SSC",
      examFamilyName: "Staff Selection Commission",
      versionNumber: 1,
      availabilityStartAt: null,
      availabilityEndAt: null,
      progressionMode: "score_gated",
      completionThreshold: 60,
    },
    eligibility: {
      available: true,
      availabilityCode: null,
      availabilityReason: null,
      completedRequiredCount: completedFirst ? 1 : 0,
      requiredCount: 2,
      completedCount: completedFirst ? 1 : 0,
      totalCount: 2,
      progressPercent: completedFirst ? 50 : 0,
      nextTestId: completedFirst ? SECOND_TEST_ID : TEST_ID,
      members: [
        member({
          id: "member-1",
          testId: TEST_ID,
          order: 1,
          title: "Foundation Mock",
          completed: completedFirst,
          unlocked: true,
        }),
        member({
          id: "member-2",
          testId: SECOND_TEST_ID,
          order: 2,
          title: "Advanced Mock",
          completed: false,
          unlocked: completedFirst,
          lockReason: "Score at least 60% in Foundation Mock to unlock this test.",
        }),
      ],
    },
    generatedAt: "2026-07-21T06:00:00.000Z",
  };
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installApiFixtures(page: Page, state: FixtureState): Promise<Observations> {
  const observations: Observations = {
    attemptPosts: 0,
    resultGets: 0,
    testSeriesIds: [],
    sessionAuthorization: [],
    attemptAuthorization: [],
    lastAttemptBody: null,
  };

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();
    const authorization = request.headers()["authorization"] ?? "";

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") {
      return fulfillJson(route, {
        tests: [
          {
            id: "standalone-1",
            publicCode: "T-STANDALONE",
            examVersionId: "exam-version-1",
            publishedVersionId: "published-version-1",
            title: "Standalone Speed Mock",
            description: "A standalone canonical test.",
            durationSeconds: 1_200,
            totalMarks: 2,
            settings: {},
            examCode: "SSC-CGL",
            examName: "SSC CGL",
            examFamilyCode: "SSC",
            examFamilyName: "Staff Selection Commission",
            questionCount: 2,
            publishedAt: "2026-07-20T06:00:00.000Z",
            closesAt: null,
          },
        ],
        generatedAt: "2026-07-21T06:00:00.000Z",
      });
    }
    if (path === "/test-series" && method === "GET") {
      return fulfillJson(route, { series: [seriesSummary()], generatedAt: "2026-07-21T06:00:00.000Z" });
    }
    if (path === `/test-series/${SERIES_ID}` && method === "GET") {
      return fulfillJson(route, seriesDetail(state.completedFirst));
    }
    if (path === `/tests/${TEST_ID}` && method === "GET") {
      const seriesId = url.searchParams.get("seriesId");
      if (seriesId) observations.testSeriesIds.push(seriesId);
      return fulfillJson(route, testDetail);
    }
    if (path === `/tests/${SECOND_TEST_ID}` && method === "GET") {
      return fulfillJson(route, { ...testDetail, id: SECOND_TEST_ID, name: "Advanced Mock" });
    }
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") {
      return fulfillJson(route, { purchased: true, testId: url.searchParams.get("testId"), access: "free", priceCents: null });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      observations.sessionAuthorization.push(authorization);
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: 1,
        seriesId: SERIES_ID,
        updatedAt: "2026-07-21T06:00:00.000Z",
        state: state.serverDraft,
      }, 201);
    }
    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      observations.sessionAuthorization.push(authorization);
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: Number(payload.expectedRevision ?? 1) + 1,
        seriesId: SERIES_ID,
        updatedAt: "2026-07-21T06:01:00.000Z",
        state: payload.state ?? null,
      });
    }
    if (path === "/attempts" && method === "POST") {
      observations.attemptPosts += 1;
      observations.attemptAuthorization.push(authorization);
      observations.lastAttemptBody = request.postDataJSON() as Record<string, unknown>;
      state.completedFirst = true;
      await new Promise((resolve) => setTimeout(resolve, 250));
      return fulfillJson(route, canonicalResult, 201);
    }
    if (path === `/attempts/${RESULT_ID}` && method === "GET") {
      observations.resultGets += 1;
      return fulfillJson(route, canonicalResult);
    }
    if (path === "/attempts" && method === "GET") return fulfillJson(route, [canonicalResult]);

    return fulfillJson(route, { error: `Unhandled E2E API route: ${method} ${path}` }, 404);
  });

  return observations;
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

async function openAsStudent(page: Page, path: string) {
  await seedStudentSession(page);
  await page.goto(path);
}

test.describe("canonical student reliability", () => {
  test("protects series progress behind student login", async ({ page }) => {
    await installApiFixtures(page, { completedFirst: false, serverDraft: null });
    await page.goto(`/test-series/${SERIES_ID}`);
    await expect(page).toHaveURL(/\/login\/student\?next=/);
  });

  test("discovers canonical series in the final exams marketplace", async ({ page }) => {
    await installApiFixtures(page, { completedFirst: false, serverDraft: null });
    await openAsStudent(page, "/tests");

    const featuredSeries = page.getByTestId("featured-series-section");
    await expect(featuredSeries.getByRole("heading", { name: "Featured Test Series", exact: true })).toBeVisible();
    await expect(featuredSeries.getByRole("heading", { name: "SSC CGL Starter Series", exact: true })).toBeVisible();

    await featuredSeries.getByRole("button", { name: "View Series", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/test-series/${SERIES_ID}$`));
    await expect(page.getByRole("heading", { name: "SSC CGL Starter Series", exact: true })).toBeVisible();
  });

  test("shows server-reported score gates and carries series context into the runner", async ({ page }) => {
    const observations = await installApiFixtures(page, { completedFirst: false, serverDraft: null });
    await openAsStudent(page, `/test-series/${SERIES_ID}`);

    const foundation = page.getByRole("article").filter({ hasText: "Foundation Mock" });
    const advanced = page.getByRole("article").filter({ hasText: "Advanced Mock" });
    await expect(foundation.getByText("Available")).toBeVisible();
    await expect(advanced.getByRole("button", { name: "Locked" })).toBeVisible();
    await expect(advanced.getByText(/Score at least 60%/)).toBeVisible();

    await foundation.getByRole("button", { name: "Start test" }).click();
    await expect(page).toHaveURL(new RegExp(`/test/${TEST_ID}\\?seriesId=${SERIES_ID}`));
    await expect(page.getByRole("heading", { name: "Foundation Mock" })).toBeVisible();
    expect(observations.testSeriesIds).toContain(SERIES_ID);
    await expect.poll(() => observations.sessionAuthorization).toContain(`Bearer ${FIREBASE_TOKEN}`);
  });

  test("hydrates a canonical server draft and resumes the saved question", async ({ page }) => {
    const serverDraft = {
      testId: TEST_ID,
      testName: "Foundation Mock",
      category: "SSC",
      currentSectionIndex: 0,
      currentQuestionIndex: 1,
      answers: { 101: 0 },
      flags: {},
      timeLeft: 1_500,
      sectionTimeLeftByName: {},
      updatedAt: Date.now(),
      attemptType: "REAL",
      lockedSections: [],
      sectionCompletionTimes: {},
      visitedQuestionIds: [101, 102],
    };
    await installApiFixtures(page, { completedFirst: false, serverDraft });
    await openAsStudent(page, `/test/${TEST_ID}?seriesId=${SERIES_ID}`);

    await expect(page.getByText(/saved session for this test/i)).toBeVisible();
    await page.getByRole("button", { name: "Resume Test" }).click();
    await expect(page.getByText("Question No 2")).toBeVisible();
    await expect(page.getByText("What is 10% of 50?")).toBeVisible();
    await expect(page.getByText("Saved test resumed", { exact: true }).first()).toBeVisible();
  });

  test("submits once, reloads the committed result, and unlocks the next series test", async ({ page }) => {
    const state: FixtureState = { completedFirst: false, serverDraft: null };
    const observations = await installApiFixtures(page, state);
    await openAsStudent(page, `/test/${TEST_ID}?seriesId=${SERIES_ID}`);

    await page.getByRole("button", { name: "Start Test" }).click();
    await expect(page.getByText("Question No 1")).toBeVisible();
    await page.getByRole("button", { name: /Four/ }).click();
    await page.getByRole("button", { name: "Submit test", exact: true }).click();
    await expect(page.getByTestId("submit-modal")).toBeVisible();
    await page.getByTestId("btn-confirm-submit").dblclick();

    await expect(page).toHaveURL(new RegExp(`/result\\?.*attemptId=${RESULT_ID}`));
    await expect(page.getByText("Canonical saved result")).toBeVisible();
    await expect(page.getByText("100%", { exact: true }).first()).toBeVisible();
    expect(observations.attemptPosts).toBe(1);
    expect(observations.attemptAuthorization).toContain(`Bearer ${FIREBASE_TOKEN}`);
    expect(observations.lastAttemptBody?.attemptId).toBe(SESSION_ID);
    expect(observations.lastAttemptBody?.seriesId).toBe(SERIES_ID);

    await page.evaluate((attemptId) => {
      sessionStorage.removeItem(`examtree.attempt.handoff.${attemptId}`);
    }, RESULT_ID);
    await page.reload();
    await expect(page.getByText("Canonical saved result")).toBeVisible();
    await expect.poll(() => observations.resultGets).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Continue Test Series" }).click();
    const advanced = page.getByRole("article").filter({ hasText: "Advanced Mock" });
    await expect(advanced.getByText("Available")).toBeVisible();
    await expect(page.getByText("1 of 2 required tests completed")).toBeVisible();
  });

  test("renders canonical attempt history after a fresh browser navigation", async ({ page }) => {
    await installApiFixtures(page, { completedFirst: true, serverDraft: null });
    await openAsStudent(page, "/dashboard");

    await expect(page.getByRole("heading", { name: "Welcome back, E2E Student" })).toBeVisible();
    await expect(page.getByText("Foundation Mock")).toBeVisible();
    await expect(page.getByText("1 saved")).toBeVisible();
    await expect(page.getByText(/2 correct, 0 wrong/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent attempts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View result" })).toHaveAttribute(
      "href",
      "/result?attemptId=attempt-result-1&testId=test-1",
    );
  });
});
