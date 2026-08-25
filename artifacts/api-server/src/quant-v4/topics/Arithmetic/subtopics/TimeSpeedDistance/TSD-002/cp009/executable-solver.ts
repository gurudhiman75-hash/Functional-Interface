import { add, compare, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp009Direction, TsdCp009ExecutableInput, TsdCp009ExecutableSolution } from "./executable-types";

function positive(value: Rational, label: string): Rational {
  if (compare(value, rational(0)) <= 0) throw new Error(`${label} must be positive`);
  return value;
}

function adjusted(body: Rational, medium: Rational, direction: TsdCp009Direction): Rational {
  positive(body, "body-relative speed");
  positive(medium, "medium speed");
  const value = direction === "ASSISTED" ? add(body, medium) : subtract(body, medium);
  return positive(value, "ground speed");
}

function integerSqrtExact(value: bigint): bigint {
  if (value < 0n) throw new Error("Cannot square-root a negative integer");
  if (value < 2n) return value;
  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + value / x) / 2n;
  }
  if (x * x !== value) throw new Error(`Expected exact square discriminant, got ${value}`);
  return x;
}

function sqrtRationalExact(value: Rational): Rational {
  positive(value, "quadratic discriminant");
  return rational(integerSqrtExact(value.numerator), integerSqrtExact(value.denominator));
}

function mediumFromTrip(body: Rational, distance: Rational, time: Rational, direction: TsdCp009Direction): Rational {
  const ground = divide(positive(distance, "distance"), positive(time, "trip time"));
  const medium = direction === "ASSISTED" ? subtract(ground, body) : subtract(body, ground);
  return positive(medium, "derived medium speed");
}

