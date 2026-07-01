import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface RepeatedReplacementEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
}

export class RepeatedReplacementRenderer implements ExplanationRenderer {
  constructor(_solverMathJax: Record<string, string>) {}

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as RepeatedReplacementEvidence;
    const volume = Number(e.variables.initialVolume);
    const replaced = Number(e.variables.replacementVolume);
    const operations = Number(e.variables.numberOfOperations);
    return [
      { stepId: "step-1", type: "GOAL", narrative: `Fraction retained after one operation`, mathLatex: `1-\\frac{${replaced}}{${volume}}` },
      { stepId: "step-2", type: "FORMULA", narrative: `=`, mathLatex: `\\frac{${volume - replaced}}{${volume}}` },
      { stepId: "step-3", type: "SUBSTITUTION", narrative: `After ${operations} operations`, mathLatex: `\\left(\\frac{${volume - replaced}}{${volume}}\\right)^{${operations}}` },
      { stepId: "step-4", type: "SIMPLIFICATION", narrative: `=`, mathLatex: `${e.answer}` },
      { stepId: "step-5", type: "CONCLUSION", narrative: `Hence, ${e.answer} of the original liquid remains.` },
    ];
  }
}
