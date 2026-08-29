import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  DSF_CP004_QUESTION_BANK_ACCEPTANCE,
  DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
} from "./question-bank-acceptance-v1.ts";

const read = (path: string) => readFileSync(path, "utf8");
const dsfRoute = read("src/routes/admin-question-studio-data-sufficiency.ts");
const bulkRoute = read("src/routes/admin-question-studio-bulk-hardening.ts");
const conversion = read("src/lib/admin-question-conversion.ts");
const questionLifecycle = read("src/routes/admin-question-lifecycle-hardening.ts");
const testRoutes = read("src/routes/admin-tests.ts");
const routeIndex = read("src/routes/index.ts");
const cp002Runtime = read("src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1.ts");

assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.questionBank.writable, true);
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.questionBank.acceptanceMode, "BANK_ONLY");
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.testEligible, false);
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.publiclyPublishable, false);

// CP-004 remains a permanent compatibility overlay even after later lifecycle checkpoints.
assert.match(dsfRoute, /export function dsfCp004ReviewPayload/);
assert.match(dsfRoute, /questionBankAcceptanceMode: "BANK_ONLY" as const/);
assert.match(dsfRoute, /testEligibility: "INELIGIBLE" as const/);
assert.match(dsfRoute, /testEligible: false as const/);
assert.match(dsfRoute, /publiclyPublishable: false as const/);
assert.match(dsfRoute, /DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY/);

const laterCp005Overlay = dsfRoute.includes("DSF_CP005_TEST_RELEASE_AUTHORITY");
if (laterCp005Overlay) {
  assert.match(dsfRoute, /export function dsfCp005ReviewPayload/);
  assert.match(dsfRoute, /questionBankAcceptanceMode: "FULL_RELEASE" as const/);
  assert.match(dsfRoute, /testEligible: true as const/);
  assert.match(dsfRoute, /publiclyPublishable: true as const/);
  assert.match(dsfRoute, /mockTestEligible: false as const/);
  assert.match(dsfRoute, /automaticStudentPublication: false as const/);
}

assert.match(dsfRoute, /reasoning\/data-sufficiency\/package/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/preview/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/runs/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/status/);
assert.doesNotMatch(dsfRoute, /reasoning\/data-sufficiency\/(?:publish|test|mock|question-bank)\b/);
const dsfRouteRegistrations = [...dsfRoute.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(dsfRouteRegistrations.length, 4);

assert.match(bulkRoute, /convertApprovedGenerationItem/);
assert.match(conversion, /acceptanceMode === "BANK_ONLY"/);
assert.match(conversion, /questionBankAcceptanceAuthority/);
assert.match(conversion, /testEligible/);
assert.match(conversion, /publiclyPublishable/);
assert.match(questionLifecycle, /generationPubliclyPublishable/);
assert.match(questionLifecycle, /generationTestEligible/);
assert.match(testRoutes, /QUESTION_NOT_PUBLISHED/);
assert.match(testRoutes, /String\(row\.status\) !== "published"/);

assert.match(routeIndex, /adminQuestionStudioBulkHardeningRouter/);
assert.match(routeIndex, /adminQuestionStudioDataSufficiencyRouter/);
assert.match(routeIndex, /adminQuestionLifecycleHardeningRouter/);

// Frozen CP-002 source contract must remain untouched.
assert.match(cp002Runtime, /questionBankStatus: "NOT_STORED"/);
assert.match(cp002Runtime, /questionBankWritable: false/);
assert.match(cp002Runtime, /testEligible: false/);
assert.match(cp002Runtime, /publiclyPublishable: false/);

console.log(JSON.stringify({
  status: "PASS_DSF_CP004_QUESTION_BANK_ROUTE_LIFECYCLE_CONTRACT",
  authority: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  dsfRoutes: 4,
  acceptancePath: "PATCH /admin/question-studio/items/bulk -> canonical Question Bank converter",
  questionBankAcceptanceMode: "BANK_ONLY",
  legacyCp004PayloadPreserved: true,
  laterCp005OverlayAllowed: laterCp005Overlay,
  canonicalTestSelectionRequiresPublishedQuestions: true,
  parallelDsfLifecycleRouteAdded: false,
  permanentQlId: "DSF-QL-001",
  nextAvailableQlId: "DSF-QL-002",
}, null, 2));
