import { generateCp006EnglishReviewSetV5 } from "./english-review-runtime-v5";

export const TSD_CP006_ENGLISH_APPROVED_SOURCE_HEAD = "d9ce572bbdb66b931dd298546d74ae7cac0ca248" as const;
export const TSD_CP006_ENGLISH_APPROVED_WORKFLOW_RUN_ID = 32337853471 as const;
export const TSD_CP006_ENGLISH_APPROVED_ARTIFACT_ID = 9395273089 as const;
export const TSD_CP006_ENGLISH_APPROVED_ARTIFACT_DIGEST = "sha256:edcb596311d109dde7597a1f75d2f201e0948146d55bc019a8e768e2be224ade" as const;
export const TSD_CP006_ENGLISH_APPROVED_JSON_SHA256 = "4ce05894ab7934b7111e652375a0188ff65bbdf60bf924683e6d86c392ef47cb" as const;
export const TSD_CP006_ENGLISH_FREEZE_ID = "TSD-CP-006-EN-v5-frozen" as const;
export const TSD_CP006_ENGLISH_FREEZE_STATUS = "APPROVED_ENGLISH_FROZEN" as const;
export const TSD_CP006_PRODUCT_OWNER_APPROVAL_DATE = "2026-08-20" as const;
export const TSD_CP006_PRODUCT_OWNER_APPROVAL_RECORDED = true as const;

/**
 * Product-owner approved English learner authority for TSD-CP-006.
 *
 * The exact reviewed V5 surface is immutable learner content. This wrapper may
 * change lifecycle metadata only. QLs, solve modes, inputs, stems, options,
 * correct-answer identity, explanations, object families, route contexts and
 * difficulty labels must remain equivalent to the approved V5 source.
 *
 * Hindi/Punjabi localization, Question Studio enablement, Question Bank
 * storage, test eligibility, public publication, deployment and merge remain
 * independent downstream gates.
 */
export function generateCp006ApprovedEnglishFrozenQuestions() {
  return Object.freeze(
    generateCp006EnglishReviewSetV5().map((row) => Object.freeze({
      ...row,
      lifecycle: Object.freeze({
        englishReviewStatus: TSD_CP006_ENGLISH_FREEZE_STATUS,
        englishFreezeStatus: "FROZEN" as const,
        productOwnerApprovalRecorded: TSD_CP006_PRODUCT_OWNER_APPROVAL_RECORDED,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    })),
  );
}

export const TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q = generateCp006ApprovedEnglishFrozenQuestions();
