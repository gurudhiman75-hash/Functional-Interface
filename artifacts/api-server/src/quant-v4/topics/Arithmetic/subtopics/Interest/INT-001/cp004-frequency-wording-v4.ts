import { deepFreeze, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";

export function polishCp004TargetWordingV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  if (state.qlId !== "INT-QL-075") return explanation;
  return deepFreeze({
    ...explanation,
    whatAsked: "We need to find the difference between the maturity amounts under the two compounding schedules.",
  });
}
