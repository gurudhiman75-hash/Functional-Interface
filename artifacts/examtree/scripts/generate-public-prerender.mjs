import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PUBLIC_ORIGIN = "https://sarbedutech.web.app";
const DIST_DIR = fileURLToPath(new URL("../dist/public/", import.meta.url));
const INDEX_PATH = path.join(DIST_DIR, "index.html");
const ROBOTS_PATH = path.join(DIST_DIR, "robots.txt");

const routes = [
  {
    path: "/",
    title: "Mock Tests & Exam Preparation | ExamTree",
    heading: "Mock tests and exam preparation on ExamTree",
    description: "Browse ExamTree mock tests, exam practice, saved attempts, and supported multilingual question content from one student workspace.",
  },
  {
    path: "/exams",
    title: "Online Mock Tests | ExamTree",
    heading: "Browse online mock tests",
    description: "Browse published ExamTree mock tests and test series by exam, section, and topic, then review committed attempts in your student workspace.",
  },
  {
    path: "/mock-tests",
    title: "Mock Tests | ExamTree",
    heading: "Find available ExamTree mock tests",
    description: "Discover free, featured, subject-wise, and multilingual mock tests from the published ExamTree catalog.",
  },
  {
    path: "/exams-covered",
    title: "Exams Covered | ExamTree",
    heading: "Explore exams covered by ExamTree",
    description: "Explore ExamTree preparation pathways for SSC, Punjab government, banking, and railway exam families.",
  },
  {
    path: "/about",
    title: "About ExamTree",
    heading: "About ExamTree",
    description: "Learn how ExamTree approaches mock-test practice, multilingual question delivery, saved attempts, and exam preparation.",
  },
  {
    path: "/contact",
    title: "Contact Us | ExamTree",
    heading: "Contact ExamTree",
    description: "Contact ExamTree for account, payment, content, translation, technical support, or partnership questions.",
  },
  {
    path: "/faq",
    title: "FAQ | ExamTree",
    heading: "ExamTree frequently asked questions",
    description: "Find answers about ExamTree mock tests, attempts, languages, account access, payments, and support.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | ExamTree",
    heading: "ExamTree privacy policy",
    description: "Read the ExamTree privacy policy for account data, authentication, analytics, support, and service usage.",
  },
  {
    path: "/terms-and-conditions",
    title: "Terms & Conditions | ExamTree",
    heading: "ExamTree terms and conditions",
    description: "Read the terms and conditions governing access to ExamTree mock tests, accounts, and services.",
  },
  {
    path: "/refund-policy",
    title: "Refund Policy | ExamTree",
    heading: "ExamTree refund policy",
    description: "Read the ExamTree refund policy for eligible purchases and support requests.",
  },
];

const discoveryLinks = [
  ["Browse tests", "/exams"],
  ["Mock tests", "/mock-tests"],
  ["Exams covered", "/exams-covered"],
  ["FAQ", "/faq"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolvePublicOrigin() {
  const candidate = String(
    process.env.EXAMTREE_PUBLIC_ORIGIN ??
      process.env.VITE_PUBLIC_SITE_ORIGIN ??
      process.env.RENDER_EXTERNAL_URL ??
      DEFAULT_PUBLIC_ORIGIN,
  ).trim();
  const url = new URL(candidate);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Public site origin must use http or https: ${candidate}`);
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`Public site origin must not contain a path, query, or hash: ${candidate}`);
  }
  return url.origin;
}

function replaceTag(html, matcher, replacement, label) {
  if (!matcher.test(html)) throw new Error(`Built index is missing ${label}.`);
  return html.replace(matcher, replacement);
}

function buildFallbackMarkup(route) {
  const links = discoveryLinks
    .filter(([, href]) => href !== route.path)
    .map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join(" · ");
  return `<div id="root"><main data-prerender-fallback style="max-width:760px;margin:0 auto;padding:48px 20px;font-family:Inter,Arial,sans-serif;line-height:1.6;color:#1e293b"><a href="/" style="font-weight:700;color:#1e1b4b">ExamTree</a><h1 style="margin:24px 0 12px;color:#0f172a">${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.description)}</p><nav aria-label="Explore ExamTree" style="margin-top:24px">${links}</nav><p style="margin-top:28px;font-size:14px;color:#64748b">Interactive catalog and account features load when JavaScript is available.</p></main></div>`;
}

function renderRoute(baseHtml, route, publicOrigin) {
  const canonical = new URL(route.path, `${publicOrigin}/`).toString();
  const image = new URL("/opengraph.jpg", `${publicOrigin}/`).toString();
  let html = baseHtml;
  html = replaceTag(html, /<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`, "title");
  html = replaceTag(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`, "description meta");
  html = replaceTag(html, /<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="index,follow" />`, "robots meta");
  html = replaceTag(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`, "og:title meta");
  html = replaceTag(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`, "og:description meta");
  html = replaceTag(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`, "og:image meta");
  html = replaceTag(html, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`, "twitter:title meta");
  html = replaceTag(html, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`, "twitter:description meta");
  html = replaceTag(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`, "twitter:image meta");
  html = replaceTag(
    html,
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${escapeHtml(canonical)}" />\n    <link rel="canonical" href="${escapeHtml(canonical)}" />`,
    "og:type meta",
  );
  html = replaceTag(html, /<div id="root"><\/div>/i, buildFallbackMarkup(route), "empty application root");
  return html;
}

function writeRoute(route, html) {
  if (route.path === "/") {
    fs.writeFileSync(INDEX_PATH, html);
    return;
  }
  const relativePath = route.path.replace(/^\//, "");
  const filePath = path.join(DIST_DIR, `${relativePath}.html`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function writeSitemap(publicOrigin) {
  const locations = routes
    .map((route) => `  <url><loc>${escapeHtml(new URL(route.path, `${publicOrigin}/`).toString())}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml);
}

function writeRobots(publicOrigin) {
  const current = fs.existsSync(ROBOTS_PATH) ? fs.readFileSync(ROBOTS_PATH, "utf8").trimEnd() : "User-agent: *\nAllow: /";
  const withoutOldSitemap = current
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("Sitemap:"))
    .join("\n")
    .trimEnd();
  fs.writeFileSync(ROBOTS_PATH, `${withoutOldSitemap}\n\nSitemap: ${publicOrigin}/sitemap.xml\n`);
}

if (!fs.existsSync(INDEX_PATH)) {
  throw new Error("Student Vite build output is missing; run Vite build before public prerender generation.");
}

const publicOrigin = resolvePublicOrigin();
const baseHtml = fs.readFileSync(INDEX_PATH, "utf8");
for (const route of routes) writeRoute(route, renderRoute(baseHtml, route, publicOrigin));
writeSitemap(publicOrigin);
writeRobots(publicOrigin);

console.log(`Generated ${routes.length} crawlable public snapshots and sitemap for ${publicOrigin}.`);
