import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const app = read("../src/App.tsx");
const boundary = read("../src/components/RouteMathBoundary.tsx");
const provider = read("../src/providers/MathJaxRouteProvider.tsx");
const vite = read("../vite.config.ts");
const proof = read("../../../scripts/e2e/tests/student-startup-performance.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:startup-performance"], "node scripts/check-startup-performance.mjs");
assert.match(pkg.scripts.quality, /audit:startup-performance/);
assert.doesNotMatch(app, /from "better-react-mathjax"/, "application root must not statically import MathJax");
assert.doesNotMatch(app, /<MathJaxContext/, "application root must not globally mount MathJax");
assert.match(app, /<RouteMathBoundary>[\s\S]*?<Router \/>[\s\S]*?<\/RouteMathBoundary>/, "router must be wrapped by the route-scoped math boundary");
assert.match(boundary, /lazy\(\(\) => import\("@\/providers\/MathJaxRouteProvider"\)\)/, "MathJax provider must be dynamically imported");
assert.match(boundary, /location\.startsWith\("\/test\/"\)/, "active test routes must load the math provider");
assert.match(boundary, /location === "\/result"/, "canonical result route must load the math provider");
assert.doesNotMatch(boundary, /location\.startsWith\("\/test-series\/"\)/, "test-series summary routes must not load MathJax unnecessarily");
assert.match(boundary, /Suspense fallback=\{<MathRouteSkeleton \/>\}/, "math provider loading must use a context-safe route skeleton");
assert.match(provider, /MathJaxContext/);
assert.match(provider, /inlineMath/);
assert.match(provider, /displayMath/);
assert.match(provider, /processEscapes: true/);
assert.match(provider, /\[tex\]\/ams/);
assert.doesNotMatch(vite, /mathjax:\s*\[/, "MathJax must not be a manual chunk because Vite preloads manual entry dependencies globally");
assert.match(proof, /public acquisition pages do not download the MathJax bundle/);
assert.match(proof, /saved question review loads the isolated MathJax bundle on demand/);
assert.match(proof, /function localMathProviderChunks/);
assert.match(proof, /MathJaxRouteProvider-/);
assert.match(proof, /toEqual\(\[\]\)/);
assert.match(proof, /toBeGreaterThan\(0\)/);
assert.match(proof, /\$x = 2\$/);

console.log("Startup performance audit passed (23 assertions).");
