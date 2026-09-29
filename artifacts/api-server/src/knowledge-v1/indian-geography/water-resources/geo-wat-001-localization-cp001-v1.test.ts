import assert from "node:assert/strict";
import {
  GEO_WAT_001_CP001_HINDI_LOCALIZATION_V1,
  GEO_WAT_001_CP001_PUNJABI_LOCALIZATION_V1,
  auditGeoWat001Cp001LocalizationV1,
} from "./geo-wat-001-localization-cp001-v1";

const audit = auditGeoWat001Cp001LocalizationV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.canonicalQuestionCount, 25);
assert.equal(audit.hindiQuestionCount, 25);
assert.equal(audit.punjabiQuestionCount, 25);
assert.equal(audit.localizedOutputCount, 50);
assert.equal(audit.qlCount, 5);
assert.equal(GEO_WAT_001_CP001_HINDI_LOCALIZATION_V1.length, GEO_WAT_001_CP001_PUNJABI_LOCALIZATION_V1.length);
