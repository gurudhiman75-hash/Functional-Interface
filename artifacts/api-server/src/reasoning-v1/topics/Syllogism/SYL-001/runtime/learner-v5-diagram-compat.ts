import type { SylLearnerDiagramV4 } from "./learner-v4-types";
import type { SylLearnerDiagramV5 } from "./learner-v5-types";

/**
 * V5 keeps the V4 semantic diagram contract but narrows the mobile canvas to
 * the approved 340-unit learner width. Promote old review evidence explicitly
 * instead of leaking a V4 type into the V5 pipeline.
 */
export function promoteLearnerDiagramV4ToV5(
  diagram: SylLearnerDiagramV4,
): SylLearnerDiagramV5 {
  return {
    ...diagram,
    mobileViewBoxWidth: 340,
  };
}
