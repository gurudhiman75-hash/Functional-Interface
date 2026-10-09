import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("artifacts/examtree/dist/public");
const read = (p) => fs.readFileSync(path.join(dist, p), "utf8");

assert.ok(fs.existsSync(path.join(dist, "index.html")), "student index missing");
assert.ok(fs.existsSync(path.join(dist, "admin/index.html")), "admin index missing");
assert.doesNotMatch(read("_redirects"), /^(?!#).*\s200\s*$/gm, "Pages 200 rewrites are invalid redirect loops");
const routes = JSON.parse(read("_routes.json"));
assert.deepEqual(routes, { version: 1, include: ["/api/*", "/admin", "/admin/*"], exclude: ["/admin/assets/*", "/admin/index.html"] });
assert.doesNotMatch(read("index.html"), /onrender\.com\/api/i, "public index should not hardcode Render API");
assert.doesNotMatch(read("admin/index.html"), /onrender\.com\/api/i, "admin index should not hardcode Render API");
assert.ok(fs.existsSync(path.join(dist, "sitemap.xml")), "public SEO sitemap missing");
assert.ok(fs.existsSync(path.join(dist, "robots.txt")), "robots file missing");
console.log("PASS: Cloudflare Pages student/admin build output and API routing contract");
