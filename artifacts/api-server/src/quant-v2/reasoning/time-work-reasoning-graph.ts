import type { CanonicalTimeWorkProblem } from "../canonical/time-work-types";

export function buildTimeWorkReasoningGraph(problem: CanonicalTimeWorkProblem) {
  return {
    id: `${problem.id}:graph`,
    topic: "time-work",
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
