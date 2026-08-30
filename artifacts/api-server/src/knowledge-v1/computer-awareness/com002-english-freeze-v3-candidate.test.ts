import assert from "node:assert/strict";

import {
  auditCom002EnglishV3FreezeCandidate,
  COM002_ENGLISH_V3_FREEZE_CANDIDATE,
} from "./com002-english-freeze-v3-candidate";

const audit = auditCom002EnglishV3FreezeCandidate();
console.log("[COM002-ENGLISH-V3-FREEZE-CANDIDATE] actual fingerprints", audit.actual);

assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.exactExecutedEvidence.workflowRunId, 33053333684);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.exactExecutedEvidence.workflowJobId, 98453914630);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.materializedReviewPack.materializedPackAvailable, true);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.humanReview.explicitApprovalVerified, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.promotionAllowed, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.englishV3MachineAuditExecuted, true);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.englishV3AuthorityFrozen, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.questionStudioActive, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.publiclyPublishable, false);
assert.equal(COM002_ENGLISH_V3_FREEZE_CANDIDATE.lifecycle.productionReleaseAuthorized, false);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.actual.corpusQuestionCount, 520);
assert.equal(audit.actual.reviewQuestionCount, 26);
assert.equal(audit.promotable, false);
assert.ok(audit.issues.includes("EXPLICIT_PRODUCT_OWNER_APPROVAL_PENDING"));
assert.equal(
  audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:")).length,
  3,
  audit.issues.join("\n"),
);

console.log("[COM002-ENGLISH-V3-FREEZE-CANDIDATE] PASS hashProbe=true approval=false");
