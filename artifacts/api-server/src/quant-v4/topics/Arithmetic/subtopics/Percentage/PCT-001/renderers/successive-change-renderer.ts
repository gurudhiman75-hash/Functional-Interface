import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface SuccessiveChangeEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class SuccessiveChangeRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as SuccessiveChangeEvidence;
    const first = Number(e.variables.rate1);
    const second = Number(e.variables.rate2);
    const secondSigned = -second;
    return [
      { stepId: "step-1", type: "GOAL", narrative: `Equivalent percentage change`, mathLatex: `a+b+\\frac{ab}{100}` },
      { stepId: "step-2", type: "FORMULA", narrative: `=`, mathLatex: `${first}+(${secondSigned})+\\frac{${first}\\times(${secondSigned})}{100}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `=`, mathLatex: `${first + secondSigned}+\\frac{${first * secondSigned}}{100}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Hence, the overall change is ${e.answer}.` },
    ];
  }
}
