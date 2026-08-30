import { strict as assert } from "node:assert";

import {
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2,
  auditCom001HiPaLocalizationFreezeV2,
  computeCom001HiPaLocalizationFreezeFingerprintsV2,
} from "./com001-hi-pa-localization-freeze-v2";

const actual = computeCom001HiPaLocalizationFreezeFingerprintsV2();
console.log("[COM001-HI-PA-LOCALIZATION-FREEZE-V2] actual fingerprints", actual);

const audit = auditCom001HiPaLocalizationFreezeV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(actual.localizedQuestionCount, 720);
assert.equal(actual.qlCount, 9);
assert.deepEqual(actual.languages, ["hi", "pa"]);
assert.equal(
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.localizationV2Frozen,
  true,
);
assert.equal(
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.questionStudioV2Active,
  false,
);
assert.equal(
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.canonicalQuestionPersistenceAllowed,
  false,
);
assert.equal(
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.questionBankWritable,
  false,
);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.testEligible, false);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.lifecycle.publiclyPublishable, false);
