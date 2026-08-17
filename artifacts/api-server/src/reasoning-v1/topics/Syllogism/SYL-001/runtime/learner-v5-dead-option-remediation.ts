import type { SylLearnerPresentationV5 } from "./learner-v5-types";

export function markDeadOptionRemediationV5(
  presentation: SylLearnerPresentationV5,
): SylLearnerPresentationV5 {
  return {
    ...presentation,
    remediationEvidence: {
      ...presentation.remediationEvidence,
      deadOptionRemediationStatus: "REMOVED_THREE_STATUS_DIAGNOSTIC",
    },
  };
}
