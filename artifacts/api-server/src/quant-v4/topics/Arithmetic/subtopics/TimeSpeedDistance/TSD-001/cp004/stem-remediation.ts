import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { Rational } from "../foundation/rational";
import type { TsdCp004GeneratedState } from "./runtime-types";

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function h(value: Rational | undefined): string {
  return value ? formatDurationHours(value) : "?";
}

export function remediateCp004Stem(state: TsdCp004GeneratedState, rawStem: string): string {
  const i = state.input;
  const representation = Number(state.representation.split(":").at(-1) ?? "0");

  if (state.solveMode === "findCatchUpTimeFromHeadStartDistance") {
    return `A vehicle moving at ${n(i.speedB)} km/h has a head start of ${n(i.headStartDistance)} km. Another vehicle follows on the same road at ${n(i.speedA)} km/h. How long will the faster vehicle take to catch up?`;
  }

  if (state.solveMode === "findDepartureClockTimeFromMeetingState") {
    if (i.directionCase === "SAME") {
      return `A car starts ${n(i.initialSeparation)} km behind a bus. They move in the same direction at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h respectively and meet at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`;
    }
    return `Two vehicles start at the same time from points ${n(i.initialSeparation)} km apart and travel towards each other at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. They meet at ${formatClockMinute(i.meetingClockMinute!)}. At what time did they start?`;
  }

  if (state.solveMode === "findRelativeSpeedFromMeetingTime") {
    if (representation === 1) {
      return `A faster vehicle closes an initial gap of ${n(i.initialSeparation)} km and catches another vehicle in ${h(i.meetingTime)}. What was their closing speed?`;
    }
    if (representation === 2) {
      return `Two vehicles moving apart increase their separation by ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. At what relative speed does the separation grow?`;
    }
    return `Two vehicles moving towards each other close a gap of ${n(i.initialSeparation)} km in ${h(i.meetingTime)}. What is their relative speed?`;
  }

  if (state.solveMode === "findSpeedRatioFromMeetingPoint") {
    if (representation === 1) {
      return `Two buses start simultaneously from opposite ends of a road and meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. What is the ratio of their speeds?`;
    }
    if (representation === 2) {
      return `Two runners start simultaneously from opposite ends of a straight route and meet after covering ${n(i.distanceA)} km and ${n(i.distanceB)} km respectively. What is the ratio of their speeds?`;
    }
  }

  return rawStem.replace("travel on two towns", "travel on a road between two towns").replace("apart on two towns", "apart on a road between two towns");
}
