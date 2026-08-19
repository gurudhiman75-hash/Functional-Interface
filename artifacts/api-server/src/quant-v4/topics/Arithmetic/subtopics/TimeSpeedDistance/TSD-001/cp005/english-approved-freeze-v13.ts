import { generateCp005ReviewSetV13 } from "./english-review-runtime-v13";

export const TSD_CP005_ENGLISH_APPROVED_SOURCE_HEAD = "93b1f84ddd054acdcdbbc787281cc2dc47782bfb" as const;
export const TSD_CP005_ENGLISH_APPROVED_WORKFLOW_RUN_ID = 32213562607 as const;
export const TSD_CP005_ENGLISH_APPROVED_ARTIFACT_ID = 9351577376 as const;
export const TSD_CP005_ENGLISH_APPROVED_ARTIFACT_DIGEST = "sha256:e65a6509f68fff612e45dcc9c5ab46587b5816e53c6e0a75464ac49d1ae42beb" as const;
export const TSD_CP005_ENGLISH_FREEZE_ID = "TSD-CP-005-EN-v13-frozen" as const;
export const TSD_CP005_ENGLISH_FREEZE_STATUS = "APPROVED_ENGLISH_FROZEN" as const;
export const TSD_CP005_PRODUCT_OWNER_APPROVAL_DATE = "2026-08-19" as const;
export const TSD_CP005_PRODUCT_OWNER_APPROVAL_RECORDED = true as const;

/**
 * Product-owner approved English learner authority for TSD-CP-005.
 *
 * The exact reviewed V13 learner surface remains the content authority. This
 * wrapper changes lifecycle metadata only. Mathematical identity, QLs, solve
 * modes, object/context assignments, stems, answers, options and explanations
 * must remain byte-equivalent to the approved V13 source.
 *
 * Hindi/Punjabi localization, Question Studio, Question Bank storage, test
 * eligibility, publication, deployment and merge remain separate gates.
 */
export function generateCp005ApprovedEnglishFrozenQuestions(perAuthority = 6) {
  return Object.freeze(
    generateCp005ReviewSetV13(perAuthority).map((row) => Object.freeze({
      ...row,
      lifecycle: Object.freeze({
        reviewStatus: TSD_CP005_ENGLISH_FREEZE_STATUS,
        englishFreezeStatus: "FROZEN" as const,
        productOwnerApprovalRecorded: TSD_CP005_PRODUCT_OWNER_APPROVAL_RECORDED,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    })),
  );
}

export const TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q = generateCp005ApprovedEnglishFrozenQuestions(6);
