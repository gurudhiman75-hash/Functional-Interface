import { strict as assert } from "node:assert";

import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com001-english-freeze-v1";
import {
  COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  auditCom001HiPaLocalizationFreezeV1,
} from "./com001-hi-pa-localization-freeze-v1";

const audit = auditCom001HiPaLocalizationFreezeV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.actual.localizedQuestionCount, 720);
assert.equal(audit.actual.qlCount, 9);
assert.equal(
  audit.actual.englishCombinedFingerprint,
  COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.status, "HI_PA_LOCALIZATION_FROZEN");
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.localizationFrozen, true);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.persistenceAllowed, false);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.questionBankWritable, false);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.testEligible, false);
assert.equal(COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.lifecycle.publiclyPublishable, false);
