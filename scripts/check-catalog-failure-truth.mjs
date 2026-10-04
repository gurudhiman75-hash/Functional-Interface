import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const provider = read("../src/providers/ExamCatalogProvider.tsx");
const boundary = read("../src/components/RouteCatalogBoundary.tsx");
const appLayout = read("../src/components/AppLayout.tsx");
const mockTests = read("../src/pages/mock-tests.tsx");
const proof = read("../../../scripts/e2e/tests/student-catalog-failure-truth.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:catalog-failure-truth"], "node scripts/check-catalog-failure-truth.mjs");
assert.match(pkg.scripts.quality, /audit:catalog-failure-truth/);

assert.match(provider, /retryCatalog: \(\) => Promise<void>/);
assert.match(provider, /isRetrying: boolean/);
assert.match(provider, /retryCatalog: async \(\) => \{\}/);
assert.match(provider, /const retryCatalog = useCallback\(async \(\) => \{[\s\S]*?await examCatalogQuery\.refetch\(\)/);
assert.match(provider, /examCatalogQuery\.data === undefined[\s\S]*?examCatalogQuery\.error/);
assert.match(provider, /isRetrying: examCatalogQuery\.isFetching && !examCatalogQuery\.isLoading/);
assert.match(provider, /error: fatalError,[\s\S]*?retryCatalog/);
assert.match(provider, /export function ExamCatalogRouteProvider/);
assert.match(provider, /function CatalogAvailabilityGate/);
assert.match(provider, /if \(requireCatalog && error\) return <CatalogFailureState \/>/);
assert.match(provider, /data-testid="catalog-unavailable"/);
assert.match(provider, /Retry catalog/);
assert.match(provider, /Your saved attempts are safe/);

assert.match(boundary, /import \{ useLocation \} from "wouter"/);
assert.match(boundary, /module\.ExamCatalogRouteProvider/);
assert.match(boundary, /function routeRequiresCatalogTruth\(location: string\)/);
assert.match(boundary, /pathname === "\/"/);
assert.match(boundary, /pathname === "\/exams"/);
assert.match(boundary, /pathname === "\/tests"/);
assert.match(boundary, /pathname === "\/mock-tests"/);
assert.match(boundary, /pathname\.startsWith\("\/category\/"\)/);
assert.match(boundary, /pathname\.startsWith\("\/subcategory\/"\)/);
assert.match(boundary, /requireCatalog=\{routeRequiresCatalogTruth\(location\)\}/);

assert.match(appLayout, /import \{ useExamCatalog \} from "@\/providers\/ExamCatalogProvider"/);
assert.match(appLayout, /const \{ error, retryCatalog, isRetrying \} = useExamCatalog\(\)/);
assert.match(appLayout, /if \(!error\) return <StickyHeader \/>/);
assert.match(appLayout, /data-testid="catalog-recovery-header"/);
assert.match(appLayout, /onClick=\{\(\) => void retryCatalog\(\)\}/);
assert.match(appLayout, /Catalog temporarily unavailable/);

assert.match(mockTests, /const \{ tests, isLoading \} = useExamCatalog\(\)/);
assert.match(mockTests, /aria-label="Loading mock tests"/);
assert.match(mockTests, /data-testid="mock-tests-empty"/);
assert.match(mockTests, /No mock tests are published yet/);

assert.match(proof, /catalog temporarily unavailable[\s\S]*?503/);
assert.match(proof, /getByTestId\("catalog-unavailable"\)/);
assert.match(proof, /expect\(page\.getByText\("0 published tests", \{ exact: true \}\)\)\.toHaveCount\(0\)/);
assert.match(proof, /getByRole\("button", \{ name: "Retry catalog" \}\)\.click\(\)/);
assert.match(proof, /__catalogRetrySentinel = "preserved"/);
assert.match(proof, /expect\(page\.getByTestId\("home-reference"\)\)\.toBeVisible\(\)/);
assert.match(proof, /getByTestId\("home-category-grid"\)\.getByRole\("button"\)\)\.toHaveCount\(1\)/);
assert.match(proof, /getByTestId\("home-category-grid"\)\)\.toContainText\("SSC"\)/);
assert.match(proof, /getByTestId\("home-category-grid"\)\)\.toContainText\("1\+ tests"\)/);
assert.match(proof, /No mock tests are published yet/);
assert.match(proof, /expect\(page\.getByTestId\("catalog-unavailable"\)\)\.toHaveCount\(0\)/);
assert.match(proof, /state\.requests\)\.toBeGreaterThanOrEqual\(3\)/);

console.log("Catalog failure truth audit passed (47 assertions).");
