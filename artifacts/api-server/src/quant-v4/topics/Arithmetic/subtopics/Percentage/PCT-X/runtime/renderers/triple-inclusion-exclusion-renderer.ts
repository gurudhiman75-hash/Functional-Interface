import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface TripleInclusionExclusionEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class TripleInclusionExclusionRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as TripleInclusionExclusionEvidence;
    const v = e.variables;
    const union = Number(e.derivedValues.union);
    const entityA = e.entities.entityA || "the first subject";
    const entityB = e.entities.entityB || "the second subject";
    const entityC = e.entities.entityC || "the third subject";
    return [
      { stepId: "step-1", type: "GOAL", narrative: `${entityA}\\cup${entityB}\\cup${entityC}`, mathLatex: `A+B+C-AB-BC-AC+ABC` },
      { stepId: "step-2", type: "FORMULA", narrative: `=`, mathLatex: `${v.groupAPercentage}+${v.groupBPercentage}+${v.groupCPercentage}-${v.groupABPercentage}-${v.groupBCPercentage}-${v.groupACPercentage}+${v.groupABCPercentage}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `At least one`, mathLatex: `${union}\\%` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `Required percentage`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Hence, the required percentage is ${e.answer}.` },
    ];
  }
}
