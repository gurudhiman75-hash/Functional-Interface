import { renderExplanationLanguage } from "./library";
import type { NsCop001Explanation, NsCop001ReasoningGraph, NsCop001SolverResult } from "./types";

export function renderNsCop001Explanation(input: { solver: NsCop001SolverResult; reasoningGraph: NsCop001ReasoningGraph; styleId: string }): NsCop001Explanation {
  const rendered = renderExplanationLanguage({
    canonicalProblemId: input.solver.canonicalProblemId,
    styleId: input.styleId,
    answer: input.solver.answer,
    values: {
      a: input.solver.canonicalProblemId === "CP-001" || input.solver.canonicalProblemId === "CP-006" ? input.reasoningGraph.nodes[0].inputs.a as number | undefined : undefined,
      b: input.solver.canonicalProblemId === "CP-001" || input.solver.canonicalProblemId === "CP-006" ? input.reasoningGraph.nodes[0].inputs.b as number | undefined : undefined,
      number: input.reasoningGraph.nodes[0].inputs.number as number | undefined,
      nextNumber: input.reasoningGraph.nodes[0].inputs.nextNumber as number | undefined,
      targetNumber: input.reasoningGraph.nodes[0].inputs.targetNumber as number | undefined,
      hcf: input.solver.hcf,
      decisionText: input.solver.coprimeStatus === "coprime" ? "are co-prime" : "are not co-prime",
      hcfLatex: input.solver.hcfLatex,
      coprimeCheckLatex: input.solver.coprimeCheckLatex,
      candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
      pairEvaluationLatex: input.solver.pairEvaluationLatex,
      consecutivePropertyLatex: input.solver.consecutivePropertyLatex,
      ratioReductionLatex: input.solver.ratioReductionLatex,
    },
  });
  return {
    graphId: input.reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId: input.styleId,
    lines: rendered.lines,
    hcfLatex: input.solver.hcfLatex,
    coprimeCheckLatex: input.solver.coprimeCheckLatex,
    candidateEvaluationLatex: input.solver.candidateEvaluationLatex,
    pairEvaluationLatex: input.solver.pairEvaluationLatex,
    consecutivePropertyLatex: input.solver.consecutivePropertyLatex,
    ratioReductionLatex: input.solver.ratioReductionLatex,
  };
}
