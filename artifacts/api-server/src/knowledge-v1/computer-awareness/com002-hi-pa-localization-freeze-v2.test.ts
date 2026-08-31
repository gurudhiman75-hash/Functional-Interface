import assert from "node:assert/strict";

import {
  auditCom002HiPaLocalizationFreezeCandidateV2,
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2,
} from "./com002-hi-pa-localization-freeze-v2";

const audit = auditCom002HiPaLocalizationFreezeCandidateV2();
console.log("[COM002-HI-PA-LOCALIZATION-FREEZE-V2] actual fingerprints", audit.actual);

assert.equal(
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.englishGeneratorVersion,
  "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1",
);
assert.equal(
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.localizationVersion,
  "COM-002-LOCALIZATION-V2-CANDIDATE-1",
);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.exactExecutedEvidence.workflowRunId, 33053333684);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.explicitEnglishApprovalVerified, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.operationalEnglishFreezeAllowed, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.promotionAllowed, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.expectedProof.localizedParityQuestions, 1040);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.expectedProof.reviewSamplerQuestions, 26);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.expectedProof.v3Ql004SafetyRemediationPreserved, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.expectedProof.v3Ql013SafeRelationFamiliesPreserved, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.englishV3ExecutedGreen, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.englishV3Approved, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.localizationV2ExecutedGreen, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.localizationFrozen, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.questionStudioActive, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.questionBankWritable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.testEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.mockTestEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.publiclyPublishable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2.lifecycle.productionReleaseAuthorized, false);

assert.equal(audit.hashProbeComputed, true);
assert.equal(audit.promotable, false);
assert.equal(audit.actual.localizedQuestionCount, 1040);
assert.equal(audit.actual.reviewSamplerQuestionCount, 26);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.actual.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1");
assert.equal(audit.machineFingerprintValid, false);
assert.ok(
  audit.issues.includes("ENGLISH_V3_OPERATIONAL_FREEZE_BLOCKED_PENDING_EXPLICIT_APPROVAL"),
  audit.issues.join("\n"),
);
assert.equal(
  audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:")).length,
  4,
  audit.issues.join("\n"),
);

console.log("[COM002-HI-PA-LOCALIZATION-FREEZE-V2] PASS hashProbe=true promotable=false english=V3 localization=V2");
