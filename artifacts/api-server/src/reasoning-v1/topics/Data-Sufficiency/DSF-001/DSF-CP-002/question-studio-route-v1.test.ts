import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const routeIndexSource = readFileSync(resolve(process.cwd(), "src/routes/index.ts"), "utf8");
const adminApiSource = readFileSync(resolve(process.cwd(), "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const adminPanelSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");
const operationsSource = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");
const sourceFreeze = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-001/cp001-freeze-authority.ts"), "utf8");
const integrationRuntime = readFileSync(resolve(process.cwd(), "src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1.ts"), "utf8");

const requiredRoutes = [
  ["GET", "/reasoning/data-sufficiency/package"],
  ["GET", "/reasoning/data-sufficiency/preview"],
  ["POST", "/reasoning/data-sufficiency/runs"],
  ["GET", "/reasoning/data-sufficiency/status"],
] as const;

for (const [method, path] of requiredRoutes) {
  const declaration = `router.${method.toLowerCase()}(\"${path}\"`;
  assert(routeSource.includes(declaration), `Missing Data Sufficiency Question Studio route: ${method} ${path}`);
  const adminPath = `/admin/question-studio${path}`;
  assert(adminApiSource.includes(adminPath), `Data Sufficiency admin client is missing ${adminPath}`);
}

const declaredRoutes = [...routeSource.matchAll(/router\.(get|post|put|patch|delete)\(\"(\/reasoning\/data-sufficiency\/[^\"]+)\"/g)]
  .map((match) => `${match[1]!.toUpperCase()} ${match[2]!}`);
assert(declaredRoutes.length === 4, `Expected exactly four Data Sufficiency Studio routes, found ${declaredRoutes.length}: ${declaredRoutes.join(", ")}`);
assert(
  !declaredRoutes.some((route) => /publish|question-bank|mock|test/i.test(route)),
  "A parallel downstream publication/Question Bank/test route leaked into the DSF Question Studio integration",
);

assert(
  routeIndexSource.includes('import adminQuestionStudioDataSufficiencyRouter from "./admin-question-studio-data-sufficiency";'),
  "Data Sufficiency Question Studio router import is missing from routes/index.ts",
);
assert(
  routeIndexSource.includes('router.use("/admin/question-studio", adminQuestionStudioDataSufficiencyRouter);'),
  "Data Sufficiency Question Studio router is not registered under /admin/question-studio",
);

// CP-002 remains frozen as a review-only source integration. Later checkpoints may
// overlay delivery/profile/lifecycle behavior in the route without mutating this source authority.
for (const lifecycleFragment of [
  "questionStudioDiscoverable: true",
  "persistenceAllowed: true",
  "reviewOnly: true",
  "questionBankWritable: false",
  "testEligible: false",
  "mockTestEligible: false",
  "publiclyPublishable: false",
] as const) {
  assert(integrationRuntime.includes(lifecycleFragment), `Data Sufficiency CP-002 runtime lost lifecycle contract: ${lifecycleFragment}`);
}

assert(routeSource.includes("DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY"), "Later CP-004 lifecycle overlay is not explicit in DSF route");
assert(routeSource.includes('questionBankAcceptanceMode: "BANK_ONLY"'), "CP-004 route does not keep Question Bank acceptance staged");
for (const downstreamLock of ["testEligible: false", "mockTestEligible: false", "publiclyPublishable: false"] as const) {
  assert(routeSource.includes(downstreamLock), `Later route overlay lost downstream lock ${downstreamLock}`);
}

assert(sourceFreeze.includes('status: "FROZEN"'), "DSF CP-001 source is not frozen");
assert(sourceFreeze.includes('questionStudioDiscoverable: false'), "DSF CP-001 source lifecycle was improperly reopened");
assert(integrationRuntime.includes('DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1'), "CP-002 integration authority is missing");
assert(integrationRuntime.includes('GENERIC_DS_STANDARD_5_EN'), "Frozen generic five-option answer profile is missing");
assert(integrationRuntime.includes('examSpecificAnswerProfilesImplemented: false'), "CP-002 source boundary is no longer explicit");
assert(integrationRuntime.includes('permanentQlIds: ["DSF-QL-001"]'), "CP-002 does not preserve the single permanent QL");
assert(integrationRuntime.includes('nextAvailableQlId: "DSF-QL-002"'), "CP-002 changed the next available permanent QL ID");

for (const apiFunction of [
  "getDsfReviewPackage",
  "previewDsfReview",
  "createDsfReviewRun",
  "getDsfReviewStatus",
] as const) {
  assert(adminApiSource.includes(`function ${apiFunction}`), `Data Sufficiency admin API client is missing ${apiFunction}`);
}

for (const panelFragment of [
  "QuestionStudioDataSufficiencyReviewPanel",
  "Answer profile",
  "Source domain",
  "Solve mode",
  "Sufficiency class",
  "Create review run",
  "CP-003 profiles",
  "CP-004 Question Bank",
  "Punjab-specific rendering remains disabled",
  "Scored tests locked",
  "Publication locked",
] as const) {
  assert(adminPanelSource.includes(panelFragment), `Data Sufficiency panel is missing UI contract: ${panelFragment}`);
}

assert(
  operationsSource.includes("import { QuestionStudioDataSufficiencyReviewPanel } from './QuestionStudioDataSufficiencyReviewPanel';"),
  "Data Sufficiency panel import is missing from Operations page",
);
assert(
  operationsSource.includes("<QuestionStudioDataSufficiencyReviewPanel />"),
  "Data Sufficiency panel is not mounted in Operations page",
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_002_QUESTION_STUDIO_ROUTE_CONTRACT",
  routes: declaredRoutes,
  sourceCheckpoint: "DSF-CP-001/FROZEN",
  integrationCheckpoint: "DSF-CP-002",
  permanentQl: "DSF-QL-001",
  cp002SourceAnswerProfile: "GENERIC_DS_STANDARD_5_EN",
  laterProfileCheckpointAllowed: "DSF-CP-003",
  laterLifecycleCheckpointAllowed: "DSF-CP-004",
  cp002SourceReviewOnly: true,
  routeQuestionBankAcceptanceMode: "BANK_ONLY",
  testMockPublicationLocked: true,
}, null, 2));
