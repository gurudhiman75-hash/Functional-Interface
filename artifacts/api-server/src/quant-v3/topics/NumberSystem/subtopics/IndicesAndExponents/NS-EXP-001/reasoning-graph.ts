import type { NsExp001Parameters, NsExp001ReasoningGraph, NsExp001SolverResult } from "./types";

const NODE_IDS = {
  CP01: ["captureExpression", "applyExponentLaw", "compressPower", "extractAnswer"],
  CP02: ["captureEquation", "matchBases", "equateExponents", "solveExponent", "extractAnswer"],
  CP03: ["captureExpression", "convertToCommonBase", "applyExponentLaw", "extractAnswer"],
  CP04: ["captureExpression", "identifyNegativeExponent", "convertToReciprocal", "extractAnswer"],
  CP05: ["captureExpression", "convertFractionalExponentToRoot", "evaluateRoot", "extractAnswer"],
  CP06: ["captureExpression", "normalizeExponents", "combineExponentLaws", "extractAnswer"],
  CP07: ["captureExpressions", "alignBases", "compareExponents", "extractAnswer"],
  CP09: ["captureRelation", "rewriteTargetExpression", "substituteKnownPower", "extractAnswer"],
} as const;

export function buildNsExp001ReasoningGraph(parameters: NsExp001Parameters, solver: NsExp001SolverResult): NsExp001ReasoningGraph {
  const ids = NODE_IDS[parameters.canonicalProblemId];
  const nodes = ids.map((id, index) => ({
    id,
    inputs: index === 0 ? { expression: parameters.expression } : { previousNode: ids[index - 1] },
    outputs: id === "extractAnswer" ? { answer: solver.answer } : { status: "complete" },
  }));
  const edges = ids.slice(1).map((id, index) => ({ from: ids[index], to: id, relationship: "supports" }));
  return {
    graphId: `NS-EXP-001:${parameters.canonicalProblemId}:${parameters.questionId}`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes,
    edges,
    answerNodeId: "extractAnswer",
    ...mathJaxFromSolver(solver),
  };
}

function mathJaxFromSolver(solver: NsExp001SolverResult) {
  return {
    sameBaseCompressionLatex: solver.sameBaseCompressionLatex,
    sameBaseEquationLatex: solver.sameBaseEquationLatex,
    baseTransformationLatex: solver.baseTransformationLatex,
    negativeExponentLatex: solver.negativeExponentLatex,
    fractionalExponentLatex: solver.fractionalExponentLatex,
    mixedExponentLatex: solver.mixedExponentLatex,
    comparisonLatex: solver.comparisonLatex,
    substitutionLatex: solver.substitutionLatex,
  };
}
