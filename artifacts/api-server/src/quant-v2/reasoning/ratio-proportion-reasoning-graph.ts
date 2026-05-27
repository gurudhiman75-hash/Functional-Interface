import type { CanonicalRatioProportionProblem } from "../canonical/ratio-proportion-types";

export function buildRatioProportionReasoningGraph(problem: CanonicalRatioProportionProblem) {
  return {
    id: `${problem.id}:graph`,
    topic: "ratio-proportion",
    topology: problem.topology,
    steps: problem.explanationSteps.map((step, index) => ({
      id: step.key,
      order: index + 1,
      label: step.text.en,
      expression: step.math,
      value: step.value,
    })),
  };
}
