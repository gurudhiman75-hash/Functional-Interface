import { deepFreeze, periodicRate, type Cp004Explanation, type Cp004MathematicalState } from "./cp004-frequency-math";
import { durationText, frequencyNoun, percentText } from "./cp004-frequency-options";

export function ensureCp004InverseExplanationDepthV4(
  state: Cp004MathematicalState,
  explanation: Cp004Explanation,
): Cp004Explanation {
  if (explanation.steps.length >= 5) return explanation;

  let extraStep: string | undefined;
  if (state.qlId === "INT-QL-071") {
    const ratePerPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
    extraStep = `The rate for one ${frequencyNoun(state.frequency)} is ${percentText(ratePerPeriod)}, so the quoted annual rate is ${percentText(ratePerPeriod)} × ${state.frequency} = ${percentText(state.nominalAnnualRatePercent)}.`;
  } else if (state.qlId === "INT-QL-072") {
    extraStep = `Each ${frequencyNoun(state.frequency)} is ${12 / state.frequency} month${12 / state.frequency === 1 ? "" : "s"}, so ${state.periods} periods correspond to ${durationText(state.periods, state.frequency)}.`;
  } else if (state.qlId === "INT-QL-077") {
    const ratePerPeriod = periodicRate(state.nominalAnnualRatePercent, state.frequency);
    extraStep = `The checked rate per ${frequencyNoun(state.frequency)} is ${percentText(ratePerPeriod)}, so the nominal annual rate is ${percentText(ratePerPeriod)} × ${state.frequency} = ${percentText(state.nominalAnnualRatePercent)}.`;
  }

  if (!extraStep) return explanation;
  const steps = [...explanation.steps];
  steps.splice(Math.max(0, steps.length - 1), 0, extraStep);
  return deepFreeze({ ...explanation, steps: Object.freeze(steps) });
}
