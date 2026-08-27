import assert from "node:assert/strict";

import {
  assertSea002Cp008CertifiedEvidenceV2,
  SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2,
} from "./certified-evidence-v2.ts";
import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";

assert.doesNotThrow(() => assertSea002Cp008CertifiedEvidenceV2());
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.certificationStatus, "CI_CERTIFIED_REVIEW_CONTENT_V3");
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.renderer, "EXAM_REAL_SQUARE_PRODUCTION_GRAPH_V3_EDITORIAL_V2");
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.productionGraphVersion, "EXAM_REAL_PRODUCTION_GRAPH_V3");
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.difficultyPolicy, "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY");
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.discoveryConstraintSpineUsed, false);
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.englishReviewFingerprint, SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint);
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.localizationReviewFingerprint, SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint);
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.englishCanonicalSurfaces, 42);
assert.equal(SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.localizedSurfaces, 84);
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.productOwnerApprovalStatus, "PENDING");
assert.equal(SEA002_CP008_PREFREEZE_AUTHORITY_V2.freezeStatus, "NOT_FROZEN");

console.log("PASS_SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2");
console.log("certified review head", SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.certifiedReviewHeadSha);
console.log("combined prefreeze run", SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.combinedPrefreezeRunId);
console.log("artifact", SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactId);
console.log("artifact digest", SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactDigest);
console.log("production graph", SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.productionGraphVersion);
console.log("approval/freeze", "PENDING", "NOT_FROZEN");
