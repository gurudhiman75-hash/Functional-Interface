import type { Pct007Parameters, Pct007ReasoningGraph, Pct007ReasoningNode, Pct007SolverResult } from "./types";

export function buildPct007ReasoningGraph(parameters: Pct007Parameters, solver: Pct007SolverResult): Pct007ReasoningGraph {
  const evidenceNodes: Pct007ReasoningNode[] = Object.entries(solver.evidence).map(([key, value]) => ({
    id: `evidence:${key}`,
    label: `Evidence ${key}`,
    value,
  }));

  return {
    graphId: `${parameters.questionId}:graph`,
    nodes: [
      { id: "inputs", label: "Captured inputs", value: parameters.variables },
      { id: "task", label: "Selected task kind", value: parameters.taskKind },
      { id: "solveMode", label: "Selected solve mode", value: parameters.solveMode },
      { id: "answerType", label: "Declared answer type", value: parameters.answerType },
      ...evidenceNodes,
      { id: "mathJax", label: "MathJax evidence", value: solver.mathJax },
      { id: "answer", label: "Final answer", value: solver.answer },
    ],
  };
}
