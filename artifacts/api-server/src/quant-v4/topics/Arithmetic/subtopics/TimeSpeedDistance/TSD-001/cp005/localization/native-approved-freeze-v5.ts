import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5 } from "./native-review-editorial-v5";
import type { TsdCp005NativeReviewRowV1 } from "./native-review-candidate-v1";

export const TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD =
  "6f619fe95c108434d1db6c59f3d38b8c5bffa434" as const;
export const TSD_CP005_HI_PA_FREEZE_ID = "TSD-CP-005-HI-PA-v5-frozen" as const;
export const TSD_CP005_HI_PA_FREEZE_STATUS = "APPROVED_NATIVE_FROZEN" as const;
export const TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE = "2026-08-20" as const;
export const TSD_CP005_HI_PA_APPROVED_WORKFLOW_RUN_ID = 32275777332 as const;
export const TSD_CP005_HI_PA_APPROVED_ARTIFACT_ID = 9373944402 as const;
export const TSD_CP005_HI_PA_APPROVED_ARTIFACT_DIGEST =
  "sha256:53c8e2bafa0582304ced8d678c854ad5b75ef13986f2f47df442247173c4da0b" as const;
export const TSD_CP005_HI_PA_APPROVED_JSON_SHA256 =
  "6f423143d4059e3e90c4001629e38b6d5c74fd223c720e9b0bf2951ee7cedb6a" as const;

function freezeRow(row: TsdCp005NativeReviewRowV1) {
  return Object.freeze({
    source: row.source,
    presentation: Object.freeze({
      ...row.presentation,
      lifecycle: Object.freeze({
        nativeReviewStatus: TSD_CP005_HI_PA_FREEZE_STATUS,
        multilingualFreezeStatus: "FROZEN" as const,
        productOwnerApprovalRecorded: true as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    }),
    approvedNativeFreeze: Object.freeze({
      freezeId: TSD_CP005_HI_PA_FREEZE_ID,
      approvedSourceHead: TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD,
      status: TSD_CP005_HI_PA_FREEZE_STATUS,
      productOwnerApprovalDate: TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
      productOwnerApprovalRecorded: true as const,
      approvalBasis: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
      approvedWorkflowRunId: TSD_CP005_HI_PA_APPROVED_WORKFLOW_RUN_ID,
      approvedArtifactId: TSD_CP005_HI_PA_APPROVED_ARTIFACT_ID,
      approvedArtifactDigest: TSD_CP005_HI_PA_APPROVED_ARTIFACT_DIGEST,
      approvedJsonSha256: TSD_CP005_HI_PA_APPROVED_JSON_SHA256,
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

export function generateCp005ApprovedNativeFrozenV5() {
  return Object.freeze(TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5.map(freezeRow));
}

export const TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q =
  generateCp005ApprovedNativeFrozenV5();
