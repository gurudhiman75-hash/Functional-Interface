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
    path: "/cancellation-refund-policy",
    title: "Cancellation & Refund Policy | ExamTree",
    heading: "ExamTree cancellation and refund policy",
    description: "Read the ExamTree cancellation and refund policy for digital purchases, duplicate charges, failed access, and eligible refunds.",
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | ExamTree",
    heading: "ExamTree disclaimer",
    description: "Read important boundaries for official exam information, practice material, exam names, and third-party services.",
  },
  {
    path: "/billing-help",
    title: "Payment & Billing Help | ExamTree",
    heading: "ExamTree payment and billing help",
    description: "Get help with payments, missing access, duplicate charges, refunds, coupons, and billing questions.",
  },
  {
    path: "/grievance-redressal",
    title: "Grievance Redressal | ExamTree",
    heading: "ExamTree grievance redressal",
    description: "Learn how to raise account, payment, privacy, content, or service concerns with ExamTree.",
  },
  {
    path: "/accessibility",
    title: "Accessibility | ExamTree",
    heading: "Accessibility at ExamTree",
    description: "Read how ExamTree approaches keyboard access, readable interfaces, responsive layouts, zoom, and accessibility feedback.",
  },
  {
    path: "/ssc-cgl",
    title: "SSC CGL Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC CGL preparation hub",
    description: "Prepare for SSC CGL with syllabus guidance, preparation strategy, mock tests, and free topic-wise questions with answers.",
  },
  {
    path: "/ssc-cgl-preparation",
    title: "How to Prepare for SSC CGL 2026 | ExamTree",
    heading: "How to prepare for SSC CGL 2026",
    description: "Use a practical SSC CGL preparation workflow built around concept coverage, focused question practice, timed mocks, and review.",
  },
  {
    path: "/ssc-cgl-syllabus",
    title: "SSC CGL Syllabus & Tier-I Exam Pattern 2026 | ExamTree",
    heading: "SSC CGL syllabus and Tier-I pattern 2026",
    description: "Review the SSC CGL 2026 Tier-I subject structure, marks, timing, negative marking, and preparation links.",
  },
  {
    path: "/ssc-chsl",
    title: "SSC CHSL Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC CHSL preparation hub",
    description: "Prepare for SSC CHSL with syllabus guidance, preparation strategy, mock tests, and free topic-wise questions with answers.",
  },
  {
    path: "/ssc-chsl-preparation",
    title: "How to Prepare for SSC CHSL 2026 | ExamTree",
    heading: "How to prepare for SSC CHSL 2026",
    description: "Build SSC CHSL Tier-I fundamentals, practise by topic, review timed mocks, and prepare for Tier-II computer and skill requirements.",
  },
  {
    path: "/ssc-chsl-syllabus",
    title: "SSC CHSL Syllabus & Exam Pattern 2026 | ExamTree",
    heading: "SSC CHSL syllabus and exam pattern 2026",
    description: "Review SSC CHSL Tier-I subjects, Tier-II modules, negative marking, and skill or typing requirements.",
  },
  {
    path: "/ssc-mts",
    title: "SSC MTS Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC MTS preparation hub",
    description: "Prepare for SSC MTS 2026 with session-based guidance, mock tests, and free topic-wise questions.",
  },
  {
    path: "/ssc-mts-preparation",
    title: "How to Prepare for SSC MTS 2026 | ExamTree",
    heading: "How to prepare for SSC MTS 2026",
    description: "Build SSC MTS numerical, reasoning, English, and General Awareness fundamentals and convert them into timed practice.",
  },
  {
    path: "/ssc-mts-syllabus",
    title: "SSC MTS Syllabus & Exam Pattern 2026 | ExamTree",
    heading: "SSC MTS syllabus and exam pattern 2026",
    description: "Review the SSC MTS and Havaldar preparation areas, session structure, and official verification guidance.",
  },
  {
    path: "/ssc-cpo",
    title: "SSC CPO Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC CPO preparation hub",
    description: "Prepare for SSC CPO 2026 with Paper-I practice, physical-stage planning, mock tests, and free questions.",
  },
  {
    path: "/ssc-cpo-preparation",
    title: "How to Prepare for SSC CPO 2026 | ExamTree",
    heading: "How to prepare for SSC CPO 2026",
    description: "Prepare Paper-I, physical readiness, Paper-II English, and mock-test review as one SSC CPO plan.",
  },
  {
    path: "/ssc-cpo-syllabus",
    title: "SSC CPO Syllabus & Selection Pattern 2026 | ExamTree",
    heading: "SSC CPO syllabus and selection pattern 2026",
    description: "Review SSC CPO Paper-I subjects, PET/PST, Paper-II, and later selection stages.",
  },
  {
    path: "/ssc-stenographer",
    title: "SSC Stenographer Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC Stenographer preparation hub",
    description: "Prepare for SSC Stenographer Grade C & D 2026 with CBE practice and stenography skill guidance.",
  },
  {
    path: "/ssc-stenographer-preparation",
    title: "How to Prepare for SSC Stenographer 2026 | ExamTree",
    heading: "How to prepare for SSC Stenographer 2026",
    description: "Balance English, Reasoning, General Awareness, sectional timing, and regular stenography skill practice.",
  },
  {
    path: "/ssc-stenographer-syllabus",
    title: "SSC Stenographer Syllabus & Exam Pattern 2026 | ExamTree",
    heading: "SSC Stenographer Grade C & D syllabus and pattern 2026",
    description: "Review the 2026 CBE structure and Grade C/Grade D stenography skill-test requirements.",
  },
  {
    path: "/ssc-gd",
    title: "SSC GD 2027 Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "SSC GD 2027 preparation hub",
    description: "Prepare for the next SSC GD cycle with CBE guidance, physical-stage planning, mock tests, and free questions.",
  },
  {
    path: "/ssc-gd-preparation",
    title: "How to Prepare for SSC GD 2027 | ExamTree",
    heading: "How to prepare for SSC GD 2027",
    description: "Prepare SSC GD written fundamentals and physical readiness together for the next recruitment cycle.",
  },
  {
    path: "/ssc-gd-syllabus",
    title: "SSC GD Syllabus & Selection Pattern 2027 | ExamTree",
    heading: "SSC GD syllabus and selection pattern 2027",
    description: "Review the SSC GD CBE subjects and later PET/PST, medical, and verification stages.",
  },
  {
    path: "/ibps-po",
    title: "IBPS PO 2026 (CRP PO/MT-XVI) Preparation, Syllabus, Mock Tests & Updates | ExamTree",
    heading: "IBPS PO 2026 preparation hub",
    description: "Prepare for CRP PO/MT-XVI with the revised 2026 prelims and mains pattern, mock tests, official-cycle updates, and topic-wise banking practice.",
  },
  {
    path: "/ibps-po-preparation",
    title: "How to Prepare for IBPS PO 2026 (CRP PO/MT-XVI) | ExamTree",
    heading: "How to prepare for IBPS PO 2026",
    description: "Prepare for the revised XVI pattern with timed prelims, 170-question mains, banking awareness, Essay + Comprehension, and mock analysis.",
  },
  {
    path: "/ibps-po-syllabus",
    title: "IBPS PO 2026 Syllabus & Revised Exam Pattern (CRP PO/MT-XVI) | ExamTree",
    heading: "IBPS PO/MT-XVI syllabus and revised exam pattern 2026",
    description: "Review the XVI prelims, 170-question mains objective paper, descriptive Essay + Comprehension, interview, and final-merit structure.",
  },
  {
    path: "/ibps-clerk",
    title: "IBPS Clerk / CSA 2026 Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "IBPS Clerk / CSA 2026 preparation hub",
    description: "Prepare for IBPS Customer Service Associate XVI with prelims and mains guidance, mock tests, and free questions.",
  },
  {
    path: "/ibps-clerk-preparation",
    title: "How to Prepare for IBPS Clerk / CSA 2026 | ExamTree",
    heading: "How to prepare for IBPS Clerk / CSA 2026",
    description: "Build separately timed prelims speed and mains-level banking awareness, Quant, Reasoning, and English.",
  },
  {
    path: "/ibps-clerk-syllabus",
    title: "IBPS Clerk / CSA 2026 Syllabus & Exam Pattern | ExamTree",
    heading: "IBPS Customer Service Associate XVI syllabus and exam pattern 2026",
    description: "Review the current IBPS CSA XVI preliminary and main examination structure and preparation priorities.",
  },
  {
    path: "/ibps-rrb-po",
    title: "IBPS RRB PO 2026 Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "IBPS RRB PO 2026 preparation hub",
    description: "Prepare for CRP RRBs XV Officer Scale I with prelims, mains, interview guidance, mock tests, and free questions.",
  },
  {
    path: "/ibps-rrb-po-preparation",
    title: "How to Prepare for IBPS RRB PO 2026 | ExamTree",
    heading: "How to prepare for IBPS RRB PO 2026",
    description: "Build prelims speed while preparing RRB Officer Scale I mains, banking awareness, computer knowledge, and interview readiness.",
  },
  {
    path: "/ibps-rrb-po-syllabus",
    title: "IBPS RRB PO 2026 Syllabus & Exam Pattern | ExamTree",
    heading: "IBPS RRB Officer Scale I syllabus and exam pattern 2026",
    description: "Review CRP RRBs XV Officer Scale I prelims, mains, and interview stages.",
  },
  {
    path: "/ibps-rrb-office-assistant",
    title: "IBPS RRB Office Assistant 2026 Preparation, Syllabus, Mock Tests & Free Questions | ExamTree",
    heading: "IBPS RRB Office Assistant 2026 preparation hub",
    description: "Prepare for CRP RRBs XV Office Assistant with prelims and mains guidance, mock tests, and free questions.",
  },
  {
    path: "/ibps-rrb-office-assistant-preparation",
    title: "How to Prepare for IBPS RRB Office Assistant 2026 | ExamTree",
    heading: "How to prepare for IBPS RRB Office Assistant 2026",
    description: "Build prelims speed while preparing mains awareness, computer knowledge, language, and banking aptitude.",
  },
  {
    path: "/ibps-rrb-office-assistant-syllabus",
    title: "IBPS RRB Office Assistant 2026 Syllabus & Exam Pattern | ExamTree",
    heading: "IBPS RRB Office Assistant syllabus and exam pattern 2026",
    description: "Review CRP RRBs XV Office Assistant prelims and mains preparation structure.",
  },
];

