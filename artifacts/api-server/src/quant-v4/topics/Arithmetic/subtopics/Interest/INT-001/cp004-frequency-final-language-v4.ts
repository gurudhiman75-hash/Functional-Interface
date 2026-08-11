import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";

function naturalDurationAnswer(text: string): string {
  return text
    .replace(/\b(\d+) complete years\b/gu, "$1 years")
    .replace(/\b(\d+) complete year\b/gu, "$1 year")
    .replace(/\b(\d+) whole years\b/gu, "$1 years")
    .replace(/\b(\d+) whole year\b/gu, "$1 year")
    .replace(/\b(\d+) full years\b/gu, "$1 years")
    .replace(/\b(\d+) full year\b/gu, "$1 year");
}

export function finalizeCp004ExplanationLanguageV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  if (state.qlId !== "INT-QL-083") return explanation;
  return deepFreeze({
    ...explanation,
    whatAsked: naturalDurationAnswer(explanation.whatAsked),
    steps: Object.freeze(explanation.steps.map(naturalDurationAnswer)),
    finalAnswer: naturalDurationAnswer(explanation.finalAnswer),
    commonMistake: naturalDurationAnswer(explanation.commonMistake),
  });
}
