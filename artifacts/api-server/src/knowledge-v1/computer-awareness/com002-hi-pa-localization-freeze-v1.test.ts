import assert from "node:assert/strict";

import {
  auditCom002HiPaLocalizationFreezeCandidateV1,
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1,
} from "./com002-hi-pa-localization-freeze-v1";

const audit = auditCom002HiPaLocalizationFreezeCandidateV1();
console.log("[COM002-HI-PA-LOCALIZATION-FREEZE-V1] actual fingerprints", audit.actual);

assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.englishV1Frozen, true);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.localizationFrozen, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.questionStudioActive, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.questionBankWritable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.testEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.mockTestEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.publiclyPublishable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.lifecycle.productionReleaseAuthorized, false);
assert.equal(audit.valid, true, audit.issues.join("\n"));
