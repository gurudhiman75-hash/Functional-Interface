import assert from "node:assert/strict";

import { SEA002_CP008_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import {
  SEA002_CP008_PREFREEZE_AUTHORITY_V2,
  assertSea002Cp008PrefreezeBoundaryV2,
} from "./prefreeze-authority-v2.ts";

assertSea002Cp008PrefreezeBoundaryV2();
assert.deepEqual(SEA002_CP008_PREFREEZE_AUTHORITY_V2.permanentQlIds, SEA002_CP008_PERMANENT_QL_IDS);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.permanentAuthorityCount, 7);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.productionSourceSaturation, true);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.canonicalSurfaces, 42);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.localizedSurfaces, 84);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint.length, 64);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint.length, 64);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.questionStudioActivationEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.questionStudioRegistered, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.questionBankWritable, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.testEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.mockTestEligible, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.productionStaging, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.publiclyPublishable, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.automaticStudentDelivery, false);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.nextPermanentQlId, "SEA-QL-036");

console.log("PASS_SEA002_CP008_PREFREEZE_AUTHORITY_V2");
console.log("permanent QLs", SEA002_CP008_PREFREEZE_AUTHORITY_V2.permanentQlIds.join(","));
console.log("English V2 surfaces", SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.canonicalSurfaces);
console.log("localized V2 surfaces", SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.localizedSurfaces);
console.log("English V2 fingerprint", SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint);
console.log("localization V2 fingerprint", SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint);
console.log("approval/freeze", SEA002_CP008_PREFREEZE_AUTHORITY_V2.productOwnerApprovalStatus, SEA002_CP008_PREFREEZE_AUTHORITY_V2.freezeStatus);
console.log("Studio/Bank/test/mock/staging/public", false, false, false, false, false, false);
