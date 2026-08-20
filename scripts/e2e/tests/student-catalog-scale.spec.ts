import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

const categories = [
  { id: "cat-1", name: "SSC", description: "SSC exams", icon: "BookOpen", color: "indigo", testsCount: 135 },
  { id: "cat-2", name: "Banking", description: "Banking exams", icon: "Landmark", color: "teal", testsCount: 135 },
  { id: "cat-3", name: "Punjab", description: "Punjab exams", icon: "MapPin", color: "amber", testsCount: 135 },
  { id: "cat-4", name: "Railways", description: "Railway exams", icon: "Train", color: "blue", testsCount: 135 },
];

const subcategories = categories.flatMap((category, categoryIndex) => [1, 2].map((suffix) => ({
  id: `${category.id}-sub-${suffix}`,
  categoryId: category.id,
  categoryName: category.name,
  name: `${category.name} Exam ${suffix}`,
  description: `${category.name} public exam path ${suffix}`,
  languages: ["en", "hi", "pa"],
})));

const difficulties = ["Easy", "Medium", "Hard"] as const;
const kinds = ["full-length", "sectional", "topic-wise"] as const;

const catalogTests = Array.from({ length: 540 }, (_, index) => {
  const number = index + 1;
  const category = categories[index % categories.length]!;
  const subcategory = subcategories[(index % categories.length) * 2 + (index % 2)]!;
  return {
    id: `catalog-${String(number).padStart(3, "0")}`,
    name: `Catalog Test ${String(number).padStart(3, "0")}`,
    category: category.name,
    categoryName: category.name,
    categoryId: category.id,
    subcategoryId: subcategory.id,
    subcategoryName: subcategory.name,
    access: number % 2 === 0 ? "paid" : "free",
    priceCents: number % 2 === 0 ? 9900 : null,
    kind: kinds[index % kinds.length],
    duration: 20 + (number % 100),
    totalQuestions: 25 + (number % 75),
    attempts: number * 10,
    avgScore: 40 + (number % 50),
    difficulty: difficulties[index % difficulties.length],
    sections: [],
    languages: number % 4 === 0 ? ["en", "pa"] : number % 5 === 0 ? ["en", "hi"] : ["en"],
  };
});

const publishedTests = Array.from({ length: 13 }, (_, index) => ({
  id: `published-${index + 1}`,
  publicCode: `PUB-${index + 1}`,
  examVersionId: `exam-v-${index + 1}`,
  publishedVersionId: `published-v-${index + 1}`,
  title: `Live Test ${String(index + 1).padStart(2, "0")}`,
  description: null,
  durationSeconds: 3600,
  totalMarks: 100,
  settings: {},
  examCode: "SSC-CGL",
  examName: "SSC CGL",
  examFamilyCode: "SSC",
  examFamilyName: "SSC",
  questionCount: 100,
  publishedAt: "2026-08-20T00:00:00.000Z",
  closesAt: null,
}));

const series = Array.from({ length: 13 }, (_, index) => ({
  id: `series-${index + 1}`,
  code: `SER-${index + 1}`,
  name: `Series ${String(index + 1).padStart(2, "0")}`,
  description: "Structured large-catalog preparation series.",
  availabilityStartAt: null,
  availabilityEndAt: null,
  progressionMode: "open" as const,
  completionThreshold: null,
  examCode: "SSC-CGL",
  examName: "SSC CGL",
  examFamilyCode: "SSC",
  examFamilyName: "SSC",
  testCount: 10,
  liveTestCount: 10,
  durationSeconds: 18_000,
  questionCount: 500,
}));

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installCatalogFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/api/, "");
    if (path === "/categories") return fulfillJson(route, categories);
    if (path === "/subcategories") return fulfillJson(route, subcategories);
    if (path === "/tests") return fulfillJson(route, catalogTests);
    if (path === "/published-tests") return fulfillJson(route, { tests: publishedTests, generatedAt: "2026-08-20T06:30:00.000Z" });
    if (path === "/test-series") return fulfillJson(route, { series, generatedAt: "2026-08-20T06:30:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function openCatalog(page: Page) {
  await installCatalogFixtures(page);
  await page.goto("/exams");
  await expect(page.getByTestId("catalog-test-browser")).toBeVisible();
  await expect(page.getByTestId("catalog-result-count")).toHaveText("Showing 1-18 of 540");
}

async function expectTouchTarget(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round((box?.width ?? 0) * 1000) / 1000).toBeGreaterThanOrEqual(44);
  expect(Math.round((box?.height ?? 0) * 1000) / 1000).toBeGreaterThanOrEqual(44);
}

