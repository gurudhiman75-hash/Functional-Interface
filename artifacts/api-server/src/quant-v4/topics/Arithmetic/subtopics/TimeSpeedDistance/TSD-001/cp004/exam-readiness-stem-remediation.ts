import { multiply, rational, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004GeneratedState } from "./runtime-types";

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function dur(value: Rational | undefined): string {
  if (!value) return "?";
  const minutes = multiply(value, rational(60));
  if (minutes.denominator === 1n && minutes.numerator < 60n) {
    return `${minutes.numerator} minute${minutes.numerator === 1n ? "" : "s"}`;
  }
  return formatDurationHours(value);
}

function structureIndex(state: TsdCp004GeneratedState): number {
  const parsed = Number(state.representation.split(":").at(-1) ?? "0");
  const variant = Number.isInteger(parsed) ? ((parsed % 6) + 6) % 6 : 0;
  return [0, 1, 2, 3, 0, 1][variant]!;
}

function fixNumericArticle(stem: string): string {
  return stem.replace(/\b([Aa])\s+(\d[\d,]*(?:\.\d+)?(?:\s+\d+\/\d+)?)\b/g, (match, article: string, numeral: string) => {
    const integerPart = numeral.replace(/,/g, "").split(/[.\s/]/)[0] ?? "";
    const needsAn = integerPart.startsWith("8") || integerPart === "11" || integerPart === "18";
    if (!needsAn) return match;
    return `${article === "A" ? "An" : "an"} ${numeral}`;
  });
}

export function remediateCp004ExamReadyStem(state: TsdCp004GeneratedState, originalStem: string): string {
  const i = state.input;
  const structure = structureIndex(state);
  let stem = originalStem;

  if (state.solveMode === "findRelativeSpeedSameDirection" && structure === 1) {
    stem = `A tracking log records two same-direction vehicles moving at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. At what rate does the faster vehicle gain on the slower vehicle?`;
  } else if (state.solveMode === "findRelativeDistanceCoveredInGivenTime" && i.directionCase !== "SAME" && structure === 3) {
    stem = `For ${dur(i.elapsedTime)}, two vehicles move in opposite directions at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h. Find the total increase in separation.`;
  } else if (state.solveMode === "findRelativeSpeedFromMeetingTime" && structure === 3) {
    stem = `Between two observations, the gap between two vehicles changes by ${n(i.initialSeparation)} km over ${dur(i.meetingTime)}. What relative speed does this represent?`;
  } else if (state.solveMode === "findStartDelayFromCatchUpState") {
    if (structure === 0) {
      stem = `A bus at ${n(i.speedB)} km/h leaves a checkpoint first. A car at ${n(i.speedA)} km/h leaves the same checkpoint later and catches the bus after ${dur(i.meetingTime)} of pursuit. How much later did the car leave?`;
    } else if (structure === 1) {
      stem = `Two vehicles leave the same point in the same direction, with the slower vehicle starting first. After the faster vehicle starts, the chase lasts ${dur(i.meetingTime)}. The faster and slower vehicles travel at ${n(i.speedA)} km/h and ${n(i.speedB)} km/h respectively. How much earlier did the slower vehicle start?`;
    } else if (structure === 3) {
      stem = `A slower vehicle leaves a checkpoint first at ${n(i.speedB)} km/h. A faster vehicle later leaves the same checkpoint at ${n(i.speedA)} km/h. From the faster vehicle's start, the catch-up takes ${dur(i.meetingTime)}. Determine how much earlier the slower vehicle left.`;
    }
  } else if (state.solveMode === "findMeetingPointFromSpeedRatio" && structure === 1) {
    stem = `Two vehicles start simultaneously from opposite ends of a ${n(i.routeDistance)} km route. Their speeds are in the ratio ${n(i.ratioA)}:${n(i.ratioB)}. How far from the first end do they meet?`;
  } else if (state.solveMode === "findSpeedNeededToAvoidOrCauseMeeting" && i.directionCase === "SAME" && structure === 1) {
    stem = `A pursuer must erase a lead of ${n(i.initialSeparation)} km in ${dur(i.targetTime)} while the leading vehicle continues at ${n(i.speedB)} km/h. Find the required pursuer speed.`;
  } else if (state.solveMode === "findSpeedNeededToAvoidOrCauseMeeting" && i.directionCase !== "SAME" && structure === 2) {
    stem = `Two vehicles start from checkpoints ${n(i.initialSeparation)} km apart and move towards each other. One travels at ${n(i.speedB)} km/h. What speed must the second maintain for them to meet after ${dur(i.targetTime)}?`;
  }

  return fixNumericArticle(stem);
}
