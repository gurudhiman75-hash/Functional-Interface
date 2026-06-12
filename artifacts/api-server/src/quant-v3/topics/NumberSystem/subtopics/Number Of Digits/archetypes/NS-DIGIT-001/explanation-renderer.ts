import { renderExplanation } from "./library";
import type { NsDigit001Explanation, NsDigit001Parameters, NsDigit001ReasoningGraph, NsDigit001SolverResult } from "./types";

export function renderNsDigit001Explanation(parameters: NsDigit001Parameters, solver: NsDigit001SolverResult, graph: NsDigit001ReasoningGraph): NsDigit001Explanation {
  const rendered = renderExplanation(parameters.canonicalProblemId, parameters.explanationId, {
    answer: solver.answer,
    digitCountFormulaLatex: solver.digitCountFormulaLatex,
    logarithmExpansionLatex: solver.logarithmExpansionLatex,
    productDigitFormulaLatex: solver.productDigitFormulaLatex,
    nDigitNumberFormulaLatex: solver.nDigitNumberFormulaLatex,
    exponentDigitFormulaLatex: solver.exponentDigitFormulaLatex,
  });
  return { graphId: graph.graphId, familyId: rendered.familyId, styleId: parameters.explanationId, lines: rendered.lines, ...mathJaxFromSolver(solver) };
}

function mathJaxFromSolver(solver: NsDigit001SolverResult) {
  return {
    digitCountFormulaLatex: solver.digitCountFormulaLatex,
    logarithmExpansionLatex: solver.logarithmExpansionLatex,
    productDigitFormulaLatex: solver.productDigitFormulaLatex,
    nDigitNumberFormulaLatex: solver.nDigitNumberFormulaLatex,
    exponentDigitFormulaLatex: solver.exponentDigitFormulaLatex,
  };
}
