import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp004SolveCertificate, TsdCp004SolveInput } from "./types";

function requirePositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

function requireNonNegative(value: Rational, label: string): void {
  if (compare(value, RATIONAL_ZERO) < 0) throw new Error(`${label} must be non-negative`);
}

function requireFaster(faster: Rational, slower: Rational): void {
  requirePositive(faster, "faster speed");
  requirePositive(slower, "slower speed");
  if (compare(faster, slower) <= 0) throw new Error("faster speed must exceed slower speed");
}

function relativeSpeed(
  speedA: Rational,
  speedB: Rational,
  relation: "OPPOSITE_CLOSING" | "SAME_DIRECTION" | "SAME_DIRECTION_CATCH",
): Rational {
  requirePositive(speedA, "speed A");
  requirePositive(speedB, "speed B");
  if (relation === "OPPOSITE_CLOSING") return add(speedA, speedB);
  const difference = absRational(subtract(speedA, speedB));
  requirePositive(difference, "same-direction closing speed");
  return difference;
}

export function solveCp004(input: TsdCp004SolveInput): TsdCp004SolveCertificate {
  switch (input.solveMode) {
    case "relativeSpeedByDirection": {
      const answer = relativeSpeed(input.speedA, input.speedB, input.directionRelation);
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "KMPH",
        governingEquation: input.directionRelation === "OPPOSITE_CLOSING"
          ? "relative speed = speed A + speed B"
          : "relative speed = |speed A - speed B|",
        intermediate: Object.freeze({}),
      });
    }

    case "meetingTimeFromInitialGap": {
      requirePositive(input.initialGap, "initial gap");
      const closingSpeed = relativeSpeed(input.speedA, input.speedB, input.directionRelation);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(input.initialGap, closingSpeed),
        unit: "HOUR",
        governingEquation: "first-event time = initial gap / positive closing speed",
        intermediate: Object.freeze({ closingSpeed }),
      });
    }

    case "initialGapFromMeetingState": {
      requirePositive(input.relativeSpeed, "relative speed");
      requirePositive(input.meetingTime, "meeting time");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: multiply(input.relativeSpeed, input.meetingTime),
        unit: "KM",
        governingEquation: "initial gap = relative speed × meeting time",
        intermediate: Object.freeze({}),
      });
    }

    case "relativeSpeedFromMeetingState": {
      requirePositive(input.initialGap, "initial gap");
      requirePositive(input.meetingTime, "meeting time");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(input.initialGap, input.meetingTime),
        unit: "KMPH",
        governingEquation: "relative speed = initial gap / meeting time",
        intermediate: Object.freeze({}),
      });
    }

    case "individualSpeedFromRelativeState": {
      requirePositive(input.relativeSpeed, "relative speed");
      requirePositive(input.knownSpeed, "known speed");
      let answer: Rational;
      if (input.relation === "OPPOSITE_TARGET") {
        answer = subtract(input.relativeSpeed, input.knownSpeed);
      } else if (input.relation === "SAME_TARGET_FASTER") {
        answer = add(input.knownSpeed, input.relativeSpeed);
      } else {
        answer = subtract(input.knownSpeed, input.relativeSpeed);
      }
      requirePositive(answer, "unknown individual speed");
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "KMPH",
        governingEquation: "recover the unknown individual speed from the signed relative-speed relation",
        intermediate: Object.freeze({}),
      });
    }

    case "catchUpTimeFromHeadStart": {
      requireFaster(input.fasterSpeed, input.slowerSpeed);
      const closingSpeed = subtract(input.fasterSpeed, input.slowerSpeed);
      let leadDistance: Rational;
      if (input.representation === "HEAD_START_DISTANCE") {
        requirePositive(input.headStartDistance, "head-start distance");
        leadDistance = input.headStartDistance;
      } else {
        requirePositive(input.startDelay, "start delay");
        leadDistance = multiply(input.slowerSpeed, input.startDelay);
      }
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(leadDistance, closingSpeed),
        unit: "HOUR",
        governingEquation: "catch-up time after pursuer starts = lead distance / (faster speed - slower speed)",
        intermediate: Object.freeze({ closingSpeed, leadDistance }),
      });
    }

    case "headStartFromCatchUpState": {
      requirePositive(input.catchUpTime, "catch-up time");
      requireFaster(input.fasterSpeed, input.slowerSpeed);
      const closingSpeed = subtract(input.fasterSpeed, input.slowerSpeed);
      const leadDistance = multiply(closingSpeed, input.catchUpTime);
      if (input.target === "HEAD_START_DISTANCE") {
        return Object.freeze({
          solveMode: input.solveMode,
          answer: leadDistance,
          unit: "KM",
          governingEquation: "head-start distance = (faster speed - slower speed) × catch-up time",
          intermediate: Object.freeze({ closingSpeed }),
        });
      }
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(leadDistance, input.slowerSpeed),
        unit: "HOUR",
        governingEquation: "start delay = head-start distance / slower speed",
        intermediate: Object.freeze({ closingSpeed, leadDistance }),
      });
    }

    case "speedFromCatchUpState": {
      requirePositive(input.headStartDistance, "head-start distance");
      requirePositive(input.catchUpTime, "catch-up time");
      requirePositive(input.knownSpeed, "known speed");
      const closingSpeed = divide(input.headStartDistance, input.catchUpTime);
      const answer = input.target === "FASTER"
        ? add(input.knownSpeed, closingSpeed)
        : subtract(input.knownSpeed, closingSpeed);
      requirePositive(answer, "unknown speed");
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "KMPH",
        governingEquation: "speed difference = head-start distance / catch-up time",
        intermediate: Object.freeze({ closingSpeed }),
      });
    }

    case "separationAfterElapsedTime": {
      requireNonNegative(input.initialSeparation, "initial separation");
      requirePositive(input.elapsedTime, "elapsed time");
      const relative = input.motionRelation === "OPPOSITE_MOVING_APART"
        ? relativeSpeed(input.speedA, input.speedB, "OPPOSITE_CLOSING")
        : relativeSpeed(input.speedA, input.speedB, "SAME_DIRECTION");
      const addedSeparation = multiply(relative, input.elapsedTime);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: add(input.initialSeparation, addedSeparation),
        unit: "KM",
        governingEquation: "later separation = initial separation + separating speed × elapsed time",
        intermediate: Object.freeze({ relativeSpeed: relative, addedSeparation }),
      });
    }

    case "initialGapFromLaterSeparation": {
      requirePositive(input.laterSeparation, "later separation");
      requirePositive(input.relativeSpeed, "relative speed");
      requirePositive(input.elapsedTime, "elapsed time");
      const addedSeparation = multiply(input.relativeSpeed, input.elapsedTime);
      const answer = subtract(input.laterSeparation, addedSeparation);
      requireNonNegative(answer, "initial gap");
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "KM",
        governingEquation: "initial gap = later separation - relative speed × elapsed time",
        intermediate: Object.freeze({ addedSeparation }),
      });
    }

    case "timeToSpecifiedSeparation": {
      requireNonNegative(input.initialSeparation, "initial separation");
      requireNonNegative(input.targetSeparation, "target separation");
      requirePositive(input.relativeSpeed, "relative speed");
      const gapChange = input.trend === "INCREASING"
        ? subtract(input.targetSeparation, input.initialSeparation)
        : subtract(input.initialSeparation, input.targetSeparation);
      requirePositive(gapChange, "required separation change");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(gapChange, input.relativeSpeed),
        unit: "HOUR",
        governingEquation: "time = required change in separation / relative speed",
        intermediate: Object.freeze({ gapChange }),
      });
    }

    case "meetingPointDistanceSplit": {
      requirePositive(input.totalSeparation, "total separation");
      const weightA = input.representation === "SPEEDS" ? input.speedA : input.speedRatioA;
      const weightB = input.representation === "SPEEDS" ? input.speedB : input.speedRatioB;
      requirePositive(weightA, "A motion weight");
      requirePositive(weightB, "B motion weight");
      const totalWeight = add(weightA, weightB);
      const distanceFromA = divide(multiply(input.totalSeparation, weightA), totalWeight);
      const distanceFromB = subtract(input.totalSeparation, distanceFromA);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: input.target === "FROM_A" ? distanceFromA : distanceFromB,
        unit: "KM",
        governingEquation: "at a simultaneous first meeting, distances covered are in the speed ratio",
        intermediate: Object.freeze({ totalWeight, distanceFromA, distanceFromB }),
      });
    }

    case "speedRatioFromMeetingPoint": {
      requirePositive(input.distanceCoveredByA, "distance covered by A");
      requirePositive(input.distanceCoveredByB, "distance covered by B");
      const aToB = divide(input.distanceCoveredByA, input.distanceCoveredByB);
      const bToA = divide(input.distanceCoveredByB, input.distanceCoveredByA);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: input.target === "A_TO_B" ? aToB : bToA,
        unit: "RATIO",
        governingEquation: "for equal meeting time, speed ratio = distance-covered ratio",
        intermediate: Object.freeze({ aToB, bToA }),
      });
    }

    case "meetingClockState": {
      requirePositive(input.initialGap, "initial gap");
      requireNonNegative(
        input.target === "MEETING_CLOCK" ? input.departureMinuteFromDayZero : input.meetingMinuteFromDayZero,
        input.target === "MEETING_CLOCK" ? "departure clock minute" : "meeting clock minute",
      );
      const closingSpeed = relativeSpeed(input.speedA, input.speedB, input.directionRelation);
      const meetingHours = divide(input.initialGap, closingSpeed);
      const meetingMinutes = multiply(meetingHours, rational(60));
      const answer = input.target === "MEETING_CLOCK"
        ? add(input.departureMinuteFromDayZero, meetingMinutes)
        : subtract(input.meetingMinuteFromDayZero, meetingMinutes);
      requireNonNegative(answer, "solved clock minute");
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "CLOCK_MINUTE",
        governingEquation: "meeting clock = departure clock + 60 × initial gap / closing speed",
        intermediate: Object.freeze({ closingSpeed, meetingHours, meetingMinutes }),
      });
    }

    case "piecewiseCatchUpTime": {
      requirePositive(input.leadDistanceAtPursuerStart, "lead distance at pursuer start");
      requireFaster(input.fasterSpeed, input.slowerSpeed);
      requireNonNegative(input.pursuerNonMovingTime, "pursuer non-moving time");
      const closingSpeed = subtract(input.fasterSpeed, input.slowerSpeed);
      const interruptionPenalty = multiply(input.fasterSpeed, input.pursuerNonMovingTime);
      const effectiveGap = add(input.leadDistanceAtPursuerStart, interruptionPenalty);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(effectiveGap, closingSpeed),
        unit: "HOUR",
        governingEquation: "faster speed × (t - non-moving time) = initial lead + slower speed × t",
        intermediate: Object.freeze({ closingSpeed, interruptionPenalty, effectiveGap }),
      });
    }

    case "speedThresholdForFirstMeeting": {
      requirePositive(input.initialGap, "initial gap");
      requirePositive(input.slowerSpeed, "slower speed");
      requirePositive(input.deadline, "deadline");
      const requiredClosingSpeed = divide(input.initialGap, input.deadline);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: add(input.slowerSpeed, requiredClosingSpeed),
        unit: "KMPH",
        governingEquation: "threshold pursuer speed = slower speed + initial gap/deadline",
        intermediate: Object.freeze({ requiredClosingSpeed }),
      });
    }

    case "multiPursuerFirstEventOrder": {
      requirePositive(input.targetSpeed, "target speed");
      requirePositive(input.leadFromPursuerA, "lead from pursuer A");
      requirePositive(input.leadFromPursuerB, "lead from pursuer B");
      requireFaster(input.pursuerASpeed, input.targetSpeed);
      requireFaster(input.pursuerBSpeed, input.targetSpeed);
      const closingA = subtract(input.pursuerASpeed, input.targetSpeed);
      const closingB = subtract(input.pursuerBSpeed, input.targetSpeed);
      const timeA = divide(input.leadFromPursuerA, closingA);
      const timeB = divide(input.leadFromPursuerB, closingB);
      const ordering = compare(timeA, timeB);
      const answer = ordering < 0 ? rational(1) : ordering > 0 ? rational(2) : rational(0);
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit: "ORDER",
        governingEquation: "compare each pursuer's lead distance / positive closing speed",
        intermediate: Object.freeze({ closingA, closingB, timeA, timeB }),
      });
    }
  }
}
