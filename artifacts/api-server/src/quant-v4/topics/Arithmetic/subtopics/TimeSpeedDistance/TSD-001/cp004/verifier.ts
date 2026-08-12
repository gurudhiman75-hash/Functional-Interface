import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp004SolveCertificate, TsdCp004SolveInput, TsdCp004SolvedUnit } from "./types";

export interface TsdCp004VerificationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly expectedAnswer: Rational | null;
  readonly expectedUnit: TsdCp004SolvedUnit | null;
}

function positive(value: Rational): boolean {
  return isPositive(value);
}

function nonNegative(value: Rational): boolean {
  return compare(value, RATIONAL_ZERO) >= 0;
}

function sameDirectionRelative(a: Rational, b: Rational): Rational | null {
  if (!positive(a) || !positive(b)) return null;
  const value = absRational(subtract(a, b));
  return positive(value) ? value : null;
}

function closing(
  a: Rational,
  b: Rational,
  relation: "OPPOSITE_CLOSING" | "SAME_DIRECTION" | "SAME_DIRECTION_CATCH",
): Rational | null {
  if (!positive(a) || !positive(b)) return null;
  if (relation === "OPPOSITE_CLOSING") return add(a, b);
  return sameDirectionRelative(a, b);
}

function independentExpected(input: TsdCp004SolveInput): { answer: Rational; unit: TsdCp004SolvedUnit } | null {
  switch (input.solveMode) {
    case "relativeSpeedByDirection": {
      const value = closing(input.speedA, input.speedB, input.directionRelation);
      return value ? { answer: value, unit: "KMPH" } : null;
    }
    case "meetingTimeFromInitialGap": {
      if (!positive(input.initialGap)) return null;
      const rel = closing(input.speedA, input.speedB, input.directionRelation);
      return rel ? { answer: divide(input.initialGap, rel), unit: "HOUR" } : null;
    }
    case "initialGapFromMeetingState":
      if (!positive(input.relativeSpeed) || !positive(input.meetingTime)) return null;
      return { answer: multiply(input.relativeSpeed, input.meetingTime), unit: "KM" };
    case "relativeSpeedFromMeetingState":
      if (!positive(input.initialGap) || !positive(input.meetingTime)) return null;
      return { answer: divide(input.initialGap, input.meetingTime), unit: "KMPH" };
    case "individualSpeedFromRelativeState": {
      if (!positive(input.relativeSpeed) || !positive(input.knownSpeed)) return null;
      const value = input.relation === "SAME_TARGET_FASTER"
        ? add(input.knownSpeed, input.relativeSpeed)
        : subtract(input.knownSpeed, input.relativeSpeed);
      return positive(value) ? { answer: value, unit: "KMPH" } : null;
    }
    case "catchUpTimeFromHeadStart": {
      if (!positive(input.fasterSpeed) || !positive(input.slowerSpeed) || compare(input.fasterSpeed, input.slowerSpeed) <= 0) return null;
      const rel = subtract(input.fasterSpeed, input.slowerSpeed);
      const lead = input.representation === "HEAD_START_DISTANCE"
        ? input.headStartDistance
        : multiply(input.slowerSpeed, input.startDelay);
      if (!positive(lead)) return null;
      return { answer: divide(lead, rel), unit: "HOUR" };
    }
    case "headStartFromCatchUpState": {
      if (!positive(input.catchUpTime) || !positive(input.fasterSpeed) || !positive(input.slowerSpeed) || compare(input.fasterSpeed, input.slowerSpeed) <= 0) return null;
      const rel = subtract(input.fasterSpeed, input.slowerSpeed);
      const lead = multiply(rel, input.catchUpTime);
      return input.target === "HEAD_START_DISTANCE"
        ? { answer: lead, unit: "KM" }
        : { answer: divide(lead, input.slowerSpeed), unit: "HOUR" };
    }
    case "speedFromCatchUpState": {
      if (!positive(input.headStartDistance) || !positive(input.catchUpTime) || !positive(input.knownSpeed)) return null;
      const rel = divide(input.headStartDistance, input.catchUpTime);
      const value = input.target === "FASTER" ? add(input.knownSpeed, rel) : subtract(input.knownSpeed, rel);
      return positive(value) ? { answer: value, unit: "KMPH" } : null;
    }
    case "separationAfterElapsedTime": {
      if (!nonNegative(input.initialSeparation) || !positive(input.elapsedTime)) return null;
      const rel = input.motionRelation === "OPPOSITE_MOVING_APART"
        ? closing(input.speedA, input.speedB, "OPPOSITE_CLOSING")
        : sameDirectionRelative(input.speedA, input.speedB);
      if (!rel) return null;
      return { answer: add(input.initialSeparation, multiply(rel, input.elapsedTime)), unit: "KM" };
    }
    case "initialGapFromLaterSeparation": {
      if (!positive(input.laterSeparation) || !positive(input.relativeSpeed) || !positive(input.elapsedTime)) return null;
      const value = subtract(input.laterSeparation, multiply(input.relativeSpeed, input.elapsedTime));
      return nonNegative(value) ? { answer: value, unit: "KM" } : null;
    }
    case "timeToSpecifiedSeparation": {
      if (!nonNegative(input.initialSeparation) || !nonNegative(input.targetSeparation) || !positive(input.relativeSpeed)) return null;
      const change = input.trend === "INCREASING"
        ? subtract(input.targetSeparation, input.initialSeparation)
        : subtract(input.initialSeparation, input.targetSeparation);
      return positive(change) ? { answer: divide(change, input.relativeSpeed), unit: "HOUR" } : null;
    }
    case "meetingPointDistanceSplit": {
      if (!positive(input.totalSeparation)) return null;
      const a = input.representation === "SPEEDS" ? input.speedA : input.speedRatioA;
      const b = input.representation === "SPEEDS" ? input.speedB : input.speedRatioB;
      if (!positive(a) || !positive(b)) return null;
      const fromA = divide(multiply(input.totalSeparation, a), add(a, b));
      const fromB = subtract(input.totalSeparation, fromA);
      return { answer: input.target === "FROM_A" ? fromA : fromB, unit: "KM" };
    }
    case "speedRatioFromMeetingPoint": {
      if (!positive(input.distanceCoveredByA) || !positive(input.distanceCoveredByB)) return null;
      return {
        answer: input.target === "A_TO_B"
          ? divide(input.distanceCoveredByA, input.distanceCoveredByB)
          : divide(input.distanceCoveredByB, input.distanceCoveredByA),
        unit: "RATIO",
      };
    }
    case "meetingClockState": {
      if (!positive(input.initialGap)) return null;
      const clock = input.target === "MEETING_CLOCK" ? input.departureMinuteFromDayZero : input.meetingMinuteFromDayZero;
      if (!nonNegative(clock)) return null;
      const rel = closing(input.speedA, input.speedB, input.directionRelation);
      if (!rel) return null;
      const travelMinutes = multiply(divide(input.initialGap, rel), rational(60));
      const value = input.target === "MEETING_CLOCK" ? add(clock, travelMinutes) : subtract(clock, travelMinutes);
      return nonNegative(value) ? { answer: value, unit: "CLOCK_MINUTE" } : null;
    }
    case "piecewiseCatchUpTime": {
      if (!positive(input.leadDistanceAtPursuerStart) || !positive(input.fasterSpeed) || !positive(input.slowerSpeed) || compare(input.fasterSpeed, input.slowerSpeed) <= 0 || !nonNegative(input.pursuerNonMovingTime)) return null;
      const rel = subtract(input.fasterSpeed, input.slowerSpeed);
      const effectiveGap = add(input.leadDistanceAtPursuerStart, multiply(input.fasterSpeed, input.pursuerNonMovingTime));
      return { answer: divide(effectiveGap, rel), unit: "HOUR" };
    }
    case "speedThresholdForFirstMeeting": {
      if (!positive(input.initialGap) || !positive(input.slowerSpeed) || !positive(input.deadline)) return null;
      return { answer: add(input.slowerSpeed, divide(input.initialGap, input.deadline)), unit: "KMPH" };
    }
    case "multiPursuerFirstEventOrder": {
      if (!positive(input.targetSpeed) || !positive(input.leadFromPursuerA) || !positive(input.leadFromPursuerB)) return null;
      if (compare(input.pursuerASpeed, input.targetSpeed) <= 0 || compare(input.pursuerBSpeed, input.targetSpeed) <= 0) return null;
      const timeA = divide(input.leadFromPursuerA, subtract(input.pursuerASpeed, input.targetSpeed));
      const timeB = divide(input.leadFromPursuerB, subtract(input.pursuerBSpeed, input.targetSpeed));
      const ordering = compare(timeA, timeB);
      return { answer: ordering < 0 ? rational(1) : ordering > 0 ? rational(2) : rational(0), unit: "ORDER" };
    }
  }
}

export function verifyCp004(
  input: TsdCp004SolveInput,
  certificate: TsdCp004SolveCertificate,
): TsdCp004VerificationResult {
  const errors: string[] = [];
  const expected = independentExpected(input);
  if (!expected) {
    errors.push("Independent verifier rejected the input state");
    return Object.freeze({ valid: false, errors: Object.freeze(errors), expectedAnswer: null, expectedUnit: null });
  }
  if (certificate.solveMode !== input.solveMode) errors.push("Solve mode mismatch");
  if (certificate.unit !== expected.unit) errors.push(`Unit mismatch: expected ${expected.unit}, got ${certificate.unit}`);
  if (!equals(certificate.answer, expected.answer)) errors.push("Answer does not match independent relative-motion reconstruction");
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    expectedAnswer: expected.answer,
    expectedUnit: expected.unit,
  });
}
