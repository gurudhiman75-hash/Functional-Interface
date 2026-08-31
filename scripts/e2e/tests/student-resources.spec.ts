import { expect, test, type Page, type Route } from "@playwright/test";

const currentAffairs = {
  id: "11111111-1111-4111-8111-111111111111",
  publicCode: "CA-2026-08-30",
  category: "current_affairs",
  format: "article",
  title: "RBI Policy Update for Competitive Exams",
  summary: "A reviewed current-affairs brief covering the policy decision and exam-relevant facts.",
  languageCode: "en",
  contentDate: "2026-08-30",
  contentUrl: null,
  hasInlineContent: true,
  publishedAt: "2026-08-30T06:00:00.000Z",
  expiresAt: null,
  isGeneral: false,
  exams: [{
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    code: "IBPS-PO",
    name: "IBPS PO",
    familyId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    familyCode: "BANKING",
    familyName: "Banking",
  }],
};

const studyNote = {
  id: "22222222-2222-4222-8222-222222222222",
  publicCode: "NOTE-POLITY-FR",
  category: "notes",
  format: "article",
  title: "Fundamental Rights Revision Notes",
  summary: "Governed revision notes prepared for fast constitutional-law recall.",
  languageCode: "en",
  contentDate: "2026-08-29",
  contentUrl: null,
  hasInlineContent: true,
  publishedAt: "2026-08-29T10:00:00.000Z",
  expiresAt: null,
  isGeneral: true,
  exams: [],
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installResourceFixtures(page: Page, resources = [currentAffairs, studyNote]) {
  const handleResourceRequest = async (route: Route) => {
    const url = new URL(route.request().url());
    const suffix = url.pathname.replace(/^\/api\/learning-resources\/?/, "");
    if (!suffix) {
      return fulfillJson(route, {
        resources,
        filters: { category: null, format: null, language: null },
        generatedAt: "2026-08-30T07:30:00.000Z",
      });
    }

    const identifier = decodeURIComponent(suffix);
    const resource = resources.find((item) => item.id === identifier || item.publicCode === identifier);
    if (!resource) return fulfillJson(route, { error: "Learning resource not found", code: "LEARNING_RESOURCE_NOT_FOUND" }, 404);
    return fulfillJson(route, {
      resource: {
        ...resource,
        hasInlineContent: undefined,
        bodyMarkdown: resource.id === currentAffairs.id
          ? "## Why it matters\n\nThis is the **published canonical brief** used by the learner reader.\n\n- Policy fact one\n- Policy fact two\n\n| Area | Exam cue |\n| --- | --- |\n| Banking | Remember the policy decision |"
          : "## Quick revision\n\nThese are the published Notes Studio learner notes.",
      },
    });
  };

  // Playwright's glob semantics do not let the trailing ** reliably cross the
  // slash between the collection and detail endpoint, so intercept both forms.
  await page.route("**/api/learning-resources/**", handleResourceRequest);
  await page.route("**/api/learning-resources**", handleResourceRequest);
}

async function expectTouchTarget(locator: ReturnType<Page["locator"]>) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
}

test.describe("free resources hub", () => {
  test("renders canonical published Current Affairs and Notes in the approved resource design", async ({ page }) => {
    await installResourceFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resources");

    await expect(page.getByTestId("resources-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Learn something useful/i })).toBeVisible();
    await expect(page.getByText(currentAffairs.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(studyNote.title, { exact: true })).toBeVisible();
    await expect(page.getByTestId("latest-resource-brief")).toContainText(currentAffairs.title);
    await expect(page.getByText("IBPS PO", { exact: true }).first()).toBeVisible();

    await page.getByRole("link", { name: /Current Affairs Daily news/i }).first().click();
    await expect(page).toHaveURL(/\/resources\/current-affairs$/);
    await expect(page.getByRole("heading", { name: "Current affairs, without the noise." })).toBeVisible();
    await expect(page.getByText(currentAffairs.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(studyNote.title, { exact: true })).toHaveCount(0);
  });

  test("opens the exact canonical learning resource detail and renders its published body", async ({ page }) => {
    await installResourceFixtures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resources/current-affairs");

    await page.getByTestId(`open-learning-resource-${currentAffairs.id}`).click();
    await expect(page).toHaveURL(new RegExp(`/resources/item/${currentAffairs.id}$`));
    await expect(page.getByTestId("resource-detail-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: currentAffairs.title, exact: true })).toBeVisible();
    await expect(page.getByTestId("resource-body")).toContainText("published canonical brief");
    await expect(page.getByTestId("resource-body")).toContainText("Remember the policy decision");
    await expect(page.getByText("IBPS PO", { exact: true })).toBeVisible();
  });

  test("shows a truthful empty state when no canonical learning resources are published", async ({ page }) => {
    await installResourceFixtures(page, []);
    await page.goto("/resources/current-affairs");

    await expect(page.getByTestId("resource-library-empty")).toBeVisible();
    await expect(page.getByText(/No published current affairs are available yet/i)).toBeVisible();
    await expect(page.getByTestId("latest-resource-brief")).toContainText(/No current-affairs brief is published right now/i);
  });

  test("keeps unconnected resource categories truthful instead of manufacturing feed records", async ({ page }) => {
    await installResourceFixtures(page);
    await page.goto("/resources/vocabulary");

    await expect(page.getByRole("heading", { name: "Build the vocabulary that actually scores." })).toBeVisible();
    await expect(page.getByText(/No canonical vocabulary feed is exposed yet/i)).toBeVisible();
    await expect(page.getByTestId(`learning-resource-card-${currentAffairs.id}`)).toHaveCount(0);
  });

  test("resource hub stays usable on mobile", async ({ page }) => {
    await installResourceFixtures(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resources");

    await expectTouchTarget(page.getByTestId("resources-search"));
    const currentAffairsLink = page.getByRole("link", { name: /Current Affairs Daily news/i }).first();
    await expectTouchTarget(currentAffairsLink);
    await expectTouchTarget(page.getByTestId(`open-learning-resource-${currentAffairs.id}`));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
