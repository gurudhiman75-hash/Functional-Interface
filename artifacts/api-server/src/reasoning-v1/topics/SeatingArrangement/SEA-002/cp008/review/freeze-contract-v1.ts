import { SEA002_CP008_PREFREEZE_AUTHORITY_V1 } from "./prefreeze-authority-v1.ts";

export type Sea002Cp008ExplicitApproval = Readonly<{
  approvedBy: "PRODUCT_OWNER";
  approvedAt: string;
  englishReviewFingerprint: string;
  localizationReviewFingerprint: string;
}>;

export function buildSea002Cp008FrozenAuthority(
  approval: Sea002Cp008ExplicitApproval,
) {
  if (approval.approvedBy !== "PRODUCT_OWNER") {
    throw new Error("SEA-CP-008 freeze requires explicit PRODUCT_OWNER approval.");
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(approval.approvedAt)) {
    throw new Error("SEA-CP-008 approval timestamp must be an explicit UTC ISO timestamp.");
  }
  if (approval.englishReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint) {
    throw new Error("SEA-CP-008 English approval fingerprint does not match the pinned review candidate.");
  }
  if (approval.localizationReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint) {
    throw new Error("SEA-CP-008 localization approval fingerprint does not match the pinned review candidate.");
  }

  return Object.freeze({
    checkpointId: SEA002_CP008_PREFREEZE_AUTHORITY_V1.checkpointId,
    permanentQlIds: SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentQlIds,
    permanentAuthorityCount: SEA002_CP008_PREFREEZE_AUTHORITY_V1.permanentAuthorityCount,
    englishReviewFingerprint: approval.englishReviewFingerprint,
    localizationReviewFingerprint: approval.localizationReviewFingerprint,
    approvedBy: approval.approvedBy,
    approvedAt: approval.approvedAt,
    productOwnerApprovalStatus: "APPROVED" as const,
    englishFreezeStatus: "FROZEN" as const,
    localizationFreezeStatus: "FROZEN" as const,
    freezeStatus: "FROZEN" as const,
    questionStudioActivationEligible: true as const,
    questionStudioRegistered: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentDelivery: false as const,
    nextPermanentQlId: SEA002_CP008_PREFREEZE_AUTHORITY_V1.nextPermanentQlId,
  });
}
