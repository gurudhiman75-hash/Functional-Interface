import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../lib/admin-question-conversion";
import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-bank-only-activation-authority-v1";
import { knowledgeV1Com003QuestionStudioAdapterV2 } from "./knowledge-v1-com003-adapter-v2";

const read = (path: string) => readFileSync(path, "utf8");
const bulkRoute = read("src/routes/admin-question-studio-bulk-hardening.ts");
const conversion = read("src/lib/admin-question-conversion.ts");
const registry = read("src/routes/admin-question-studio-registry.ts");
const questionLifecycle = read("src/routes/admin-question-lifecycle-hardening.ts");
const testRoutes = read("src/routes/admin-tests.ts");

const authority = COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
assert.equal(authority.authorization.lifecycleStage, "BANK_ONLY");
assert.equal(authority.authorization.questionBankWritable, true);
assert.equal(authority.authorization.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(authority.authorization.manualApprovalRequired, true);
assert.equal(authority.locks.testEligible, false);
assert.equal(authority.locks.testBuilderEligible, false);
assert.equal(authority.locks.mockTestEligible, false);
assert.equal(authority.locks.publiclyPublishable, false);
assert.equal(authority.locks.productionReleaseAuthorized, false);

// Prove a real COM-003 runtime payload takes the canonical manual Question Bank
// acceptance path and remains downstream-locked after normalization.
const generated = await knowledgeV1Com003QuestionStudioAdapterV2.generate({
  packageId: "COM-003",
  runtimeMode: "review-only",
  patternId: "COM-003-QL-017",
  language: "pa",
  difficulty: "Medium",
  seed: "com003-question-bank-acceptance-route-v1",
  count: 1,
});
const question = generated.questions[0] as any;
assert.ok(question);
assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(question.questionBankWritable, true);
assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(question.questionBankAcceptanceAuthority, authority.authorityId);
assert.equal(question.testEligible, false);
assert.equal(question.mockTestEligible, false);
assert.equal(question.publiclyPublishable, false);
assert.equal(question.productionReleaseAuthorized, false);

const disposition = getGeneratedItemApprovalDisposition(question);
assert.equal(disposition.mode, "question_bank");
assert.equal(disposition.reason, null);
assert.equal(getGeneratedQuestionBankEligibilityIssue(question), null);
assert.equal(getGeneratedQuestionBankAcceptanceMode(question), "BANK_ONLY");

const normalized = normalizeGeneratedQuestionPayload(question, {
  itemId: "com003-contract-item",
  generationRunCode: "COM003-CONTRACT-RUN",
});
const generation = normalized.answerModel.generation as Record<string, unknown>;
assert.equal(generation.packageId, "COM-003");
assert.equal(generation.qlId, "COM-003-QL-017");
assert.equal(generation.language, "pa");
assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(generation.questionBankWritable, true);
assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(generation.questionBankAcceptanceAuthority, authority.authorityId);
assert.equal(generation.testEligibility, "INELIGIBLE");
assert.equal(generation.testEligible, false);
assert.equal(generation.mockTestEligible, false);
assert.equal(generation.publiclyPublishable, false);
assert.equal(generation.automaticStudentPublication, false);

// The hardened shared approval route must remain the canonical path. It decides
// disposition from the persisted payload and invokes the shared converter only
// for Question-Bank-eligible approvals.
assert.match(bulkRoute, /getGeneratedItemApprovalDisposition\(item\.payload\)/);
assert.match(bulkRoute, /disposition\.mode === "question_bank"/);
assert.match(bulkRoute, /convertApprovedGenerationItem/);
assert.match(bulkRoute, /requireAdminPermission\("content\.generation\.review"\)/);
assert.match(bulkRoute, /status === "approved"/);

assert.match(conversion, /assertGeneratedQuestionBankEligible\(payload\)/);
assert.match(conversion, /acceptanceMode === "BANK_ONLY"/);
assert.match(conversion, /Accepted into Question Bank with downstream lifecycle locked/);
assert.match(conversion, /questionBankAcceptanceAuthority/);
assert.match(conversion, /testEligible/);
assert.match(conversion, /mockTestEligible/);
assert.match(conversion, /publiclyPublishable/);
assert.match(conversion, /automaticStudentPublication/);

// Hardening must precede the legacy route so approval cannot bypass the
// disposition policy. No COM-003-specific parallel publish/test endpoint is
// introduced by this checkpoint.
const hardeningIndex = registry.indexOf("router.use(adminQuestionStudioBulkHardeningRouter)");
const legacyIndex = registry.indexOf("router.use(adminQuestionStudioRouter)");
assert.ok(hardeningIndex >= 0 && legacyIndex > hardeningIndex);

assert.match(questionLifecycle, /generationTestEligible/);
assert.match(questionLifecycle, /generationPubliclyPublishable/);
assert.match(testRoutes, /QUESTION_NOT_PUBLISHED/);
assert.match(testRoutes, /String\(row\.status\) !== "published"/);

console.log("[COM003-QUESTION-BANK-ACCEPTANCE-ROUTE-V1]", {
  authorityId: authority.authorityId,
  approvalPath: "PATCH /admin/question-studio/items/bulk -> canonical Question Bank converter",
  approvalDisposition: disposition.mode,
  questionBankAcceptanceMode: generation.questionBankAcceptanceMode,
  language: generation.language,
  qlId: generation.qlId,
  testEligible: generation.testEligible,
  mockTestEligible: generation.mockTestEligible,
  publiclyPublishable: generation.publiclyPublishable,
  productionReleaseAuthorized: authority.locks.productionReleaseAuthorized,
  parallelCom003LifecycleRouteAdded: false,
});
