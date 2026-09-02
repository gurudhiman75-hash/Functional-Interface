import { strict as assert } from "node:assert";

import { COM003_PRODUCT_REVIEW_REVOCATION_V1, assertCom003CurrentProductAuthorityV1 } from "./com003-product-review-revocation-v1";

assert.equal(assertCom003CurrentProductAuthorityV1(), true);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.revokedGeneratorVersion, "COM003_ENGLISH_REVIEW_CORPUS_V4");
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.generatorVersion, "COM003_ENGLISH_REVIEW_CORPUS_V6");
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.questionCount, 228);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.qlCount, 19);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.technicalStatus, "EXAM_REALNESS_REVIEW_CANDIDATE");
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.productReviewStatus, "AWAITING_USER_REVIEW");
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.englishFrozen, false);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.hindiPunjabiLocalizationAuthorized, false);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.questionStudioReplacementAuthorized, false);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.questionBankWritesAuthorized, false);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.testEligibilityAuthorized, false);
assert.equal(COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.automaticPublicationAuthorized, false);

console.log("[COM003-PRODUCT-REVIEW-REVOCATION-V1]", {
  decision: COM003_PRODUCT_REVIEW_REVOCATION_V1.decision,
  revokedAuthorityId: COM003_PRODUCT_REVIEW_REVOCATION_V1.revokedAuthorityId,
  remediationCandidate: COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.generatorVersion,
  technicalStatus: COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.technicalStatus,
  productReviewStatus: COM003_PRODUCT_REVIEW_REVOCATION_V1.remediationCandidate.productReviewStatus,
  localizationAuthorized: COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.hindiPunjabiLocalizationAuthorized,
  questionStudioReplacementAuthorized: COM003_PRODUCT_REVIEW_REVOCATION_V1.effectiveGovernance.questionStudioReplacementAuthorized,
});
