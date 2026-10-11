import { add, divide, multiply, subtract, type Rational } from "../foundation/rational";
import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004CoreInput, TsdCp004CoreSolution } from "./relative-motion-foundation";
import type { TsdCp004Explanation } from "./runtime-types";

function n(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

function h(value: Rational | undefined): string {
  return value ? formatDurationHours(value) : "?";
}

function rel(input: TsdCp004CoreInput, sameOverride?: boolean): Rational {
  const same = sameOverride ?? input.directionCase === "SAME";
  return same ? subtract(input.speedA!, input.speedB!) : add(input.speedA!, input.speedB!);
}

function freeze(method: string, steps: readonly string[], shortcut: string, finalAnswer: string): TsdCp004Explanation {
  return Object.freeze({ method, steps: Object.freeze([...steps]), shortcut, finalAnswer });
}

export function buildCp004TeachingV2(
  authorityKey: string,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
  answerText: string,
): TsdCp004Explanation {
  switch (authorityKey) {
    case "relativeSpeedBetweenTwoBodies": {
      const same = solution.solveMode === "findRelativeSpeedSameDirection" || input.directionCase === "SAME";
      const r = rel(input, same);
      return freeze(
        "Use the relative-speed rule that matches the direction of motion.",
        same
          ? [`Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(r)} km/h.`, `Therefore the faster vehicle gains ${n(r)} km each hour.`]
          : [`Relative speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`, `Therefore their separation changes at ${n(r)} km/h.`],
        same ? "Same direction → subtract the speeds." : "Opposite directions → add the speeds.",
        answerText,
      );
    }

    case "firstMeetingOrCatchUpTimeFromGap": {
      const same = input.directionCase === "SAME" || solution.solveMode === "findCatchUpTimeFromHeadStartDistance";
      const r = rel(input, same);
      const gap = input.headStartDistance ?? input.initialSeparation!;
      const time = divide(gap, r);
      if (solution.unit === "CLOCK_MINUTE") {
        const isMeeting = solution.solveMode === "findMeetingClockTime";
        return freeze(
          "First find the relative-motion duration, then shift the clock by that duration.",
          [
            same
              ? `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(r)} km/h.`
              : `Relative speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`,
            `Meeting duration = ${n(gap)} ÷ ${n(r)} = ${h(time)}.`,
            isMeeting
              ? `Starting from ${formatClockMinute(input.departureMinute!)}, add ${h(time)} to get ${answerText}.`
              : `From meeting time ${formatClockMinute(input.meetingClockMinute!)}, subtract ${h(time)} to get ${answerText}.`,
          ],
          "Relative speed → duration → clock shift.",
          answerText,
        );
      }
      return freeze(
        "Use time = gap ÷ relative speed.",
        [
          same
            ? `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(r)} km/h.`
            : `Relative speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`,
          `Relevant gap = ${n(gap)} km.`,
          `Time = ${n(gap)} ÷ ${n(r)} = ${h(time)}.`,
        ],
        "Gap ÷ closing/opening rate.",
        answerText,
      );
    }

    case "relativeDistanceFromRelativeMotion": {
      const same = input.directionCase === "SAME" || solution.solveMode === "findHeadStartDistanceFromCatchUpTime";
      const r = rel(input, same);
      const t = input.elapsedTime ?? input.meetingTime!;
      const d = multiply(r, t);
      return freeze(
        "Convert the two-body motion into one relative-speed motion, then use distance = speed × time.",
        [
          same
            ? `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(r)} km/h.`
            : `Relative speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`,
          `Time = ${h(t)}.`,
          `Relative distance = ${n(r)} × ${n(t)} = ${n(d)} km.`,
        ],
        "Relative distance = relative speed × time.",
        answerText,
      );
    }

    case "relativeSpeedFromGapAndMeetingTime": {
      const gap = input.initialSeparation!;
      const t = input.meetingTime!;
      const r = divide(gap, t);
      return freeze(
        "Reconstruct relative speed from the observed change in gap.",
        [`Gap change = ${n(gap)} km.`, `Elapsed time = ${h(t)}.`, `Relative speed = ${n(gap)} ÷ ${n(t)} = ${n(r)} km/h.`],
        "Relative speed = gap change ÷ time.",
        answerText,
      );
    }

    case "individualSpeedFromRelativeState": {
      if (solution.solveMode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed") {
        const r = input.relativeSpeed!;
        const known = input.speedB!;
        const result = input.directionCase === "SAME" ? add(known, r) : subtract(r, known);
        return freeze(
          "Use the relative-speed relation to recover the unknown individual speed.",
          [
            `Relative speed = ${n(r)} km/h and known speed = ${n(known)} km/h.`,
            input.directionCase === "SAME"
              ? `Faster speed = ${n(known)} + ${n(r)} = ${n(result)} km/h.`
              : `Other speed = ${n(r)} − ${n(known)} = ${n(result)} km/h.`,
          ],
          "Find the relative speed first; then undo the direction relation.",
          answerText,
        );
      }
      const closing = divide(input.headStartDistance!, input.meetingTime!);
      if (solution.solveMode === "findFasterSpeedFromCatchUpState") {
        const result = add(input.speedB!, closing);
        return freeze(
          "Find closing speed from the catch-up state, then add it to the slower speed.",
          [
            `Closing speed = ${n(input.headStartDistance)} ÷ ${n(input.meetingTime)} = ${n(closing)} km/h.`,
            `Faster speed = ${n(input.speedB)} + ${n(closing)} = ${n(result)} km/h.`,
          ],
          "Head start ÷ catch-up time gives the speed advantage.",
          answerText,
        );
      }
      const result = subtract(input.speedA!, closing);
      return freeze(
        "Find closing speed from the catch-up state, then subtract it from the faster speed.",
        [
          `Closing speed = ${n(input.headStartDistance)} ÷ ${n(input.meetingTime)} = ${n(closing)} km/h.`,
          `Slower speed = ${n(input.speedA)} − ${n(closing)} = ${n(result)} km/h.`,
        ],
        "Head start ÷ catch-up time gives the speed advantage.",
        answerText,
      );
    }

    case "delayedStartPursuitState": {
      const closing = subtract(input.speedA!, input.speedB!);
      if (solution.solveMode === "findDelayedStartCatchUpTime") {
        const headStart = multiply(input.speedB!, input.startDelay!);
        const pursuit = divide(headStart, closing);
        return freeze(
          "Turn the start delay into a head-start distance, then close that distance at the speed difference.",
          [
            `Head-start distance = ${n(input.speedB)} × ${n(input.startDelay)} = ${n(headStart)} km.`,
            `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(closing)} km/h.`,
            `Catch-up time = ${n(headStart)} ÷ ${n(closing)} = ${h(pursuit)}.`,
          ],
          "Delay → head start → divide by closing speed.",
          answerText,
        );
      }
      const headStart = multiply(closing, input.meetingTime!);
      const delay = divide(headStart, input.speedB!);
      return freeze(
        "Use the pursuit period to reconstruct the earlier head start, then convert that distance into a start delay.",
        [
          `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(closing)} km/h.`,
          `Head-start distance = ${n(closing)} × ${n(input.meetingTime)} = ${n(headStart)} km.`,
          `Start delay = ${n(headStart)} ÷ ${n(input.speedB)} = ${h(delay)}.`,
        ],
        "Pursuit time → head start → divide by slower speed.",
        answerText,
      );
    }

    case "separationEvolutionOnLine": {
      const same = input.directionCase === "SAME";
      const r = rel(input, same);
      if (solution.solveMode === "findSeparationAfterMovingApart") {
        const increase = multiply(r, input.elapsedTime!);
        const later = add(input.initialSeparation!, increase);
        return freeze(
          "Find how much separation is added, then add it to the original gap.",
          [`Opening speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`, `Added separation = ${n(r)} × ${n(input.elapsedTime)} = ${n(increase)} km.`, `Final separation = ${n(input.initialSeparation)} + ${n(increase)} = ${n(later)} km.`],
          "Later gap = initial gap + relative distance.",
          answerText,
        );
      }
      if (solution.solveMode === "findInitialGapFromLaterSeparation") {
        const increase = multiply(r, input.elapsedTime!);
        const initial = subtract(input.specifiedSeparation!, increase);
        return freeze(
          "Remove the separation added during the observed interval from the later gap.",
          [`Opening speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`, `Added separation = ${n(r)} × ${n(input.elapsedTime)} = ${n(increase)} km.`, `Initial gap = ${n(input.specifiedSeparation)} − ${n(increase)} = ${n(initial)} km.`],
          "Initial gap = later gap − added relative distance.",
          answerText,
        );
      }
      const change = same
        ? subtract(input.initialSeparation!, input.specifiedSeparation!)
        : subtract(input.specifiedSeparation!, input.initialSeparation!);
      const time = divide(change, r);
      return freeze(
        "Use only the required change in separation, then divide by relative speed.",
        [
          `Required gap change = ${n(change)} km.`,
          same
            ? `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(r)} km/h.`
            : `Opening speed = ${n(input.speedA)} + ${n(input.speedB)} = ${n(r)} km/h.`,
          `Time = ${n(change)} ÷ ${n(r)} = ${h(time)}.`,
        ],
        "Change in gap ÷ relative speed.",
        answerText,
      );
    }

    case "firstMeetingPointFromSpeedRelation": {
      const first = solution.solveMode === "findMeetingPointFromSpeedRatio" ? input.ratioA! : input.speedA!;
      const second = solution.solveMode === "findMeetingPointFromSpeedRatio" ? input.ratioB! : input.speedB!;
      const total = add(first, second);
      const distance = divide(multiply(input.routeDistance!, first), total);
      return freeze(
        "At first meeting, both vehicles travel for the same time, so their distances are proportional to their speeds.",
        [
          `First : second speed parts = ${n(first)}:${n(second)}; total parts = ${n(total)}.`,
          `Distance from the first end = ${n(input.routeDistance)} × ${n(first)} ÷ ${n(total)} = ${n(distance)} km.`,
        ],
        "First meeting from opposite ends: meeting distances follow the speed ratio.",
        answerText,
      );
    }

    case "speedRatioFromFirstMeetingPoint": {
      return freeze(
        "Equal travel time means the speed ratio equals the corresponding distance ratio.",
        [`Distance ratio = ${n(input.distanceA)}:${n(input.distanceB)}.`, `Therefore speed A : speed B = ${answerText}.`],
        "Same time → speed ratio = distance ratio.",
        answerText,
      );
    }

    case "requiredSpeedForTargetMeeting": {
      const requiredRelative = divide(input.initialSeparation!, input.targetTime!);
      const required = input.directionCase === "SAME"
        ? add(requiredRelative, input.speedB!)
        : subtract(requiredRelative, input.speedB!);
      return freeze(
        "First calculate the relative speed needed to meet the target time, then recover the requested vehicle speed.",
        [
          `Required relative speed = ${n(input.initialSeparation)} ÷ ${n(input.targetTime)} = ${n(requiredRelative)} km/h.`,
          input.directionCase === "SAME"
            ? `Required pursuer speed = ${n(requiredRelative)} + ${n(input.speedB)} = ${n(required)} km/h.`
            : `Required second speed = ${n(requiredRelative)} − ${n(input.speedB)} = ${n(required)} km/h.`,
        ],
        "Target gap/time first; then undo the relative-speed relation.",
        answerText,
      );
    }
  }
}
