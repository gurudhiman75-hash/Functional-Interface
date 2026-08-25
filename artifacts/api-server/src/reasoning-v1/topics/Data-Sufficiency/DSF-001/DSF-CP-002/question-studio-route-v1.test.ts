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
  assert(adminApiSource.includes(`/admin/question-studio${path}`), `Data Sufficiency admin client is missing ${path}`);
}
const declaredRoutes = [...routeSource.matchAll(/router\.(get|post|put|patch|delete)\(\"(\/reasoning\/data-sufficiency\/[^\"]+)\"/g)]
  .map((match) => `${match[1]!.toUpperCase()} ${match[2]!}`);
assert(declaredRoutes.length === 4, `Expected exactly four Data Sufficiency Studio routes, found ${declaredRoutes.length}`);
assert(!declaredRoutes.some((route) => /publish|question-bank|mock|test/i.test(route)), "Parallel DSF downstream route leaked into Question Studio");
assert(routeIndexSource.includes('router.use("/admin/question-studio", adminQuestionStudioDataSufficiencyRouter);'), "DSF router mount missing");

for (const lifecycleFragment of [
  "questionStudioDiscoverable: true", "persistenceAllowed: true", "reviewOnly: true",
  "questionBankWritable: false", "testEligible: false", "mockTestEligible: false", "publiclyPublishable: false",
] as const) {
  assert(integrationRuntime.includes(lifecycleFragment), `CP-002 runtime lost source lifecycle contract: ${lifecycleFragment}`);
}

for (const overlay of [
  "DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY",
  "DSF_CP005_TEST_RELEASE_AUTHORITY",
  "DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY",
  "DSF_CP008_LOCALIZATION_AUTHORITY",
  "DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY",
  "dsfCp004ReviewPayload",
  "dsfCp005ReviewPayload",
  "dsfCp006ReviewPayload",
  "dsfCp008LocalizedReviewPayload",
  "dsfCp009LocalizedReleasePayload",
] as const) assert(routeSource.includes(overlay), `Later lifecycle overlay missing: ${overlay}`);
assert(routeSource.includes('questionBankAcceptanceMode: "BANK_ONLY"'), "CP-004 BANK_ONLY contract not preserved");
assert(routeSource.includes('questionBankAcceptanceMode: "FULL_RELEASE"'), "CP-005/006/009 FULL_RELEASE contract missing");
assert(routeSource.includes('mockTestEligible: true'), "CP-006/009 mock eligibility missing");
assert(routeSource.includes('automaticStudentPublication: false'), "Automatic student publication must stay disabled");

assert(sourceFreeze.includes('status: "FROZEN"'), "DSF CP-001 source is not frozen");
assert(sourceFreeze.includes('questionStudioDiscoverable: false'), "DSF CP-001 source lifecycle was reopened");
assert(integrationRuntime.includes('DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1'), "CP-002 authority missing");
assert(integrationRuntime.includes('GENERIC_DS_STANDARD_5_EN'), "CP-002 generic answer profile missing");
assert(integrationRuntime.includes('examSpecificAnswerProfilesImplemented: false'), "CP-002 source boundary mutated");
assert(integrationRuntime.includes('permanentQlIds: ["DSF-QL-001"]'), "CP-002 permanent QL changed");
assert(integrationRuntime.includes('nextAvailableQlId: "DSF-QL-002"'), "CP-002 next QL changed");

for (const apiFunction of ["getDsfReviewPackage", "previewDsfReview", "createDsfReviewRun", "getDsfReviewStatus"] as const) {
  assert(adminApiSource.includes(`function ${apiFunction}`), `Admin API missing ${apiFunction}`);
}
for (const panelFragment of [
  "QuestionStudioDataSufficiencyReviewPanel", "Answer profile", "Source domain", "Solve mode", "Sufficiency class",
  "Create review run", "CP-006 enables mock-test eligibility", "Banking + SSC", "Punjab-specific answer-profile rendering remains disabled",
  "test-series QA/release before mock delivery", "Automatic student publication remains OFF",
  "CP-009 multilingual production release", "English + Hindi + Punjabi production",
] as const) {
  assert(adminPanelSource.includes(panelFragment), `Data Sufficiency panel is missing UI contract: ${panelFragment}`);
}
assert(operationsSource.includes("<QuestionStudioDataSufficiencyReviewPanel />"), "DSF panel not mounted");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_002_QUESTION_STUDIO_ROUTE_CONTRACT",
  routes: declaredRoutes,
  sourceCheckpoint: "DSF-CP-001/FROZEN",
  integrationCheckpoint: "DSF-CP-002",
  permanentQl: "DSF-QL-001",
  cp002SourceReviewOnly: true,
  laterProfileCheckpointAllowed: "DSF-CP-003",
  laterQuestionBankCheckpointAllowed: "DSF-CP-004",
  laterTestReleaseCheckpointAllowed: "DSF-CP-005",
  laterMockReleaseCheckpointAllowed: "DSF-CP-006",
  laterLocalizationCheckpointAllowed: "DSF-CP-008",
  laterLocalizationApprovalCheckpointAllowed: "DSF-CP-009",
  cp008LearnerTextOverlayOnly: true,
  legacyCp004BankOnlyPayloadPreserved: true,
  legacyCp005MockIneligiblePayloadPreserved: true,
  automaticStudentDeliveryLocked: true,
}, null, 2));
