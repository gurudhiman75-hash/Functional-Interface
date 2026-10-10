import { generateCp004ReviewQuestions } from "./runtime-engine";

export const TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD = "99b65d54c87bfe456182bbcbad5963d30579952c" as const;
export const TSD_CP004_ENGLISH_FREEZE_ID = "TSD-CP-004-EN-v1-frozen" as const;
export const TSD_CP004_ENGLISH_FREEZE_STATUS = "APPROVED_ENGLISH_FROZEN" as const;
export const TSD_CP004_PRODUCT_OWNER_APPROVAL_DATE = "2026-08-18" as const;
export const TSD_CP004_PRODUCT_OWNER_APPROVAL_RECORDED = true as const;

/**
 * Product-owner approved English learner surface for TSD-CP-004.
 *
 * The source candidate remains the exact V3 exam-readiness surface at
 * TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD. This wrapper changes lifecycle
 * metadata only; learner content and mathematical identity are preserved.
 *
 * Hindi/Punjabi localization, Question Studio, Question Bank storage, test
 * eligibility, public publication, deployment and merge remain separate gates.
 */
export function generateCp004ApprovedEnglishFrozenQuestions(perAuthority = 6) {
  return Object.freeze(
    generateCp004ReviewQuestions(perAuthority).map((row) => Object.freeze({
      ...row,
      lifecycle: Object.freeze({
        reviewStatus: TSD_CP004_ENGLISH_FREEZE_STATUS,
        englishFreezeStatus: "FROZEN" as const,
        productOwnerApprovalRecorded: TSD_CP004_PRODUCT_OWNER_APPROVAL_RECORDED,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    })),
  );
}

export const TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q = generateCp004ApprovedEnglishFrozenQuestions(6);
