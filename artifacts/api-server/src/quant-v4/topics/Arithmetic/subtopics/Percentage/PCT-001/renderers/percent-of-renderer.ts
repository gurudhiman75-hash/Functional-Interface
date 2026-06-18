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
        narrative: `We need to calculate ${percentageRate}% of the base value ${baseValue}.`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `The formula to find $x\\%$ of $y$ is:`,
        mathLatex: `\\frac{x}{100} \\times y`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `Substitute $x = ${percentageRate}$ and $y = ${baseValue}$:`,
        mathLatex: `\\frac{${percentageRate}}{100} \\times ${baseValue}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Simplify the multiplication:`,
        mathLatex: `\\frac{${percentageRate} \\times ${baseValue}}{100} = ${answer}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Therefore, ${percentageRate}% of ${baseValue} is ${answer}.`,
      },
    ];
  }
}
