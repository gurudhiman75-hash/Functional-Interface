import { expect, test, type Page, type Route } from "@playwright/test";

const student = {
  id: "purchase-student",
  email: "purchase.student@examtree.local",
  name: "Purchase Student",
  role: "student" as const,
};

const orderId = "22222222-2222-4222-8222-222222222222";
const orderItemId = "33333333-3333-4333-8333-333333333333";
const entitlementId = "44444444-4444-4444-8444-444444444444";
const productId = "11111111-1111-4111-8111-111111111111";
const productVersionId = "55555555-5555-4555-8555-555555555555";

const purchases = {
  orders: [
    {
      id: orderId,
      orderNumber: "1042",
      status: "partially_refunded",
      currency: "INR",
      subtotalMinor: 59900,
      discountMinor: 10000,
      taxMinor: 0,
      totalMinor: 49900,
      refundedMinor: 10000,
      paymentStatus: "partially_refunded",
      createdAt: "2026-08-20T10:00:00.000Z",
      updatedAt: "2026-08-22T10:00:00.000Z",
      paidAt: "2026-08-20T10:02:00.000Z",
      cancelledAt: null,
      expiresAt: "2026-08-20T10:30:00.000Z",
    },
  ],
  items: [
    {
      id: orderItemId,
      orderId,
      productId,
      productVersionId,
      productCode: "BANK-90",
      title: "Banking Mock Test Pack",
      description: "Published banking preparation package.",
      validityDays: 90,
      testCount: 25,
      quantity: 1,
      unitPriceMinor: 59900,
      discountMinor: 10000,
      taxMinor: 0,
      totalMinor: 49900,
      createdAt: "2026-08-20T10:00:00.000Z",
    },
  ],
  entitlements: [
    {
      id: entitlementId,
      orderItemId,
      orderId,
      productVersionId,
      productId,
      productCode: "BANK-90",
      productTitle: "Banking Mock Test Pack",
      productDescription: "Published banking preparation package.",
      status: "active",
      accessStatus: "active",
      startsAt: "2026-08-20T10:02:00.000Z",
      endsAt: "2026-11-18T10:02:00.000Z",
      revokedAt: null,
      revokeReason: null,
      grantSource: "paid_order",
      createdAt: "2026-08-20T10:02:00.000Z",
      testCount: 25,
    },
  ],
  generatedAt: "2026-08-29T09:00:00.000Z",
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");

    if (path === "/commerce/purchases") return fulfillJson(route, purchases);
    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests") return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests: [], generatedAt: purchases.generatedAt });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: purchases.generatedAt });
    if (path === "/users/me") return fulfillJson(route, student);
    if (path === "/learning-resources") return fulfillJson(route, { resources: [], filters: { category: null, format: null, language: null }, generatedAt: purchases.generatedAt });
    if (path === "/attempts") return fulfillJson(route, []);
    if (path === "/analytics") return fulfillJson(route, { averageScore: 0, highestScore: 0, totalAttempts: 0, recentAttempts: [] });

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

test.describe("canonical student purchase history", () => {
  test("purchase history requires login and preserves the exact return path", async ({ page }) => {
    await installFixtures(page);
    await page.goto("/my-packages");

    await expect(page).toHaveURL(/\/login\/student\?next=/);
    const next = await page.evaluate(() => new URL(window.location.href).searchParams.get("next"));
    expect(next).toBe("/my-packages");
  });

  test("signed-in student sees canonical active access, order totals and processed refund state", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/my-packages");

    await expect(page.getByTestId("my-purchases-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "My purchases", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "My Purchases", exact: true })).toHaveAttribute("aria-current", "page");

    const entitlement = page.getByTestId(`purchase-entitlement-${entitlementId}`);
    await expect(entitlement.getByText("Banking Mock Test Pack", { exact: true })).toBeVisible();
    await expect(entitlement.getByText("Active access", { exact: true })).toBeVisible();
    await expect(entitlement.getByText(/25 tests/)).toBeVisible();

    const order = page.getByTestId(`purchase-order-${orderId}`);
    await expect(order.getByText("Partially refunded", { exact: true })).toBeVisible();
    await expect(order.getByText(/₹499/).first()).toBeVisible();
    await expect(order.getByText(/₹100/).first()).toBeVisible();
    await expect(order.getByText("Access active", { exact: true })).toBeVisible();
  });

  test("My Purchases stays usable without horizontal overflow on mobile", async ({ page }) => {
    await installFixtures(page);
    await seedStudent(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/my-packages");

    await expectTouchTarget(page.getByTestId("btn-refresh-purchases"));
    await expectTouchTarget(page.getByRole("link", { name: "Browse Store", exact: true }));
    await expectTouchTarget(page.getByRole("link", { name: "Use this access", exact: true }));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
