import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface WrongMultiplierEvidence extends ExplanationEvidence {
  variables: {
    correctMultiplier: number;
    wrongMultiplier: number;
  };
  derivedValues: {
    percentError: number;
  };
  entities: {
    target: string;
  };
}

export class WrongMultiplierRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as WrongMultiplierEvidence;
    const { correctMultiplier, wrongMultiplier } = e.variables;
    const { percentError } = e.derivedValues;
    const target = e.entities.target || "number";

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Let the original ${target} be 100 to simplify the calculation.`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `First, determine the correct result and the wrongly calculated result.`,
        mathLatex: `\\text{Correct} = 100 \\times ${correctMultiplier}, \\quad \\text{Wrong} = 100 \\times ${wrongMultiplier}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `Find the absolute difference (error) between the two results.`,
        mathLatex: `\\text{Error} = |100 \\times ${correctMultiplier} - 100 \\times ${wrongMultiplier}|`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Now calculate the error as a percentage of the correct value.`,
        mathLatex: `\\text{Percentage Error} = \\frac{\\text{Error}}{\\text{Correct}} \\times 100 = ${percentError}\\%`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `The percentage error in the calculation is ${percentError}%.`,
      },
    ];
  }
}
