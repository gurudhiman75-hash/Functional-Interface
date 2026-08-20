import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const publicPage = read("../src/components/PublicPage.tsx");
const fallback = read("../src/components/PublicSeoFallback.tsx");
const publicLayout = read("../src/components/PublicLayout.tsx");
const indexHtml = read("../index.html");
const robots = read("../public/robots.txt");
const proof = read("../../../scripts/e2e/tests/student-public-seo.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:public-seo"], "node scripts/check-public-seo.mjs");
assert.match(pkg.scripts.quality, /audit:public-seo/);
assert.match(publicPage, /window\.location\.origin/, "canonical metadata must derive from the deployed runtime origin");
assert.match(publicPage, /canonicalPathFor\(window\.location\.pathname\)/, "canonical metadata must omit query strings and normalize known aliases");
assert.match(publicPage, /"\/tests": "\/exams"/, "tests alias must canonicalize to exams");
assert.match(publicPage, /"\/privacy": "\/privacy-policy"/, "privacy alias must canonicalize to the public policy route");
assert.match(publicPage, /"\/login": "\/login\/student"/, "login alias must canonicalize to the student login route");
assert.match(publicPage, /link\[rel="canonical"\]/, "metadata hook must manage a canonical link");
assert.match(publicPage, /twitter:card[\s\S]*?summary_large_image/, "metadata hook must expose Twitter card metadata");
for (const key of ["twitter:title", "twitter:description", "twitter:image", "og:title", "og:description", "og:type", "og:url", "og:image", "robots"]) {
  assert.ok(publicPage.includes(key), `metadata hook must manage ${key}`);
}
assert.match(publicLayout, /<PublicSeoFallback \/>/, "public shell must mount metadata fallback for acquisition routes without page-owned metadata");
assert.match(fallback, /location === "\/"/, "home must receive acquisition metadata");
assert.match(fallback, /location === "\/tests" \|\| location === "\/exams"/, "tests/exams discovery must receive metadata");
assert.match(fallback, /location\.startsWith\("\/category\/"\)/, "category discovery must receive metadata");
assert.match(fallback, /location\.startsWith\("\/subcategory\/"\)/, "exam discovery must receive metadata");
assert.match(fallback, /location\.startsWith\("\/published-tests\/"\)[\s\S]*?noindex,follow/, "published redirect routes must not be indexed");
assert.match(fallback, /location\.startsWith\("\/login\/"\)[\s\S]*?noindex,follow/, "account utility routes must not be indexed");
assert.match(indexHtml, /ExamTree — Mock Tests & Exam Preparation/);
assert.match(indexHtml, /meta name="description"/);
assert.match(indexHtml, /meta name="robots" content="index,follow"/);
assert.match(indexHtml, /meta property="og:title"/);
assert.match(indexHtml, /meta property="og:image" content="\/opengraph\.jpg"/);
assert.match(indexHtml, /meta name="twitter:card" content="summary_large_image"/);
assert.match(indexHtml, /meta name="theme-color" content="#1e1b4b"/);
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \/(?:\n|$)/);
for (const path of ["/admin", "/dashboard", "/profile", "/result", "/test/", "/login"]) {
  assert.ok(robots.includes(`Disallow: ${path}`), `robots must block private route ${path}`);
}
for (const publicPath of ["/exams", "/mock-tests", "/pyqs", "/about"]) {
  assert.ok(!robots.includes(`Disallow: ${publicPath}`), `robots must not block public acquisition route ${publicPath}`);
}
assert.match(proof, /origin.*canonical|canonical.*origin/is, "browser proof must verify runtime-origin canonical URLs");
assert.match(proof, /\/about\?utm_source=e2e/, "browser proof must exercise query stripping on page-owned metadata");
assert.match(proof, /\/tests\?source=e2e/, "browser proof must exercise canonical alias normalization");
assert.match(proof, /\/login\/student\?next=/, "browser proof must exercise noindex utility metadata");
assert.match(proof, /summary_large_image/);
assert.match(proof, /opengraph\.jpg/);

console.log("Public SEO metadata audit passed (50 assertions).");
