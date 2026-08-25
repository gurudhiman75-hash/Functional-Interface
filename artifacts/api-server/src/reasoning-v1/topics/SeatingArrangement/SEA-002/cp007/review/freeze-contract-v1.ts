import { SEA002_CP007_PREFREEZE_AUTHORITY_V1 } from "./prefreeze-authority-v1.ts";

export type Sea002Cp007ExplicitApproval = Readonly<{
  approvedBy: "PRODUCT_OWNER";
  approvedAt: string;
  englishReviewFingerprint: typeof SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint;
  localizationReviewFingerprint: typeof SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint;
  englishArtifactId: typeof SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.artifactId;
  localizationArtifactId: typeof SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.artifactId;
}>;

export function buildSea002Cp007FrozenAuthority(
  approval: Sea002Cp007ExplicitApproval,
) {
  if (approval.approvedBy !== "PRODUCT_OWNER") {
    throw new Error("SEA-CP-007 freeze requires explicit PRODUCT_OWNER approval.");
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(approval.approvedAt)) {
    throw new Error("SEA-CP-007 approval timestamp must be an explicit UTC ISO timestamp.");
  }
  if (approval.englishReviewFingerprint !== SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint) {
    throw new Error("SEA-CP-007 English approval fingerprint does not match the pinned V7 review candidate.");
  }
  if (approval.localizationReviewFingerprint !== SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint) {
    throw new Error("SEA-CP-007 localization approval fingerprint does not match the pinned V2 review candidate.");
  }
  if (approval.englishArtifactId !== SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.artifactId) {
    throw new Error("SEA-CP-007 English approval artifact is stale or incorrect.");
  }
  if (approval.localizationArtifactId !== SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.artifactId) {
    throw new Error("SEA-CP-007 localization approval artifact is stale or incorrect.");
  }

  return Object.freeze({
    checkpointId: SEA002_CP007_PREFREEZE_AUTHORITY_V1.checkpointId,
    permanentQlIds: SEA002_CP007_PREFREEZE_AUTHORITY_V1.permanentQlIds,
    englishReviewFingerprint: approval.englishReviewFingerprint,
    localizationReviewFingerprint: approval.localizationReviewFingerprint,
    englishArtifactId: approval.englishArtifactId,
    localizationArtifactId: approval.localizationArtifactId,
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
    nextPermanentQlId: SEA002_CP007_PREFREEZE_AUTHORITY_V1.nextPermanentQlId,
  });
}
