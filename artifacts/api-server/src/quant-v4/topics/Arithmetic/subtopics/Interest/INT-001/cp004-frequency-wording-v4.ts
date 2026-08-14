import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";
import { frequencyLabel } from "./cp004-frequency-options";

export function polishCp004TargetWordingV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  if (state.qlId === "INT-QL-075") {
    return deepFreeze({
      ...explanation,
      whatAsked: "We need to find the difference between the maturity amounts under the two compounding schedules.",
    });
  }
  if (state.qlId === "INT-QL-078") {
    return deepFreeze({
      ...explanation,
      finalAnswer: `Therefore, interest was compounded ${frequencyLabel(state.frequency)}.`,
    });
  }
  return explanation;
}
