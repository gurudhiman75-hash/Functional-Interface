import { expect, test, type Page, type Route } from "@playwright/test";

const TEST_ID = "test-runner-dialog-1";
const SESSION_ID = "attempt-session-runner-dialog-1";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const testDetail = {
  id: TEST_ID,
  name: "SSC CGL Dialog Accessibility Mock",
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
    { name: "Reasoning", minutes: 10 },
  ],
  sectionSettings: [
    { name: "Quantitative Aptitude", locked: true },
    { name: "Reasoning", locked: true },
  ],
  sections: [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      questions: [{
        id: 101,
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        section: "Quantitative Aptitude",
        explanation: "Two plus two equals four.",
      }],
    },
    {
      id: "reasoning",
      name: "Reasoning",
      questions: [{
        id: 201,
        text: "Which number comes next: 2, 4, 6, ?",
        options: ["7", "8", "9", "10"],
        correct: 1,
        section: "Reasoning",
        explanation: "The sequence increases by two.",
      }],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 1,
  negativeMarks: 0,
  unattemptedMarks: 0,
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
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T04:45:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-20T04:45:00.000Z" });
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
        updatedAt: "2026-08-20T04:45:00.000Z",
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
        updatedAt: "2026-08-20T04:45:05.000Z",
        state: payload.state ?? null,
      });
    }

    return fulfillJson(route, { error: `Unhandled runner dialog E2E route: ${method} ${path}` }, 404);
  });
}

async function openRunner(page: Page) {
  await installFixtures(page);
  await page.goto("/login/student");
  await page.evaluate((profile) => {
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("attempts", JSON.stringify([]));
    localStorage.removeItem("active_test_sessions");
  }, student);
  await page.goto(`/test/${TEST_ID}`);
  await expect(page.getByRole("heading", { name: testDetail.name })).toBeVisible();
  await page.getByRole("button", { name: "Start Test" }).click();
  await expect(page.getByText("Question No 1")).toBeVisible();
}

async function expectModalContract(
  page: Page,
  name: string,
  cancelLabel: string,
) {
  const dialog = page.getByRole("dialog", { name });
  const cancel = dialog.getByRole("button", { name: cancelLabel, exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAttribute("aria-labelledby");
  await expect(dialog).toHaveAttribute("aria-describedby");
  await expect(cancel).toBeFocused();
  return { dialog, cancel };
}

test.describe("CP02 runner dialog accessibility", () => {
  test("Pause dialog traps focus, inerts background, Escape-cancels and returns focus", async ({ page }) => {
    await openRunner(page);

    const trigger = page.getByRole("button", { name: "Pause & Exit", exact: true });
    await trigger.focus();
    await trigger.click();

    const { dialog, cancel } = await expectModalContract(page, "Pause & Exit?", "Continue Test");
    const saveExit = dialog.getByRole("button", { name: "Save & Exit", exact: true });
    const fullscreenExit = page.locator('button[aria-label="Exit fullscreen"]');
    await expect(fullscreenExit).toHaveCount(1);
    expect(await fullscreenExit.evaluate((element) => element.hasAttribute("inert") || Boolean(element.closest("[inert]")))).toBe(true);

    await page.keyboard.press("Shift+Tab");
    await expect(saveExit).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("locked-section warning uses safe initial focus and Escape returns to section trigger", async ({ page }) => {
    await openRunner(page);

    const trigger = page.getByRole("button", { name: "Jump to Next Section", exact: true });
    await trigger.focus();
    await trigger.click();

    const { dialog } = await expectModalContract(page, "Move to Next Section?", "Stay Here");
    await expect(dialog.getByText(/cannot return/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("submit confirmation traps Tab on safe actions and Escape never submits", async ({ page }) => {
    await openRunner(page);

    const trigger = page.getByRole("button", { name: "Submit test", exact: true });
    await trigger.focus();
    await trigger.click();

    const { dialog, cancel } = await expectModalContract(page, "Submit this attempt?", "Continue test");
    const confirm = dialog.getByRole("button", { name: "Submit now", exact: true });

    await page.keyboard.press("Tab");
    await expect(confirm).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`/test/${TEST_ID}`));
    await expect(page.getByText("Question No 1")).toBeVisible();
  });
});
