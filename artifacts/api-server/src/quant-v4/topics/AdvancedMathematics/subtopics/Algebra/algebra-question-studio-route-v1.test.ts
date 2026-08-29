import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-algebra.ts"), "utf8");
const routeIndexSource = readFileSync(resolve(process.cwd(), "src/routes/index.ts"), "utf8");
const adminApiSource = readFileSync(resolve(process.cwd(), "../admin-app/src/features/question-studio/algebra-review-api.ts"), "utf8");
const adminPanelSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioAlgebraReviewPanel.tsx"), "utf8");
const operationsSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");

const requiredRoutes = [
  ['GET', '/quant/algebra/package'],
  ['GET', '/quant/algebra/preview'],
  ['POST', '/quant/algebra/runs'],
  ['GET', '/quant/algebra/status'],
] as const;

for (const [method, path] of requiredRoutes) {
  const declaration = `router.${method.toLowerCase()}(\"${path}\"`;
  assert(routeSource.includes(declaration), `Missing Algebra Question Studio route: ${method} ${path}`);
  const adminPath = `/admin/question-studio${path}`;
  assert(adminApiSource.includes(adminPath), `Algebra admin client is missing ${adminPath}`);
}

const declaredAlgebraRoutes = [...routeSource.matchAll(/router\.(get|post|put|patch|delete)\(\"(\/quant\/algebra\/[^\"]+)\"/g)]
  .map((match) => `${match[1]!.toUpperCase()} ${match[2]!}`);
assert(declaredAlgebraRoutes.length === 4, `Expected exactly four Algebra Question Studio routes, found ${declaredAlgebraRoutes.length}: ${declaredAlgebraRoutes.join(', ')}`);
assert(
  !declaredAlgebraRoutes.some((route) => /publish|question-bank|mock|test/i.test(route)),
  "Downstream publication/Question Bank/test route leaked into Algebra integration gate",
);

assert(
  routeIndexSource.includes('import adminQuestionStudioAlgebraRouter from "./admin-question-studio-algebra";'),
  "Algebra Question Studio router import is missing from routes/index.ts",
);
assert(
  routeIndexSource.includes('router.use("/admin/question-studio", adminQuestionStudioAlgebraRouter);'),
  "Algebra Question Studio router is not registered under /admin/question-studio",
);

for (const lifecycleFragment of [
  'questionBankWritable: false',
  'testEligible: false',
  'mockTestEligible: false',
  'publiclyPublishable: false',
  'reviewOnly: true',
] as const) {
  assert(routeSource.includes(lifecycleFragment), `Algebra Question Studio route lost lifecycle lock: ${lifecycleFragment}`);
}

assert(routeSource.includes('ALGEBRA_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY'), "Route is not pinned to Algebra delivery V3 authority");
assert(routeSource.includes('generateAlgebraStudioBatchV3'), "Route is not wired to Algebra V3 batch generator");

for (const apiFunction of [
  'getAlgebraReviewPackage',
  'previewAlgebraReview',
  'createAlgebraReviewRun',
  'getAlgebraReviewStatus',
] as const) {
  assert(adminApiSource.includes(`function ${apiFunction}`), `Algebra admin API client is missing ${apiFunction}`);
}

for (const panelFragment of [
  'QuestionStudioAlgebraReviewPanel',
  'Permanent QL',
  'Prototype',
  'Exam profile',
  'Create review run',
  'Question Bank locked',
] as const) {
  assert(adminPanelSource.includes(panelFragment), `Algebra Question Studio panel is missing UI contract: ${panelFragment}`);
}

assert(
  operationsSource.includes("import { QuestionStudioAlgebraReviewPanel } from './QuestionStudioAlgebraReviewPanel';"),
  "Algebra Question Studio panel import is missing from Operations page",
);
assert(
  operationsSource.includes('<QuestionStudioAlgebraReviewPanel />'),
  "Algebra Question Studio panel is not mounted in Operations page",
);

console.log(
  `Algebra Question Studio integration contract passed: ${declaredAlgebraRoutes.join(', ')}; API client, admin panel and Operations mount present; downstream gates locked`,
);
