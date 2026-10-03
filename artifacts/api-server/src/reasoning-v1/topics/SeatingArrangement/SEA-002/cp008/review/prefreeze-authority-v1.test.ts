import assert from "node:assert/strict";

import { SEA002_CP008_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import {
  SEA002_CP008_PREFREEZE_AUTHORITY_V1,
  assertSea002Cp008PrefreezeBoundary,
} from "./prefreeze-authority-v1.ts";

assertSea002Cp008PrefreezeBoundary();
assert.deepEqual(SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentQlIds, SEA002_CP008_PERMANENT_QL_IDS);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentAuthorityCount, 7);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.productionSourceSaturation, true);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.canonicalSurfaces, 42);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.localizedSurfaces, 84);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint.length, 64);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint.length, 64);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.questionStudioActivationEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.questionBankWritable, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.testEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.mockTestEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.productionStaging, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.automaticStudentDelivery, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V1.nextPermanentQlId, "SEA-QL-036");

console.log("PASS_SEA002_CP008_PREFREEZE_AUTHORITY_V1");
console.log("permanent QLs", SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentQlIds.join(","));
console.log("English surfaces", SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.canonicalSurfaces);
console.log("localized surfaces", SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.localizedSurfaces);
console.log("English fingerprint", SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint);
console.log("localization fingerprint", SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint);
console.log("approval/freeze", SEA002_CP008_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus, SEA002_CP008_PREFREEZE_AUTHORITY_V1.freezeStatus);
console.log("Studio/Bank/test/mock/staging/public", false, false, false, false, false, false);
console.log("next permanent QL", SEA002_CP008_PREFREEZE_AUTHORITY_V1.nextPermanentQlId);
