import { mkdirSync, writeFileSync } from "node:fs";

import { FGC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-english-freeze-v1";
import { FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-hi-pa-localization-freeze-v1";
import { SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1 } from "../foundation/spatial/spatial-fgc-question-studio-operator-review-v1";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V1 } from "../foundation/spatial/spatial-question-studio-integration-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = SPATIAL_FGC_QUESTION_STUDIO_OPERATOR_REVIEW_V1;

assert(review.reviewId === "SPA-FGC-001-QUESTION-STUDIO-OPERATOR-REVIEW-V1", "FGC operator review ID changed.");
assert(review.chapterCode === "FGC-001", "FGC operator review chapter changed.");
assert(review.packageId === "SPA-001", "FGC operator review package changed.");
assert(review.reviewedIntegrationHead === "d1235666788e4d2b83b3e3579424dba0c6ca9492", "Reviewed integration head changed.");
assert(review.pullRequestNumber === 861, "Reviewed PR changed.");
assert(review.permanentQlRange === "SPA-QL-031..SPA-QL-034", "FGC review QL range changed.");
assert(JSON.stringify(review.reviewedPermanentQls) === JSON.stringify(["SPA-QL-031", "SPA-QL-032", "SPA-QL-033", "SPA-QL-034"]), "FGC review must cover exactly four permanent QLs.");
assert(JSON.stringify(review.reviewedLanguages) === JSON.stringify(["en", "hi", "pa"]), "FGC review must cover English, Hindi and Punjabi.");
assert(review.reviewerAuthority === "ASSISTANT_OPERATOR_REVIEW", "Operator review must not impersonate product-owner authority.");
assert(review.learnerReviewStatus === "NO_BLOCKER_FOUND_OPERATOR_REVIEW", "Operator learner verdict changed.");
assert(review.reviewerVerdict === "NO_LEARNER_FACING_BLOCKER_FOUND", "Operator learner verdict changed.");

assert(review.integrationEvidence.workflowRunId === 32034757693, "Integration evidence run changed.");
assert(review.integrationEvidence.artifactId === 9290248586, "Integration evidence artifact changed.");
assert(review.integrationEvidence.artifactDigest === "sha256:a7755f18d9a29cbc58aebc001540851c1a3cce7db164a03e228f78d3a2f74d88", "Integration evidence digest changed.");
assert(review.integrationEvidence.result === "SUCCESS", "Reviewed integration evidence was not green.");
assert(review.integrationEvidence.integrationMarker === "PASS_SPA_FGC_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1", "Integration marker changed.");

assert(review.sourceReviewAuthorities.english.authorityId === FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId, "English freeze authority mismatch.");
assert(review.sourceReviewAuthorities.english.artifactDigest === FGC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactDigest, "English retained review artifact mismatch.");
assert(review.sourceReviewAuthorities.hindiPunjabi.authorityId === FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId, "HI/PA freeze authority mismatch.");
assert(review.sourceReviewAuthorities.hindiPunjabi.artifactDigest === FGC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactDigest, "HI/PA retained review artifact mismatch.");

assert(review.learnerFindings.ql031ContinuityAndJunction === "CLEAR_NO_BLOCKER", "QL031 review changed.");
assert(review.learnerFindings.ql032CountDirectionAndMarker === "SUBTLE_BUT_DISTINGUISHABLE_AT_104PX_NO_BLOCKER", "QL032 review changed.");
assert(review.learnerFindings.ql033QuadrantSymmetry === "CLEAR_NO_BLOCKER", "QL033 review changed.");
assert(review.learnerFindings.ql034CompoundStateAndContact === "ABSTRACT_BUT_DISTINGUISHABLE_NO_BLOCKER", "QL034 review changed.");
assert(review.learnerFindings.recommendedStimulusPixels === 384, "FGC review stimulus size changed.");
assert(review.learnerFindings.mobileMinimumOptionPixels === 104, "FGC mobile option floor changed.");
assert(review.learnerFindings.englishWording === "ACCEPTABLE_NO_BLOCKER", "English wording review changed.");
assert(review.learnerFindings.hindiWording === "ACCEPTABLE_NO_BLOCKER", "Hindi wording review changed.");
assert(review.learnerFindings.punjabiWording === "ACCEPTABLE_NO_BLOCKER", "Punjabi wording review changed.");
assert(review.learnerFindings.explanations === "QUESTION_SPECIFIC_AND_LEARNER_USABLE_NO_BLOCKER", "Explanation review changed.");

assert(!review.governance.productOwnerApprovalGranted, "Operator review must not claim product-owner approval.");
assert(!review.governance.mergeAuthorized, "Operator review must not authorize merge.");
assert(!review.governance.deploymentAuthorized, "Operator review must not authorize deployment.");
assert(!review.governance.generatedItemApprovalAuthorized, "Operator review must not approve generated items.");
assert(!review.governance.automaticStudentPublicationAuthorized, "Operator review must not authorize automatic student publication.");
assert(review.governance.manualApprovalStillRequired, "Manual generated-item approval must remain required.");
assert(review.nextGate === "EXPLICIT_PRODUCT_OWNER_QUESTION_STUDIO_APPROVAL", "Next governance gate changed.");

assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId === review.packageId, "Review package is not the integrated Spatial package.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.permanentQlCount === 34, "Review authority is not attached to the 34-QL package.");
assert(SPATIAL_QUESTION_STUDIO_PACKAGE_V1.manualApprovalRequired, "Integrated package no longer requires manual approval.");
assert(!SPATIAL_QUESTION_STUDIO_PACKAGE_V1.automaticStudentPublication, "Integrated package unexpectedly enables automatic publication.");

const evidence = {
  status: "PASS_SPA_FGC_001_OPERATOR_QUESTION_STUDIO_REVIEW_V1",
  reviewId: review.reviewId,
  reviewedIntegrationHead: review.reviewedIntegrationHead,
  pullRequestNumber: review.pullRequestNumber,
  qls: review.reviewedPermanentQls,
  languages: review.reviewedLanguages,
  learnerReviewStatus: review.learnerReviewStatus,
  reviewerVerdict: review.reviewerVerdict,
  integrationEvidence: review.integrationEvidence,
  sourceReviewAuthorities: review.sourceReviewAuthorities,
  learnerFindings: review.learnerFindings,
  governance: review.governance,
  checks: {
    exactFourFgcQlsReviewed: true,
    allThreeLanguagesReviewed: true,
    exactIntegrationEvidencePinned: true,
    frozenSourceReviewEvidencePinned: true,
    noLearnerFacingBlockerFound: true,
    productOwnerApprovalNotOverclaimed: true,
    mergeNotAuthorized: true,
    deploymentNotAuthorized: true,
    generatedItemsNotApproved: true,
    automaticPublicationStillDisabled: true,
    manualApprovalStillRequired: true,
  },
  nextGate: review.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fgc-question-studio-operator-review-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
