import { expect, test } from "@playwright/test";

test.describe("free resources hub", () => {
  test("opens the reference-style resource hub and category pages", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resources");

    await expect(page.getByTestId("resources-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Learn something useful/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Current Affairs Daily news/i })).toHaveAttribute("href", "/resources/current-affairs");

    await page.getByRole("link", { name: /Current Affairs Daily news/i }).first().click();
    await expect(page).toHaveURL(/\/resources\/current-affairs$/);
    await expect(page.getByRole("heading", { name: "Current affairs, without the noise." })).toBeVisible();
    await expect(page.getByText(/does not invent article titles/i)).toBeVisible();
  });

  test("resource hub stays usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resources");

    const search = page.getByTestId("resources-search");
    await expect(search).toBeVisible();
    const searchBox = await search.boundingBox();
    expect(searchBox).not.toBeNull();
    expect(searchBox!.height).toBeGreaterThanOrEqual(44);

    const currentAffairs = page.getByRole("link", { name: /Current Affairs Daily news/i }).first();
    const cardBox = await currentAffairs.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox!.height).toBeGreaterThanOrEqual(44);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
