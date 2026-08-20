import { expect, test } from "@playwright/test";

const DEFAULT_ORIGIN = "https://sarbedutech.web.app";

test.describe("CP03 build-time sitemap and crawlable snapshots", () => {
  test("emits a conservative sitemap and advertises it from robots", async ({ request }) => {
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const sitemap = await sitemapResponse.text();

    for (const path of ["/", "/exams", "/mock-tests", "/exams-covered", "/about", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions", "/refund-policy"]) {
      expect(sitemap).toContain(`<loc>${DEFAULT_ORIGIN}${path === "/" ? "/" : path}</loc>`);
    }
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/pyqs`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/blog`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/ssc-cgl-pyqs`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/punjab-police-mock-tests`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/ibps-clerk-syllabus`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/dashboard`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/test/`);

    const robotsResponse = await request.get("/robots.txt");
    expect(robotsResponse.ok()).toBe(true);
    const robots = await robotsResponse.text();
    expect(robots).toContain(`Sitemap: ${DEFAULT_ORIGIN}/sitemap.xml`);
    expect(robots).toContain("Disallow: /dashboard");
    expect(robots).toContain("Disallow: /test/");
    expect(robots).toContain("Disallow: /login");
  });

  test("about snapshot is crawlable without executing JavaScript", async ({ request }) => {
    const response = await request.get("/about.html");
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/about"`);
    expect(html).toContain(`<meta property="og:url" content="${DEFAULT_ORIGIN}/about"`);
    expect(html).toContain(`https://sarbedutech.web.app/opengraph.jpg`);
    expect(html).toContain("data-prerender-fallback");
    expect(html).toContain("<h1");
    expect(html).toContain("About ExamTree");
    expect(html).toContain("Learn how ExamTree approaches mock-test practice");
    expect(html).toContain('aria-label="Explore ExamTree"');
  });

  test("exam discovery snapshot has unique metadata and static discovery content", async ({ request }) => {
    const response = await request.get("/exams.html");
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain("<title>Online Mock Tests | ExamTree</title>");
    expect(html).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/exams"`);
    expect(html).toContain(`<meta property="og:url" content="${DEFAULT_ORIGIN}/exams"`);
    expect(html).toContain("Browse online mock tests");
    expect(html).toContain("data-prerender-fallback");
  });
});
