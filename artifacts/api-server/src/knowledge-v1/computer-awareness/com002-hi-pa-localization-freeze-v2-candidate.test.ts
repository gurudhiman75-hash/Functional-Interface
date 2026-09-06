import assert from "node:assert/strict";

import {
  auditCom002V3V2FreezeCandidate,
  COM002_V3_V2_FREEZE_CANDIDATE,
} from "./com002-hi-pa-localization-freeze-v2-candidate";

const audit = auditCom002V3V2FreezeCandidate();
console.log("[COM002-V3-V2-FREEZE-CANDIDATE] actual fingerprints", audit.actual);

assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.status, "HASH_READY_BLOCKED_PENDING_V3_EXECUTION_PACK_AND_EXPLICIT_APPROVAL");
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.localizationVersion, "COM-002-LOCALIZATION-V2-CANDIDATE-1");
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.promotionAllowed, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.englishV3Frozen, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.localizationV2Frozen, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.questionStudioActive, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.reviewRunPersistenceAllowed, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.canonicalQuestionPersistenceAllowed, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.questionBankWritable, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.testEligible, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.mockTestEligible, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.publiclyPublishable, false);
assert.equal(COM002_V3_V2_FREEZE_CANDIDATE.lifecycle.productionReleaseAuthorized, false);

assert.equal(audit.hashProbeComputed, true);
assert.equal(audit.promotable, false);
assert.equal(audit.valid, false);
assert.equal(audit.actual.englishQuestionCount, 520);
assert.equal(audit.actual.englishHumanReviewQuestionCount, 26);
assert.equal(audit.actual.localizedQuestionCount, 1040);
assert.equal(audit.actual.localizedReviewSamplerQuestionCount, 26);
assert.equal(audit.actual.qlCount, 13);
assert.ok(audit.issues.includes("EXPLICIT_V3_ENGLISH_APPROVAL_NOT_VERIFIED"));
assert.equal(
  audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:")).length,
  6,
  audit.issues.join("\n"),
);

console.log("[COM002-V3-V2-FREEZE-CANDIDATE] PASS hashProbe=true promotable=false");
