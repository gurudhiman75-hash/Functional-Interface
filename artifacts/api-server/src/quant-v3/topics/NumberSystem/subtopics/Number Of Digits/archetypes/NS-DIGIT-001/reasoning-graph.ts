import type { NsDigit001Parameters, NsDigit001ReasoningGraph, NsDigit001SolverResult } from "./types";

export function buildNsDigit001ReasoningGraph(parameters: NsDigit001Parameters, solver: NsDigit001SolverResult): NsDigit001ReasoningGraph {
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
    digitCountFormulaLatex: solver.digitCountFormulaLatex,
    logarithmExpansionLatex: solver.logarithmExpansionLatex,
    productDigitFormulaLatex: solver.productDigitFormulaLatex,
    nDigitNumberFormulaLatex: solver.nDigitNumberFormulaLatex,
    exponentDigitFormulaLatex: solver.exponentDigitFormulaLatex,
  };
}

function nodeIds(cpId: string) {
  if (cpId === "CP-001") return ["captureNumber", "applyDigitRule", "extractAnswer"];
  if (cpId === "CP-002") return ["captureBase", "captureExponent", "applyDigitFormula", "applyFloor", "extractAnswer"];
  if (cpId === "CP-003") return ["parseExpression", "sumLogarithms", "applyDigitFormula", "extractAnswer"];
  if (cpId === "CP-004") return ["captureDigitCount", "identifyBoundType", "applyBoundaryFormula", "extractAnswer"];
  return ["captureBase", "captureDigitCount", "solveExponentRelation", "evaluateOptions", "selectUniqueAnswer"];
}
