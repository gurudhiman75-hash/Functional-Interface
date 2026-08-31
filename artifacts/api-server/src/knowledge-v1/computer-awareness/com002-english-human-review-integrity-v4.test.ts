import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4 } from "./com002-english-human-review-integrity-v4";
import { COM002_ENGLISH_GENERATOR_VERSION_V5 } from "./com002-review-synthesis-v5";

const authority = COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4;

assert.equal(authority.authorityId, "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V4");
assert.equal(authority.status, "EXPLICIT_APPROVAL_RECORDED_AWAITING_V5_CANONICAL_EXECUTION");
assert.equal(authority.englishGeneratorVersion, COM002_ENGLISH_GENERATOR_VERSION_V5);
assert.equal(authority.reviewQuestionCount, 26);
assert.equal(authority.qlCount, 13);
assert.equal(authority.exactReviewSeeds.length, 26);
assert.equal(authority.explicitApprovalVerified, true);
assert.equal(authority.approvalSource, "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL");
assert.equal(authority.approvedOn, "2026-08-28");
assert.equal(authority.approvedSurface, "SIMPLIFIED_ENGLISH_V5");
assert.equal(authority.v5CorpusAuditDefined, true);
assert.equal(authority.v5SamplerAuditDefined, true);
assert.equal(authority.v5ExecutedGreen, false);
assert.equal(authority.operationalEnglishFreezeAllowed, false);
assert.equal(authority.localizationFreezePromotionAllowed, false);
assert.equal(authority.questionStudioActivationAllowed, false);
assert.equal(authority.canonicalPersistenceAllowed, false);
assert.equal(authority.questionBankWritable, false);
assert.equal(authority.testEligibilityAllowed, false);
assert.equal(authority.mockEligibilityAllowed, false);
assert.equal(authority.publicEligibilityAllowed, false);
assert.equal(authority.productionReleaseAuthorized, false);

console.log("[COM002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V4] PASS", {
  approval: true,
  v5ExecutedGreen: false,
  failClosed: true,
});
