import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const converter = readFileSync(resolve(root, "src/lib/admin-question-conversion.ts"), "utf8");
const testsRoute = readFileSync(resolve(root, "src/routes/admin-tests.ts"), "utf8");
const seriesLib = readFileSync(resolve(root, "src/lib/admin-test-series.ts"), "utf8");
const adminClient = readFileSync(resolve(root, "../admin-app/src/features/question-studio/data-sufficiency-review-api.ts"), "utf8");
const adminPanel = readFileSync(resolve(root, "../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx"), "utf8");

const routes = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(routes.length, 4, "CP-006 must not add a parallel DSF mock endpoint");
assert.ok(route.includes('activationMode: "MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED"'));
assert.ok(route.includes('mockTestReleaseCheckpointId: DSF_CP006_CHECKPOINT_ID'));
assert.ok(route.includes('mockTestReleaseAuthority: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY'));
assert.ok(route.includes('export function dsfCp006ReviewPayload'));
assert.ok(route.includes('export function dsfCp009LocalizedReleasePayload'));
assert.ok(route.includes('mockTestEligible: true as const'));
assert.ok(route.includes('automaticStudentPublication: false as const'));
assert.ok(route.includes('export function dsfCp005ReviewPayload'));

const cp005Start = route.indexOf('export function dsfCp005ReviewPayload');
const cp006Start = route.indexOf('export function dsfCp006ReviewPayload');
assert.ok(route.slice(cp005Start, cp006Start).includes('mockTestEligible: false as const'));
assert.ok(!route.includes('/reasoning/data-sufficiency/mock'));
assert.ok(!route.includes('/reasoning/data-sufficiency/publish'));

assert.ok(converter.includes('mockTestEligible: lifecycleValue(payload, generationContext, "mockTestEligible")'));
assert.ok(testsRoute.includes('String(row.status) !== "published"'));
assert.ok(testsRoute.includes('code: "QUESTION_NOT_PUBLISHED"'));
assert.ok(seriesLib.includes('["qa_approved", "scheduled", "live", "completed"].includes(status)'));
assert.ok(seriesLib.includes('test(s) are not QA approved or released'));

assert.ok(adminClient.includes("activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED'"));
assert.ok(adminClient.includes("mockTestReleaseCheckpointId: 'DSF-CP-006'"));
assert.ok(adminClient.includes('mockTestEligible: true'));
assert.ok(adminClient.includes('automaticStudentPublication: false'));
assert.ok(adminPanel.includes('CP-006 enables mock-test eligibility'));
assert.ok(adminPanel.includes('test-series QA/release before mock delivery'));
assert.ok(adminPanel.includes('Automatic student publication remains OFF'));
assert.ok(adminPanel.includes('Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP006_ROUTE_MOCK_LIFECYCLE_CONTRACT",
  dsfStudioRoutes: 4,
  canonicalPublishedQuestionRequired: true,
  canonicalTestValidationRequired: true,
  canonicalSeriesQaOrReleaseRequired: true,
  parallelDsfMockRouteAdded: false,
  legacyCp005MockIneligiblePayloadPreserved: true,
  laterCp009MultilingualOverlayAllowed: true,
  mockTestEligible: true,
  automaticStudentPublication: false,
}, null, 2));
