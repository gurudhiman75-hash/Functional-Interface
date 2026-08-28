import assert from "node:assert/strict";

import {
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4,
  auditCom002HiPaLocalizationFreezeCandidateV4,
} from "./com002-hi-pa-localization-freeze-v4-candidate";
import { auditCom002HiPaLocalizationMachineLockV4 } from "./com002-hi-pa-localization-machine-lock-v4";

const audit = auditCom002HiPaLocalizationFreezeCandidateV4();
console.log("[COM002-HI-PA-LOCALIZATION-V4-CANDIDATE] actual fingerprints", audit.actual);

assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.lifecycle.englishV5Frozen, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.lifecycle.localizationV4Implemented, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.lifecycle.localizationV4ExecutedGreen, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.humanReview.accepted, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.promotionAllowed, false);
assert.equal(audit.actual.localizedQuestionCount, 1040);
assert.equal(audit.actual.reviewSamplerQuestionCount, 26);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.machineFingerprintValid, false);
assert.equal(audit.promotable, false);

const fingerprintIssues = audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:"));
assert.equal(fingerprintIssues.length, 4, `expected four PENDING fingerprint mismatches, got ${audit.issues.join(" | ")}`);
assert.deepEqual(
  audit.issues.filter((issue) => !issue.startsWith("FINGERPRINT_MISMATCH:")),
  ["BILINGUAL_HUMAN_REVIEW_NOT_ACCEPTED"],
);

const machineLockAudit = auditCom002HiPaLocalizationMachineLockV4();
assert.equal(machineLockAudit.valid, true, machineLockAudit.issues.join(" | "));
assert.equal(machineLockAudit.authority.lifecycle.localizationV4ExecutedGreen, true);
assert.equal(machineLockAudit.authority.lifecycle.localizationFingerprintsPinned, true);
assert.equal(machineLockAudit.authority.lifecycle.localizationMachineLocked, true);
assert.equal(machineLockAudit.authority.humanReview.accepted, false);
assert.equal(machineLockAudit.authority.lifecycle.localizationFrozen, false);
assert.equal(machineLockAudit.authority.lifecycle.questionStudioActive, false);
assert.equal(machineLockAudit.authority.lifecycle.questionBankWritable, false);
assert.equal(machineLockAudit.authority.lifecycle.productionReleaseAuthorized, false);

console.log("[COM002-HI-PA-LOCALIZATION-V4-CANDIDATE] PASS hashProbe=true machineLock=true humanAccepted=false promotable=false");
