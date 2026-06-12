import { renderExplanation } from "./library";
import type { NsFracdec001Explanation, NsFracdec001Parameters, NsFracdec001ReasoningGraph, NsFracdec001SolverResult } from "./types";

export function renderNsFracdec001Explanation(parameters: NsFracdec001Parameters, solver: NsFracdec001SolverResult, graph: NsFracdec001ReasoningGraph): NsFracdec001Explanation {
  const rendered = renderExplanation(parameters.canonicalProblemId, parameters.explanationId, { answer: solver.answer });
  return { graphId: graph.graphId, familyId: rendered.familyId, styleId: parameters.explanationId, lines: rendered.lines, ...mathJaxFromSolver(solver) };
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
