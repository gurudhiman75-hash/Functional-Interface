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
    const rawLeft = numerator1 * denominator2;
    const rawRight = denominator1 * numerator2;

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Problem: clear the fractions.`,
        mathLatex: `\\frac{${numerator1}}{${denominator1}}:\\frac{${numerator2}}{${denominator2}}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `Why it applies: multiplying both ratio terms by the same common denominator preserves the ratio while clearing fractions.`,
        mathLatex: `\\frac{${numerator1}}{${denominator1}}\\times${denominator1 * denominator2}:\\frac{${numerator2}}{${denominator2}}\\times${denominator1 * denominator2}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `This gives whole-number terms.`,
        mathLatex: `${rawLeft}:${rawRight}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Method 2: cross-multiply shortcut.`,
        mathLatex: `(${numerator1}\\times${denominator2}):(${denominator1}\\times${numerator2})=${rawLeft}:${rawRight}`,
      },
      {
        stepId: "step-5",
        type: "SIMPLIFICATION",
        narrative: `Reduce the ratio.`,
        mathLatex: `${normalizedLeft}:${normalizedRight}`,
      },
      {
        stepId: "step-6",
        type: "SIMPLIFICATION",
        narrative: "Check that the final terms have no common factor greater than 1.",
        mathLatex: `${normalizedLeft}:${normalizedRight}`,
      },
      {
        stepId: "step-7",
        type: "CONCLUSION",
        narrative: `Therefore, the simplest integer ratio is`,
        mathLatex: `${normalizedLeft}:${normalizedRight}`,
      },
    ];
  }
}
