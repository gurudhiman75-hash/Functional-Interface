import type { Pct002Parameters, Pct002ReasoningGraph, Pct002ReasoningNode, Pct002SolverResult } from "./types";

export function buildPct002ReasoningGraph(parameters: Pct002Parameters, solver: Pct002SolverResult): Pct002ReasoningGraph {
  const evidenceNodes: Pct002ReasoningNode[] = Object.entries(solver.evidence).map(([key, value]) => ({
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
