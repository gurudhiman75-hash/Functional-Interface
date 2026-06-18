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
        narrative: `We need to convert the given fractional ratio into a simpler integer ratio.`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: `To normalize a ratio of fractions $\\frac{a}{b} : \\frac{c}{d}$, we cross-multiply or multiply by the LCM of the denominators.`,
        mathLatex: `\\frac{a}{b} : \\frac{c}{d} = (a \\times d) : (b \\times c)`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `Substitute the given fractions into the relation:`,
        mathLatex: `\\frac{${numerator1}}{${denominator1}} : \\frac{${numerator2}}{${denominator2}} = (${numerator1} \\times ${denominator2}) : (${denominator1} \\times ${numerator2})`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: `Perform the multiplication and simplify the resulting integers if possible.`,
        mathLatex: `(${numerator1} \\times ${denominator2}) : (${denominator1} \\times ${numerator2}) = ${normalizedLeft} : ${normalizedRight}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: `Hence, the simplified integer ratio is ${normalizedLeft}:${normalizedRight}.`,
      },
    ];
  }
}
