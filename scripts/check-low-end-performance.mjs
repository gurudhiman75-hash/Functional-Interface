import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const vite = read("../vite.config.ts");
const playwrightConfig = read("../../../scripts/e2e/playwright.config.ts");
const proof = read("../../../scripts/e2e/tests/student-low-end-performance.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:low-end-performance"], "node scripts/check-low-end-performance.mjs");
assert.match(pkg.scripts.quality, /audit:low-end-performance/);

assert.match(vite, /STATIC_ENTRY_CHUNK_BUDGET_BYTES = 384 \* 1024/);
assert.match(vite, /STATIC_ENTRY_GRAPH_BUDGET_BYTES = 768 \* 1024/);
assert.match(vite, /function assertStartupBundleBudgets\(\): Plugin/);
assert.match(vite, /output\.isEntry/);
assert.match(vite, /chunk\.imports/);
assert.match(vite, /Buffer\.byteLength\(chunk\.code, "utf8"\)/);
assert.match(vite, /assertStartupBundleBudgets\(\)/);

assert.match(playwrightConfig, /student-\(timer-mobile-hardening\|low-end-performance\|cross-browser-polish\)/);
assert.match(playwrightConfig, /student-\(production-hardening\|timer-mobile-hardening\|low-end-performance\)/);

assert.match(proof, /Emulation\.setCPUThrottlingRate/);
assert.match(proof, /rate: 4/);
assert.match(proof, /Network\.setCacheDisabled/);
assert.match(proof, /first-contentful-paint/);
assert.match(proof, /largest-contentful-paint/);
assert.match(proof, /layout-shift/);
assert.match(proof, /toBeLessThanOrEqual\(3_000\)/);
assert.match(proof, /toBeLessThanOrEqual\(4_000\)/);
assert.match(proof, /toBeLessThanOrEqual\(0\.1\)/);
assert.match(proof, /scrollWidth <= window\.innerWidth \+ 1/);
assert.match(
  proof,
  /MathJaxRouteProvider\|auth\|firebase/,
  "low-end Home proof must reject MathJax, auth, and Firebase deferred chunks on public startup",
);

console.log("Low-end performance audit passed.");