export function solveTsdCp009(input: TsdCp009ExecutableInput): TsdCp009ExecutableSolution {
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      return Object.freeze({ authorityKey: input.authorityKey, value: adjusted(input.bodyRelativeSpeed, input.mediumSpeed, input.direction), unit: "METRE_PER_SECOND" as const });

    case "mediumComponentsFromAssistedOpposedSpeeds": {
      const assisted = positive(input.assistedGroundSpeed, "assisted ground speed");
      const opposed = positive(input.opposedGroundSpeed, "opposed ground speed");
      if (compare(assisted, opposed) <= 0) throw new Error("assisted ground speed must exceed opposed ground speed");
      const body = divide(add(assisted, opposed), rational(2));
      const medium = divide(subtract(assisted, opposed), rational(2));
      return Object.freeze({ authorityKey: input.authorityKey, value: input.target === "BODY_SPEED" ? body : medium, unit: "METRE_PER_SECOND" as const });
    }

    case "mediumLegTravelState": {
      const speed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, input.direction);
      if (input.target === "TIME") {
        return Object.freeze({ authorityKey: input.authorityKey, value: divide(positive(input.distance, "distance"), speed), unit: "SECOND" as const });
      }
      return Object.freeze({ authorityKey: input.authorityKey, value: multiply(speed, positive(input.time, "time")), unit: "METRE" as const });
    }

    case "pairedEqualDistanceMediumState": {
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") {
        const distance = positive(input.equalDistance, "equal distance");
        const assisted = divide(distance, positive(input.assistedTime, "assisted time"));
        const opposed = divide(distance, positive(input.opposedTime, "opposed time"));
        if (compare(assisted, opposed) <= 0) throw new Error("assisted speed must exceed opposed speed");
        const body = divide(add(assisted, opposed), rational(2));
        const medium = divide(subtract(assisted, opposed), rational(2));
        return Object.freeze({ authorityKey: input.authorityKey, value: input.target === "BODY_SPEED" ? body : medium, unit: "METRE_PER_SECOND" as const });
      }
      if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") {
        const u = positive(input.bodyRelativeSpeed, "body-relative speed");
        const c = positive(input.mediumSpeed, "medium speed");
        const assisted = adjusted(u, c, "ASSISTED");
        const opposed = adjusted(u, c, "OPPOSED");
        const reciprocalGap = subtract(divide(rational(1), opposed), divide(rational(1), assisted));
        return Object.freeze({ authorityKey: input.authorityKey, value: divide(positive(input.opposedMinusAssistedTime, "time difference"), positive(reciprocalGap, "reciprocal speed gap")), unit: "METRE" as const });
      }
      const ratio = positive(input.opposedToAssistedTimeRatio, "opposed/assisted time ratio");
      if (compare(ratio, rational(1)) <= 0) throw new Error("opposed/assisted time ratio must exceed 1");
      if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") {
        const body = divide(multiply(positive(input.mediumSpeed, "medium speed"), add(ratio, rational(1))), subtract(ratio, rational(1)));
        return Object.freeze({ authorityKey: input.authorityKey, value: positive(body, "body-relative speed"), unit: "METRE_PER_SECOND" as const });
      }
      const medium = divide(multiply(positive(input.bodyRelativeSpeed, "body-relative speed"), subtract(ratio, rational(1))), add(ratio, rational(1)));
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(medium, "medium speed"), unit: "METRE_PER_SECOND" as const });
    }

    case "roundTripMediumState": {
      const assisted = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "ASSISTED");
      const opposed = adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
      const distance = positive(input.oneWayDistance, "one-way distance");
      const totalTime = add(divide(distance, assisted), divide(distance, opposed));
      if (input.target === "TOTAL_TIME") return Object.freeze({ authorityKey: input.authorityKey, value: totalTime, unit: "SECOND" as const });
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(multiply(rational(2), distance), totalTime), unit: "METRE_PER_SECOND" as const });
    }

    case "mixedUnequalLegMediumState": {
      const c = positive(input.mediumSpeed, "medium speed");
      const totalTime = positive(input.totalTime, "total time");
      if (input.target === "ASSISTED_DISTANCE") {
        const u = positive(input.bodyRelativeSpeed, "body-relative speed");
        const assisted = adjusted(u, c, "ASSISTED");
        const opposed = adjusted(u, c, "OPPOSED");
        const remainingTime = subtract(totalTime, divide(positive(input.opposedDistance, "opposed distance"), opposed));
        return Object.freeze({ authorityKey: input.authorityKey, value: multiply(positive(remainingTime, "assisted-leg time"), assisted), unit: "METRE" as const });
      }
      if (input.target === "OPPOSED_DISTANCE") {
        const u = positive(input.bodyRelativeSpeed, "body-relative speed");
        const assisted = adjusted(u, c, "ASSISTED");
        const opposed = adjusted(u, c, "OPPOSED");
        const remainingTime = subtract(totalTime, divide(positive(input.assistedDistance, "assisted distance"), assisted));
        return Object.freeze({ authorityKey: input.authorityKey, value: multiply(positive(remainingTime, "opposed-leg time"), opposed), unit: "METRE" as const });
      }
      const dA = positive(input.assistedDistance, "assisted distance");
      const dO = positive(input.opposedDistance, "opposed distance");
      const a = totalTime;
      const b = subtract(rational(0), add(dA, dO));
      const constantInside = add(multiply(totalTime, multiply(c, c)), multiply(subtract(dO, dA), c));
      const c0 = subtract(rational(0), constantInside);
      const discriminant = subtract(multiply(b, b), multiply(rational(4), multiply(a, c0)));
      const root = sqrtRationalExact(discriminant);
      const body = divide(add(subtract(rational(0), b), root), multiply(rational(2), a));
      adjusted(body, c, "OPPOSED");
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(body, "body-relative speed"), unit: "METRE_PER_SECOND" as const });
    }

    case "equalTimeMediumDistanceSpread":
      return Object.freeze({ authorityKey: input.authorityKey, value: multiply(rational(2), multiply(positive(input.mediumSpeed, "medium speed"), positive(input.equalTime, "equal time"))), unit: "METRE" as const });

    case "mediumShiftedMeetingPoint": {
      const distance = positive(input.routeDistance, "route distance");
      const fromUpstreamGround = adjusted(input.fromUpstreamBodySpeed, input.mediumSpeed, "ASSISTED");
      adjusted(input.fromDownstreamBodySpeed, input.mediumSpeed, "OPPOSED");
      const meetingTime = divide(distance, add(positive(input.fromUpstreamBodySpeed, "upstream-end body speed"), positive(input.fromDownstreamBodySpeed, "downstream-end body speed")));
      return Object.freeze({ authorityKey: input.authorityKey, value: multiply(fromUpstreamGround, meetingTime), unit: "METRE" as const });
    }

    case "passiveFloatingObjectState":
      if (input.target === "FLOAT_SPEED") return Object.freeze({ authorityKey: input.authorityKey, value: positive(input.mediumSpeed, "medium speed"), unit: "METRE_PER_SECOND" as const });
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(positive(input.distance, "drift distance"), positive(input.mediumSpeed, "medium speed")), unit: "SECOND" as const });

    case "floatingObjectRecoveryState": {
      adjusted(input.bodyRelativeSpeed, input.mediumSpeed, "OPPOSED");
      const beforeTurn = positive(input.separationTimeBeforeTurn, "separation time before turn");
      if (input.target === "RECOVERY_TIME_AFTER_TURN") return Object.freeze({ authorityKey: input.authorityKey, value: beforeTurn, unit: "SECOND" as const });
      return Object.freeze({ authorityKey: input.authorityKey, value: multiply(rational(2), multiply(positive(input.mediumSpeed, "medium speed"), beforeTurn)), unit: "METRE" as const });
    }

    case "changingMediumState": {
      const body = positive(input.bodyRelativeSpeed, "body-relative speed");
      const distance = positive(input.distance, "distance");
      const first = mediumFromTrip(body, distance, input.firstTripTime, input.direction);
      const second = mediumFromTrip(body, distance, input.secondTripTime, input.direction);
      if (input.target === "NEW_MEDIUM_SPEED") return Object.freeze({ authorityKey: input.authorityKey, value: second, unit: "METRE_PER_SECOND" as const });
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(subtract(second, first), "medium-speed increase"), unit: "METRE_PER_SECOND" as const });
    }
  }
}
