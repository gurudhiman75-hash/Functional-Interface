import { add, compare, divide, equals, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp009Direction, TsdCp009ExecutableInput, TsdCp009ExecutableSolution, TsdCp009ValueUnit, TsdCp009Verification } from "./executable-types";

function positive(value: Rational): boolean {
  return compare(value, rational(0)) > 0;
}

function ground(body: Rational, medium: Rational, direction: TsdCp009Direction): Rational {
  return direction === "ASSISTED" ? add(body, medium) : subtract(body, medium);
}

function exactIntegerSqrt(value: bigint): bigint {
  if (value < 0n) throw new Error("negative square root");
  if (value < 2n) return value;
  let low = 1n;
  let high = value;
  while (low <= high) {
    const mid = (low + high) / 2n;
    const square = mid * mid;
    if (square === value) return mid;
    if (square < value) low = mid + 1n;
    else high = mid - 1n;
  }
  throw new Error(`non-square discriminant ${value}`);
}

function exactRationalSqrt(value: Rational): Rational {
  return rational(exactIntegerSqrt(value.numerator), exactIntegerSqrt(value.denominator));
}

function expectedFor(input: TsdCp009ExecutableInput): Readonly<{ value: Rational; unit: TsdCp009ValueUnit; invariant: string }> {
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      return { value: ground(input.bodyRelativeSpeed, input.mediumSpeed, input.direction), unit: "METRE_PER_SECOND", invariant: "ground speed equals body-relative speed plus/minus medium speed" };

    case "mediumComponentsFromAssistedOpposedSpeeds": {
      const sum = add(input.assistedGroundSpeed, input.opposedGroundSpeed);
      const difference = subtract(input.assistedGroundSpeed, input.opposedGroundSpeed);
      return { value: input.target === "BODY_SPEED" ? divide(sum, rational(2)) : divide(difference, rational(2)), unit: "METRE_PER_SECOND", invariant: "half-sum/half-difference of assisted and opposed speeds" };
    }

    case "mediumLegTravelState": {
      const speed = ground(input.bodyRelativeSpeed, input.mediumSpeed, input.direction);
      return input.target === "TIME"
        ? { value: divide(input.distance, speed), unit: "SECOND", invariant: "time = distance / medium-adjusted ground speed" }
        : { value: multiply(speed, input.time), unit: "METRE", invariant: "distance = medium-adjusted ground speed × time" };
    }

    case "pairedEqualDistanceMediumState": {
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") {
        const assisted = divide(input.equalDistance, input.assistedTime);
        const opposed = divide(input.equalDistance, input.opposedTime);
        return {
          value: input.target === "BODY_SPEED" ? divide(add(assisted, opposed), rational(2)) : divide(subtract(assisted, opposed), rational(2)),
          unit: "METRE_PER_SECOND",
          invariant: "equal-distance paired times imply assisted/opposed ground speeds",
        };
      }
      if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") {
        const assisted = ground(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
        const opposed = ground(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
        const gap = subtract(divide(rational(1), opposed), divide(rational(1), assisted));
        return { value: divide(input.opposedMinusAssistedTime, gap), unit: "METRE", invariant: "time difference = distance × reciprocal-speed difference" };
      }
      const ratio = input.opposedToAssistedTimeRatio;
      if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") {
        return { value: divide(multiply(input.mediumSpeed, add(ratio, rational(1))), subtract(ratio, rational(1))), unit: "METRE_PER_SECOND", invariant: "time ratio = (u+c)/(u-c)" };
      }
      return { value: divide(multiply(input.bodyRelativeSpeed, subtract(ratio, rational(1))), add(ratio, rational(1))), unit: "METRE_PER_SECOND", invariant: "time ratio = (u+c)/(u-c)" };
    }

    case "roundTripMediumState": {
      const assisted = ground(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
      const opposed = ground(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
      const totalTime = add(divide(input.oneWayDistance, assisted), divide(input.oneWayDistance, opposed));
      return input.target === "TOTAL_TIME"
        ? { value: totalTime, unit: "SECOND", invariant: "round-trip time is the sum of assisted and opposed leg times" }
        : { value: divide(multiply(rational(2), input.oneWayDistance), totalTime), unit: "METRE_PER_SECOND", invariant: "round-trip average speed = total distance / total time" };
    }

    case "mixedUnequalLegMediumState": {
      if (input.target === "ASSISTED_DISTANCE") {
        const assisted = ground(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
        const opposed = ground(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
        return { value: multiply(subtract(input.totalTime, divide(input.opposedDistance, opposed)), assisted), unit: "METRE", invariant: "total time equals assisted-leg time plus opposed-leg time" };
      }
      if (input.target === "OPPOSED_DISTANCE") {
        const assisted = ground(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
        const opposed = ground(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
        return { value: multiply(subtract(input.totalTime, divide(input.assistedDistance, assisted)), opposed), unit: "METRE", invariant: "total time equals assisted-leg time plus opposed-leg time" };
      }
      const a = input.totalTime;
      const b = subtract(rational(0), add(input.assistedDistance, input.opposedDistance));
      const c0 = subtract(rational(0), add(
        multiply(input.totalTime, multiply(input.mediumSpeed, input.mediumSpeed)),
        multiply(subtract(input.opposedDistance, input.assistedDistance), input.mediumSpeed),
      ));
      const discriminant = subtract(multiply(b, b), multiply(rational(4), multiply(a, c0)));
      const root = exactRationalSqrt(discriminant);
      return { value: divide(add(subtract(rational(0), b), root), multiply(rational(2), a)), unit: "METRE_PER_SECOND", invariant: "unequal-leg total-time equation yields the positive quadratic root for body speed" };
    }

    case "equalTimeMediumDistanceSpread":
      return { value: multiply(rational(2), multiply(input.mediumSpeed, input.equalTime)), unit: "METRE", invariant: "equal-time distance spread = 2ct" };

    case "mediumShiftedMeetingPoint": {
      const meetingTime = divide(input.routeDistance, add(input.fromUpstreamBodySpeed, input.fromDownstreamBodySpeed));
      return { value: multiply(ground(input.fromUpstreamBodySpeed, input.mediumSpeed, "ASSISTED"), meetingTime), unit: "METRE", invariant: "common current cancels from closing speed but shifts the meeting coordinate" };
    }

    case "passiveFloatingObjectState":
      return input.target === "FLOAT_SPEED"
        ? { value: input.mediumSpeed, unit: "METRE_PER_SECOND", invariant: "passive float ground speed equals medium speed" }
        : { value: divide(input.distance, input.mediumSpeed), unit: "SECOND", invariant: "passive drift time = distance / medium speed" };

    case "floatingObjectRecoveryState":
      return input.target === "RECOVERY_TIME_AFTER_TURN"
        ? { value: input.separationTimeBeforeTurn, unit: "SECOND", invariant: "in the medium frame, equal away/toward body speeds make post-turn recovery time equal pre-turn separation time" }
        : { value: multiply(rational(2), multiply(input.mediumSpeed, input.separationTimeBeforeTurn)), unit: "METRE", invariant: "the passive object drifts for twice the pre-turn separation time" };

    case "changingMediumState": {
      const firstGround = divide(input.distance, input.firstTripTime);
      const secondGround = divide(input.distance, input.secondTripTime);
      const firstMedium = input.direction === "ASSISTED" ? subtract(firstGround, input.bodyRelativeSpeed) : subtract(input.bodyRelativeSpeed, firstGround);
      const secondMedium = input.direction === "ASSISTED" ? subtract(secondGround, input.bodyRelativeSpeed) : subtract(input.bodyRelativeSpeed, secondGround);
      return input.target === "NEW_MEDIUM_SPEED"
        ? { value: secondMedium, unit: "METRE_PER_SECOND", invariant: "second trip ground speed resolves the new medium speed" }
        : { value: subtract(secondMedium, firstMedium), unit: "METRE_PER_SECOND", invariant: "medium-speed change is the difference between trip-implied medium speeds" };
    }
  }
}

export function verifyTsdCp009(input: TsdCp009ExecutableInput, candidate: TsdCp009ExecutableSolution): TsdCp009Verification {
  try {
    const expected = expectedFor(input);
    const basicFeasibility = positive(expected.value)
      && (input.authorityKey !== "mediumAdjustedGroundSpeed" || positive(ground(input.bodyRelativeSpeed, input.mediumSpeed, input.direction)));
    return Object.freeze({
      valid: basicFeasibility && candidate.authorityKey === input.authorityKey && candidate.unit === expected.unit && equals(candidate.value, expected.value),
      expected: expected.value,
      unit: expected.unit,
      invariant: expected.invariant,
    });
  } catch {
    return Object.freeze({ valid: false, expected: rational(0), unit: candidate.unit, invariant: "input state is infeasible or non-exact under CP009 verifier" });
  }
}
