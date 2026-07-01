import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface PercentOfEvidence extends ExplanationEvidence {
  variables: {
    percentageRate: number;
    baseValue: number;
  };
  derivedValues: Record<string, string | number>;
}

export class PercentOfRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as PercentOfEvidence;
    const { percentageRate, baseValue } = e.variables;
    const answer = e.answer;

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `${percentageRate}% of ${baseValue}`,
        mathLatex: `${percentageRate}\\%\\text{ of }${baseValue}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `=`,
        mathLatex: `\\frac{${percentageRate}}{100}\\times${baseValue}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `=`,
        mathLatex: `\\frac{${percentageRate}\\times${baseValue}}{100}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `=`,
        mathLatex: `${answer}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Hence, the required value is ${answer}.`,
      },
    ];
  }
}
