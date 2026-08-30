import { expect, test, type Page, type Route } from "@playwright/test";

const student = {
  id: "bookmark-student",
  email: "bookmark.student@examtree.local",
  name: "Bookmark Student",
  role: "student" as const,
};

const attempt = {
  id: "attempt-bookmark-1",
  userId: student.id,
  testId: "test-bookmark-1",
  testName: "IBPS PO Full Mock 01",
  category: "Banking",
  score: 62,
  correct: 2,
  wrong: 1,
  unanswered: 1,
  totalQuestions: 4,
  timeSpent: 38,
  attemptType: "REAL",
  createdAt: "2026-08-29T10:00:00.000Z",
  questionReview: [
    {
      questionId: 101,
      section: "Quantitative Aptitude",
      text: "A marked banking question that was answered incorrectly.",
      options: ["12", "15", "18", "20"],
      selected: 0,
      correct: 2,
      explanation: "The correct option follows from the committed solution.",
      flagged: true,
    },
    {
      questionId: 102,
      section: "Reasoning Ability",
      text: "A marked reasoning question that was answered correctly.",
      options: ["North", "South", "East", "West"],
      selected: 3,
      correct: 3,
      explanation: "The submitted snapshot confirms West.",
      flagged: true,
    },
    {
      questionId: 103,
      section: "English Language",
      text: "This question was not marked for review and must not appear.",
      options: ["A", "B", "C", "D"],
      selected: null,
      correct: 1,
      explanation: "Not part of the saved review list.",
      flagged: false,
    },
  ],
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/attempts") return fulfillJson(route, [attempt]);
    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-30T03:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-30T03:00:00.000Z" });
    if (path === "/users/me") return fulfillJson(route, student);
    return fulfillJson(route, []);
  });
}

async function seedStudent(page: Page) {
  await page.addInitScript((profile) => {
    window.localStorage.setItem("user", JSON.stringify(profile));
  }, student);
}

async function expectTouchTarget(locator: ReturnType<Page["locator"]>) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
}

test.describe("student bookmarks", () => {
  test("Bookmarks requires login and preserves the exact return path", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/bookmarks");

    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe("/bookmarks");
  });

  test("signed-in student sees only questions marked for review from canonical attempts", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/bookmarks");

    await expect(page.getByTestId("bookmarks-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Questions you marked to revisit, in one place." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bookmarks", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("A marked banking question that was answered incorrectly.", { exact: true })).toBeVisible();
    await expect(page.getByText("A marked reasoning question that was answered correctly.", { exact: true })).toBeVisible();
    await expect(page.getByText("This question was not marked for review and must not appear.", { exact: true })).toHaveCount(0);

    await page.getByRole("button", { name: "Wrong (1)", exact: true }).click();
    await expect(page.getByText("A marked banking question that was answered incorrectly.", { exact: true })).toBeVisible();
    await expect(page.getByText("A marked reasoning question that was answered correctly.", { exact: true })).toHaveCount(0);

    const note = page.getByPlaceholder("Add why you want to revisit this question…");
    await note.fill("Revisit the setup before the next banking mock.");
    await page.reload();
    await expect(
      page
        .getByTestId("bookmark-card-101")
        .getByRole("textbox", { name: "Personal note (this device)" }),
    ).toHaveValue("Revisit the setup before the next banking mock.");
  });

  test("Bookmarks filters and result links stay usable on mobile", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/bookmarks");

    await expectTouchTarget(page.getByTestId("bookmarks-search"));
    await expectTouchTarget(page.getByRole("button", { name: "All (2)", exact: true }));
    await expectTouchTarget(page.getByRole("button", { name: "Wrong (1)", exact: true }));
    await expectTouchTarget(page.getByRole("link", { name: "Open full result", exact: true }).first());

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
