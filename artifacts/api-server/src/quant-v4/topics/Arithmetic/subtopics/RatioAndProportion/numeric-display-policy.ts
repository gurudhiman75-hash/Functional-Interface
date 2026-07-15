export type NumericDisplayPolicy =
  | "EXACT_INTEGER"
  | "EXACT_RATIO"
  | "EXACT_FRACTION"
  | "TERMINATING_DECIMAL"
  | "ROUND_TO_1_DP"
  | "ROUND_TO_2_DP"
  | "ROUND_TO_NEAREST_INTEGER";

function answerBody(answer: string) {
  return answer.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "").trim();
}

export function numericDisplayPolicy(answer: string, answerType: string): NumericDisplayPolicy {
  const body = answerBody(answer);
  if (answerType === "RATIO") return "EXACT_RATIO";
  if (!/^-?\d+\.\d+(?:%)?$/.test(body)) return "EXACT_INTEGER";
  return "ROUND_TO_2_DP";
}

export function renderStemWithNumericDisplayPolicy(stem: string, answer: string, answerType: string, language: string) {
  const policy = numericDisplayPolicy(answer, answerType);
  if (policy !== "ROUND_TO_2_DP" || language !== "en") return stem;
  if (/correct to \d+ decimal places|nearest (?:rupee|integer|whole number)|round(?:ed)? to/i.test(stem)) return stem;
  return `${stem} Give your answer correct to two decimal places.`;
}

export function hasMatchingNumericDisplayInstruction(stem: string, answer: string, answerType: string) {
  return numericDisplayPolicy(answer, answerType) !== "ROUND_TO_2_DP"
    || /correct to two decimal places|rounded to two decimal places/i.test(stem);
}
