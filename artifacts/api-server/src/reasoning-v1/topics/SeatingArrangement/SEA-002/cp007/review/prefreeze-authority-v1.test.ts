import assert from "node:assert/strict";

import { SEA002_CP007_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";
import {
  SEA002_CP007_ENGLISH_REVIEW_V7,
  SEA002_CP007_LOCALIZATION_REVIEW_V2,
  SEA002_CP007_PREFREEZE_AUTHORITY_V1,
  assertSea002Cp007PrefreezeBoundary,
} from "./prefreeze-authority-v1.ts";

assert.deepEqual(SEA002_CP007_PREFREEZE_AUTHORITY_V1.permanentQlIds, [
  "SEA-QL-025",
  "SEA-QL-026",
  "SEA-QL-027",
  "SEA-QL-028",
]);
assert.equal(SEA002_CP007_PERMANENT_QL_REGISTRY.length, 4);
assert.equal(SEA002_CP007_ENGLISH_REVIEW_V7.status, "CI_CERTIFIED_SELF_REVIEW_COMPLETE");
assert.equal(SEA002_CP007_ENGLISH_REVIEW_V7.humanApprovalStatus, "PENDING");
assert.equal(SEA002_CP007_ENGLISH_REVIEW_V7.reviewFingerprint, "95d99edb9a20a92391f675a986c82232fe416f8b1d9b81fc289634333bf59373");
assert.equal(SEA002_CP007_ENGLISH_REVIEW_V7.artifactId, 9551313639);
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.status, "V2_REVIEW_READY_HUMAN_APPROVAL_PENDING");
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.humanApprovalStatus, "PENDING");
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.reviewFingerprint, "3b64a3dc7c943dbd7b50c737772bc8d18ec837c1b1333e6d5aa23469bb80a811");
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.artifactId, 9551312737);
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.localizedLearnerSurfaces, 48);
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.mechanicalGenderSlashResidue, 0);
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.unnaturalImmediateQueryResidue, 0);
assert.equal(SEA002_CP007_LOCALIZATION_REVIEW_V2.structuralParityChanged, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.freezeStatus, "NOT_FROZEN");
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.approvalRequiredBeforeFreeze, true);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.questionStudioActivationEligible, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.questionBankWritable, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.testEligible, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.mockTestEligible, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.productionStaging, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.automaticStudentDelivery, false);
assert.equal(SEA002_CP007_PREFREEZE_AUTHORITY_V1.nextPermanentQlId, "SEA-QL-029");
assert.ok(SEA002_CP007_PERMANENT_QL_REGISTRY.every((entry) => !entry.active && !entry.questionStudioDiscoverable && !entry.questionBankWritable));
assert.doesNotThrow(() => assertSea002Cp007PrefreezeBoundary());

console.log("PASS_SEA002_CP007_PREFREEZE_AUTHORITY_V1");
console.log("English", SEA002_CP007_ENGLISH_REVIEW_V7.status, SEA002_CP007_ENGLISH_REVIEW_V7.humanApprovalStatus);
console.log("Localization", SEA002_CP007_LOCALIZATION_REVIEW_V2.status, SEA002_CP007_LOCALIZATION_REVIEW_V2.humanApprovalStatus);
console.log("permanent QLs", SEA002_CP007_PREFREEZE_AUTHORITY_V1.permanentQlIds.join(","));
console.log("freeze", SEA002_CP007_PREFREEZE_AUTHORITY_V1.freezeStatus);
console.log("Studio/Bank/test/mock/staging/public", false, false, false, false, false, false);
console.log("next permanent QL", SEA002_CP007_PREFREEZE_AUTHORITY_V1.nextPermanentQlId);
