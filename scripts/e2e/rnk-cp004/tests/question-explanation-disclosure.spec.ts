import { expect, test } from '@playwright/test';

const requiredWidths = [360, 390, 430] as const;

for (const width of requiredWidths) {
  test(`RNK CP-004 renderer remains usable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/admin/rnk-cp004-renderer.html');

    await expect(page.getByRole('heading', {
      name: 'Multi-entity comparison and explicit order reconstruction',
    })).toBeVisible();

    const harness = page.getByTestId('rnk-cp004-renderer-harness');
    const explanation = page.getByRole('region', { name: 'Question explanation' });
    await expect(harness).toBeVisible();
    await expect(explanation).toHaveAttribute('data-required-width-targets', '360,390,430');

    const initialOverflow = await page.evaluate(() => ({
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
    }));
    expect(initialOverflow.documentOverflow).toBeLessThanOrEqual(1);
    expect(initialOverflow.bodyOverflow).toBeLessThanOrEqual(1);

    const disclosure = page.locator('button[aria-controls^="question-explanation-options-"]');
    await expect(disclosure).toHaveCount(1);
    await expect(disclosure).toHaveAccessibleName('Show why the other options are wrong');
    await expect(disclosure).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Tab');
    await expect(disclosure).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure).toHaveAccessibleName('Hide why the other options are wrong');

    const controlledRegionId = await disclosure.getAttribute('aria-controls');
    expect(controlledRegionId).toBeTruthy();
    const optionAnalysis = page.locator(`#${controlledRegionId}`);
    await expect(optionAnalysis).toBeVisible();
    await expect(optionAnalysis).toHaveAttribute('role', 'region');
    await expect(optionAnalysis).toHaveAttribute('aria-label', 'Why are the other options wrong?');
    await expect(optionAnalysis.getByRole('listitem')).toHaveCount(4);

    const expandedOverflow = await page.evaluate(() => ({
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
    }));
    expect(expandedOverflow.documentOverflow).toBeLessThanOrEqual(1);
    expect(expandedOverflow.bodyOverflow).toBeLessThanOrEqual(1);

    await page.screenshot({
      path: testInfo.outputPath(`rnk-cp004-renderer-${width}px.png`),
      fullPage: true,
    });

    await page.keyboard.press('Space');
    await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    await expect(disclosure).toHaveAccessibleName('Show why the other options are wrong');
    await expect(disclosure).toBeFocused();
  });
}