const sscPracticeTopics = [
  ["percentage", "Percentage"],
  ["profit-and-loss", "Profit and Loss"],
  ["average", "Average"],
  ["ratio-and-proportion", "Ratio and Proportion"],
  ["time-and-work", "Time and Work"],
  ["time-speed-distance", "Time, Speed and Distance"],
  ["number-system", "Number System"],
  ["syllogism", "Syllogism"],
  ["coding-decoding", "Coding-Decoding"],
  ["indian-polity", "Indian Polity"],
];

const stenographerPracticeTopics = sscPracticeTopics.filter(([slug]) =>
  ["syllogism", "coding-decoding", "indian-polity"].includes(slug),
);
const gdPracticeTopics = sscPracticeTopics.filter(([slug]) =>
  ["percentage", "average", "ratio-and-proportion", "time-and-work", "time-speed-distance", "number-system", "coding-decoding", "indian-polity"].includes(slug),
);
const bankingPracticeTopics = sscPracticeTopics.filter(([slug]) =>
  ["percentage", "profit-and-loss", "average", "ratio-and-proportion", "time-and-work", "time-speed-distance", "number-system", "syllogism", "coding-decoding"].includes(slug),
);

routes.push(
  ...sscPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-cgl/questions/${slug}`,
    title: `${name} Questions for SSC CGL – Free Practice | ExamTree`,
    heading: `${name} questions for SSC CGL`,
    description: `Solve free ${name} questions for SSC CGL with answers and explanations, then continue to timed mock tests.`,
  })),
  ...sscPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-chsl/questions/${slug}`,
    title: `${name} Questions for SSC CHSL – Free Practice | ExamTree`,
    heading: `${name} questions for SSC CHSL`,
    description: `Solve free ${name} questions for SSC CHSL with answers and explanations, then continue to timed mock tests.`,
  })),
  ...sscPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-mts/questions/${slug}`,
    title: `${name} Questions for SSC MTS – Free Practice | ExamTree`,
    heading: `${name} questions for SSC MTS`,
    description: `Solve free ${name} questions for SSC MTS with answers and explanations.`,
  })),
  ...sscPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-cpo/questions/${slug}`,
    title: `${name} Questions for SSC CPO – Free Practice | ExamTree`,
    heading: `${name} questions for SSC CPO`,
    description: `Solve free ${name} questions for SSC CPO with answers and explanations.`,
  })),
  ...stenographerPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-stenographer/questions/${slug}`,
    title: `${name} Questions for SSC Stenographer – Free Practice | ExamTree`,
    heading: `${name} questions for SSC Stenographer`,
    description: `Solve free ${name} questions for SSC Stenographer with answers and explanations.`,
  })),
  ...gdPracticeTopics.map(([slug, name]) => ({
    path: `/ssc-gd/questions/${slug}`,
    title: `${name} Questions for SSC GD – Free Practice | ExamTree`,
    heading: `${name} questions for SSC GD`,
    description: `Solve free ${name} questions for SSC GD with answers and explanations.`,
  })),
  ...bankingPracticeTopics.map(([slug, name]) => ({
    path: `/ibps-po/questions/${slug}`,
    title: `${name} Questions for IBPS PO – Free Practice | ExamTree`,
    heading: `${name} questions for IBPS PO`,
    description: `Solve free ${name} questions for IBPS PO with answers and explanations.`,
  })),
  ...bankingPracticeTopics.map(([slug, name]) => ({
    path: `/ibps-clerk/questions/${slug}`,
    title: `${name} Questions for IBPS Clerk / CSA – Free Practice | ExamTree`,
    heading: `${name} questions for IBPS Clerk / CSA`,
    description: `Solve free ${name} questions for IBPS Clerk / CSA with answers and explanations.`,
  })),
  ...bankingPracticeTopics.map(([slug, name]) => ({
    path: `/ibps-rrb-po/questions/${slug}`,
    title: `${name} Questions for IBPS RRB PO – Free Practice | ExamTree`,
    heading: `${name} questions for IBPS RRB PO`,
    description: `Solve free ${name} questions for IBPS RRB Officer Scale I with answers and explanations.`,
  })),
  ...bankingPracticeTopics.map(([slug, name]) => ({
    path: `/ibps-rrb-office-assistant/questions/${slug}`,
    title: `${name} Questions for IBPS RRB Office Assistant – Free Practice | ExamTree`,
    heading: `${name} questions for IBPS RRB Office Assistant`,
    description: `Solve free ${name} questions for IBPS RRB Office Assistant with answers and explanations.`,
  })),
);

const discoveryLinks = [
  ["Browse tests", "/exams"],
  ["Mock tests", "/mock-tests"],
  ["Exams covered", "/exams-covered"],
  ["SSC CGL", "/ssc-cgl"],
  ["SSC CHSL", "/ssc-chsl"],
  ["SSC MTS", "/ssc-mts"],
  ["SSC CPO", "/ssc-cpo"],
  ["IBPS PO", "/ibps-po"],
  ["IBPS Clerk / CSA", "/ibps-clerk"],
  ["IBPS RRB PO", "/ibps-rrb-po"],
  ["IBPS RRB Office Assistant", "/ibps-rrb-office-assistant"],
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
