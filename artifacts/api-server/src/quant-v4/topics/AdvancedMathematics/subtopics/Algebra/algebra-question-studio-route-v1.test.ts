import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-algebra.ts"), "utf8");
const routeIndexSource = readFileSync(resolve(process.cwd(), "src/routes/index.ts"), "utf8");

const requiredRoutes = [
  ['GET', '/quant/algebra/package'],
  ['GET', '/quant/algebra/preview'],
  ['POST', '/quant/algebra/runs'],
  ['GET', '/quant/algebra/status'],
] as const;

for (const [method, path] of requiredRoutes) {
  const declaration = `router.${method.toLowerCase()}(\"${path}\"`;
  assert(routeSource.includes(declaration), `Missing Algebra Question Studio route: ${method} ${path}`);
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

console.log(`Algebra Question Studio route contract passed: ${declaredAlgebraRoutes.join(', ')}; router registered and downstream gates locked`);
