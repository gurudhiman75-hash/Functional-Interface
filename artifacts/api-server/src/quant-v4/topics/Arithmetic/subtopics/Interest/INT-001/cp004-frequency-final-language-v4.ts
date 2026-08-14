import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";

function naturalDurationAnswer(text: string): string {
  return text
    .replace(/\b(\d+) complete years\b/gu, "$1 years")
    .replace(/\b(\d+) complete year\b/gu, "$1 year")
    .replace(/\b(\d+) whole years\b/gu, "$1 years")
    .replace(/\b(\d+) whole year\b/gu, "$1 year")
    .replace(/\b(\d+) full years\b/gu, "$1 years")
    .replace(/\b(\d+) full year\b/gu, "$1 year")
    .replace(/number of complete compound-interest years before the stated simple-interest tail/gu, "number of years for which interest was compounded annually before the final simple-interest months")
    .replace(/^After period (\d+):/gu, "After year $1:");
}

function naturalAnnualYearConclusion(text: string): string {
  return naturalDurationAnswer(text)
    .replace(/so the number of years is 1\./gu, "so interest was compounded annually for 1 year.")
    .replace(/so the number of years is (\d+)\./gu, "so interest was compounded annually for $1 years.");
}

export function finalizeCp004ExplanationLanguageV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  if (state.qlId !== "INT-QL-083") return explanation;
  return deepFreeze({
    ...explanation,
    whatAsked: naturalDurationAnswer(explanation.whatAsked),
    steps: Object.freeze(explanation.steps.map(naturalAnnualYearConclusion)),
    finalAnswer: naturalDurationAnswer(explanation.finalAnswer),
    commonMistake: naturalDurationAnswer(explanation.commonMistake),
  });
}
