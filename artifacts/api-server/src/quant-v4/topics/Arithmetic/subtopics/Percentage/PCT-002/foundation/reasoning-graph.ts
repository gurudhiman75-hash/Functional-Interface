import type { Pct002Parameters, Pct002ReasoningGraph, Pct002ReasoningNode, Pct002SolverResult } from "./types";

export function buildPct002ReasoningGraph(parameters: Pct002Parameters, solver: Pct002SolverResult): Pct002ReasoningGraph {
  const evidenceNodes: Pct002ReasoningNode[] = Object.entries(solver.evidence).map(([key, value]) => ({
    id: key,
    label: key,
    value,
  }));

  return {
    graphId: `${parameters.questionId}:graph`,
    nodes: [
      { id: "taskKind", label: "taskKind", value: parameters.taskKind },
      { id: "answerType", label: "answerType", value: parameters.answerType },
      { id: "answer", label: "answer", value: solver.answer },
      ...evidenceNodes,
    ],
  };
}
