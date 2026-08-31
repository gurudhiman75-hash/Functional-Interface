import assert from "node:assert/strict";

import {
  auditCom002HiPaLocalizationFreezeCandidateV1,
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1,
} from "./com002-hi-pa-localization-freeze-v1";

const audit = auditCom002HiPaLocalizationFreezeCandidateV1();
console.log("[COM002-HI-PA-LOCALIZATION-FREEZE-V1] actual fingerprints", audit.actual);

assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.historicalEnglishFreezeRecordPresent, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.operationalEnglishFreezeAllowed, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.promotionAllowed, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.localizationFrozen, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.questionStudioActive, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.questionBankWritable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.testEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.mockTestEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.publiclyPublishable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.productionReleaseAuthorized, false);
assert.equal(audit.hashProbeComputed, true);
assert.equal(audit.promotable, false);
assert.equal(audit.actual.localizedQuestionCount, 1040);
assert.equal(audit.actual.reviewSamplerQuestionCount, 26);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.valid, false);
assert.ok(
  audit.issues.includes("ENGLISH_OPERATIONAL_FREEZE_BLOCKED_PENDING_EXPLICIT_APPROVAL"),
  audit.issues.join("\n"),
);
assert.equal(
  audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:")).length,
  4,
  audit.issues.join("\n"),
);

console.log("[COM002-HI-PA-LOCALIZATION-FREEZE-V1] PASS hashCandidate=true promotable=false");
