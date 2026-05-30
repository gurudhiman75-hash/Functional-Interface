import type { CanonicalNumberSystemProblem } from "../canonical/number-system-types";

export function buildNumberSystemReasoningGraph(problem: CanonicalNumberSystemProblem) {
  return {
    id: `${problem.id}:graph`,
    topic: "number-system",
    topology: problem.topology,
    principle: problem.principle.en,
    formulaModel: problem.formulaModel,
    preferredSolutionMethod: problem.preferredSolutionMethod,
    graphDepth: problem.reasoningDepth,
    nodes: [
      { id: "observe", label: "Observe the number-system condition" },
      { id: "transform", label: "Transform into divisibility, factor, cycle, or digit relation" },
      { id: "solve", label: "Solve the reduced relation" },
      { id: "verify", label: "Verify against the original condition" },
    ],
    edges: [
      { from: "observe", to: "transform" },
      { from: "transform", to: "solve" },
      { from: "solve", to: "verify" },
    ],
    shortcutHints: [problem.shortcutExplanation.en],
    steps: problem.explanationSteps.map((step, index) => ({
      id: step.key,
      order: index + 1,
      label: step.text.en,
      expression: step.math,
      value: step.value,
    })),
  };
}
