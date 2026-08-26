import assert from "node:assert/strict";

import { SEA002_CP008_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";
import { SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 } from "./certified-evidence-v2.ts";
import {
  SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1,
  SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1,
  assertSea002Cp008ExplicitProductApprovalV1,
} from "./approved-freeze-v1.ts";

assert.doesNotThrow(() => assertSea002Cp008ExplicitProductApprovalV1());
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.approvedBy, "PRODUCT_OWNER");
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.approvedAt, "2026-08-26T14:08:29Z");
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.englishReviewFingerprint, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.englishReviewFingerprint);
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.localizationReviewFingerprint, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.localizationReviewFingerprint);
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.certifiedReviewArtifactId, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactId);
assert.equal(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.certifiedReviewArtifactDigest, SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactDigest);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.productOwnerApprovalStatus, "APPROVED");
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.freezeStatus, "FROZEN");
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.englishFreezeStatus, "FROZEN");
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.localizationFreezeStatus, "FROZEN");
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.questionStudioActivationEligible, true);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.questionBankWritable, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.testEligible, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.mockTestEligible, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.productionStaging, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.automaticStudentDelivery, false);
assert.equal(SEA002_CP008_PERMANENT_QL_REGISTRY.every((entry) => !entry.active && !entry.questionStudioDiscoverable && !entry.questionBankWritable), true);

console.log("PASS_SEA002_CP008_APPROVED_FREEZE_V1");
console.log("approved by", SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.approvedBy);
console.log("approved at", SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.approvedAt);
console.log("freeze", SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.freezeStatus);
console.log("Question Studio activation eligible", SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.questionStudioActivationEligible);
console.log("source Studio registered", SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1.questionStudioRegistered);
console.log("Bank/test/mock/staging/public", false, false, false, false, false);
