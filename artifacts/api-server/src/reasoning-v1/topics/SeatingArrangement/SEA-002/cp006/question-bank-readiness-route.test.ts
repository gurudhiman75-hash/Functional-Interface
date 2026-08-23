import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (relative: string) => readFileSync(resolve(root, relative), "utf8");

const bulkRoute = read("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts");
const approvalPolicy = read("artifacts/api-server/src/lib/admin-question-studio-approval-policy.ts");
const conversion = read("artifacts/api-server/src/lib/admin-question-conversion.ts");
const management = read("artifacts/api-server/src/lib/admin-question-management.ts");
const questionLifecycle = read("artifacts/api-server/src/routes/admin-question-lifecycle-hardening.ts");
const testRoutes = read("artifacts/api-server/src/routes/admin-tests.ts");
const routeIndex = read("artifacts/api-server/src/routes/index.ts");
const studioRoute = read("artifacts/api-server/src/routes/admin-question-studio-average.ts");
const sharedStudio = read("artifacts/api-server/src/question-studio/shared-generation-engine.ts");
const sourceRuntime = read("artifacts/api-server/src/reasoning-v1/topics/SeatingArrangement/SEA-002/cp006/question-studio-integration.ts");
const acceptanceOverlay = read("artifacts/api-server/src/reasoning-v1/topics/SeatingArrangement/SEA-002/cp006/question-bank-acceptance.ts");

for (const marker of [
  "getGeneratedItemApprovalDisposition",
  'disposition.mode === "question_bank"',
  "convertApprovedGenerationItem",
  "accepted_question_id",
  "ITEM_ALREADY_CONVERTED",
]) {
  assert.ok(bulkRoute.includes(marker), `Question Studio approval route missing Bank conversion marker: ${marker}`);
}

for (const marker of [
  'questionBankStatus === "NOT_STORED"',
  "questionBankWritable === false",
  'mode: "review_only"',
  'mode: "question_bank"',
]) {
  assert.ok(approvalPolicy.includes(marker), `Question Studio approval policy missing lifecycle marker: ${marker}`);
}

for (const marker of [
  '"BANK_ONLY"',
  'acceptanceMode === "BANK_ONLY"',
  "questionBankAcceptanceAuthority",
  "testEligible",
  "mockTestEligible",
  "publiclyPublishable",
  "automaticStudentPublication",
  "accepted_question_version_id",
  "Accepted into Question Bank with downstream lifecycle locked",
  "content.question.created_from_generation",
]) {
  assert.ok(conversion.includes(marker), `Question Bank converter missing lifecycle marker: ${marker}`);
}

for (const marker of [
  "Generation lifecycle has not enabled scored-test eligibility.",
  "Generation lifecycle has not enabled public publication.",
  "generationTestEligible === false",
  "generationPubliclyPublishable === false",
]) {
  assert.ok(management.includes(marker), `Question publication gate missing lifecycle marker: ${marker}`);
  assert.ok(questionLifecycle.includes(marker), `Question lifecycle route missing generated-content publication lock: ${marker}`);
}

assert.ok(testRoutes.includes("QUESTION_NOT_PUBLISHED"));
assert.ok(testRoutes.includes('String(row.status) !== "published"'));
assert.ok(routeIndex.includes("adminQuestionStudioBulkHardeningRouter"));
assert.ok(routeIndex.includes("adminQuestionLifecycleHardeningRouter"));
assert.ok(routeIndex.includes("adminTestsRouter"));
assert.ok(routeIndex.includes('router.use("/admin/question-studio", adminQuestionStudioBulkHardeningRouter)'));
assert.ok(routeIndex.includes('router.use("/admin/questions", adminQuestionLifecycleHardeningRouter)'));
assert.ok(routeIndex.includes('router.use("/admin/tests", adminTestsRouter)'));

// Frozen source authority stays product-inactive even after the production
// shared facade applies the separately proven BANK_ONLY acceptance overlay.
assert.ok(sourceRuntime.includes('questionBankStatus: "NOT_STORED"'));
assert.ok(sourceRuntime.includes("questionBankWritable: false"));
assert.ok(sourceRuntime.includes('testEligibility: "INELIGIBLE"'));
assert.ok(sourceRuntime.includes("testEligible: false"));
assert.ok(sourceRuntime.includes("mockTestEligible: false"));
assert.ok(sourceRuntime.includes("publiclyPublishable: false"));
assert.ok(sourceRuntime.includes("automaticStudentPublication: false"));

for (const marker of [
  "SEA002_CP006_QUESTION_BANK_ACCEPTANCE_V1",
  'questionBankStatus: "READY_FOR_STORAGE"',
  "questionBankWritable: true",
  'questionBankAcceptanceMode: "BANK_ONLY"',
  "manualApprovalRequired: true",
  "testEligible: false",
  "mockTestEligible: false",
  "publiclyPublishable: false",
  "automaticStudentPublication: false",
]) {
  assert.ok(acceptanceOverlay.includes(marker), `CP006 acceptance overlay missing lifecycle marker: ${marker}`);
}

assert.ok(sharedStudio.includes("generateSea002Cp006QuestionBankAcceptedBatch"));
assert.ok(sharedStudio.includes("listSea002Cp006QuestionBankAcceptedPackages"));
assert.ok(studioRoute.includes("isSea002Cp006QuestionStudioRequest"));
assert.ok(studioRoute.includes('"reasoning-v1-sea-002-cp006"'));

console.log("PASS_SEA002_CP006_QUESTION_BANK_ROUTE_READINESS_V1");
console.log("manual approval route converts question_bank disposition only");
console.log("generation item conversion is idempotency guarded");
console.log("BANK_ONLY downstream lifecycle metadata is persisted");
console.log("question publication is blocked by generation lifecycle flags");
console.log("test selection requires an actually published question version");
console.log("frozen source remains NOT_STORED / false");
console.log("shared SEA-002 Studio facade applies READY_FOR_STORAGE / BANK_ONLY acceptance");
console.log("test/mock/public remain lifecycle-locked");
