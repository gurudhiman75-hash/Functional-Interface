import { expect, test } from "@playwright/test";

const DEFAULT_ORIGIN = "https://sarbedutech.web.app";

test.describe("CP03 build-time sitemap and crawlable snapshots", () => {
  test("emits a conservative sitemap and advertises it from robots", async ({ request }) => {
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const sitemap = await sitemapResponse.text();

    for (const path of ["/", "/exams", "/mock-tests", "/exams-covered", "/about", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions", "/cancellation-refund-policy", "/disclaimer", "/billing-help", "/grievance-redressal", "/accessibility", "/ssc-cgl", "/ssc-cgl-preparation", "/ssc-cgl-syllabus", "/ssc-cgl/questions/percentage", "/ssc-cgl/questions/syllogism", "/ssc-chsl", "/ssc-chsl-preparation", "/ssc-chsl-syllabus", "/ssc-chsl/questions/percentage", "/ssc-chsl/questions/syllogism", "/ssc-mts", "/ssc-mts/questions/percentage", "/ssc-cpo", "/ssc-cpo/questions/syllogism", "/ssc-stenographer", "/ssc-stenographer/questions/syllogism", "/ssc-gd", "/ssc-gd/questions/percentage", "/ibps-po", "/ibps-po-preparation", "/ibps-po-syllabus", "/ibps-po/questions/percentage", "/ibps-clerk", "/ibps-clerk-preparation", "/ibps-clerk-syllabus", "/ibps-clerk/questions/syllogism", "/ibps-rrb-po", "/ibps-rrb-po-preparation", "/ibps-rrb-po-syllabus", "/ibps-rrb-po/questions/percentage", "/ibps-rrb-office-assistant", "/ibps-rrb-office-assistant-preparation", "/ibps-rrb-office-assistant-syllabus", "/ibps-rrb-office-assistant/questions/syllogism"]) {
      expect(sitemap).toContain(`<loc>${DEFAULT_ORIGIN}${path === "/" ? "/" : path}</loc>`);
    }
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/pyqs`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/blog`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/ssc-cgl-pyqs`);
    expect(sitemap).not.toContain(`${DEFAULT_ORIGIN}/punjab-police-mock-tests`);
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

  test("SSC CGL acquisition snapshots are crawlable", async ({ request }) => {
    const hubResponse = await request.get("/ssc-cgl.html");
    expect(hubResponse.ok()).toBe(true);
    const hubHtml = await hubResponse.text();
    expect(hubHtml).toContain("<title>SSC CGL Preparation, Syllabus, Mock Tests &amp; Free Questions | ExamTree</title>");
    expect(hubHtml).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/ssc-cgl"`);
    expect(hubHtml).toContain("SSC CGL preparation hub");

    const topicResponse = await request.get("/ssc-cgl/questions/percentage.html");
    expect(topicResponse.ok()).toBe(true);
    const topicHtml = await topicResponse.text();
    expect(topicHtml).toContain("Percentage Questions for SSC CGL");
    expect(topicHtml).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/ssc-cgl/questions/percentage"`);
  });

  test("SSC CHSL acquisition snapshots are crawlable", async ({ request }) => {
    const hubResponse = await request.get("/ssc-chsl.html");
    expect(hubResponse.ok()).toBe(true);
    const hubHtml = await hubResponse.text();
    expect(hubHtml).toContain("<title>SSC CHSL Preparation, Syllabus, Mock Tests &amp; Free Questions | ExamTree</title>");
    expect(hubHtml).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/ssc-chsl"`);
    expect(hubHtml).toContain("SSC CHSL preparation hub");

    const topicResponse = await request.get("/ssc-chsl/questions/percentage.html");
    expect(topicResponse.ok()).toBe(true);
    const topicHtml = await topicResponse.text();
    expect(topicHtml).toContain("Percentage Questions for SSC CHSL");
    expect(topicHtml).toContain(`<link rel="canonical" href="${DEFAULT_ORIGIN}/ssc-chsl/questions/percentage"`);
  });

  test("expanded SSC acquisition snapshots are crawlable", async ({ request }) => {
    for (const [path, phrase] of [
      ["/ssc-mts.html", "SSC MTS preparation hub"],
      ["/ssc-cpo.html", "SSC CPO preparation hub"],
      ["/ssc-stenographer.html", "SSC Stenographer preparation hub"],
      ["/ssc-gd.html", "SSC GD 2027 preparation hub"],
    ] as const) {
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain(phrase);
    }
  });

  test("IBPS acquisition snapshots are crawlable", async ({ request }) => {
    for (const [path, phrase] of [
      ["/ibps-po.html", "IBPS PO 2026 preparation hub"],
      ["/ibps-clerk.html", "IBPS Clerk / CSA 2026 preparation hub"],
    ] as const) {
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain(phrase);
    }

    const poTopic = await request.get("/ibps-po/questions/percentage.html");
    expect(poTopic.ok()).toBe(true);
    expect(await poTopic.text()).toContain("Percentage Questions for IBPS PO");

    const clerkTopic = await request.get("/ibps-clerk/questions/syllogism.html");
    expect(clerkTopic.ok()).toBe(true);
    expect(await clerkTopic.text()).toContain("Syllogism Questions for IBPS Clerk / CSA");
  });

  test("IBPS RRB acquisition snapshots are crawlable", async ({ request }) => {
    for (const [path, phrase] of [
      ["/ibps-rrb-po.html", "IBPS RRB PO 2026 preparation hub"],
      ["/ibps-rrb-office-assistant.html", "IBPS RRB Office Assistant 2026 preparation hub"],
    ] as const) {
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain(phrase);
    }

    const poTopic = await request.get("/ibps-rrb-po/questions/percentage.html");
    expect(poTopic.ok()).toBe(true);
    expect(await poTopic.text()).toContain("Percentage Questions for IBPS RRB PO");

    const oaTopic = await request.get("/ibps-rrb-office-assistant/questions/syllogism.html");
    expect(oaTopic.ok()).toBe(true);
    expect(await oaTopic.text()).toContain("Syllogism Questions for IBPS RRB Office Assistant");
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
