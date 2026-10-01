import assert from "node:assert/strict";
import {
  INDIAN_GEO_FAMILY_FREEZE_AUTHORITY_V1,
  INDIAN_GEO_FAMILY_FREEZE_STATUS_V1,
  INDIAN_GEO_FAMILY_FREEZE_V1,
} from "./indian-geo-family-freeze-v1";

assert.equal(INDIAN_GEO_FAMILY_FREEZE_AUTHORITY_V1, "INDIAN-GEO-FAMILY-FREEZE-V1");
assert.equal(INDIAN_GEO_FAMILY_FREEZE_STATUS_V1, "FROZEN_CLOSED");
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.packageCount, 17);
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.canonicalQuestionCount, 7220);
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.localizedVersionCount, 21660);
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.structuralValid, true);
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.qualityReadyForFreeze, true);
assert.equal(INDIAN_GEO_FAMILY_FREEZE_V1.reviewRequired, false);
assert.equal(new Set(INDIAN_GEO_FAMILY_FREEZE_V1.frozenPackageIds).size, 17);

console.log(JSON.stringify(INDIAN_GEO_FAMILY_FREEZE_V1, null, 2));
