import { expect, test, type Page, type Route } from "@playwright/test";

const categories = [
  {
    id: "ssc",
    name: "SSC",
    description: "Staff Selection Commission practice",
    icon: "ShieldCheck",
  },
  {
    id: "banking",
    name: "Banking",
    description: "Banking and financial recruitment practice",
    icon: "Landmark",
  },
];

const tests = [
  {
    id: "ssc-cgl-free-1",
    name: "SSC CGL Full Mock 1",
    category: "SSC",
    categoryId: "ssc",
    subcategoryId: null,
    subcategoryName: "SSC CGL",
    totalQuestions: 100,
    duration: 60,
    access: "free",
    difficulty: "Medium",
    testType: "Full Length",
    languages: ["en"],
  },
  {
    id: "bank-po-free-1",
    name: "Bank PO Full Mock 1",
    category: "Banking",
    categoryId: "banking",
    subcategoryId: null,
    subcategoryName: "Bank PO",
    totalQuestions: 80,
    duration: 60,
    access: "free",
    difficulty: "Medium",
    testType: "Full Length",
    languages: ["en", "hi"],
  },
];

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, tests);
    if (path === "/published-tests") {
      return fulfillJson(route, { tests, generatedAt: "2026-08-22T07:00:00.000Z" });
    }
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-22T07:00:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const bounded = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  expect(bounded).toBe(true);
}

async function expectMinimumTouchTarget(page: Page, accessibleName: string) {
  const control = page.getByRole("button", { name: accessibleName });
  await expect(control).toBeVisible();
  const box = await control.boundingBox();
  expect(box).not.toBeNull();
  const width = Math.round((box?.width ?? 0) * 1000) / 1000;
  const height = Math.round((box?.height ?? 0) * 1000) / 1000;
  expect(width).toBeGreaterThanOrEqual(44);
  expect(height).toBeGreaterThanOrEqual(44);
}

test.describe("CP09 premium Home acquisition experience", () => {
  test("presents truthful catalog proof and usable exam discovery", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/");

    await expect(page.getByTestId("home-premium-hero")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Structured mock tests for serious exam practice." })).toBeVisible();
    await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("180", { exact: true })).toBeVisible();
    await expect(page.getByTestId("home-exam-discovery")).toBeVisible();
    await expect(page.getByTestId("home-practice-continuity")).toBeVisible();
    await expect(page.getByTestId("home-featured-mocks")).toBeVisible();

    const search = page.getByRole("textbox", { name: "Search exams and tests" });
    await search.fill("Banking");
    await expect(page.getByRole("heading", { name: "Banking" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SSC" })).toHaveCount(0);

    await expectMinimumTouchTarget(page, "See all tests");
    await expectNoHorizontalOverflow(page);
  });

  test("keeps the acquisition hierarchy bounded on a 390px viewport", async ({ page }) => {
    await installFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByTestId("home-premium-hero")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Search exams and tests" })).toBeVisible();
    await expectMinimumTouchTarget(page, "Browse live tests");
    await expectNoHorizontalOverflow(page);
  });
});
