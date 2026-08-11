import type { Cp004MathematicalState } from "./cp004-frequency-math";
import { durationText, frequencyNoun, moneyText, percentText } from "./cp004-frequency-options";
import { assertCp004VisibleGivensV4 } from "./cp004-frequency-exam-readiness-v4";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function hasVisibleTimeRow(stem: string): boolean {
  const periodRow = /\|\s*Number of periods\s*\|\s*(?!\?\s*\|)[^|]+\|/iu;
  const termRow = /\|\s*Term\s*\|\s*(?!\?\s*\|)[^|]+\|/iu;
  return periodRow.test(stem) || termRow.test(stem);
}

export function assertCp004VisibleGivensExamReadyV4(state: Cp004MathematicalState, stem: string): void {
  if (state.qlId !== "INT-QL-073" && state.qlId !== "INT-QL-074") {
    assertCp004VisibleGivensV4(state, stem);
    return;
  }

  const principal = moneyText(state.principal);
  const rate = percentText(state.periodicRatePercent);
  if (!stem.includes(principal)) throw new Error(`${state.qlId}: displayed stem omits principal (${principal}).`);
  if (!stem.includes(rate)) throw new Error(`${state.qlId}: displayed stem omits period rate (${rate}).`);

  const duration = durationText(state.periods, state.frequency);
  const noun = escapeRegExp(frequencyNoun(state.frequency));
  const namedPeriodEvidence = new RegExp(`\\b${state.periods}\\s+(?:complete\\s+)?${noun}s?\\b`, "iu");
  const genericPeriodEvidence = new RegExp(`\\b${state.periods}\\s+(?:(?:complete|such)\\s+)?periods?\\b`, "iu");
  if (!stem.includes(duration) && !namedPeriodEvidence.test(stem) && !genericPeriodEvidence.test(stem) && !hasVisibleTimeRow(stem)) {
    throw new Error(`${state.qlId}: displayed stem omits visible duration/period evidence.`);
  }
}
