import { renderExplanationLanguage } from "./library";
import type { NsHl001Explanation, NsHl001ReasoningGraph, NsHl001SolverResult } from "./types";

export function renderNsHl001Explanation(input: {
  solver: NsHl001SolverResult;
  reasoningGraph: NsHl001ReasoningGraph;
  styleId: string;
}): NsHl001Explanation {
  const rendered = renderExplanationLanguage({
    canonicalProblemId: input.solver.canonicalProblemId,
    styleId: input.styleId,
    answer: input.solver.answer,
    values: {
      productRelationLatex: input.solver.productRelationLatex,
      divisibilityCheckLatex: input.solver.divisibilityCheckLatex,
      productRelationCheckLatex: input.solver.productRelationCheckLatex,
      missingNumberFormulaLatex: input.solver.missingNumberFormulaLatex,
      hcfVerificationLatex: input.solver.hcfVerificationLatex,
      lcmVerificationLatex: input.solver.lcmVerificationLatex,
      quotientLatex: input.solver.quotientLatex,
      factorPairListLatex: input.solver.factorPairListLatex,
      coprimePairFilterLatex: input.solver.coprimePairFilterLatex,
      conditionFilterLatex: input.solver.conditionFilterLatex,
      reconstructedPairLatex: input.solver.reconstructedPairLatex,
      factorPairCountLatex: input.solver.factorPairCountLatex,
      orderedPairPolicyLatex: input.solver.orderedPairPolicyLatex,
      unorderedPairPolicyLatex: input.solver.unorderedPairPolicyLatex,
      ratioReductionLatex: input.solver.ratioReductionLatex,
      ratioMultiplierLatex: input.solver.ratioMultiplierLatex,
      hcfMultiplierLatex: input.solver.hcfMultiplierLatex,
      lcmMultiplierLatex: input.solver.lcmMultiplierLatex,
      consistencyCheckLatex: input.solver.consistencyCheckLatex,
    },
  });
  return {
    graphId: input.reasoningGraph.graphId,
    familyId: rendered.familyId,
    styleId: input.styleId,
    lines: rendered.lines,
    productRelationLatex: input.solver.productRelationLatex,
    divisibilityCheckLatex: input.solver.divisibilityCheckLatex,
    productRelationCheckLatex: input.solver.productRelationCheckLatex,
    missingNumberFormulaLatex: input.solver.missingNumberFormulaLatex,
    hcfVerificationLatex: input.solver.hcfVerificationLatex,
    lcmVerificationLatex: input.solver.lcmVerificationLatex,
    quotientLatex: input.solver.quotientLatex,
    factorPairListLatex: input.solver.factorPairListLatex,
    coprimePairFilterLatex: input.solver.coprimePairFilterLatex,
    conditionFilterLatex: input.solver.conditionFilterLatex,
    reconstructedPairLatex: input.solver.reconstructedPairLatex,
    factorPairCountLatex: input.solver.factorPairCountLatex,
    orderedPairPolicyLatex: input.solver.orderedPairPolicyLatex,
    unorderedPairPolicyLatex: input.solver.unorderedPairPolicyLatex,
    ratioReductionLatex: input.solver.ratioReductionLatex,
    ratioMultiplierLatex: input.solver.ratioMultiplierLatex,
    hcfMultiplierLatex: input.solver.hcfMultiplierLatex,
    lcmMultiplierLatex: input.solver.lcmMultiplierLatex,
    consistencyCheckLatex: input.solver.consistencyCheckLatex,
  };
}
