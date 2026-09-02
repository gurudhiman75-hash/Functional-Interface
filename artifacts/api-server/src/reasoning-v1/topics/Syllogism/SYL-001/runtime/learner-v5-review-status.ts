import type { SylLearnerPresentationV5 } from "./learner-v5-types";
import {
  SYL_LEARNER_V5_APPROVAL_AUTHORITY,
  SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT,
  SYL_LEARNER_V5_APPROVED_ON,
} from "./learner-v5-types";

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
      approvalAuthority: SYL_LEARNER_V5_APPROVAL_AUTHORITY,
      approvedContentCommit: SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT,
      approvedOn: SYL_LEARNER_V5_APPROVED_ON,
    },
  };
}
