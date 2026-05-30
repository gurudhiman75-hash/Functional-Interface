import type { CanonicalMixtureAlligationProblem } from "../canonical/mixture-alligation-types";

export function buildMixtureAlligationReasoningGraph(problem: CanonicalMixtureAlligationProblem) {
  return {
    id: `${problem.id}:graph`,
    topic: "mixture-alligation",
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
