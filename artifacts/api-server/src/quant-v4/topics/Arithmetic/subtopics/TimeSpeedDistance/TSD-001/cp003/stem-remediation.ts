import type { TsdCp003GeneratedState } from "./runtime-types";

export function remediateCp003Stem(state: TsdCp003GeneratedState, stem: string): string {
  if (state.input.solveMode !== "timeGainLossFromSpeedChange") return stem;
  if (state.representation !== "SLOWER_DELAY") return stem;

  return stem
    .replace("how much travelling time is saved?", "how much extra travelling time is required?")
    .replace("Find the reduction in journey time.", "Find the increase in journey time.")
    .replace("By how much does the journey time decrease?", "By how much does the journey time increase?");
}
