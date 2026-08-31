import { strict as assert } from "node:assert";

import {
  COM001_ENGLISH_FREEZE_AUTHORITY_V1,
  auditCom001EnglishFreezeV1,
} from "./com001-english-freeze-v1";
import { COM001_EDITORIALLY_APPROVED_FACTS } from "./com001-editorial-review";
import { COM001_MEMORY_STORAGE_QLS } from "./com001-memory-storage-ql-allocation";

const freeze = COM001_ENGLISH_FREEZE_AUTHORITY_V1;
const audit = auditCom001EnglishFreezeV1();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(freeze.status, "ENGLISH_EDITORIAL_AUTHORITY_FROZEN");
assert.equal(freeze.authorityId, "COM-001-ENGLISH-FREEZE-V1");
assert.equal(freeze.cpId, "COM-001-CP-001");
assert.equal(freeze.permanentQlRange, "COM-001-QL-001..COM-001-QL-009");
assert.equal(freeze.permanentQlCount, 9);
assert.equal(freeze.approvedFactCount, 73);
assert.equal(freeze.heldFactCount, 3);
assert.equal(freeze.rejectedFactCount, 1);
assert.equal(COM001_EDITORIALLY_APPROVED_FACTS.length, 73);
assert.deepEqual(
  freeze.qls.map((entry) => entry.qlId),
  COM001_MEMORY_STORAGE_QLS.map((entry) => entry.qlId),
);
assert.equal(
  freeze.qls.every(
    (entry) =>
      entry.englishReviewSynthesisImplemented &&
      entry.englishEditorialSurfaceFrozen,
  ),
  true,
);

assert.equal(
  freeze.exactReviewedAuthority.headSha,
  "0f79cd080eb8c82f62df35d9c2eaa37eb0ffc444",
);
assert.equal(freeze.exactReviewedAuthority.workflowRunNumber, 79);
assert.equal(freeze.exactReviewedAuthority.workflowRunId, 32707689257);
assert.equal(freeze.exactReviewedAuthority.workflowJobId, 97372211884);
assert.equal(freeze.exactReviewedAuthority.reviewSynthesisQuestions, 360);
assert.equal(freeze.exactReviewedAuthority.editorialQualityAuditQuestions, 360);
assert.equal(
  freeze.exactReviewedAuthority.reviewVerdict,
  "APPROVED_NO_REMAINING_ENGLISH_EDITORIAL_BLOCKER_IN_APPROVED_SCOPE",
);

assert.equal(audit.actual.approvedFactCount, 73);
assert.equal(audit.actual.permanentQlCount, 9);
assert.equal(audit.actual.storageProfileCount, 6);
assert.equal(audit.actual.frozenQuestionCount, 360);

assert.equal(freeze.proofGuarantees.exactApprovedFactCount, 73);
assert.equal(freeze.proofGuarantees.exactPermanentQlCount, 9);
assert.equal(freeze.proofGuarantees.frozenQuestionsPerQl, 40);
assert.equal(freeze.proofGuarantees.totalFrozenEnglishQuestions, 360);
assert.equal(freeze.proofGuarantees.deterministicReplay, true);
assert.equal(freeze.proofGuarantees.blockedSourcesExcluded, true);
assert.equal(freeze.proofGuarantees.heldRejectedFactsExcluded, true);
assert.equal(freeze.proofGuarantees.ambiguousSramLayerRejected, true);
assert.equal(freeze.proofGuarantees.ambiguousKb1024WordingRejected, true);
assert.equal(freeze.proofGuarantees.explicitSiIecCapacityConvention, true);
assert.equal(freeze.proofGuarantees.internalEngineLanguageRejected, true);
assert.equal(freeze.proofGuarantees.humanFacingExplanationAudit, true);

assert.equal(freeze.lifecycle.englishEditorialAuthorityFrozen, true);
assert.equal(freeze.lifecycle.englishReviewSynthesisFrozen, true);
assert.equal(freeze.lifecycle.questionStudioDiscoverable, false);
assert.equal(freeze.lifecycle.questionStudioRegistrationStatus, "NOT_REGISTERED");
assert.equal(freeze.lifecycle.persistenceAllowed, false);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.hindiPunjabiGeneration, false);
assert.equal(freeze.lifecycle.hindiPunjabiLocalizationFrozen, false);
assert.equal(
  freeze.nextGate,
  "COM001_HINDI_PUNJABI_LOCALIZATION_AND_REVIEW",
);
