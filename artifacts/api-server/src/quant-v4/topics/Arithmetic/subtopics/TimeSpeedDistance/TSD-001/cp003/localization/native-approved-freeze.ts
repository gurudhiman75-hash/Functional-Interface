import {
  generateCp003AllFinalNativeReviewCandidates,
  generateCp003FinalNativeReviewCandidate,
  type TsdCp003FinalNativeReviewRow,
} from "./native-final-polished-candidate";
import type { TsdCp003NativeLanguage } from "./native-language-primitives";

export const TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD =
  "49965e649a7f688c2dd9f3ca5a2c909dc0240423" as const;
export const TSD_CP003_HI_PA_FREEZE_ID = "TSD-CP-003-HI-PA-v1-frozen" as const;
export const TSD_CP003_HI_PA_FREEZE_STATUS = "APPROVED_NATIVE_FROZEN" as const;

export type TsdCp003ApprovedNativeFreezeRow = Readonly<{
  source: TsdCp003FinalNativeReviewRow["source"];
  presentation: Omit<TsdCp003FinalNativeReviewRow["presentation"], "lifecycle"> & Readonly<{
    lifecycle: Readonly<{
      nativeEditorialStatus: typeof TSD_CP003_HI_PA_FREEZE_STATUS;
      multilingualFreezeStatus: "FROZEN";
      questionStudioEnabled: false;
      questionBankStatus: "NOT_STORED";
      testEligibility: "INELIGIBLE";
      publiclyPublishable: false;
    }>;
  }>;
  approvedNativeFreeze: Readonly<{
    freezeId: typeof TSD_CP003_HI_PA_FREEZE_ID;
    approvedSourceHead: typeof TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD;
    status: typeof TSD_CP003_HI_PA_FREEZE_STATUS;
    productOwnerApprovalRecorded: true;
    approvalBasis: "EXPLICIT_PRODUCT_OWNER_APPROVAL";
    contentIdentityRequired: true;
    semanticSentenceParityPreserved: true;
    sourceContextParityPreserved: true;
    multilingualFreezeAuthorized: true;
    sourceMathChanged: false;
    questionStudioActivationAuthorized: false;
    questionBankStorageAuthorized: false;
    testEligibilityAuthorized: false;
    publicPublicationAuthorized: false;
    mergeAuthorized: false;
  }>;
}>;

function freezeRow(row: TsdCp003FinalNativeReviewRow): TsdCp003ApprovedNativeFreezeRow {
  return Object.freeze({
    source: row.source,
    presentation: Object.freeze({
      ...row.presentation,
      lifecycle: Object.freeze({
        nativeEditorialStatus: TSD_CP003_HI_PA_FREEZE_STATUS,
        multilingualFreezeStatus: "FROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    }),
    approvedNativeFreeze: Object.freeze({
      freezeId: TSD_CP003_HI_PA_FREEZE_ID,
      approvedSourceHead: TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
      status: TSD_CP003_HI_PA_FREEZE_STATUS,
      productOwnerApprovalRecorded: true as const,
      approvalBasis: "EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
      contentIdentityRequired: true as const,
      semanticSentenceParityPreserved: true as const,
      sourceContextParityPreserved: true as const,
      multilingualFreezeAuthorized: true as const,
      sourceMathChanged: false as const,
      questionStudioActivationAuthorized: false as const,
      questionBankStorageAuthorized: false as const,
      testEligibilityAuthorized: false as const,
      publicPublicationAuthorized: false as const,
      mergeAuthorized: false as const,
    }),
  });
}

export function generateCp003ApprovedNativeFrozenRows(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003ApprovedNativeFreezeRow[] {
  return Object.freeze(generateCp003FinalNativeReviewCandidate(language).map(freezeRow));
}

export function generateCp003AllApprovedNativeFrozenRows(): readonly TsdCp003ApprovedNativeFreezeRow[] {
  return Object.freeze(generateCp003AllFinalNativeReviewCandidates().map(freezeRow));
}
