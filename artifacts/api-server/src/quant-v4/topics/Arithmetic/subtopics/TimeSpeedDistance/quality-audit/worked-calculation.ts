import { add, divide, multiply, subtract, toMixedString, type Rational } from "../TSD-001/foundation/rational";

export type ReviewLocale = "en-IN" | "hi-IN" | "pa-IN";
export type CalculationUnit = "m" | "s" | "m/s" | "km" | "h" | "km/h" | "h/km" | "";
export interface WorkedCalculation {
  readonly label: string;
  readonly expression: string;
  readonly value: Rational;
  readonly unit: CalculationUnit;
  readonly text: string;
}
export const display = toMixedString;
export function calculationWriter(locale: ReviewLocale) {
  const steps: WorkedCalculation[] = [];
  const index = locale === "en-IN" ? 0 : locale === "hi-IN" ? 1 : 2;
  const units: Record<CalculationUnit, readonly [string, string, string]> = {
    m: ["m", "मीटर", "ਮੀਟਰ"], s: ["s", "सेकंड", "ਸਕਿੰਟ"], "m/s": ["m/s", "मीटर/सेकंड", "ਮੀਟਰ/ਸਕਿੰਟ"],
    km: ["km", "किमी", "ਕਿਮੀ"], h: ["h", "घंटे", "ਘੰਟੇ"], "km/h": ["km/h", "किमी/घंटा", "ਕਿਮੀ/ਘੰਟਾ"], "h/km": ["h/km", "घंटे/किमी", "ਘੰਟੇ/ਕਿਮੀ"], "": ["", "", ""],
  };
  const put = (labels: readonly [string, string, string], expression: string, value: Rational, unit: CalculationUnit) => {
    const label = labels[index];
    const unitText = unit === "h" && value.numerator === value.denominator && index > 0
      ? index === 1 ? "घंटा" : "ਘੰਟਾ" : units[unit][index];
    const text = `${label}: ${expression} = ${display(value)}${unit ? ` ${unitText}` : ""}`;
    steps.push(Object.freeze({ label, expression, value, unit, text }));
    return value;
  };
  const binary = (labels: readonly [string, string, string], a: Rational, operator: "+" | "−" | "×" | "÷", b: Rational, unit: CalculationUnit) => {
    const value = operator === "+" ? add(a, b) : operator === "−" ? subtract(a, b) : operator === "×" ? multiply(a, b) : divide(a, b);
    // Parentheses make mixed fractions unambiguous when copied to plain text.
    return put(labels, `(${display(a)}) ${operator} (${display(b)})`, value, unit);
  };
  return { steps, put, binary };
}
export const EDITORIAL_REVIEW_LOCK = Object.freeze({
  reviewStatus: "UNAPPROVED_CONTENT_REVIEW_CANDIDATE" as const,
  contentApproved: false, frozen: false, registered: false, persistence: false,
  bank: false, test: false, mock: false, public: false,
});
