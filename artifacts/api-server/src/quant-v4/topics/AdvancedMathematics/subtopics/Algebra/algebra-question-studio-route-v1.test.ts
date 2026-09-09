import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-algebra.ts"), "utf8");
const routeIndexSource = readFileSync(resolve(process.cwd(), "src/routes/index.ts"), "utf8");
const adminApiSource = readFileSync(resolve(process.cwd(), "../admin-app/src/features/question-studio/algebra-review-api.ts"), "utf8");
const adminPanelSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioAlgebraReviewPanel.tsx"), "utf8");
const operationsSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");

const requiredRoutes = [
  ["GET", "/quant/algebra/package"],
  ["GET", "/quant/algebra/preview"],
  ["POST", "/quant/algebra/runs"],
  ["GET", "/quant/algebra/status"],
] as const;

for (const [method, path] of requiredRoutes) {
  const declaration = `router.${method.toLowerCase()}(\"${path}\"`;
  assert.ok(routeSource.includes(declaration), `Missing Algebra Question Studio route: ${method} ${path}`);
  assert.ok(adminApiSource.includes(`/admin/question-studio${path}`), `Algebra admin client is missing /admin/question-studio${path}`);
}

const declaredAlgebraRoutes = [...routeSource.matchAll(/router\.(get|post|put|patch|delete)\(\"(\/quant\/algebra\/[^\"]+)\"/g)]
  .map((match) => `${match[1]!.toUpperCase()} ${match[2]!}`);
assert.equal(declaredAlgebraRoutes.length, 4, `Expected exactly four Algebra Question Studio routes, found ${declaredAlgebraRoutes.length}: ${declaredAlgebraRoutes.join(", ")}`);
assert.equal(
  declaredAlgebraRoutes.some((route) => /publish|question-bank|mock|test/i.test(route)),
  false,
  "Algebra must use the shared approval/converter path instead of chapter-specific downstream routes",
);

assert.ok(routeIndexSource.includes('import adminQuestionStudioAlgebraRouter from "./admin-question-studio-algebra";'));
assert.ok(routeIndexSource.includes('router.use("/admin/question-studio", adminQuestionStudioAlgebraRouter);'));

for (const fragment of [
  "ALGEBRA_QUESTION_STUDIO_DELIVERY_V5_AUTHORITY",
  "generateAlgebraStudioBatchV5",
  "ALGEBRA_QUESTION_BANK_ACTIVATION_V1_AUTHORITY",
  "buildAlgebraBankOnlyReviewPayload",
  'questionBankStatus: "READY_FOR_STORAGE"',
  "questionBankWritable: true",
  'questionBankAcceptanceMode: "BANK_ONLY"',
  "manualApprovalRequired: true",
  "testEligible: false",
  "mockTestEligible: false",
  "publiclyPublishable: false",
  "productionReleaseAuthorized: false",
] as const) {
  assert.ok(routeSource.includes(fragment), `Algebra BANK_ONLY route contract missing: ${fragment}`);
}

assert.equal(routeSource.includes("convertApprovedGenerationItem"), false, "Algebra route must not own Question Bank conversion");
assert.equal(routeSource.includes("INSERT INTO content.questions"), false, "Algebra route must not write canonical Question Bank rows directly");
assert.equal(routeSource.includes("INSERT INTO content.question_versions"), false, "Algebra route must not write Question Bank versions directly");
assert.ok(routeSource.includes("INSERT INTO content.generation_runs"));
assert.ok(routeSource.includes("INSERT INTO content.generation_run_items"));
assert.ok(routeSource.includes("INSERT INTO content.generation_item_versions"));
assert.ok(routeSource.includes("bankReadyItemCount"));

for (const apiFunction of [
  "getAlgebraReviewPackage",
  "previewAlgebraReview",
  "createAlgebraReviewRun",
  "getAlgebraReviewStatus",
] as const) {
  assert.ok(adminApiSource.includes(`function ${apiFunction}`), `Algebra admin API client is missing ${apiFunction}`);
}

for (const panelFragment of [
  "QuestionStudioAlgebraReviewPanel",
  "Permanent QL",
  "Prototype",
  "Exam profile",
  "Create review run",
  "BANK_ONLY",
] as const) {
  assert.ok(adminPanelSource.includes(panelFragment), `Algebra Question Studio panel is missing UI contract: ${panelFragment}`);
}

assert.ok(operationsSource.includes("import { QuestionStudioAlgebraReviewPanel } from './QuestionStudioAlgebraReviewPanel';"));
assert.ok(operationsSource.includes("<QuestionStudioAlgebraReviewPanel />"));

console.log("PASS_ALGEBRA_QUESTION_STUDIO_ROUTE_V5_BANK_ONLY", {
  routes: declaredAlgebraRoutes,
  deliveryAuthority: "ALGEBRA-FROZEN-QUESTION-STUDIO-DELIVERY-V5-CENTRAL-OPTION-CONTRACT",
  lifecycle: "QUESTION-STUDIO-STANDARD-BANK-ONLY-V1",
  manualApprovalRequired: true,
  directQuestionBankRoute: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
});
