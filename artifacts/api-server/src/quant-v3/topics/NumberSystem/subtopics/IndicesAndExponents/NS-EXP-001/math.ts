import type { NsExp001CanonicalProblemId, NsExp001MathJaxFields } from "./types";

export const NS_EXP_001_MATHJAX_KEYS = [
  "sameBaseCompressionLatex",
  "sameBaseEquationLatex",
  "baseTransformationLatex",
  "negativeExponentLatex",
  "fractionalExponentLatex",
  "mixedExponentLatex",
  "comparisonLatex",
  "substitutionLatex",
] as const;

export const EMPTY_EXP_MATHJAX: NsExp001MathJaxFields = {
  sameBaseCompressionLatex: "",
  sameBaseEquationLatex: "",
  baseTransformationLatex: "",
  negativeExponentLatex: "",
  fractionalExponentLatex: "",
  mixedExponentLatex: "",
  comparisonLatex: "",
  substitutionLatex: "",
};

export function mathJaxFor(cpId: NsExp001CanonicalProblemId, expression: string, answer: string): NsExp001MathJaxFields {
  const value = `${expression} = ${answer}`;
  return {
    ...EMPTY_EXP_MATHJAX,
    ...(cpId === "CP01" ? { sameBaseCompressionLatex: value } : {}),
    ...(cpId === "CP02" ? { sameBaseEquationLatex: value } : {}),
    ...(cpId === "CP03" ? { baseTransformationLatex: value } : {}),
    ...(cpId === "CP04" ? { negativeExponentLatex: value } : {}),
    ...(cpId === "CP05" ? { fractionalExponentLatex: value } : {}),
    ...(cpId === "CP06" ? { mixedExponentLatex: value } : {}),
    ...(cpId === "CP07" ? { comparisonLatex: value } : {}),
    ...(cpId === "CP09" ? { substitutionLatex: value } : {}),
  };
}

export function hasApplicableMathJax(fields: NsExp001MathJaxFields) {
  return NS_EXP_001_MATHJAX_KEYS.some((key) => fields[key].length > 0);
}