test.describe("CP04 catalog scale", () => {
  test("bounds a 540-test catalog and supports search filter sort pagination", async ({ page }) => {
    await openCatalog(page);

    const grid = page.getByTestId("catalog-page-grid");
    await expect(grid.locator("article")).toHaveCount(18);
    await expect(page.getByTestId("catalog-large-mode")).toBeVisible();
    await expect(page.getByText("Drill into the exact exam path.")).toHaveCount(0);

    await page.getByTestId("catalog-sort").selectOption("name");
    await expect(grid.locator("article h3").first()).toHaveText("Catalog Test 001");

    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByTestId("catalog-next-page").click();
    await expect(page.getByTestId("catalog-result-count")).toHaveText("Showing 19-36 of 540");
    await expect(grid.locator("article")).toHaveCount(18);

    await page.getByTestId("catalog-search").fill("Catalog Test 540");
    await expect(page.getByTestId("catalog-result-count")).toHaveText("Showing 1-1 of 1");
    await expect(grid.locator("article h3")).toHaveText("Catalog Test 540");
    await expect(page.getByTestId("catalog-next-page")).toHaveCount(0);

    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByTestId("catalog-category-filter").selectOption("cat-2");
    await page.getByTestId("catalog-access-filter").selectOption("paid");
    await page.getByTestId("catalog-difficulty-filter").selectOption("Hard");
    await page.getByTestId("catalog-kind-filter").selectOption("topic-wise");
    await page.getByTestId("catalog-language-filter").selectOption("pa");
    await expect(page.getByTestId("catalog-result-count")).not.toHaveText("Showing 1-18 of 540");
    expect(await grid.locator("article").count()).toBeLessThanOrEqual(18);

    await page.getByTestId("catalog-search").fill("definitely-not-a-real-test");
    await expect(page.getByTestId("catalog-empty-state")).toContainText("No tests match these filters");
  });

  test("pages promotional series and live-test grids at six cards", async ({ page }) => {
    await openCatalog(page);

    const seriesSection = page.getByTestId("series-section");
    const publishedSection = page.getByTestId("published-tests-section");
    await expect(seriesSection.locator("article")).toHaveCount(6);
    await expect(publishedSection.locator("article")).toHaveCount(6);

    const seriesPager = page.getByRole("navigation", { name: "Test series pagination" });
    await seriesPager.getByRole("button", { name: "Next" }).click();
    await expect(seriesPager).toContainText("Page 2 of 3");
    await expect(seriesSection.locator("article")).toHaveCount(6);

    const livePager = page.getByRole("navigation", { name: "Live mock tests pagination" });
    await livePager.getByRole("button", { name: "Next" }).click();
    await expect(livePager).toContainText("Page 2 of 3");
    await expect(publishedSection.locator("article")).toHaveCount(6);
  });

  test("keeps scale controls mobile-safe at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCatalog(page);

    for (const testId of ["catalog-search", "catalog-category-filter", "catalog-access-filter", "catalog-difficulty-filter", "catalog-kind-filter", "catalog-language-filter", "catalog-sort", "catalog-next-page"]) {
      await expectTouchTarget(page.getByTestId(testId));
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
