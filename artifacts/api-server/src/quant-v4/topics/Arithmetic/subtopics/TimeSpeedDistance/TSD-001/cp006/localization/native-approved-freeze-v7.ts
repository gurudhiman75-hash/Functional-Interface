import { generateCp006NativeReviewV7 } from "./native-review-editorial-v7";

export const TSD_CP006_HI_PA_APPROVED_SOURCE_HEAD =
  "362f0d9f66dd2944de7a89a0f0a7dc3c17d2e66e" as const;
export const TSD_CP006_HI_PA_FREEZE_ID = "TSD-CP-006-HI-PA-v7-frozen" as const;
export const TSD_CP006_HI_PA_FREEZE_STATUS = "APPROVED_NATIVE_FROZEN" as const;
export const TSD_CP006_HI_PA_PRODUCT_OWNER_APPROVAL_DATE = "2026-08-21" as const;
export const TSD_CP006_HI_PA_APPROVED_WORKFLOW_RUN_ID = 32357700409 as const;
export const TSD_CP006_HI_PA_APPROVED_ARTIFACT_ID = 9402292419 as const;
export const TSD_CP006_HI_PA_APPROVED_ARTIFACT_DIGEST =
  "sha256:129d7947d79448b7eb5da0184992be99c75cf2c3fa142ff5bc9b3d866c90162a" as const;
export const TSD_CP006_HI_PA_APPROVED_JSON_SHA256 =
  "84548f9014f23957ede31ad717d774cd1f10dc46c3b2d71626a1c18ed905f648" as const;

type SourceRow = ReturnType<typeof generateCp006NativeReviewV7>[number];

function freezeRow(row: SourceRow) {
  return Object.freeze({
    source: row.source,
    presentation: Object.freeze({
      ...row.presentation,
      lifecycle: Object.freeze({
        nativeReviewStatus: TSD_CP006_HI_PA_FREEZE_STATUS,
        multilingualFreezeStatus: "FROZEN" as const,
        productOwnerApprovalRecorded: true as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    }),
    approvedNativeFreeze: Object.freeze({
      freezeId: TSD_CP006_HI_PA_FREEZE_ID,
      approvedSourceHead: TSD_CP006_HI_PA_APPROVED_SOURCE_HEAD,
      status: TSD_CP006_HI_PA_FREEZE_STATUS,
      productOwnerApprovalDate: TSD_CP006_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
      productOwnerApprovalRecorded: true as const,
      approvalBasis: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
      approvedWorkflowRunId: TSD_CP006_HI_PA_APPROVED_WORKFLOW_RUN_ID,
      approvedArtifactId: TSD_CP006_HI_PA_APPROVED_ARTIFACT_ID,
      approvedArtifactDigest: TSD_CP006_HI_PA_APPROVED_ARTIFACT_DIGEST,
      approvedJsonSha256: TSD_CP006_HI_PA_APPROVED_JSON_SHA256,
      contentIdentityRequired: true as const,
      englishAuthorityMutationAllowed: false as const,
      nativeLearnerContentMutationAllowed: false as const,
      multilingualFreezeAuthorized: true as const,
      questionStudioActivationAuthorized: false as const,
      questionBankStorageAuthorized: false as const,
      testEligibilityAuthorized: false as const,
      publicPublicationAuthorized: false as const,
      mergeAuthorized: false as const,
    }),
  });
}

export function generateCp006ApprovedNativeFrozenV7() {
  return Object.freeze(generateCp006NativeReviewV7().map(freezeRow));
}

export const TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q =
  generateCp006ApprovedNativeFrozenV7();
