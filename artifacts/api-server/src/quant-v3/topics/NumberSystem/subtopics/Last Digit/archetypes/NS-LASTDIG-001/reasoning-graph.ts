import type { NsLastdig001Parameters, NsLastdig001ReasoningGraph, NsLastdig001SolverResult } from "./types";

export function buildNsLastdig001ReasoningGraph(parameters: NsLastdig001Parameters, solver: NsLastdig001SolverResult): NsLastdig001ReasoningGraph {
  const ids = nodeIds(parameters.canonicalProblemId);
  const nodes = ids.map((id, index) => ({
    id,
    inputs: index === 0 ? { parameters } : { previous: ids[index - 1] },
    outputs: index === ids.length - 1 ? { answer: solver.answer } : { step: id },
  }));
  return {
    graphId: `${parameters.questionId}:graph`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes,
    edges: nodes.slice(0, -1).map((node, index) => ({ from: node.id, to: nodes[index + 1].id, relationship: "feeds" })),
    answerNodeId: nodes[nodes.length - 1].id,
    cycleLatex: solver.cycleLatex,
    cyclePositionLatex: solver.cyclePositionLatex,
    effectiveExponentLatex: solver.effectiveExponentLatex,
    productLastDigitLatex: solver.productLastDigitLatex,
    towerReductionLatex: solver.towerReductionLatex,
  };
}

function nodeIds(cpId: string) {
  if (cpId === "CP-001") return ["captureBaseLastDigit", "identifyCycle", "locateCyclePosition", "extractLastDigit"];
  if (cpId === "CP-002") return ["evaluatePower1", "evaluatePower2", "evaluatePower3IfPresent", "multiplyUnitDigits", "extractLastDigit"];
  if (cpId === "CP-003") return ["reduceTopExponent", "computeEffectiveExponent", "locateCyclePosition", "extractLastDigit"];
  if (cpId === "CP-004") return ["captureBase", "generateCycle", "identifyRepetition", "extractAnswer"];
  return ["identifyCycle", "findMatchingPositions", "evaluateOptions", "selectUniqueAnswer"];
}
