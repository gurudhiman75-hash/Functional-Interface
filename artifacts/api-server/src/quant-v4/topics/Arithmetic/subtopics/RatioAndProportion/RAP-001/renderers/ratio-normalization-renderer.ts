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

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

export class RatioNormalizationRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as RatioNormalizationEvidence;
    const { numerator1, denominator1, numerator2, denominator2 } = e.variables;
    const { normalizedLeft, normalizedRight } = e.derivedValues;
    const rawLeft = numerator1 * denominator2;
    const rawRight = denominator1 * numerator2;
    const divisor = gcd(rawLeft, rawRight);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: "Write the two fractions as a ratio.",
        mathLatex: `\\frac{${numerator1}}{${denominator1}}:\\frac{${numerator2}}{${denominator2}}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "Clear the denominators by cross-multiplying.",
        mathLatex: `(${numerator1}\\times${denominator2}):(${denominator1}\\times${numerator2})`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: "This gives the whole-number ratio",
        mathLatex: `${rawLeft}:${rawRight}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Divide both terms by their HCF, ${divisor}.`,
        mathLatex: `(${rawLeft}\\div${divisor}):(${rawRight}\\div${divisor})=${normalizedLeft}:${normalizedRight}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: "So, the simplest integer ratio is",
        mathLatex: `${normalizedLeft}:${normalizedRight}`,
      },
    ];
  }
}
