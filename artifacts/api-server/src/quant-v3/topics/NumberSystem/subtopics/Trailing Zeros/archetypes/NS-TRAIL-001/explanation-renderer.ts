import { renderExplanationLanguage } from "./library";
import type { NsTrail001Explanation, NsTrail001Parameters, NsTrail001ReasoningGraph, NsTrail001SolverResult } from "./types";

export function renderNsTrail001Explanation(
  parameters: NsTrail001Parameters,
  solver: NsTrail001SolverResult,
  reasoningGraph: NsTrail001ReasoningGraph,
): NsTrail001Explanation {
  const styleId = `ES-${parameters.canonicalProblemId.slice(-3)}`;
  const rendered = renderExplanationLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    styleId,
    answer: solver.answer,
    values: {
      answer: solver.answer,
      n: parameters.n,
      zeroCount: parameters.zeroCount,
      factorFiveCountLatex: solver.factorFiveCountLatex,
      factorialExpressionLatex: solver.factorialExpressionLatex,
      searchProcessLatex: solver.searchProcessLatex,
      powerFactorizationLatex: solver.powerFactorizationLatex,
      productFactorizationLatex: solver.productFactorizationLatex,
    },
  });
  return {
    graphId: reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId,
    lines: rendered.lines,
    factorFiveCountLatex: solver.factorFiveCountLatex,
    factorialExpressionLatex: solver.factorialExpressionLatex,
    searchProcessLatex: solver.searchProcessLatex,
    powerFactorizationLatex: solver.powerFactorizationLatex,
    productFactorizationLatex: solver.productFactorizationLatex,
  };
}
