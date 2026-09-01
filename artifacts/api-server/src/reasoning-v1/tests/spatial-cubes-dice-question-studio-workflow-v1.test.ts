import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { listQuestionStudioPackages } from "../../question-studio/shared-generation-engine-sri";

const cwd = process.cwd();
const packageId = "SPA-001-CND-001-REVIEW";
const qlIds = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"];

const packages = listQuestionStudioPackages() as Array<Record<string, unknown>>;
const cnd = packages.find((entry) => String(entry.packageId) === packageId);
assert.ok(cnd, "CND-001 must be discoverable in shared Question Studio capabilities.");
assert.equal(cnd.enabled, true);
assert.equal(cnd.topic, "Reasoning");
assert.equal(cnd.subtopic, "Cubes & Dice");
assert.equal(cnd.questionStudioDiscoverable, true);
assert.equal(cnd.questionStudioGenerationEnabled, true);
assert.equal(cnd.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(cnd.questionBankWritable, true);
assert.equal(cnd.testEligibility, "ELIGIBLE");
assert.equal(cnd.testEligible, true);
assert.equal(cnd.testBuilderEligible, true);
assert.equal(cnd.mockTestEligible, false);
assert.equal(cnd.publicReleaseAuthorized, false);
assert.equal(cnd.studentDeliveryAuthorized, false);
assert.equal(cnd.automaticStudentPublication, false);
assert.deepEqual([...(cnd.cpIds as readonly string[])], qlIds);
assert.deepEqual([...(cnd.supportedLanguages as readonly string[])], ["en", "hi", "pa"]);

const registry = readFileSync(resolve(cwd, "src/routes/admin-question-studio-registry.ts"), "utf8");
const workflowRoute = readFileSync(resolve(cwd, "src/routes/admin-question-studio-cubes-dice-workflow.ts"), "utf8");
const cndRoute = readFileSync(resolve(cwd, "src/routes/admin-question-studio-cubes-dice.ts"), "utf8");
const sharedRoute = readFileSync(resolve(cwd, "src/routes/admin-question-studio.ts"), "utf8");
const sharedApi = readFileSync(resolve(cwd, "../admin-app/src/features/question-studio/api.ts"), "utf8");
const cndApi = readFileSync(resolve(cwd, "../admin-app/src/features/question-studio/cubes-dice-review-api.ts"), "utf8");
const livePage = readFileSync(resolve(cwd, "../admin-app/src/pages/content/QuestionStudioLivePage.tsx"), "utf8");
const operationsPage = readFileSync(resolve(cwd, "../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");

assert.ok(registry.includes('import adminQuestionStudioCubesDiceWorkflowRouter from "./admin-question-studio-cubes-dice-workflow"'));
const workflowIndex = registry.indexOf("router.use(adminQuestionStudioCubesDiceWorkflowRouter)");
const cndIndex = registry.indexOf("router.use(adminQuestionStudioCubesDiceRouter)");
const catchAllIndex = registry.indexOf("router.use(adminQuestionStudioRouter)");
assert.ok(workflowIndex >= 0 && cndIndex > workflowIndex && catchAllIndex > cndIndex,
  "CND shared-run adapter must execute before the chapter router and legacy catch-all generator.");

assert.match(workflowRoute, /router\.post\("\/runs"/);
assert.match(workflowRoute, /SPA-001-CND-001-REVIEW/);
assert.match(workflowRoute, /canonicalProblemId/);
assert.match(workflowRoute, /qlId/);
assert.match(workflowRoute, /SPA-QL-043/);
assert.match(workflowRoute, /SPA-QL-047/);
assert.match(workflowRoute, /reasoning\/spatial\/cubes-dice\/runs/);
assert.match(workflowRoute, /adminQuestionStudioCubesDiceRouter\.handle/);

assert.match(cndRoute, /router\.post\(\s*"\/reasoning\/spatial\/cubes-dice\/runs"/);
assert.match(cndRoute, /generateCubesDiceQuestionStudioTestBuilderBatchV1/);
assert.match(cndRoute, /questionBankAcceptanceMode: ACTIVATION\.questionBankAcceptanceMode/);
assert.match(cndRoute, /testBuilderEligible: true/);
assert.match(cndRoute, /mockTestEligible: false/);
assert.match(cndRoute, /studentDeliveryAuthorized: false/);
assert.match(cndRoute, /automaticStudentPublication: false/);

assert.match(sharedApi, /'\/admin\/question-studio\/runs'/);
assert.match(cndApi, /import \{ createGenerationRun \} from '\.\/api'/);
assert.match(cndApi, /return createGenerationRun\(\{/);
assert.match(cndApi, /packageId: 'SPA-001-CND-001-REVIEW'/);
assert.match(cndApi, /canonicalProblemId: input\.qlId/);
assert.ok(!cndApi.includes("'/admin/question-studio/reasoning/spatial/cubes-dice/runs'"),
  "The CND panel must not bypass the shared Question Studio run client.");

assert.match(livePage, /capabilities\.packages\.filter\(\(entry\) => entry\.enabled\)/);
assert.match(livePage, /packageId: activePackage\.packageId/);
assert.match(livePage, /const result = await generate\(\{/);
assert.match(operationsPage, /<QuestionStudioCubesDiceReviewPanel \/>/);

assert.match(sharedRoute, /router\.get\("\/dashboard"/);
assert.match(sharedRoute, /accepted_question_id AS "acceptedQuestionId"/);
assert.match(sharedRoute, /router\.patch\("\/items\/bulk"/);
assert.match(sharedRoute, /convertApprovedGenerationItem/);

const evidence = {
  status: "PASS_CND_001_SHARED_QUESTION_STUDIO_WORKFLOW_V1",
  packageId,
  permanentQlIds: qlIds,
  languages: ["en", "hi", "pa"],
  sharedCapabilitiesDiscoverable: true,
  canonicalRunsEndpoint: "/admin/question-studio/runs",
  serverSideCndDispatch: true,
  cndPanelUsesSharedClient: true,
  commonDashboardReviewQueue: true,
  commonBulkApprovalConversion: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
};

const evidencePath = resolve(cwd, "dist/reasoning-v1/spatial/cnd-001-question-studio-workflow-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
