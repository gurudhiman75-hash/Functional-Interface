import { expect, test, type Page, type Route } from "@playwright/test";

const category = {
  id: "ssc",
  name: "SSC",
  description: "Staff Selection Commission exams",
  icon: "Landmark",
  color: "blue",
};

const subcategory = {
  id: "ssc-cgl",
  categoryId: "ssc",
  name: "SSC CGL",
  description: "Combined Graduate Level",
  icon: "Landmark",
};

const catalogTest = {
  id: "catalog-test-1",
  name: "SSC CGL Mock 1",
  category: "SSC",
  categoryName: "SSC",
  categoryId: "ssc",
  subcategoryId: "ssc-cgl",
  subcategoryName: "SSC CGL",
  access: "free",
  priceCents: null,
  kind: "sectional",
  duration: 60,
  totalQuestions: 100,
  attempts: 0,
  avgScore: 0,
  difficulty: "Medium",
  languages: ["en"],
};

type CatalogFixtureState = {
  available: boolean;
  empty: boolean;
  requests: number;
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installCatalogFixture(page: Page, state: CatalogFixtureState) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-24T06:00:00.000Z" });
    if (path === "/daily-challenge") return fulfillJson(route, {});
    if (path !== "/categories" && path !== "/subcategories" && path !== "/tests") {
      return fulfillJson(route, { error: `Unhandled catalog truth route: ${path}` }, 404);
    }

    state.requests += 1;
    if (!state.available) {
      return fulfillJson(route, { error: "catalog temporarily unavailable" }, 503);
    }

    if (state.empty) return fulfillJson(route, []);
    if (path === "/categories") return fulfillJson(route, [category]);
    if (path === "/subcategories") return fulfillJson(route, [subcategory]);
    return fulfillJson(route, [catalogTest]);
  });
}

test.describe("CP06 catalog failure truth", () => {
  test("home reports an outage and recovers in place without fake zero inventory", async ({ page }) => {
    const state: CatalogFixtureState = { available: false, empty: false, requests: 0 };
    await installCatalogFixture(page, state);

    await page.goto("/");
    await expect(page.getByTestId("catalog-unavailable")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "We couldn’t load the live exam catalog" })).toBeVisible();
    await expect(page.getByText("0 published tests", { exact: true })).toHaveCount(0);
    expect(state.requests).toBeGreaterThanOrEqual(2);

    await page.evaluate(() => {
      (window as typeof window & { __catalogRetrySentinel?: string }).__catalogRetrySentinel = "preserved";
    });

    state.available = true;
    await page.getByRole("button", { name: "Retry catalog" }).click();

    await expect(page.getByTestId("catalog-unavailable")).toHaveCount(0);
    await expect(page.getByTestId("home-reference")).toBeVisible();
    await expect(page.getByTestId("home-category-grid").getByRole("button")).toHaveCount(1);
    await expect(page.getByTestId("home-category-grid")).toContainText("SSC");
    await expect(page.getByTestId("home-category-grid")).toContainText("1+ tests");

    const sentinel = await page.evaluate(() =>
      (window as typeof window & { __catalogRetrySentinel?: string }).__catalogRetrySentinel,
    );
    expect(sentinel).toBe("preserved");
  });

  test("mock test hub distinguishes a successful empty catalog from an outage", async ({ page }) => {
    const state: CatalogFixtureState = { available: true, empty: true, requests: 0 };
    await installCatalogFixture(page, state);

    await page.goto("/mock-tests");
    await expect(page.getByTestId("mock-tests-empty")).toBeVisible();
    await expect(page.getByRole("heading", { name: "No mock tests are published yet" })).toBeVisible();
    await expect(page.getByTestId("catalog-unavailable")).toHaveCount(0);
    expect(state.requests).toBeGreaterThanOrEqual(3);
  });
});
