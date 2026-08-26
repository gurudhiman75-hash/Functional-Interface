import { SEA002_CP008_PERMANENT_QL_REGISTRY, SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008 } from "../permanent/registry.ts";
import { SEA002_CP008_SOURCE_SATURATION_V3 } from "../source-saturation-v3.ts";
import { SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2 } from "../review-fingerprints-v2.ts";

export const SEA002_CP008_PREFREEZE_AUTHORITY_V2 = Object.freeze({
  checkpointId: "SEA-CP-008" as const,
  permanentQlIds: Object.freeze(SEA002_CP008_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId)),
  permanentAuthorityCount: SEA002_CP008_PERMANENT_QL_REGISTRY.length,
  productionSourceSaturation: SEA002_CP008_SOURCE_SATURATION_V3.productionSourceSaturationClaimed,
  english: Object.freeze({
    status: "V3_EXAM_REAL_REVIEW_READY_CI_RECERTIFICATION_AND_HUMAN_APPROVAL_PENDING" as const,
    renderer: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.renderer,
    productionGraphVersion: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.productionGraphVersion,
    difficultyPolicy: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.difficultyPolicy,
    discoveryConstraintSpineUsed: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.discoveryConstraintSpineUsed,
    canonicalSurfaces: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.englishCanonicalSurfaces,
    reviewFingerprint: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.englishReviewFingerprint,
    humanApprovalStatus: "PENDING" as const,
  }),
  localization: Object.freeze({
    status: "V3_SOURCE_GRAPH_LOCALIZATION_REVIEW_READY_CI_RECERTIFICATION_AND_HUMAN_APPROVAL_PENDING" as const,
    locales: Object.freeze(["hi-IN", "pa-IN"] as const),
    localizedSurfaces: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.localizedSurfaces,
    reviewFingerprint: SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2.localizationReviewFingerprint,
    languageFidelityPolicy: "GENDER_NEUTRAL_STRUCTURED_RENDERING_EDITORIAL_VARIETY_V2" as const,
    humanApprovalStatus: "PENDING" as const,
  }),
  productOwnerApprovalStatus: "PENDING" as const,
  freezeStatus: "NOT_FROZEN" as const,
  approvalRequiredBeforeFreeze: true as const,
  questionStudioActivationEligible: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  productionStaging: false as const,
  publiclyPublishable: false as const,
  automaticStudentDelivery: false as const,
  nextPermanentQlId: SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID_AFTER_CP008,
});

export function assertSea002Cp008PrefreezeBoundaryV2(): void {
  const authority = SEA002_CP008_PREFREEZE_AUTHORITY_V2;
  if (!authority.productionSourceSaturation || authority.permanentAuthorityCount !== 7) {
    throw new Error("SEA-CP-008 V3 pre-freeze authority requires the proven seven-authority source-saturated set.");
  }
  if (authority.english.canonicalSurfaces !== 42 || authority.localization.localizedSurfaces !== 84) {
    throw new Error("SEA-CP-008 V3 review-surface cardinality drifted.");
  }
  if (authority.english.discoveryConstraintSpineUsed !== false) {
    throw new Error("SEA-CP-008 V3 cannot certify learner surfaces derived from discovery constraint spines.");
  }
  if (authority.productOwnerApprovalStatus !== "PENDING" || authority.freezeStatus !== "NOT_FROZEN") {
    throw new Error("SEA-CP-008 V3 must not claim freeze before explicit product-owner approval.");
  }
  if (authority.questionStudioActivationEligible
    || authority.questionStudioRegistered
    || authority.questionBankWritable
    || authority.testEligible
    || authority.mockTestEligible
    || authority.productionStaging
    || authority.publiclyPublishable
    || authority.automaticStudentDelivery) {
    throw new Error("SEA-CP-008 V3 pre-freeze authority must keep every downstream product surface locked.");
  }
  if (SEA002_CP008_PERMANENT_QL_REGISTRY.some((entry) =>
    entry.active
    || entry.questionStudioDiscoverable
    || entry.questionBankWritable
    || entry.testEligible
    || entry.mockTestEligible
    || entry.productionStaging
    || entry.publiclyPublishable
    || entry.automaticStudentPublication)) {
    throw new Error("SEA-CP-008 permanent QLs drifted active before V3 approval/freeze.");
  }
  if (authority.english.reviewFingerprint.length !== 64 || authority.localization.reviewFingerprint.length !== 64) {
    throw new Error("SEA-CP-008 V3 review fingerprints are not valid SHA-256 identities.");
  }
}
