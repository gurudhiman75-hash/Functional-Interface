import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const generator = read("./generate-public-prerender.mjs");
const firebase = JSON.parse(read("../../../firebase.json"));
const pkg = JSON.parse(read("../package.json"));
const pyqs = read("../src/pages/pyqs.tsx");
const blog = read("../src/pages/blog.tsx");
const seoLanding = read("../src/pages/seo-landing.tsx");
const examsCovered = read("../src/pages/exams-covered.tsx");
const proof = read("../../../scripts/e2e/tests/student-public-prerender.spec.ts");
const seoProof = read("../../../scripts/e2e/tests/student-public-seo.spec.ts");

assert.equal(pkg.scripts["audit:public-prerender"], "node scripts/check-public-prerender.mjs");
assert.match(pkg.scripts.quality, /audit:public-prerender/);
assert.match(pkg.scripts.build, /vite build --config vite\.config\.ts && node scripts\/generate-public-prerender\.mjs/);

assert.match(generator, /DEFAULT_PUBLIC_ORIGIN = "https:\/\/sarbedutech\.web\.app"/);
assert.match(generator, /process\.env\.EXAMTREE_PUBLIC_ORIGIN/);
assert.match(generator, /process\.env\.VITE_PUBLIC_SITE_ORIGIN/);
assert.match(generator, /process\.env\.RENDER_EXTERNAL_URL/);
assert.match(generator, /url\.protocol !== "https:" && url\.protocol !== "http:"/);
assert.match(generator, /url\.pathname !== "\/" \|\| url\.search \|\| url\.hash/);

for (const route of ["/", "/exams", "/mock-tests", "/exams-covered", "/about", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions", "/refund-policy"]) {
  assert.ok(generator.includes(`path: "${route}"`), `prerender route set must include ${route}`);
}
for (const route of ["/pyqs", "/blog", "/ssc-cgl-pyqs", "/punjab-police-mock-tests", "/ibps-clerk-syllabus", "/dashboard", "/test/"]) {
  assert.ok(!generator.includes(`path: "${route}"`), `prerender route set must exclude ${route}`);
}

assert.match(generator, /sitemap\.xml/);
assert.match(generator, /Sitemap: \$\{publicOrigin\}\/sitemap\.xml/);
assert.match(generator, /property="og:url"/);
assert.match(generator, /link rel="canonical"/);
assert.match(generator, /new URL\("\/opengraph\.jpg"/);
assert.match(generator, /data-prerender-fallback/);
assert.match(generator, /<h1/);
assert.match(generator, /aria-label="Explore ExamTree"/);
assert.match(generator, /`\$\{relativePath\}\.html`/);
assert.doesNotMatch(generator, /fs\.writeFileSync\(path\.join\(directory, "index\.html"\)/, "prerender routes must be emitted as flat clean-url .html files");

assert.equal(firebase.hosting.cleanUrls, true, "Firebase Hosting must serve flat prerender .html files at clean URLs");
assert.deepEqual(firebase.hosting.rewrites[0], { source: "/admin", destination: "/admin/index.html" });
assert.deepEqual(firebase.hosting.rewrites[1], { source: "/admin/**", destination: "/admin/index.html" });
assert.deepEqual(firebase.hosting.rewrites[2], { source: "**", destination: "/index.html" });

for (const [name, source] of [["PYQ hub", pyqs], ["blog", blog], ["SEO landing", seoLanding]]) {
  assert.match(source, /robots: "noindex,follow"/, `${name} placeholder content must stay out of search indexes`);
}
assert.doesNotMatch(examsCovered, /Future|future-ready|future PYQ|\/punjab-police-mock-tests|\/ibps-clerk-syllabus/, "sitemapped exams-covered content must not advertise placeholder routes or future content");

assert.match(proof, /request\.get\("\/sitemap\.xml"\)/);
assert.match(proof, /request\.get\("\/robots\.txt"\)/);
assert.match(proof, /request\.get\("\/about\.html"\)/);
assert.match(proof, /request\.get\("\/exams\.html"\)/);
assert.match(proof, /https:\/\/sarbedutech\.web\.app\/opengraph\.jpg/);
assert.match(proof, /data-prerender-fallback/);
assert.match(proof, /not\.toContain\(`\$\{DEFAULT_ORIGIN\}\/pyqs`\)/);
assert.match(seoProof, /placeholder content stays noindex/);
assert.match(seoProof, /\/pyqs/);
assert.match(seoProof, /noindex,follow/);

console.log("Public sitemap/prerender audit passed (54 assertions).");
