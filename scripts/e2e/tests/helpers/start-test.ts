import { expect, type Page } from "@playwright/test";

/** Follow the real student pre-test instructions flow before opening the runner. */
export async function beginTestWithInstructions(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Continue to Instructions" }).click();
  await expect(page.getByRole("heading", { name: "General Instructions" })).toBeVisible();
  const begin = page.getByTestId("begin-test");
  await expect(begin).toBeDisabled();
  await page.getByRole("checkbox", { name: /I have read and understood the instructions/ }).check();
  await expect(begin).toBeEnabled();
  await begin.click();
}
