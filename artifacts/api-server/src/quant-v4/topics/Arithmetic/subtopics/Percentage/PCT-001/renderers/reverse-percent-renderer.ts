import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface ReversePercentEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class ReversePercentRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as ReversePercentEvidence;
    const percentageRate = Number(e.variables.percentageRate);
    const knownValue = Number(e.variables.value);
    return [
      { stepId: "step-1", type: "GOAL", narrative: `${percentageRate}% corresponds to ${knownValue}.`, mathLatex: `${percentageRate}\\%=${knownValue}` },
      { stepId: "step-2", type: "FORMULA", narrative: `1%`, mathLatex: `\\frac{${knownValue}}{${percentageRate}}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `100%`, mathLatex: `\\frac{${knownValue}\\times100}{${percentageRate}}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Therefore, the number is ${e.answer}.` },
    ];
  }
}
