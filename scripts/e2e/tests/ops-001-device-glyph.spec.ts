import { expect, test } from "@playwright/test";

const CANDIDATE_IDS = [
  "OPS-CAND-001", "OPS-CAND-003", "OPS-CAND-004", "OPS-CAND-005", "OPS-CAND-007",
  "OPS-CAND-008", "OPS-CAND-009", "OPS-CAND-010", "OPS-CAND-011", "OPS-CAND-012",
  "OPS-CAND-013", "OPS-CAND-014", "OPS-CAND-015", "OPS-CAND-016", "OPS-CAND-017",
  "OPS-CAND-018", "OPS-CAND-019", "OPS-CAND-020", "OPS-CAND-021", "OPS-CAND-022",
  "OPS-CAND-023", "OPS-CAND-024", "OPS-CAND-025", "OPS-CAND-026", "OPS-CAND-027",
  "OPS-CAND-028", "OPS-CAND-029", "OPS-CAND-030", "OPS-CAND-032", "OPS-CAND-033",
  "OPS-CAND-034",
] as const;

const HIGH_RISK_SCREENSHOTS = new Set([
  "OPS-CAND-005",
  "OPS-CAND-015",
  "OPS-CAND-018",
  "OPS-CAND-027",
  "OPS-CAND-034",
]);

const REVIEWS = [
  {
    locale: "en-IN",
    path: "/en/OPS-001-EN-APPROVED-V3-310.html",
    expectedCards: 310,
    expectedScript: /[A-Za-z]/u,
  },
  {
    locale: "hi-IN",
    path: "/localized/OPS-001-HI-APPROVED-V3-155.html",
    expectedCards: 155,
    expectedScript: /\p{Script=Devanagari}/u,
  },
  {
    locale: "pa-IN",
    path: "/localized/OPS-001-PA-APPROVED-V3-155.html",
    expectedCards: 155,
    expectedScript: /\p{Script=Gurmukhi}/u,
  },
] as const;

const REQUIRED_GLYPHS = ["×", "÷", "−", "↔", "<", ">", "="] as const;

for (const review of REVIEWS) {
  test(`${review.locale} approved review has no device overflow or broken mathematical glyphs`, async ({ page }, testInfo) => {
    await page.goto(review.path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const cards = page.locator(".card");
    await expect(cards).toHaveCount(review.expectedCards);

    const pageText = (await page.locator("body").innerText()).normalize("NFC");
    expect(pageText).toMatch(review.expectedScript);
    expect(pageText).not.toContain("�");
    expect(pageText).not.toMatch(/(?:^|\s)\p{M}/u);
    for (const glyph of REQUIRED_GLYPHS) expect(pageText).toContain(glyph);

    const glyphSupport = await page.evaluate((glyphs) => {
      return glyphs.map((glyph) => ({
        glyph,
        supported: document.fonts.check("16px sans-serif", glyph),
      }));
    }, REQUIRED_GLYPHS);
    expect(glyphSupport.filter((entry) => !entry.supported)).toEqual([]);

    const documentMetrics = await page.evaluate(() => ({
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));
    expect(documentMetrics.scrollWidth).toBeLessThanOrEqual(documentMetrics.viewport + 2);
    expect(documentMetrics.bodyScrollWidth).toBeLessThanOrEqual(documentMetrics.viewport + 2);

    for (const candidateId of CANDIDATE_IDS) {
      const card = page.locator(`.card[data-candidate="${candidateId}"]`).first();
      await expect(card, `${review.locale} is missing ${candidateId}`).toBeVisible();
      await card.locator("details").evaluate((node: HTMLDetailsElement) => { node.open = true; });
      await card.scrollIntoViewIfNeeded();

      const audit = await card.evaluate((root) => {
        const inspected = [
          root,
          ...root.querySelectorAll<HTMLElement>("header, .question, h2, .options, .options li, details, .answer, .steps, .steps li, .trace, .trace span, .conclusion"),
        ];
        const overflowing = inspected
          .filter((element) => element.scrollWidth > element.clientWidth + 2)
          .map((element) => ({
            tag: element.tagName,
            className: element.className,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            text: element.textContent?.slice(0, 120) ?? "",
          }));
        const emptyTextBlocks = inspected
          .filter((element) => ["H2", "LI", "SPAN", "P"].includes(element.tagName))
          .filter((element) => (element.textContent ?? "").trim().length === 0)
          .map((element) => ({ tag: element.tagName, className: element.className }));
        return {
          overflowing,
          emptyTextBlocks,
          text: (root.textContent ?? "").normalize("NFC"),
        };
      });

      expect(audit.overflowing, `${review.locale} ${candidateId} has horizontal clipping`).toEqual([]);
      expect(audit.emptyTextBlocks, `${review.locale} ${candidateId} has empty rendered text`).toEqual([]);
      expect(audit.text).not.toContain("�");
      expect(audit.text).not.toMatch(/(?:^|\s)\p{M}/u);

      if (
        HIGH_RISK_SCREENSHOTS.has(candidateId)
        && (testInfo.project.name === "mobile-360" || testInfo.project.name === "desktop-1280")
      ) {
        await card.screenshot({
          path: testInfo.outputPath(`${review.locale}-${candidateId}.png`),
          animations: "disabled",
        });
      }

      await card.locator("details").evaluate((node: HTMLDetailsElement) => { node.open = false; });
    }
  });
}
