import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const route = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const converter = readFileSync(resolve(root, "src/lib/admin-question-conversion.ts"), "utf8");
const publishRoute = readFileSync(resolve(root, "src/routes/admin-question-lifecycle-hardening.ts"), "utf8");
const testsRoute = readFileSync(resolve(root, "src/routes/admin-tests.ts"), "utf8");

const dsfRouteMatches = [...route.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(dsfRouteMatches.length, 4, "DSF must keep exactly four Question Studio routes");
assert.ok(route.includes('activationMode: "MANUAL_TEST_RELEASE_ENABLED"'));
assert.ok(route.includes('questionBankAcceptanceMode: "FULL_RELEASE"'));
assert.ok(route.includes('testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID'));
assert.ok(route.includes('testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY'));
assert.ok(route.includes('testEligible: true'));
assert.ok(route.includes('publiclyPublishable: true'));
assert.ok(route.includes('mockTestEligible: false'));
assert.ok(route.includes('automaticStudentPublication: false'));
assert.ok(route.includes('export function dsfCp004ReviewPayload'));
assert.ok(route.includes('questionBankAcceptanceMode: "BANK_ONLY" as const'));
assert.ok(route.includes('export function dsfCp005ReviewPayload'));

assert.ok(converter.includes('getGeneratedQuestionBankAcceptanceMode'));
assert.ok(converter.includes('if (acceptanceMode === "BANK_ONLY") return null'));
assert.ok(converter.includes('testEligibility === "INELIGIBLE"'));
assert.ok(converter.includes('publiclyPublishable === false'));
assert.ok(converter.includes('accepted_question_id'));

assert.ok(publishRoute.includes("generationTestEligible === false"));
assert.ok(publishRoute.includes("generationPubliclyPublishable === false"));
assert.ok(publishRoute.includes("status = 'published'::question_status"));
assert.ok(publishRoute.includes("published_version_id = approved_version_id"));

assert.ok(testsRoute.includes('String(row.status) !== "published"'));
assert.ok(testsRoute.includes('String(row.publishedVersionId ?? "") !== questionVersionId'));
assert.ok(testsRoute.includes('code: "QUESTION_NOT_PUBLISHED"'));

assert.ok(!route.includes('/reasoning/data-sufficiency/publish'));
assert.ok(!route.includes('/reasoning/data-sufficiency/test'));
assert.ok(!route.includes('/reasoning/data-sufficiency/mock'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP005_ROUTE_LIFECYCLE_CONTRACT",
  dsfStudioRoutes: 4,
  canonicalQuestionBankConverterReused: true,
  manualQuestionPublishGateReused: true,
  canonicalTestSelectionRequiresPublishedVersion: true,
  legacyCp004BankOnlyPayloadPreserved: true,
  parallelDsfPublishRouteAdded: false,
  parallelDsfTestRouteAdded: false,
  mockTestEligible: false,
  automaticStudentPublication: false,
}, null, 2));
