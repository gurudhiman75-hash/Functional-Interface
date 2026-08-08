import type { SylLearnerPresentationV5 } from "./learner-v5-types";

export function markQuestionExplanationApprovalV5(
  presentation: SylLearnerPresentationV5,
): SylLearnerPresentationV5 {
  return {
    ...presentation,
    remediationEvidence: {
      ...presentation.remediationEvidence,
      nativeEnglishEditorialStatus: "APPROVED_BY_PRODUCT_OWNER",
      nativeHindiEditorialStatus: "APPROVED_BY_PRODUCT_OWNER",
      nativePunjabiEditorialStatus: "APPROVED_BY_PRODUCT_OWNER",
      humanViewportStatus: "APPROVED",
    },
  };
}
