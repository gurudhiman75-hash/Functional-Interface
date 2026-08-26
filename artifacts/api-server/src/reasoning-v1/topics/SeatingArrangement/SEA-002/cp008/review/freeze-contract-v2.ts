import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";

export type Sea002Cp008ExplicitApprovalV2 = Readonly<{
  approvedBy: "PRODUCT_OWNER";
  approvedAt: string;
  englishReviewFingerprint: string;
  localizationReviewFingerprint: string;
}>;

export function buildSea002Cp008FrozenAuthorityV2(approval: Sea002Cp008ExplicitApprovalV2) {
  if (approval.approvedBy !== "PRODUCT_OWNER") {
    throw new Error("SEA-CP-008 V2 freeze requires explicit PRODUCT_OWNER approval.");
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(approval.approvedAt)) {
    throw new Error("SEA-CP-008 V2 approval timestamp must be an explicit UTC ISO timestamp.");
  }
  if (approval.englishReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint) {
    throw new Error("SEA-CP-008 V2 English approval fingerprint does not match the final review candidate.");
  }
  if (approval.localizationReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint) {
    throw new Error("SEA-CP-008 V2 localization approval fingerprint does not match the final review candidate.");
  }
  return Object.freeze({
    checkpointId: SEA002_CP008_PREFREEZE_AUTHORITY_V2.checkpointId,
    permanentQlIds: SEA002_CP008_PREFREEZE_AUTHORITY_V2.permanentQlIds,
    permanentAuthorityCount: SEA002_CP008_PREFREEZE_AUTHORITY_V2.permanentAuthorityCount,
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
    nextPermanentQlId: SEA002_CP008_PREFREEZE_AUTHORITY_V2.nextPermanentQlId,
  });
}
