import type { TsdCp003GeneratedState } from "./runtime-types";

function capitalizeSentence(value: string): string {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

export function remediateCp003Stem(state: TsdCp003GeneratedState, stem: string): string {
  let remediated = stem;

  if (state.input.solveMode === "timeGainLossFromSpeedChange" && state.representation === "SLOWER_DELAY") {
    remediated = remediated
      .replace("If its speed increases from", "If its speed decreases from")
      .replace("how much travelling time is saved?", "how much extra travelling time is required?")
      .replace("Find the reduction in journey time.", "Find the increase in journey time.")
      .replace("By how much does the journey time decrease?", "By how much does the journey time increase?");
  }

  if (state.input.solveMode === "requiredRemainingSpeedAfterPartialRoute") {
    remediated = remediated.replace(/has a (.+?) schedule for/, "has $1 available for");
  }

  if (state.input.solveMode === "startTimeShiftForSameArrival") {
    const direction = state.representation === "EARLIER_START_SAME_ARRIVAL" ? "earlier" : "later";
    remediated = remediated
      .replace("by how much should the starting time shift?", `how much ${direction} should it start?`)
      .replace("How much earlier or later must", `How much ${direction} must`)
      .replace("Find the required change in departure time.", `How much ${direction} should it depart?`);
  }

  if (state.input.solveMode === "arrivalShiftFromDepartureAndSpeedChanges") {
    remediated = remediated
      .replace("By how much does the arrival time shift?", "What is the magnitude of the arrival-time shift?")
      .replace("How much does arrival move?", "What is the magnitude of the arrival-time change?");
  }

  return capitalizeSentence(remediated);
}