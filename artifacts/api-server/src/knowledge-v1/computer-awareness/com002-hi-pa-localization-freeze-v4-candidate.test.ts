import assert from "node:assert/strict";

import {
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4,
  auditCom002HiPaLocalizationFreezeCandidateV4,
} from "./com002-hi-pa-localization-freeze-v4-candidate";

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

console.log("[COM002-HI-PA-LOCALIZATION-V4-CANDIDATE] PASS hashProbe=true humanAccepted=false promotable=false");
