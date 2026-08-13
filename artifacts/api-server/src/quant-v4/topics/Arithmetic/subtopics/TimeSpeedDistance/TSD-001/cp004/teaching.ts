import type { TsdCp004CoreInput, TsdCp004CoreSolution } from "./relative-motion-foundation";
import { formatClockMinute, formatDurationHours, formatExamNumber } from "../cp003/generation-support";
import type { Rational } from "../foundation/rational";
import type { TsdCp004Explanation } from "./runtime-types";

function v(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): string {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value)) return "?";
  return formatExamNumber(value as Rational);
}

function time(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): string {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value)) return "?";
  return formatDurationHours(value as Rational);
}

function usesClosingSpeed(input: TsdCp004CoreInput, solution: TsdCp004CoreSolution): boolean {
  if (input.directionCase === "SAME") return true;
  return new Set([
    "findRelativeSpeedSameDirection",
    "findCatchUpTimeFromHeadStartDistance",
    "findHeadStartDistanceFromCatchUpTime",
    "findDelayedStartCatchUpTime",
    "findStartDelayFromCatchUpState",
    "findFasterSpeedFromCatchUpState",
    "findSlowerSpeedFromCatchUpState",
  ]).has(solution.solveMode);
}

export function buildCp004Teaching(
  authorityKey: string,
  input: TsdCp004CoreInput,
  solution: TsdCp004CoreSolution,
  answerText: string,
): TsdCp004Explanation {
  const sameDirection = usesClosingSpeed(input, solution);
  const relativeRule = sameDirection
    ? "For motion in the same direction, closing speed = faster speed − slower speed."
    : "For motion towards each other or directly apart, relative speed = speed A + speed B.";

  switch (authorityKey) {
    case "relativeSpeedBetweenTwoBodies":
      return Object.freeze({
        method: "Use the direction rule for relative speed.",
        steps: Object.freeze([
          sameDirection
            ? `Closing speed = ${v(input, "speedA")} − ${v(input, "speedB")} = ${answerText}.`
            : `Relative speed = ${v(input, "speedA")} + ${v(input, "speedB")} = ${answerText}.`,
          `So the gap changes at ${answerText}.`,
        ]),
        shortcut: sameDirection ? "Same direction → subtract speeds." : "Opposite directions → add speeds.",
        finalAnswer: answerText,
      });
    case "firstMeetingOrCatchUpTimeFromGap": {
      const isClock = solution.unit === "CLOCK_MINUTE";
      return Object.freeze({
        method: isClock ? "Find the meeting duration from relative speed, then shift the clock by that duration." : "Find relative speed first, then use time = gap ÷ relative speed.",
        steps: Object.freeze(isClock ? [
          relativeRule,
          `Meeting duration = initial gap ÷ relative speed = ${formatDurationHours({ numerator: (solution.solveMode === "findMeetingClockTime" ? (solution.answer.numerator - (input.departureMinute as Rational).numerator) : ((input.meetingClockMinute as Rational).numerator - solution.answer.numerator)), denominator: 60n })}.`,
          solution.solveMode === "findMeetingClockTime"
            ? `Add the meeting duration to ${formatClockMinute(input.departureMinute as Rational)}.`
            : `Subtract the meeting duration from ${formatClockMinute(input.meetingClockMinute as Rational)}.`,
          `Therefore the required clock time is ${answerText}.`,
        ] : [
          relativeRule,
          `The relevant starting gap is ${v(input, input.headStartDistance ? "headStartDistance" : "initialSeparation")} km.`,
          "Time = gap ÷ relative speed.",
          `This gives ${answerText}.`,
        ]),
        shortcut: isClock ? "Relative speed → meeting duration → clock shift." : "Gap ÷ closing rate.",
        finalAnswer: answerText,
      });
    }
    case "relativeDistanceFromRelativeMotion":
      return Object.freeze({
        method: "Convert the two-body motion into one relative-speed motion and use relative distance = relative speed × time.",
        steps: Object.freeze([
          relativeRule,
          `Use the stated duration ${time(input, input.elapsedTime ? "elapsedTime" : "meetingTime")}.`,
          "Relative distance = relative speed × time.",
          `The required gap/distance is ${answerText}.`,
        ]),
        shortcut: "Relative distance = closing/opening speed × time.",
        finalAnswer: answerText,
      });
    case "relativeSpeedFromGapAndMeetingTime":
      return Object.freeze({
        method: "Reconstruct the relative speed directly from the change in gap and the elapsed time.",
        steps: Object.freeze([
          `Change in gap = ${v(input, "initialSeparation")} km.`,
          `Elapsed time = ${time(input, "meetingTime")}.`,
          "Relative speed = change in gap ÷ elapsed time.",
          `Therefore the relative speed is ${answerText}.`,
        ]),
        shortcut: "Relative speed = change in gap / time.",
        finalAnswer: answerText,
      });
    case "individualSpeedFromRelativeState":
      return Object.freeze({
        method: "First identify or reconstruct the relative speed, then decompose it to the requested individual speed.",
        steps: Object.freeze([
          solution.solveMode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed"
            ? `Given relative speed = ${v(input, "relativeSpeed")} km/h.`
            : `Closing speed = head start ÷ catch-up time = ${v(input, "headStartDistance")} ÷ ${time(input, "meetingTime")}.`,
          input.directionCase === "OPPOSITE"
            ? "For opposite directions, individual speed = relative speed − the other speed."
            : solution.solveMode === "findSlowerSpeedFromCatchUpState"
              ? "For same-direction pursuit, slower speed = faster speed − closing speed."
              : "For same-direction pursuit, faster speed = slower speed + closing speed.",
          `Applying that relation gives ${answerText}.`,
        ]),
        shortcut: "Solve closing/relative speed first; only then add or subtract the known body's speed.",
        finalAnswer: answerText,
      });
    case "delayedStartPursuitState":
      return Object.freeze({
        method: "Turn the start delay into a head-start distance, then use closing speed.",
        steps: Object.freeze(solution.solveMode === "findDelayedStartCatchUpTime" ? [
          `During the delay, the first traveller covers speed × delay = ${v(input, "speedB")} × ${time(input, "startDelay")}.`,
          `Closing speed after the pursuer starts = ${v(input, "speedA")} − ${v(input, "speedB")} km/h.`,
          "Pursuit time = head-start distance ÷ closing speed.",
          `Hence the catch-up time is ${answerText}.`,
        ] : [
          `Closing speed = ${v(input, "speedA")} − ${v(input, "speedB")} km/h.`,
          `Head-start distance at catch-up = closing speed × ${time(input, "meetingTime")}.`,
          "Start delay = head-start distance ÷ slower speed.",
          `Therefore the start delay is ${answerText}.`,
        ]),
        shortcut: "Delay → head start; then close the head start with speed difference.",
        finalAnswer: answerText,
      });
    case "separationEvolutionOnLine":
      return Object.freeze({
        method: "Track only the change in separation using relative speed, then combine it with the initial/final gap as required.",
        steps: Object.freeze([
          relativeRule,
          solution.solveMode === "findTimeUntilSpecifiedSeparation"
            ? "Find the required change in the gap, not the final gap itself."
            : "Find how much separation is added during the stated time.",
          solution.solveMode === "findInitialGapFromLaterSeparation"
            ? "Initial gap = later separation − added separation."
            : solution.solveMode === "findSeparationAfterMovingApart"
              ? "Later separation = initial gap + added separation."
              : "Time = required change in separation ÷ relative speed.",
          `This gives ${answerText}.`,
        ]),
        shortcut: "Separation problems are one-dimensional relative-motion problems: change in gap = relative speed × time.",
        finalAnswer: answerText,
      });
    case "firstMeetingPointFromSpeedRelation":
      return Object.freeze({
        method: "At the first simultaneous meeting, both travellers move for the same time, so distances are proportional to speeds.",
        steps: Object.freeze([
          solution.solveMode === "findMeetingPointFromSpeedRatio"
            ? `Speed ratio = ${v(input, "ratioA")}:${v(input, "ratioB")}.`
            : `Speed ratio = ${v(input, "speedA")}:${v(input, "speedB")}.`,
          "Therefore the route is divided in the same ratio at the first meeting.",
          "Distance from the first end = total route × first ratio part ÷ sum of ratio parts.",
          `So the meeting point is ${answerText} from the first end.`,
        ]),
        shortcut: "First meeting from opposite ends: meeting distances ∝ speeds.",
        finalAnswer: answerText,
      });
    case "speedRatioFromFirstMeetingPoint":
      return Object.freeze({
        method: "At the first simultaneous meeting, equal travel time makes the speed ratio equal to the corresponding distance ratio.",
        steps: Object.freeze([
          `The travellers cover ${v(input, "distanceA")} km and ${v(input, "distanceB")} km in the same time.`,
          "So speed A : speed B = distance A : distance B.",
          `Reducing that ratio gives ${answerText}.`,
        ]),
        shortcut: "Same meeting time → speed ratio = distance ratio.",
        finalAnswer: answerText,
      });
    case "requiredSpeedForTargetMeeting":
      return Object.freeze({
        method: "Convert the target meeting time into the required relative speed, then decompose that relative speed by direction.",
        steps: Object.freeze([
          `Required relative speed = ${v(input, "initialSeparation")} km ÷ ${time(input, "targetTime")}.`,
          input.directionCase === "SAME"
            ? `For pursuit, required speed = required closing speed + ${v(input, "speedB")} km/h.`
            : `For opposite directions, required speed = required relative speed − ${v(input, "speedB")} km/h.`,
          `Therefore the required speed is ${answerText}.`,
        ]),
        shortcut: "Target gap/time first; then undo the relative-speed relation.",
        finalAnswer: answerText,
      });
  }
}
