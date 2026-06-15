import type { Pct001Parameters, Pct001ReasoningGraph, Pct001SolverResult } from "./types";

export function buildPct001ReasoningGraph(parameters: Pct001Parameters, solver: Pct001SolverResult): Pct001ReasoningGraph {
  return {
    graphId: `${parameters.questionId}:graph`,
    nodes: [
      { id: "inputs", label: "Captured inputs", value: parameters.variables },
      { id: "task", label: "Selected mathematical task", value: parameters.taskKind },
      { id: "answerType", label: "Declared answer type", value: parameters.answerType },
      { id: "calculation", label: "Computed percentage result", value: solver.evidence },
      { id: "answer", label: "Final answer", value: solver.answer },
    ],
  };
}
