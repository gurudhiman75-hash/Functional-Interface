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
    await expect(page.getByRole("heading", { name: "Help & support", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "New request", exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("Name", { exact: true }).fill("Aman Singh");
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
    await expect(page.getByRole("button", { name: "Submit support request" })).toBeVisible();
    await page.getByRole("button", { name: "Submit support request" }).click();
    await expect(page.getByRole("alert")).toContainText("Unable to submit your request");
    await expect(page.getByText("Sending the email is required; no ticket was created.", { exact: false })).toBeVisible();
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

test.describe("Multilingual help and support", () => {
  test.beforeEach(async ({ page }) => { await installEmptyApi(page); });

  test("language switching preserves draft and canonical API category", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "ਪੰਜਾਬੀ", exact: true }).click();
    await expect(page.getByRole("heading", { name: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "ਨਵੀਂ ਬੇਨਤੀ", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("radio", { name: "ਪੰਜਾਬੀ / ਹਿੰਦੀ ਅਨੁਵਾਦ ਦੀ ਸਮੱਸਿਆ", exact: true }).check();
    await dialog.getByRole("button", { name: "ਅੱਗੇ", exact: true }).click();
    await dialog.getByLabel("ਨਾਮ", { exact: true }).fill("Aman Singh");
    await dialog.getByLabel("ਈਮੇਲ", { exact: true }).fill("aman@example.com");
    const draft = "Q102: ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਵਿੱਚ ਸੁਧਾਰ ਦੀ ਲੋੜ ਹੈ।";
    await dialog.getByLabel("ਸੁਨੇਹਾ", { exact: true }).fill(draft);
    await dialog.getByRole("button", { name: "हिन्दी", exact: true }).click();
    await expect(dialog.getByLabel("नाम", { exact: true })).toHaveValue("Aman Singh");
    await expect(dialog.getByLabel("ईमेल", { exact: true })).toHaveValue("aman@example.com");
    await expect(dialog.getByLabel("संदेश", { exact: true })).toHaveValue(draft);
    await expect(dialog.getByLabel("समस्या का प्रकार", { exact: true })).toHaveValue("Punjabi / Hindi translation issue");
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/support/tickets", async route => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "00000000-0000-4000-8000-000000000001" }) });
    });
    await dialog.getByRole("button", { name: "सहायता अनुरोध भेजें", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("आपका अनुरोध मिल गया है।");
    expect(payload?.category).toBe("Punjabi / Hindi translation issue");
    expect(payload?.message).toBe(draft);
    await dialog.getByRole("button", { name: "पूरा हुआ", exact: true }).click();
    await expect(page.getByRole("button", { name: "नया अनुरोध", exact: true })).toBeFocused();
    await page.reload();
    await expect(page.getByRole("heading", { name: "मदद और सहायता", exact: true })).toBeVisible();
    await page.goto("/faq");
    await expect(page.getByRole("heading", { name: "शुरुआत के लिए आपके सवालों के जवाब", exact: true })).toBeVisible();
  });

  test("Punjabi FAQ search, filters, and no-result recovery", async ({ page }) => {
    await page.goto("/faq");
    await page.getByRole("button", { name: "ਪੰਜਾਬੀ", exact: true }).click();
    await page.getByRole("button", { name: "ਭੁਗਤਾਨ", exact: true }).click();
    await expect(page.getByText("ਭੁਗਤਾਨ ਹੋ ਗਿਆ, ਪਰ ਪਹੁੰਚ ਨਹੀਂ ਮਿਲੀ। ਕਿਹੜੇ ਵੇਰਵੇ ਦੇਵਾਂ?", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "ਸਾਰੇ ਵਿਸ਼ੇ", exact: true }).click();
    await page.getByRole("searchbox").fill("ਅਨੁਵਾਦ");
    await expect(page.getByText("ਗਲਤ ਜਵਾਬ ਜਾਂ ਅਨੁਵਾਦ ਦੀ ਰਿਪੋਰਟ ਕਿਵੇਂ ਕਰਾਂ?", { exact: true })).toBeVisible();
    await page.getByRole("searchbox").fill("no-such-help-topic-123");
    await expect(page.getByRole("status")).toContainText("ਕੋਈ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ");
    await page.getByRole("button", { name: "ਖੋਜ ਮਿਟਾਓ", exact: true }).click();
    await expect(page.getByText("ਮੈਂ ਆਪਣਾ ਖਾਤਾ ਮੁੜ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰਾਂ?", { exact: true })).toBeVisible();
  });

  test("Hindi validation, failure fallback, and mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact");
    await page.getByRole("button", { name: "हिन्दी", exact: true }).click();
    await page.getByRole("button", { name: "नया अनुरोध", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "आगे बढ़ें", exact: true }).click();
    await dialog.getByRole("button", { name: "सहायता अनुरोध भेजें", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("कृपया अपना नाम लिखें");
    await dialog.getByLabel("नाम", { exact: true }).fill("Aman Singh");
    await dialog.getByLabel("ईमेल", { exact: true }).fill("aman@example.com");
    await dialog.getByLabel("संदेश", { exact: true }).fill("The test result is not loading after submission.");
    await dialog.getByRole("button", { name: "सहायता अनुरोध भेजें", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("कोई टिकट नहीं बना है");
    await expect(dialog.getByLabel("संदेश", { exact: true })).toHaveValue("The test result is not loading after submission.");
    const handoff = dialog.getByTestId("contact-email-handoff");
    await expectTouchTarget(handoff);
    expect(await handoff.getAttribute("href")).toContain("test%20result%20is%20not%20loading");
    await dialog.getByRole("button", { name: "बंद करें", exact: true }).click();
    await expect(page.getByRole("button", { name: "नया अनुरोध", exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
