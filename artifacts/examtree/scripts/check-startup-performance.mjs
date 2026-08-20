import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const app = read("../src/App.tsx");
const mathBoundary = read("../src/components/RouteMathBoundary.tsx");
const mathProvider = read("../src/providers/MathJaxRouteProvider.tsx");
const catalogBoundary = read("../src/components/RouteCatalogBoundary.tsx");
const catalogProvider = read("../src/providers/ExamCatalogProvider.tsx");
const authBoundary = read("../src/components/RouteAuthSessionSync.tsx");
const vite = read("../vite.config.ts");
const proof = read("../../../scripts/e2e/tests/student-startup-performance.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:startup-performance"], "node scripts/check-startup-performance.mjs");
assert.match(pkg.scripts.quality, /audit:startup-performance/);

assert.doesNotMatch(app, /from "better-react-mathjax"/, "application root must not statically import MathJax");
assert.doesNotMatch(app, /<MathJaxContext/, "application root must not globally mount MathJax");
assert.match(app, /<RouteMathBoundary>[\s\S]*?<Router \/>[\s\S]*?<\/RouteMathBoundary>/, "router must be wrapped by the route-scoped math boundary");
assert.match(mathBoundary, /lazy\(\(\) => import\("@\/providers\/MathJaxRouteProvider"\)\)/, "MathJax provider must be dynamically imported");
assert.match(mathBoundary, /location\.startsWith\("\/test\/"\)/, "active test routes must load the math provider");
assert.match(mathBoundary, /location === "\/result"/, "canonical result route must load the math provider");
assert.doesNotMatch(mathBoundary, /location\.startsWith\("\/test-series\/"\)/, "test-series summary routes must not load MathJax unnecessarily");
assert.match(mathBoundary, /Suspense fallback=\{<MathRouteSkeleton \/>\}/, "math provider loading must use a context-safe route skeleton");
assert.match(mathProvider, /MathJaxContext/);
assert.match(mathProvider, /inlineMath/);
assert.match(mathProvider, /displayMath/);
assert.match(mathProvider, /processEscapes: true/);
assert.match(mathProvider, /\[tex\]\/ams/);
assert.doesNotMatch(vite, /mathjax:\s*\[/, "MathJax must not be a manual chunk because Vite preloads manual entry dependencies globally");

assert.doesNotMatch(app, /import \{ ExamCatalogProvider \}/, "application root must not statically import the exam catalog provider");
assert.doesNotMatch(app, /<ExamCatalogProvider>/, "application root must not globally mount the exam catalog provider");
assert.match(app, /import \{ RouteCatalogBoundary \}/, "application router must own the lazy catalog boundary");
assert.match(catalogBoundary, /lazy\(\(\) =>[\s\S]*?import\("@\/providers\/ExamCatalogProvider"\)/, "exam catalog provider must be dynamically imported");
assert.match(catalogBoundary, /Suspense fallback=\{<CatalogRouteSkeleton \/>\}/, "catalog provider loading must use a context-safe route skeleton");
assert.match(catalogProvider, /Promise\.all\(\[[\s\S]*?getCategories\(\)[\s\S]*?getSubcategories\(\)[\s\S]*?getTests\(\)/, "catalog provider must preserve the canonical three-source catalog request");
assert.match(app, /renderCatalogPublicRoute\(Home\)/, "home must retain catalog context");
assert.match(app, /path="\/exams"[\s\S]*?renderCatalogPublicRoute\(Tests\)/, "exam discovery must retain catalog context");
assert.match(app, /path="\/category\/:id"[\s\S]*?renderCatalogPublicRoute\(Category\)/, "category discovery must retain catalog context");
assert.match(app, /path="\/subcategory\/:id"[\s\S]*?renderCatalogPublicRoute\(Subcategory\)/, "subcategory discovery must retain catalog context");
assert.match(app, /path="\/mock-tests"[\s\S]*?renderCatalogPublicRoute\(MockTestsHub\)/, "mock-test hub must retain catalog context");
assert.match(app, /renderAppRoute = [\s\S]*?<RouteCatalogBoundary><AppLayout>/, "preparation chrome must retain catalog context");
assert.match(app, /<RouteCatalogBoundary>[\s\S]*?layout === "none"/, "protected runner routes must retain catalog context without app chrome");

assert.doesNotMatch(app, /import \{ syncAuthSession \}/, "application root must not statically import Firebase-backed auth synchronization");
assert.match(app, /<RouteAuthSessionSync \/>/, "router must mount route-aware auth synchronization");
assert.match(authBoundary, /import\("@\/lib\/auth"\)/, "auth synchronization must dynamically import the Firebase-backed auth module");
assert.match(authBoundary, /location === "\/dashboard"/, "dashboard must retain active-session synchronization");
assert.match(authBoundary, /location\.startsWith\("\/test\/"\)/, "active tests must retain revocation synchronization");
assert.match(authBoundary, /location === "\/result"/, "canonical result must retain auth synchronization");
assert.doesNotMatch(authBoundary, /\/about/, "anonymous information routes must not trigger Firebase session synchronization");
assert.doesNotMatch(authBoundary, /\/contact/, "contact must not trigger Firebase session synchronization");
assert.doesNotMatch(authBoundary, /\/privacy-policy/, "legal information routes must not trigger Firebase session synchronization");

assert.match(proof, /anonymous information pages download neither MathJax Firebase nor the exam catalog/);
assert.match(proof, /exam discovery loads the catalog on demand without loading Firebase auth/);
assert.match(proof, /student login loads Firebase on demand without waking the exam catalog/);
assert.match(proof, /saved question review loads the isolated MathJax bundle on demand/);
assert.match(proof, /function localMathProviderChunks/);
assert.match(proof, /function localCatalogProviderChunks/);
assert.match(proof, /function localFirebaseChunks/);
assert.match(proof, /MathJaxRouteProvider-/);
assert.match(proof, /ExamCatalogProvider-/);
assert.match(proof, /firebase-/);
assert.match(proof, /counts\)\.toEqual\(\{ categories: 0, subcategories: 0, tests: 0 \}\)/, "anonymous and login proofs must reject eager catalog API requests");
assert.match(proof, /counts\.categories\)\.toBeGreaterThan\(0\)/, "exam discovery proof must observe category loading on demand");
assert.match(proof, /counts\.subcategories\)\.toBeGreaterThan\(0\)/, "exam discovery proof must observe subcategory loading on demand");
assert.match(proof, /counts\.tests\)\.toBeGreaterThan\(0\)/, "exam discovery proof must observe test loading on demand");
assert.match(proof, /localFirebaseChunks\(page\)\)\.toEqual\(\[\]\)/, "anonymous/catalog routes must prove Firebase is absent");
assert.match(proof, /localFirebaseChunks\(page\)\)\.length\)\.toBeGreaterThan\(0\)/, "login must prove Firebase loads on demand");
assert.match(proof, /localCatalogProviderChunks\(page\)\)\.length\)\.toBeGreaterThan\(0\)/, "catalog route must prove provider chunk loads on demand");
assert.match(proof, /\$x = 2\$/);

console.log("Startup performance audit passed (52 assertions).");
