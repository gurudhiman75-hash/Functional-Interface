import { renderExplanationLanguage } from "./library";
import type { NsHcf001Explanation, NsHcf001ReasoningGraph, NsHcf001SolverResult } from "./types";

export function renderNsHcf001Explanation(input: {
  solver: NsHcf001SolverResult;
  reasoningGraph: NsHcf001ReasoningGraph;
  styleId: string;
}): NsHcf001Explanation {
  const rendered = renderExplanationLanguage({
    canonicalProblemId: input.solver.canonicalProblemId,
    styleId: input.styleId,
    answer: input.solver.answer,
    values: {
      operandFactorizationLatex: input.solver.operandFactorizationLatex,
      commonPrimeIntersectionLatex: input.solver.commonPrimeIntersectionLatex,
      minimumExponentSelectionLatex: input.solver.minimumExponentSelectionLatex,
      hcfLatex: input.solver.hcfLatex,
      hcfFactorCountFormulaLatex: input.solver.hcfFactorCountFormulaLatex,
      candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
      groupingInterpretationLatex: input.solver.groupingInterpretationLatex,
    },
  });
  return {
    graphId: input.reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId: input.styleId,
    lines: rendered.lines,
    operandFactorizationLatex: input.solver.operandFactorizationLatex,
    commonPrimeIntersectionLatex: input.solver.commonPrimeIntersectionLatex,
    minimumExponentSelectionLatex: input.solver.minimumExponentSelectionLatex,
    hcfLatex: input.solver.hcfLatex,
    hcfFactorCountFormulaLatex: input.solver.hcfFactorCountFormulaLatex,
    candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
    groupingInterpretationLatex: input.solver.groupingInterpretationLatex,
  };
}
