import { deepFreeze, type Cp004MathematicalState, type Cp004Option } from "./cp004-frequency-math";

function naturalFeedback(text: string): string {
  return text
    .replace(/\bextra months\b/giu, "remaining months")
    .replace(/\bafter the complete years\b/giu, "after the years of annual compounding")
    .replace(/\bcomplete years\b/giu, "whole years")
    .replace(/\bcomplete year\b/giu, "full year")
    .replace(/\bcomplete compound-interest stage\b/giu, "annual-compounding stage")
    .replace(/\badditional complete years\b/giu, "extra full years");
}

export function polishCp004OptionsHumanV4(
  state: Cp004MathematicalState,
  options: readonly Cp004Option[],
): readonly Cp004Option[] {
  return deepFreeze(options.map((option) => ({
    ...option,
    text: state.qlId === "INT-QL-083"
      ? option.text.replace(/^(\d+) complete year$/u, "$1 year").replace(/^(\d+) complete years$/u, "$1 years")
      : option.text,
    feedback: naturalFeedback(option.feedback),
  })));
}
