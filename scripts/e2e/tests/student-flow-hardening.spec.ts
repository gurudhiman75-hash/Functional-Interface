import { expect, test, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installStudentFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, []);
    if (path === "/published-tests") {
      return fulfillJson(route, { tests: [], generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/test-series") {
      return fulfillJson(route, { series: [], generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/analytics") {
      return fulfillJson(route, { averageScore: 0, highestScore: 0, totalAttempts: 0, recentAttempts: [] });
    }
    if (path === "/attempts") return fulfillJson(route, []);
    if (path === "/learning-resources") {
      return fulfillJson(route, { resources: [], filters: { category: null, format: null, language: null }, generatedAt: "2026-08-29T00:00:00.000Z" });
    }
    if (path === "/daily-challenge") return fulfillJson(route, {});

    return fulfillJson(route, []);
  });
}

async function seedStudent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("user", JSON.stringify({
      id: "flow-student-1",
      email: "flow.student@example.com",
      name: "Flow Student",
      role: "student",
    }));
  });
}

test.describe("student workflow hardening", () => {
  test("home Sign up opens the signup state instead of the login state", async ({ page }) => {
    await installStudentFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await page.getByTestId("public-header-actions").getByRole("link", { name: "Sign up", exact: true }).click();

    await expect(page).toHaveURL(/\/login\/student\?mode=signup$/);
    await expect(page.getByTestId("tab-signup")).toHaveAttribute("data-testid", "tab-signup");
    await expect(page.getByRole("heading", { name: "Create your ExamTree account" })).toBeVisible();
    await expect(page.getByTestId("input-name")).toBeVisible();
  });

  test("account-specific result routes require login and preserve the exact internal return path", async ({ page }) => {
    await installStudentFixtures(page);
    await page.goto("/result?attemptId=attempt-flow-1&testId=test-flow-1");

    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe("/result?attemptId=attempt-flow-1&testId=test-flow-1");
    await expect(page.getByRole("heading", { name: "Welcome to examtree" })).toBeVisible();
  });

  test("logged-in shell uses canonical exam navigation and page-aware context", async ({ page }) => {
    await installStudentFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Welcome back, Flow Student" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tests & Exams", exact: true })).toHaveAttribute("href", "/exams");
    await expect(page.getByRole("button", { name: "My Account", exact: true })).toBeVisible();
  });

  test("profile logout clears the local session before returning home", async ({ page }) => {
    await installStudentFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Welcome back, Flow Student" })).toBeVisible();
    await page.getByRole("button", { name: "Log out", exact: true }).click();

    await expect(page).toHaveURL(/\/$/);
    const savedUser = await page.evaluate(() => window.localStorage.getItem("user"));
    expect(savedUser).toBeNull();
    await expect(page.getByTestId("public-header-actions").getByRole("link", { name: "Log in", exact: true })).toBeVisible();
  });
});
