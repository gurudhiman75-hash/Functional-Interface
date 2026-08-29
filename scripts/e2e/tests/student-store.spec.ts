import { expect, test, type Page, type Route } from "@playwright/test";

const storeProduct = {
  id: "11111111-1111-4111-8111-111111111111",
  code: "BANK-90",
  title: "Banking Mock Test Pack",
  description: "Published banking preparation package for Store flow coverage.",
  currency: "INR",
  listPriceMinor: 99900,
  salePriceMinor: 49900,
  validityDays: 90,
  saleStartAt: null,
  saleEndAt: null,
  testCount: 25,
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installStoreFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/commerce/products") {
      return fulfillJson(route, { products: [storeProduct], generatedAt: "2026-08-29T08:00:00.000Z" });
    }
    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: "2026-08-29T08:00:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-29T08:00:00.000Z" });

    return fulfillJson(route, { error: `Unhandled Store E2E route: ${request.method()} ${path}` }, 404);
  });
}

async function expectTouchTarget(locator: ReturnType<Page["locator"]>) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const width = Math.round(box!.width * 1000) / 1000;
  const height = Math.round(box!.height * 1000) / 1000;
  expect(width).toBeGreaterThanOrEqual(44);
  expect(height).toBeGreaterThanOrEqual(44);
}

test.describe("student Store", () => {
  test("Home exposes Store and opens the canonical commerce catalog", async ({ page }) => {
    await installStoreFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const storeLink = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Store", exact: true });
    await expect(storeLink).toHaveAttribute("href", "/store");
    await storeLink.click();

    await expect(page).toHaveURL(/\/store$/);
    await expect(page.getByTestId("store-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Available packages" })).toBeVisible();
    await expect(page.getByText(storeProduct.title, { exact: true })).toBeVisible();
    await expect(page.getByText("25", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/₹499/).first()).toBeVisible();
  });

  test("package card opens its exact detail and signed-out checkout preserves the package return route", async ({ page }) => {
    await installStoreFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/store");

    await page.getByTestId(`btn-view-store-product-${storeProduct.id}`).click();
    await expect(page).toHaveURL(new RegExp(`/store/product/${storeProduct.id}$`));
    await expect(page.getByTestId("store-product-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: storeProduct.title, exact: true })).toBeVisible();
    await expect(page.getByText("90 days", { exact: true })).toBeVisible();

    await page.getByTestId("btn-store-checkout").click();
    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe(`/store/product/${storeProduct.id}`);
  });

  test("Store controls remain usable on a narrow mobile viewport", async ({ page }) => {
    await installStoreFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/store");

    await expectTouchTarget(page.getByTestId("store-search"));
    await expectTouchTarget(page.getByRole("combobox", { name: "Sort Store packages" }));
    await expectTouchTarget(page.getByRole("button", { name: /All packages/ }));
    await expectTouchTarget(page.getByTestId(`btn-view-store-product-${storeProduct.id}`));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
