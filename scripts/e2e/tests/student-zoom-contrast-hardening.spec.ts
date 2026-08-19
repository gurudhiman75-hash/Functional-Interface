import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === "/categories") return fulfillJson(route, []);
    if (path === "/subcategories") return fulfillJson(route, []);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/published-tests") {
      return fulfillJson(route, { tests: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path === "/test-series") {
      return fulfillJson(route, { series: [], generatedAt: "2026-08-19T10:00:00.000Z" });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);

    return fulfillJson(route, { error: `Unhandled zoom/contrast E2E route: ${method} ${path}` }, 404);
  });
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    const parse = (value: string) => {
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) throw new Error(`Unsupported CSS color: ${value}`);
      const parts = match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: Number.isFinite(parts[3]) ? parts[3] : 1,
      };
    };

    const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const channel = (value: number) => {
        const normalized = value / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const foreground = parse(getComputedStyle(element).color);
    let background = { r: 255, g: 255, b: 255, a: 1 };
    let current: Element | null = element;
    while (current) {
      const candidate = parse(getComputedStyle(current).backgroundColor);
      if (candidate.a >= 0.99) {
        background = candidate;
        break;
      }
      current = current.parentElement;
    }

    const foregroundLuminance = luminance(foreground);
    const backgroundLuminance = luminance(background);
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("CP02 zoom reflow and contrast", () => {
  test("keeps primary public and app controls readable at 2x Chromium page scale", async ({ page, context }) => {
    await installFixtures(page);
    await page.goto("/about");

    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });

    await expect.poll(() => page.evaluate(() => window.visualViewport?.scale ?? 1)).toBeGreaterThanOrEqual(1.9);

    const publicCta = page.getByRole("link", { name: "Browse tests" }).first();
    await publicCta.scrollIntoViewIfNeeded();
    await expect(publicCta).toBeVisible();
    expect(await contrastRatio(publicCta)).toBeGreaterThanOrEqual(4.5);

    await page.goto("/dashboard");
    const activity = page.getByRole("button", { name: "My activity" });
    const profile = page.getByRole("button", { name: "User profile" });
    await activity.scrollIntoViewIfNeeded();
    await expect(activity).toBeVisible();
    await expect(profile).toBeVisible();
    expect(await contrastRatio(activity)).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(profile)).toBeGreaterThanOrEqual(4.5);

    const sidebarTests = page.getByRole("link", { name: "Tests & Exams" });
    await expect(sidebarTests).toBeVisible();
    expect(await contrastRatio(sidebarTests)).toBeGreaterThanOrEqual(4.5);
  });

  test("reflows public and preparation shells at a 640px CSS viewport", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    await installFixtures(page);

    await page.goto("/about");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: "Select Targeted Exam" })).toBeVisible();
    await expect(page.getByRole("button", { name: "My activity" })).toBeVisible();
    await expect(page.getByRole("button", { name: "User profile" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Your activity follows you across devices/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
