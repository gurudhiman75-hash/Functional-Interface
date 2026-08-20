import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown) {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
}

async function installEmptyApi(page: Page) {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/published-tests")) return fulfillJson(route, { tests: [], generatedAt: "2026-08-20T05:00:00.000Z" });
    if (path.endsWith("/test-series")) return fulfillJson(route, { series: [], generatedAt: "2026-08-20T05:00:00.000Z" });
    return fulfillJson(route, []);
  });
}

async function expectTouchTarget(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box, "support handoff must have a measurable box").not.toBeNull();
  expect(Math.round((box?.width ?? 0) * 1000) / 1000).toBeGreaterThanOrEqual(44);
  expect(Math.round((box?.height ?? 0) * 1000) / 1000).toBeGreaterThanOrEqual(44);
}

test.describe("CP04 truthful support handoff", () => {
  test.beforeEach(async ({ page }) => {
    await installEmptyApi(page);
  });

  test("contact form composes a transparent support email handoff", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Tell us what you need help with." })).toBeVisible();
    await page.getByLabel("Name").fill("Aman Singh");
    await page.getByLabel("Email").fill("aman@example.com");
    await page.getByLabel("Issue category").selectOption({ label: "Payment or refund" });
    await page.getByLabel("Message").fill("Payment succeeded but the test is still locked.");

    const handoff = page.getByTestId("contact-email-handoff");
    await expectTouchTarget(handoff);
    const href = await handoff.getAttribute("href");
    expect(href).toContain("mailto:support@examtree.in");
    expect(href).toContain("Payment%20or%20refund");
    expect(href).toContain("Aman%20Singh");
    expect(href).toContain("aman%40example.com");
    expect(href).toContain("test%20is%20still%20locked");
    await expect(page.getByText("Nothing is uploaded to ExamTree until you review and send the email.")).toBeVisible();
  });

  test("question report composes issue context instead of pretending to submit", async ({ page }) => {
    await page.goto("/report-question");
    await expect(page.getByRole("heading", { name: "Report a question issue." })).toBeVisible();
    await page.getByLabel("Question ID or test name").fill("SSC_CGL_Q102");
    await page.getByLabel("Issue type").selectOption({ label: "Translation issue" });
    await page.getByLabel("Details").fill("Punjabi option B changes the meaning of the original answer.");

    const handoff = page.getByTestId("report-email-handoff");
    await expectTouchTarget(handoff);
    const href = await handoff.getAttribute("href");
    expect(href).toContain("mailto:support@examtree.in");
    expect(href).toContain("Translation%20issue");
    expect(href).toContain("SSC_CGL_Q102");
    expect(href).toContain("Punjabi%20option%20B");
    await expect(page.getByText("Nothing is submitted to ExamTree until you review and send the email.")).toBeVisible();
  });
});
