import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

const TEST_ID = "test-runner-zoom-1";
const SESSION_ID = "attempt-session-runner-zoom-1";
const ATTEMPT_ID = "attempt-runner-zoom-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const testDetail = {
  id: TEST_ID,
  name: "SSC CGL Accessibility Full Length Mock Test With A Long Mobile Title",
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
      questions: [{
        id: 101,
        text: "A shopkeeper marks an article at ₹800 and allows a 10% discount. What is the selling price?",
        options: ["₹700", "₹720", "₹740", "₹760"],
        correct: 1,
        section: "Quantitative Aptitude",
        explanation: "Ten per cent of ₹800 is ₹80, so the selling price is ₹720.",
      }],
    },
    {
      id: "reasoning",
      name: "General Intelligence and Reasoning",
      questions: [{
        id: 201,
        text: "Find the next term: 3, 6, 12, 24, ?",
        options: ["36", "42", "48", "54"],
        correct: 2,
        section: "General Intelligence and Reasoning",
        explanation: "Each term is twice the preceding term.",
      }],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 2,
  negativeMarks: 0.5,
  unattemptedMarks: 0,
};

const canonicalAttempt = {
  id: ATTEMPT_ID,
  userId: student.id,
  testId: TEST_ID,
  testName: testDetail.name,
  category: "SSC",
  score: 50,
  actualScore: 1.5,
  marksPerQuestion: 2,
  negativeMarks: 0.5,
  correct: 1,
  wrong: 1,
  unanswered: 0,
  totalQuestions: 2,
  timeSpent: 12,
  createdAt: "2026-08-20T03:00:00.000Z",
  submittedAt: "2026-08-20T03:12:00.000Z",
  attemptType: "REAL",
  isFirstAttempt: true,
  sectionStats: [],
  sectionTimeSpent: [],
  questionReview: [
    {
      questionId: 101,
      section: "Quantitative Aptitude",
      text: testDetail.sections[0].questions[0].text,
      options: testDetail.sections[0].questions[0].options,
      selected: 1,
      correct: 1,
      flagged: false,
      explanation: testDetail.sections[0].questions[0].explanation,
    },
    {
      questionId: 201,
      section: "General Intelligence and Reasoning",
      text: testDetail.sections[1].questions[0].text,
      options: testDetail.sections[1].questions[0].options,
      selected: 0,
      correct: 2,
      flagged: true,
      explanation: testDetail.sections[1].questions[0].explanation,
    },
  ],
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
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
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T03:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-20T03:00:00.000Z" });
    if (path === `/tests/${TEST_ID}` && method === "GET") return fulfillJson(route, testDetail);
    if (path === `/attempts/${ATTEMPT_ID}` && method === "GET") return fulfillJson(route, canonicalAttempt);
    if (path === "/attempts" && method === "GET") return fulfillJson(route, [canonicalAttempt]);
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") return fulfillJson(route, { purchased: true, testId: TEST_ID, access: "free", priceCents: null });
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      return fulfillJson(route, { id: SESSION_ID, testId: TEST_ID, revision, seriesId: null, updatedAt: "2026-08-20T03:00:00.000Z", state: null }, 201);
    }
    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      revision += 1;
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, { id: SESSION_ID, testId: TEST_ID, revision, seriesId: null, updatedAt: "2026-08-20T03:00:05.000Z", state: payload.state ?? null });
    }

    return fulfillJson(route, { error: `Unhandled runner zoom/contrast route: ${method} ${path}` }, 404);
  });
}

async function seedStudent(page: Page) {
  await page.goto("/login/student");
  await page.evaluate((profile) => {
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("attempts", JSON.stringify([]));
  }, student);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    const parse = (value: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas 2D context unavailable for contrast proof");
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: alpha / 255 };
    };
    const composite = (
      foreground: { r: number; g: number; b: number; a: number },
      background: { r: number; g: number; b: number; a: number },
    ) => {
      const a = foreground.a + background.a * (1 - foreground.a);
      if (a <= 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / a,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / a,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / a,
        a,
      };
    };
    const backgrounds: ReturnType<typeof parse>[] = [];
    let current: Element | null = element;
    while (current) {
      backgrounds.push(parse(getComputedStyle(current).backgroundColor));
      current = current.parentElement;
    }
    let background = { r: 255, g: 255, b: 255, a: 1 };
    for (const layer of backgrounds.reverse()) background = composite(layer, background);

    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const channel = (value: number) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    const foreground = parse(getComputedStyle(element).color);
    const foregroundLuminance = luminance(composite(foreground, background));
    const backgroundLuminance = luminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  });
}

async function setTwoXScale(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await expect.poll(() => page.evaluate(() => window.visualViewport?.scale ?? 1)).toBeGreaterThanOrEqual(1.9);
}

test.describe("CP02 runner and result zoom contrast", () => {
  test("keeps the active exam runner usable and readable at 200% scale", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixtures(page);
    await seedStudent(page);
    await page.goto(`/test/${TEST_ID}`);
    await expect(page.getByRole("heading", { name: testDetail.name })).toBeVisible();
    await page.getByRole("button", { name: "Start Test" }).click();
    await expect(page.getByText("Question No 1")).toBeVisible();

    await setTwoXScale(page);
    await expectNoHorizontalOverflow(page);

    const pause = page.getByRole("button", { name: "Pause & Exit" });
    const question = page.getByText(testDetail.sections[0].questions[0].text);
    const answer = page.getByRole("button", { name: /₹720/ });
    const next = page.getByRole("button", { name: /^Next/ });
    const submit = page.getByRole("button", { name: /^Submit$/ });

    for (const control of [pause, question, answer, next, submit]) await expect(control).toBeVisible();
    expect(await contrastRatio(pause)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(question)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(answer)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(next)).toBeGreaterThanOrEqual(4.5);

    await pause.click();
    await expect(page.getByRole("heading", { name: "Pause & Exit?" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("keeps the canonical result readable and reflow-safe at 200% scale", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixtures(page);
    await seedStudent(page);
    await page.goto(`/result?attemptId=${ATTEMPT_ID}&testId=${TEST_ID}`);

    await expect(page.getByRole("heading", { name: testDetail.name })).toBeVisible();
    await expect(page.getByText("50%")).toBeVisible();
    await setTwoXScale(page);
    await expectNoHorizontalOverflow(page);

    const back = page.getByRole("button", { name: "Back to My Activity" });
    const heading = page.getByRole("heading", { name: testDetail.name });
    const reviewHeading = page.getByRole("heading", { name: "Solution review" });
    const activeFilter = page.getByRole("button", { name: "All (2)" });
    const retake = page.getByRole("button", { name: "Retake test" });

    for (const control of [back, heading, reviewHeading, activeFilter, retake]) await expect(control).toBeVisible();
    expect(await contrastRatio(back)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(heading)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(reviewHeading)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(activeFilter)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(retake)).toBeGreaterThanOrEqual(4.5);
  });
});
