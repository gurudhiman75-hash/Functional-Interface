import {
  GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2,
  generateGeometryPermanentMultilingualReviewV2,
  type GeometryPermanentMultilingualReviewItemV2,
} from "./geometry-permanent-multilingual-review-v2";
import { GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2 } from "./geometry-permanent-multilingual-review-proof-v2";

if (!GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.lifecycle.multilingualFreezeAllowed) {
  throw new Error("Geometry multilingual freeze is not authorized by the approved V2 review artifact proof.");
}
if (GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.approval.approvedArtifactId !== 9690420669) {
  throw new Error("Geometry multilingual freeze approval artifact drifted.");
}
if (GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.permanentQlCount !== 75) {
  throw new Error("Geometry multilingual freeze requires exactly 75 permanent QLs.");
}
if (GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount !== 81) {
  throw new Error("Geometry multilingual freeze requires exactly 81 mapped prototype variants.");
}

export interface GeometryPermanentMultilingualFrozenItemV1 extends Omit<
  GeometryPermanentMultilingualReviewItemV2,
  "maturity" | "reviewStatus" | "multilingualImplementationFrozen"
> {
  readonly multilingualFreezeAuthorityId: "GEO-PERMANENT-MULTILINGUAL-FREEZE-V1";
  readonly localizationReviewProofAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-PROOF-V2";
  readonly approvedMultilingualReviewArtifactId: 9690420669;
  readonly approvedMultilingualReviewArtifactDigest: "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6";
  readonly maturity: "PERMANENT_MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "EXACT_V2_REVIEW_ARTIFACT_APPROVED_AND_FROZEN";
  readonly multilingualImplementationFrozen: true;
}

export function generateGeometryPermanentMultilingualFrozenV1(
  qlId: string,
  seed: string,
  locale: "hi-IN" | "pa-IN",
  requestedVariantIndex?: number,
): GeometryPermanentMultilingualFrozenItemV1 {
  const reviewed = generateGeometryPermanentMultilingualReviewV2(qlId, seed, locale, requestedVariantIndex);
  if (
    reviewed.active
    || reviewed.questionStudioDiscoverable
    || reviewed.questionBankWritable
    || reviewed.testEligible
    || reviewed.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${locale}: reviewed Geometry multilingual source crossed its pre-freeze lifecycle boundary.`);
  }
  return Object.freeze({
    ...reviewed,
    multilingualFreezeAuthorityId: "GEO-PERMANENT-MULTILINGUAL-FREEZE-V1",
    localizationReviewProofAuthorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-PROOF-V2",
    approvedMultilingualReviewArtifactId: 9690420669,
    approvedMultilingualReviewArtifactDigest: "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
    maturity: "PERMANENT_MULTILINGUAL_IMPLEMENTATION_FROZEN",
    reviewStatus: "EXACT_V2_REVIEW_ARTIFACT_APPROVED_AND_FROZEN",
    multilingualImplementationFrozen: true,
  } satisfies GeometryPermanentMultilingualFrozenItemV1);
}

export const GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-MULTILINGUAL-FREEZE-V1",
  authorityRevision: 3,
  status: "PERMANENT_HINDI_PUNJABI_IMPLEMENTATION_FROZEN__CI_PROOF_PENDING",
  sourceLocalizationReviewAuthorityId: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.authorityId,
  localizationReviewProofAuthorityId: GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.authorityId,
  approvedReviewArtifactId: GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.approval.approvedArtifactId,
  approvedReviewArtifactDigest: GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.approval.approvedArtifactDigest,
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount,
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  lifecycle: Object.freeze({
    englishFreezeProven: true,
    localizationV2Proven: true,
    exactMultilingualV2ReviewArtifactApproved: true,
    multilingualImplementationFrozen: true,
    multilingualFreezeProven: false,
    questionStudioActivationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWriteAllowed: false,
    questionBankWritable: false,
    testEligibilityAllowed: false,
    testEligible: false,
    publicPublicationAllowed: false,
    publiclyPublishable: false,
    prMergeAuthorized: false,
  }),
  postProofNextGate: "QUESTION_STUDIO_INTEGRATION_IMPLEMENTATION",
} as const);
