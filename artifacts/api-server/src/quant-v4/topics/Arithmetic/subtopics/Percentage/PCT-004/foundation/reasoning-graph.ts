import type { Pct004Parameters, Pct004ReasoningGraph, Pct004ReasoningNode, Pct004SolverResult } from "./types";

export function buildPct004ReasoningGraph(parameters: Pct004Parameters, solver: Pct004SolverResult): Pct004ReasoningGraph {
  const evidenceNodes: Pct004ReasoningNode[] = Object.entries(solver.evidence).map(([key, value]) => ({
    id: `evidence:${key}`,
    label: `Evidence ${key}`,
    value,
  }));

  return {
    graphId: `${parameters.questionId}:graph`,
    nodes: [
      { id: "inputs", label: "Captured inputs", value: parameters.variables },
      { id: "task", label: "Selected task kind", value: parameters.taskKind },
      { id: "answerType", label: "Declared answer type", value: parameters.answerType },
      ...evidenceNodes,
      { id: "mathJax", label: "MathJax evidence", value: solver.mathJax },
      { id: "answer", label: "Final answer", value: solver.answer },
    ],
  };
}
