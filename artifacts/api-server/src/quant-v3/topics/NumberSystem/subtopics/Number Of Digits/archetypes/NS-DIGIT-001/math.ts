import type { NsDigit001MathJaxFields, NsDigit001Parameters } from "./types";

export const NS_DIGIT_001_MATHJAX_KEYS = [
  "digitCountFormulaLatex",
  "logarithmExpansionLatex",
  "productDigitFormulaLatex",
  "nDigitNumberFormulaLatex",
  "exponentDigitFormulaLatex",
] as const;

export function digitCountOfNumber(value: number | string) {
  const text = String(value).replace(/^0+/, "") || "0";
  return text.length;
}

export function digitCountOfPower(base: number, exponent: number) {
  return Math.floor(exponent * Math.log10(base)) + 1;
}

export function digitCountOfProduct(factors: readonly number[]) {
  return Math.floor(factors.reduce((sum, factor) => sum + Math.log10(factor), 0)) + 1;
}

export function nDigitBoundary(digitCount: number, boundType: "smallest" | "largest") {
  if (boundType === "smallest") return digitCount === 1 ? "1" : `1${"0".repeat(digitCount - 1)}`;
  return "9".repeat(digitCount);
}

export function validExponentOptions(base: number, digitCount: number, options: readonly number[]) {
  return options.filter((option) => digitCountOfPower(base, option) === digitCount);
}

export function exponentBand(exponent: number) {
  if (exponent <= 10) return "smallExponent";
  if (exponent <= 100) return "mediumExponent";
  return "largeExponent";
}

export function digitCountBand(digitCount: number) {
  if (digitCount <= 6) return "smallN";
  if (digitCount <= 20) return "mediumN";
  return "largeN";
}

export function baseBand(base: number) {
  if (base === 2) return "base2";
  if (base === 5) return "base5";
  if (base === 10) return "base10";
  return "otherBase";
}

export function numberBoundaryStatus(value: number | string) {
  const text = String(value);
  if (/^10*$/.test(text)) return "exactPowerOfTen";
  if (/^9+$/.test(text)) return "justBelowPowerOfTen";
  if (/^10*1$/.test(text)) return "justAbovePowerOfTen";
  return text.includes("0") ? "containsZeros" : "ordinaryNumber";
}

export function numberMagnitude(value: number | string) {
  const digits = digitCountOfNumber(value);
  if (digits === 1) return "singleDigit";
  if (digits === 2) return "twoDigit";
  if (digits <= 8) return "mediumLength";
  return "largeLength";
}

export function buildMathJax(parameters: NsDigit001Parameters, answer: number | string, validOptions: readonly number[] = []): NsDigit001MathJaxFields {
  return {
    digitCountFormulaLatex: "\\text{digits}(N)=\\lfloor\\log_{10}N\\rfloor+1",
    logarithmExpansionLatex:
      parameters.base && parameters.exponent
        ? `\\lfloor ${parameters.exponent}\\log_{10}${parameters.base}\\rfloor+1=${answer}`
        : "\\text{Power formula not required}",
    productDigitFormulaLatex:
      parameters.factors?.length
        ? `\\left\\lfloor ${parameters.factors.map((factor) => `\\log_{10}${factor}`).join("+")}\\right\\rfloor+1=${answer}`
        : "\\text{Product formula not required}",
    nDigitNumberFormulaLatex:
      parameters.digitCount && parameters.boundType ? `${parameters.boundType === "smallest" ? "10^{n-1}" : "10^n-1"}=${answer}` : "\\text{Boundary formula not required}",
    exponentDigitFormulaLatex:
      parameters.base && parameters.digitCount
        ? `\\text{digits}(${parameters.base}^n)=${parameters.digitCount};\\ \\text{valid options}=(${validOptions.join(", ")})`
        : "\\text{Exponent relation not required}",
  };
}

export function mathJaxPresent(fields: NsDigit001MathJaxFields) {
  return NS_DIGIT_001_MATHJAX_KEYS.every((key) => fields[key].length > 0);
}
