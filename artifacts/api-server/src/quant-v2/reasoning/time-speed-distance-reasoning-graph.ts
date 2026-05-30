import type { CanonicalTimeSpeedDistanceProblem } from "../canonical/time-speed-distance-types";

export function buildTimeSpeedDistanceReasoningGraph(problem: CanonicalTimeSpeedDistanceProblem) {
  return {
    id: `${problem.id}:graph`,
    topic: "time-speed-distance",
    topology: problem.topology,
    principle: problem.principle.en,
    formulaModel: problem.formulaModel,
    shortcut: problem.shortcut.en,
    steps: problem.explanationSteps.map((step, index) => ({
      id: step.key,
      order: index + 1,
      label: step.text.en,
      expression: step.math,
      value: step.value,
    })),
  };
}
