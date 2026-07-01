import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface RatioNormalizationEvidence extends ExplanationEvidence {
  variables: {
    numerator1: number;
    denominator1: number;
    numerator2: number;
    denominator2: number;
  };
  derivedValues: {
    normalizedLeft: number;
    normalizedRight: number;
  };
  entities: Record<string, string>;
}

export class RatioNormalizationRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as RatioNormalizationEvidence;
    const { numerator1, denominator1, numerator2, denominator2 } = e.variables;
    const { normalizedLeft, normalizedRight } = e.derivedValues;

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Given ratio`,
        mathLatex: `\\frac{${numerator1}}{${denominator1}}:\\frac{${numerator2}}{${denominator2}}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `Cross-multiplying`,
        mathLatex: `(${numerator1}\\times${denominator2}):(${denominator1}\\times${numerator2})`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `=`,
        mathLatex: `${numerator1 * denominator2}:${denominator1 * numerator2}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `=`,
        mathLatex: `${normalizedLeft}:${normalizedRight}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Hence, the simplified integer ratio is ${normalizedLeft}:${normalizedRight}.`,
      },
    ];
  }
}
