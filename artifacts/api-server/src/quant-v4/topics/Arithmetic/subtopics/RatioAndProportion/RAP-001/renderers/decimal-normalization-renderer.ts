import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

export interface DecimalNormalizationEvidence extends ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
}

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function decimalPlaces(value: number) {
  const text = String(value);
  if (/e-/i.test(text)) return Number(text.split(/e-/i)[1] ?? 0);
  return text.includes(".") ? text.length - text.indexOf(".") - 1 : 0;
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

export class DecimalNormalizationRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const e = evidence as DecimalNormalizationEvidence;
    const decimalA = Number(e.variables.decimalA);
    const decimalB = Number(e.variables.decimalB);
    const scale = 10 ** Math.max(decimalPlaces(decimalA), decimalPlaces(decimalB));
    const wholeA = Math.round(decimalA * scale);
    const wholeB = Math.round(decimalB * scale);
    const divisor = gcd(wholeA, wholeB);
    const normalizedA = wholeA / divisor;
    const normalizedB = wholeB / divisor;
    const answer = cleanAnswer(e.answer);

    return [
      {
        stepId: "step-1",
        type: "GOAL",
        narrative: `Multiply both terms by ${scale} to remove the decimals.`,
        mathLatex: `${decimalA}:${decimalB}`,
      },
      {
        stepId: "step-2",
        type: "FORMULA",
        narrative: "This changes both terms by the same factor, so the ratio remains equal.",
        mathLatex: `(${decimalA}\times${scale}):(${decimalB}\times${scale})=${wholeA}:${wholeB}`,
      },
      {
        stepId: "step-3",
        type: "SUBSTITUTION",
        narrative: `The HCF of ${wholeA} and ${wholeB} is ${divisor}.`,
        mathLatex: `\operatorname{HCF}(${wholeA},${wholeB})=${divisor}`,
      },
      {
        stepId: "step-4",
        type: "SIMPLIFICATION",
        narrative: "Divide both terms by the HCF.",
        mathLatex: `(${wholeA}\div${divisor}):(${wholeB}\div${divisor})=${normalizedA}:${normalizedB}`,
      },
      {
        stepId: "step-5",
        type: "CONCLUSION",
        narrative: "So, the simplest whole-number ratio is",
        mathLatex: answer,
      },
    ];
  }
}
