import { add, divide, multiply, subtract, type Rational } from "../foundation/rational";
import { formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { TsdCp004CoreInput, TsdCp004CoreSolution } from "./relative-motion-foundation";
import type { TsdCp004Explanation, TsdCp004GeneratedState } from "./runtime-types";

function n(value: Rational): string { return formatExamNumber(value); }
function duration(value: Rational): string { return formatDurationHours(value); }

const SAME_DIRECTION_MODES = new Set([
  "findRelativeSpeedSameDirection",
  "findCatchUpTimeFromHeadStartDistance",
  "findHeadStartDistanceFromCatchUpTime",
  "findDelayedStartCatchUpTime",
  "findStartDelayFromCatchUpState",
  "findFasterSpeedFromCatchUpState",
  "findSlowerSpeedFromCatchUpState",
]);

function sameDirection(input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): boolean {
  return input.directionCase === "SAME" || SAME_DIRECTION_MODES.has(solution.solveMode);
}

function relative(input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): Rational {
  if (!input.speedA || !input.speedB) throw new Error(`${solution.solveMode}: speeds required for relative-motion presentation`);
  return sameDirection(input, solution) ? subtract(input.speedA, input.speedB) : add(input.speedA, input.speedB);
}

function speedLine(input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): string {
  const rel = relative(input, solution);
  return sameDirection(input, solution)
    ? `Closing speed = ${n(input.speedA!)} − ${n(input.speedB!)} = ${n(rel)} km/h.`
    : `Relative speed = ${n(input.speedA!)} + ${n(input.speedB!)} = ${n(rel)} km/h.`;
}

export function polishCp004ActorStem(state: TsdCp004GeneratedState, stem: string): string {
  if (state.solveMode === "findRelativeSpeedSameDirection") {
    return stem.replace("A faster rider", "A faster vehicle").replace("another rider", "another vehicle");
  }
  if (state.solveMode === "findUnknownStartPointGap" || state.solveMode === "findRelativeDistanceCoveredInGivenTime") {
    return stem.replace("Two runners", "Two vehicles");
  }
  if (state.solveMode === "findFasterSpeedFromCatchUpState") {
    return stem.replace("A slower rider", "A motorcyclist").replace("A faster rider", "Another motorcyclist").replace("faster rider's", "faster motorcyclist's");
  }
  if (state.solveMode === "findSlowerSpeedFromCatchUpState") {
    return stem.replace("A rider moving", "A motorcyclist moving").replace("another rider", "another motorcyclist").replace("slower rider's", "slower motorcyclist's");
  }
  return stem;
}

export function strengthenCp004Explanation(
  authorityKey: string,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
  answerText: string,
  base: TsdCp004Explanation,
): TsdCp004Explanation {
  let steps: readonly string[] = base.steps;

  if (authorityKey === "firstMeetingOrCatchUpTimeFromGap") {
    const rel = relative(input, solution);
    const gap = input.headStartDistance ?? input.initialSeparation;
    if (gap) {
      const meetingDuration = divide(gap, rel);
      steps = solution.unit === "CLOCK_MINUTE"
        ? Object.freeze([
            speedLine(input, solution),
            `Meeting duration = ${n(gap)} ÷ ${n(rel)} = ${duration(meetingDuration)}.`,
            base.steps[2] ?? "Shift the clock by the meeting duration.",
            `Therefore the required clock time is ${answerText}.`,
          ])
        : Object.freeze([
            speedLine(input, solution),
            `Time = ${n(gap)} ÷ ${n(rel)} = ${answerText}.`,
          ]);
    }
  } else if (authorityKey === "relativeDistanceFromRelativeMotion") {
    const rel = relative(input, solution);
    const t = input.elapsedTime ?? input.meetingTime;
    if (t) {
      steps = Object.freeze([
        speedLine(input, solution),
        `Relative distance = ${n(rel)} × ${n(t)} = ${answerText}.`,
      ]);
    }
  } else if (authorityKey === "relativeSpeedFromGapAndMeetingTime" && input.initialSeparation && input.meetingTime) {
    steps = Object.freeze([
      `Relative speed = change in gap ÷ time = ${n(input.initialSeparation)} ÷ ${n(input.meetingTime)} = ${answerText}.`,
    ]);
  } else if (authorityKey === "individualSpeedFromRelativeState") {
    if (solution.solveMode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" && input.relativeSpeed) {
      const known = input.unknownBody === "A" ? input.speedB : input.speedA;
      if (known) {
        steps = input.directionCase === "OPPOSITE"
          ? Object.freeze([`Unknown speed = ${n(input.relativeSpeed)} − ${n(known)} = ${answerText}.`])
          : Object.freeze([`Faster speed = ${n(known)} + ${n(input.relativeSpeed)} = ${answerText}.`]);
      }
    } else if (input.headStartDistance && input.meetingTime) {
      const closing = divide(input.headStartDistance, input.meetingTime);
      if (solution.solveMode === "findFasterSpeedFromCatchUpState" && input.speedB) {
        steps = Object.freeze([
          `Closing speed = ${n(input.headStartDistance)} ÷ ${n(input.meetingTime)} = ${n(closing)} km/h.`,
          `Faster speed = ${n(input.speedB)} + ${n(closing)} = ${answerText}.`,
        ]);
      } else if (solution.solveMode === "findSlowerSpeedFromCatchUpState" && input.speedA) {
        steps = Object.freeze([
          `Closing speed = ${n(input.headStartDistance)} ÷ ${n(input.meetingTime)} = ${n(closing)} km/h.`,
          `Slower speed = ${n(input.speedA)} − ${n(closing)} = ${answerText}.`,
        ]);
      }
    }
  } else if (authorityKey === "delayedStartPursuitState" && input.speedA && input.speedB) {
    const closing = subtract(input.speedA, input.speedB);
    if (solution.solveMode === "findDelayedStartCatchUpTime" && input.startDelay) {
      const headStart = multiply(input.speedB, input.startDelay);
      steps = Object.freeze([
        `Head-start distance = ${n(input.speedB)} × ${n(input.startDelay)} = ${n(headStart)} km.`,
        `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(closing)} km/h.`,
        `Catch-up time = ${n(headStart)} ÷ ${n(closing)} = ${answerText}.`,
      ]);
    } else if (solution.solveMode === "findStartDelayFromCatchUpState" && input.meetingTime) {
      const headStart = multiply(closing, input.meetingTime);
      const delay = divide(headStart, input.speedB);
      steps = Object.freeze([
        `Closing speed = ${n(input.speedA)} − ${n(input.speedB)} = ${n(closing)} km/h.`,
        `Head-start distance = ${n(closing)} × ${n(input.meetingTime)} = ${n(headStart)} km.`,
        `Start delay = ${n(headStart)} ÷ ${n(input.speedB)} = ${duration(delay)}.`,
        `Therefore the required delay is ${answerText}.`,
      ]);
    }
  } else if (authorityKey === "separationEvolutionOnLine" && input.speedA && input.speedB) {
    const rel = sameDirection(input, solution) ? subtract(input.speedA, input.speedB) : add(input.speedA, input.speedB);
    if (solution.solveMode === "findSeparationAfterMovingApart" && input.initialSeparation && input.elapsedTime) {
      const added = multiply(rel, input.elapsedTime);
      steps = Object.freeze([
        speedLine(input, solution),
        `Added separation = ${n(rel)} × ${n(input.elapsedTime)} = ${n(added)} km.`,
        `Final separation = ${n(input.initialSeparation)} + ${n(added)} = ${answerText}.`,
      ]);
    } else if (solution.solveMode === "findInitialGapFromLaterSeparation" && input.specifiedSeparation && input.elapsedTime) {
      const added = multiply(rel, input.elapsedTime);
      steps = Object.freeze([
        speedLine(input, solution),
        `Added separation = ${n(rel)} × ${n(input.elapsedTime)} = ${n(added)} km.`,
        `Initial separation = ${n(input.specifiedSeparation)} − ${n(added)} = ${answerText}.`,
      ]);
    } else if (solution.solveMode === "findTimeUntilSpecifiedSeparation" && input.initialSeparation && input.specifiedSeparation) {
      const change = sameDirection(input, solution)
        ? subtract(input.initialSeparation, input.specifiedSeparation)
        : subtract(input.specifiedSeparation, input.initialSeparation);
      steps = Object.freeze([
        speedLine(input, solution),
        `Required change in separation = ${n(change)} km.`,
        `Time = ${n(change)} ÷ ${n(rel)} = ${answerText}.`,
      ]);
    }
  } else if (authorityKey === "firstMeetingPointFromSpeedRelation" && input.routeDistance) {
    const first = input.speedA ?? input.ratioA;
    const second = input.speedB ?? input.ratioB;
    if (first && second) {
      steps = Object.freeze([
        `At the first meeting, distance ratio = speed ratio = ${n(first)}:${n(second)}.`,
        `Distance from the first end = ${n(input.routeDistance)} × ${n(first)} ÷ (${n(first)} + ${n(second)}) = ${answerText}.`,
      ]);
    }
  } else if (authorityKey === "speedRatioFromFirstMeetingPoint" && input.distanceA && input.distanceB) {
    steps = Object.freeze([
      `Both travellers move for the same time, so speed ratio = distance ratio = ${n(input.distanceA)}:${n(input.distanceB)}.`,
      `Reducing the ratio gives ${answerText}.`,
    ]);
  } else if (authorityKey === "requiredSpeedForTargetMeeting" && input.initialSeparation && input.targetTime && input.speedB) {
    const requiredRelative = divide(input.initialSeparation, input.targetTime);
    steps = input.directionCase === "SAME"
      ? Object.freeze([
          `Required closing speed = ${n(input.initialSeparation)} ÷ ${n(input.targetTime)} = ${n(requiredRelative)} km/h.`,
          `Required pursuing speed = ${n(requiredRelative)} + ${n(input.speedB)} = ${answerText}.`,
        ])
      : Object.freeze([
          `Required relative speed = ${n(input.initialSeparation)} ÷ ${n(input.targetTime)} = ${n(requiredRelative)} km/h.`,
          `Required second speed = ${n(requiredRelative)} − ${n(input.speedB)} = ${answerText}.`,
        ]);
  }

  return Object.freeze({ ...base, steps: Object.freeze([...steps]), finalAnswer: answerText });
}
