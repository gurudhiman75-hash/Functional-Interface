import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  DSF_CP004_QUESTION_BANK_ACCEPTANCE,
  DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
} from "./question-bank-acceptance-v1.ts";

const read = (path: string) => readFileSync(path, "utf8");

const dsfRoute = read("src/routes/admin-question-studio-data-sufficiency.ts");
const bulkRoute = read("src/routes/admin-question-studio-bulk-hardening.ts");
const approvalPolicy = read("src/lib/admin-question-studio-approval-policy.ts");
const conversion = read("src/lib/admin-question-conversion.ts");
const questionLifecycle = read("src/routes/admin-question-lifecycle-hardening.ts");
const questionManagement = read("src/lib/admin-question-management.ts");
const testRoutes = read("src/routes/admin-tests.ts");
const blueprintAssembly = read("src/routes/admin-test-blueprint-assembly.ts");
const routeIndex = read("src/routes/index.ts");
const adminClient = read("../admin-app/src/features/question-studio/data-sufficiency-review-api.ts");
const adminPanel = read("../admin-app/src/pages/content/QuestionStudioDataSufficiencyReviewPanel.tsx");
const cp002Runtime = read("src/reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1.ts");

assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.questionBank.writable, true);
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.questionBank.acceptanceMode, "BANK_ONLY");
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.testEligible, false);
assert.equal(DSF_CP004_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.publiclyPublishable, false);

assert.match(dsfRoute, /DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY/);
assert.match(dsfRoute, /questionBankStatus: "READY_FOR_STORAGE"/);
assert.match(dsfRoute, /questionBankWritable: true/);
assert.match(dsfRoute, /questionBankAcceptanceMode: "BANK_ONLY"/);
assert.match(dsfRoute, /manualApprovalRequired: true/);
assert.match(dsfRoute, /testEligibility: "INELIGIBLE"/);
assert.match(dsfRoute, /testEligible: false/);
assert.match(dsfRoute, /mockTestEligible: false/);
assert.match(dsfRoute, /publiclyPublishable: false/);
assert.match(dsfRoute, /automaticStudentPublication: false/);
assert.match(dsfRoute, /dsfCp004ReviewPayload/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/package/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/preview/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/runs/);
assert.match(dsfRoute, /reasoning\/data-sufficiency\/status/);
assert.doesNotMatch(dsfRoute, /reasoning\/data-sufficiency\/(?:publish|test|mock|question-bank)\b/);

const dsfRouteRegistrations = [...dsfRoute.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(dsfRouteRegistrations.length, 4, "CP-004 must not add a parallel Question Bank/test/publication endpoint");

assert.match(bulkRoute, /getGeneratedItemApprovalDisposition/);
assert.match(bulkRoute, /disposition\.mode === "question_bank"/);
assert.match(bulkRoute, /convertApprovedGenerationItem/);
assert.match(approvalPolicy, /questionBankStatus === "NOT_STORED" && questionBankWritable === false/);
assert.match(conversion, /getGeneratedQuestionBankAcceptanceMode/);
assert.match(conversion, /acceptanceMode === "BANK_ONLY"/);
assert.match(conversion, /questionBankAcceptanceAuthority/);
assert.match(conversion, /testEligible/);
assert.match(conversion, /publiclyPublishable/);
assert.match(conversion, /downstreamLifecycleLocked/);

assert.match(questionLifecycle, /generationPubliclyPublishable/);
assert.match(questionLifecycle, /generationTestEligible/);
assert.match(questionLifecycle, /Generation lifecycle has not enabled scored-test eligibility/);
assert.match(questionLifecycle, /Generation lifecycle has not enabled public publication/);
assert.match(questionManagement, /generationPubliclyPublishable\?: boolean \| null/);
assert.match(questionManagement, /generationTestEligible\?: boolean \| null/);
assert.match(questionManagement, /Generation lifecycle has not enabled scored-test eligibility/);
assert.match(questionManagement, /Generation lifecycle has not enabled public publication/);

assert.match(testRoutes, /QUESTION_NOT_PUBLISHED/);
assert.match(testRoutes, /publishedVersionId/);
assert.match(testRoutes, /String\(row\.status\) !== "published"/);
assert.match(blueprintAssembly, /q\.status = 'published'::question_status/);
assert.match(blueprintAssembly, /q\.published_version_id/);

assert.match(routeIndex, /adminQuestionStudioBulkHardeningRouter/);
assert.match(routeIndex, /adminQuestionStudioDataSufficiencyRouter/);
assert.match(routeIndex, /adminQuestionLifecycleHardeningRouter/);
assert.ok(
  routeIndex.indexOf("adminQuestionStudioBulkHardeningRouter") < routeIndex.indexOf("adminQuestionStudioDataSufficiencyRouter"),
  "Generic bulk review/Question Bank conversion must remain the canonical DSF acceptance path.",
);
assert.ok(
  routeIndex.indexOf("adminQuestionStudioDataSufficiencyRouter") < routeIndex.indexOf("adminQuestionStudioRouter"),
  "DSF specialized routes must remain before the generic Question Studio router.",
);
assert.ok(
  routeIndex.indexOf("adminQuestionLifecycleHardeningRouter") < routeIndex.indexOf("adminQuestionsRouter"),
  "Hardened publish guard must shadow the generic question publish route.",
);

assert.match(adminClient, /QUESTION_BANK_ACCEPTANCE_ENABLED/);
assert.match(adminClient, /questionBankAcceptanceCheckpointId: 'DSF-CP-004'/);
assert.match(adminClient, /questionBankWritable: true/);
assert.match(adminClient, /questionBankAcceptanceMode: 'BANK_ONLY'/);
assert.match(adminClient, /testEligible: false/);
assert.match(adminClient, /publiclyPublishable: false/);
assert.match(adminPanel, /CP-004 Question Bank/);
assert.match(adminPanel, /Question Bank acceptance boundary/);
assert.match(adminPanel, /Question Bank after approval/);
assert.match(adminPanel, /Scored tests locked/);
assert.match(adminPanel, /Publication locked/);
assert.match(adminPanel, /Older pre-CP-004 review items keep their original review-only payload/);

// CP-004 is an overlay. The frozen CP-002 source contract must remain untouched.
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
  legacyPayloadsImmutable: true,
  hardenedPublicationGuard: true,
  canonicalTestSelectionRequiresPublishedQuestions: true,
  newPublishOrTestRouteAdded: false,
  permanentQlId: "DSF-QL-001",
  nextAvailableQlId: "DSF-QL-002",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
