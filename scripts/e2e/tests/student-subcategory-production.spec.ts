import { expect, test, type Page, type Route } from "@playwright/test";

const categories = [
  {
    id: "ssc",
    name: "SSC",
    description: "Staff Selection Commission exams",
    icon: "Landmark",
    color: "blue",
  },
];

const subcategories = [
  {
    id: "ssc-cgl",
    categoryId: "ssc",
    name: "SSC CGL",
    description: "Practice full-length and focused SSC CGL mocks.",
    icon: "Landmark",
  },
];

const tests = [
  {
    id: "ssc-cgl-free-1",
    name: "SSC CGL Full Mock 1",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    totalQuestions: 100,
    duration: 60,
    access: "free",
    difficulty: "Medium",
    kind: "full-length",
    attempts: 0,
    sections: [],
    languages: ["en"],
  },
  {
    id: "ssc-cgl-sectional-1",
    name: "SSC CGL Quant Sectional 1",
    category: "SSC",
    categoryName: "SSC",
    categoryId: "ssc",
    subcategoryId: "ssc-cgl",
    subcategoryName: "SSC CGL",
    totalQuestions: 25,
    duration: 20,
    access: "free",
    difficulty: "Easy",
    kind: "sectional",
    attempts: 0,
    sections: [],
    languages: ["en"],
  },
];

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installFixtures(page: Page, delayCatalog = false) {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api/, "");

    if (delayCatalog && ["/categories", "/subcategories", "/tests"].includes(path)) {
      await new Promise((resolve) => setTimeout(resolve, 90));
    }

    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, subcategories);
    if (path === "/tests") return fulfillJson(route, tests);
    if (path.includes("entitlements")) return fulfillJson(route, { testIds: [] });
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);
    if (path === "/published-tests") return fulfillJson(route, { tests, generatedAt: "2026-08-25T07:30:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series: [], generatedAt: "2026-08-25T07:30:00.000Z" });

    return fulfillJson(route, []);
  });
}

async function expectMinTarget(locator: ReturnType<Page["getByRole"]>) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
}

test.describe("subcategory production hardening", () => {
  test("survives loading-to-content transition and exposes accessible 44px controls", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await installFixtures(page, true);

    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.goto("/subcategory/ssc-cgl");
    await expect(page.getByRole("heading", { name: "SSC CGL", exact: true })).toBeVisible();
    expect(pageErrors.map((error) => error.message)).toEqual([]);

    const sidebar = page.getByTestId("public-study-sidebar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Explore Exams", exact: true })).toHaveAttribute("aria-current", "page");

    const back = page.getByTestId("btn-back-category");
    const fullLengthTab = page.getByRole("tab", { name: /Full Length/ });
    const sectionalTab = page.getByRole("tab", { name: /Sectional/ });
    const listView = page.getByRole("button", { name: "List view" });
    const gridView = page.getByRole("button", { name: "Grid view" });
    const start = page.getByRole("button", { name: "Start" }).first();

    await expect(fullLengthTab).toHaveAttribute("aria-selected", "true");
    await expect(gridView).toHaveAttribute("aria-pressed", "true");
    for (const control of [back, fullLengthTab, listView, gridView, start]) {
      await expectMinTarget(control);
    }

    await listView.click();
    await expect(page.getByTestId("subcategory-test-list")).toBeVisible();
    await expect(listView).toHaveAttribute("aria-pressed", "true");

    await sectionalTab.click();
    await expect(sectionalTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("SSC CGL Quant Sectional 1", { exact: true })).toBeVisible();
  });

  test("keeps the exam-detail surface bounded on a 390px mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFixtures(page);
    await page.goto("/subcategory/ssc-cgl");

    await expect(page.getByRole("heading", { name: "SSC CGL", exact: true })).toBeVisible();
    await expect(page.getByTestId("public-study-sidebar")).toBeHidden();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await expectMinTarget(page.getByRole("tab", { name: /Full Length/ }));
    await expectMinTarget(page.getByRole("button", { name: "Grid view" }));
    await expectMinTarget(page.getByRole("button", { name: "Start" }).first());
  });
});
