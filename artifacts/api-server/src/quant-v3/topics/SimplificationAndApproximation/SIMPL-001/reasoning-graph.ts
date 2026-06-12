import type { Simpl001Parameters } from "./parameter-generator";
import type { Simpl001SolverResult } from "./solver";

export interface Simpl001ReasoningNode {
  id: string;
  label: string;
  value: string;
}

export interface Simpl001ReasoningGraph {
  graphId: string;
  canonicalProblemId: string;
  nodes: Simpl001ReasoningNode[];
}

const NODE_IDS: Record<Simpl001Parameters["canonicalProblemId"], string[]> = {
  "CP-001": ["captureExpression", "applyBodmas", "answer"],
  "CP-002": ["captureFractionExpression", "applyFractionOperations", "reduceResult", "answer"],
  "CP-003": ["captureDecimalExpression", "applyDecimalOperations", "answer"],
  "CP-004": ["captureMixedExpression", "normalizeMixedValues", "simplifyResult", "answer"],
  "CP-005": ["captureRootPowerExpression", "evaluateRootsAndPowers", "answer"],
  "CP-006": ["captureExpression", "roundValues", "computeEstimate", "answer"],
  "CP-007": ["captureExpression", "computeOrEstimate", "selectNearestValue", "answer"],
};

export function buildSimpl001ReasoningGraph(
  parameters: Simpl001Parameters,
  solver: Simpl001SolverResult,
): Simpl001ReasoningGraph {
  const nodes = NODE_IDS[parameters.canonicalProblemId].map((id) => ({
    id,
    label: id,
    value: id === "answer" ? solver.answer : solver.expression,
  }));
  return {
    graphId: `${parameters.questionId}:graph`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes,
  };
}
