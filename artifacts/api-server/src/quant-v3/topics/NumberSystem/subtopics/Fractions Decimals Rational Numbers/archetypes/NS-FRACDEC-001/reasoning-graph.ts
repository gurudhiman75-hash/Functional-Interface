import type { NsFracdec001Parameters, NsFracdec001ReasoningGraph, NsFracdec001SolverResult } from "./types";

const NODE_IDS = {
  "CP-001": ["captureFraction", "findHcf", "reduceFraction", "extractAnswer"],
  "CP-002": ["captureInput", "identifyDirection", "performConversion", "extractAnswer"],
  "CP-003": ["parseExpression", "applyOperations", "simplifyResult", "extractAnswer"],
  "CP-004": ["normalizeValues", "compareValues", "orderOrSelect", "extractAnswer"],
  "CP-005": ["captureFraction", "performDivision", "detectRepetition", "extractAnswer"],
  "CP-006": ["captureDecimal", "convertUsingPlaceValue", "reduceFraction", "extractAnswer"],
  "CP-007": ["defineVariable", "formEquations", "eliminateRecurringPart", "solveFraction", "extractAnswer"],
  "CP-008": ["reduceFraction", "factorDenominator", "classifyDecimal", "extractAnswer"],
  "CP-009": ["simplifyFractions", "applyFractionHcfLcmRule", "extractAnswer"],
} as const;

export function buildNsFracdec001ReasoningGraph(parameters: NsFracdec001Parameters, solver: NsFracdec001SolverResult): NsFracdec001ReasoningGraph {
  const ids = NODE_IDS[parameters.canonicalProblemId];
  const nodes = ids.map((id, index) => ({
    id,
    inputs: index === 0 ? { parameters } : { previousNode: ids[index - 1] },
    outputs: id === "extractAnswer" ? { answer: solver.answer } : { status: "complete" },
  }));
  const edges = ids.slice(1).map((id, index) => ({ from: ids[index], to: id, relationship: "supports" }));
  return {
    graphId: `NS-FRACDEC-001:${parameters.canonicalProblemId}:${parameters.questionId}`,
    canonicalProblemId: parameters.canonicalProblemId,
    nodes,
    edges,
    answerNodeId: "extractAnswer",
    ...mathJaxFromSolver(solver),
  };
}

function mathJaxFromSolver(solver: NsFracdec001SolverResult) {
  return {
    fractionReductionLatex: solver.fractionReductionLatex,
    mixedFractionConversionLatex: solver.mixedFractionConversionLatex,
    fractionArithmeticLatex: solver.fractionArithmeticLatex,
    comparisonWorkingLatex: solver.comparisonWorkingLatex,
    fractionToDecimalLatex: solver.fractionToDecimalLatex,
    decimalToFractionLatex: solver.decimalToFractionLatex,
    recurringDecimalConversionLatex: solver.recurringDecimalConversionLatex,
    terminatingCheckLatex: solver.terminatingCheckLatex,
    fractionHcfLcmLatex: solver.fractionHcfLcmLatex,
  };
}
