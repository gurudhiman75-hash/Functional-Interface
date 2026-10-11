import { absRational, add, compare, divide, equals, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import type { Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp008ExecutableInput, TsdCp008ExecutableSolution, TsdCp008Verification, TsdCp008ValueUnit } from "./executable-types";

function requirePositive(value: Rational, label: string): Rational {
  if (compare(value, rational(0)) <= 0) throw new Error(`${label} must be positive`);
  return value;
}

function result(solution: TsdCp008ExecutableSolution, expected: Rational, unit: TsdCp008ValueUnit, invariant: string): TsdCp008Verification {
  return Object.freeze({ valid: solution.unit === unit && equals(solution.value, expected), expected, unit, invariant });
}

export function verifyTsdCp008(input: TsdCp008ExecutableInput, solution: TsdCp008ExecutableSolution): TsdCp008Verification {
  if (solution.authorityKey !== input.authorityKey) return Object.freeze({ valid: false, expected: rational(0), unit: solution.unit, invariant: "authority key mismatch" });

  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime": {
      const expected = divide(add(input.lengthA, input.lengthB), requirePositive(add(input.speedA, input.speedB), "relative speed"));
      return result(solution, expected, "SECOND", "(L1+L2)/(v1+v2)");
    }
    case "sameDirectionTrainCrossingTime": {
      const expected = divide(add(input.lengthA, input.lengthB), requirePositive(subtract(input.fasterSpeed, input.slowerSpeed), "closing speed"));
      return result(solution, expected, "SECOND", "(L1+L2)/(vFast-vSlow)");
    }
    case "relativeSpeedFromTrainCrossing": {
      const expected = divide(add(input.lengthA, input.lengthB), requirePositive(input.crossingTime, "crossing time"));
      return result(solution, expected, "METRE_PER_SECOND", "(L1+L2)/t");
    }
    case "trainLengthFromTrainCrossingEvidence": {
      const rel = input.direction === "OPPOSITE" ? add(input.speedA, input.speedB) : subtract(input.speedA, input.speedB);
      const expected = subtract(multiply(requirePositive(rel, "relative speed"), input.crossingTime), input.knownLength);
      requirePositive(expected, "unknown train length");
      return result(solution, expected, "METRE", "vRel*t-Lknown");
    }
    case "trainSpeedFromTrainCrossingEvidence": {
      const rel = divide(add(input.lengthA, input.lengthB), requirePositive(input.crossingTime, "crossing time"));
      const expected = input.direction === "OPPOSITE" ? subtract(rel, input.otherSpeed) : add(input.otherSpeed, rel);
      requirePositive(expected, "unknown train speed");
      return result(solution, expected, "METRE_PER_SECOND", "direction-aware individual speed from vRel");
    }
    case "movingObserverTrainCrossingTime": {
      const rel = input.direction === "OPPOSITE" ? add(input.trainSpeed, input.observerSpeed) : subtract(input.trainSpeed, input.observerSpeed);
      const expected = divide(input.trainLength, requirePositive(rel, "train-observer relative speed"));
      return result(solution, expected, "SECOND", "Ltrain/vRelativeObserver");
    }
    case "trainObserverStateFromCrossingTimes": {
      const sameRel = divide(input.trainLength, requirePositive(input.sameDirectionTime, "same-direction time"));
      const oppositeRel = divide(input.trainLength, requirePositive(input.oppositeDirectionTime, "opposite-direction time"));
      const trainSpeed = divide(add(sameRel, oppositeRel), rational(2));
      const observerSpeed = divide(subtract(oppositeRel, sameRel), rational(2));
      const expected = input.target === "TRAIN_SPEED" ? trainSpeed : observerSpeed;
      requirePositive(expected, input.target);
      return result(solution, expected, "METRE_PER_SECOND", "paired same/opposite observer equations");
    }
    case "sharedFixedObjectTwoTrainEvidence": {
      const ratioDelta = subtract(input.lengthRatioAtoB, rational(1));
      if (compare(ratioDelta, rational(0)) === 0) throw new Error("length ratio cannot equal one");
      const travelledA = multiply(input.speedA, input.crossingTimeA);
      const travelledB = multiply(input.speedB, input.crossingTimeB);
      const lengthB = divide(subtract(travelledA, travelledB), ratioDelta);
      const lengthA = multiply(input.lengthRatioAtoB, lengthB);
      const fixedObject = subtract(travelledB, lengthB);
      requirePositive(lengthA, "train A length");
      requirePositive(lengthB, "train B length");
      requirePositive(fixedObject, "fixed object length");
      const expected = input.target === "FIXED_OBJECT_LENGTH" ? fixedObject : lengthA;
      return result(solution, expected, "METRE", "coupled two-train common-object equations");
    }
    case "fullContainmentOverlapDuration": {
      const difference = absRational(subtract(input.lengthA, input.lengthB));
      requirePositive(difference, "length difference");
      const rel = input.direction === "OPPOSITE" ? add(input.speedA, input.speedB) : subtract(input.speedA, input.speedB);
      const expected = divide(difference, requirePositive(rel, "relative speed"));
      return result(solution, expected, "SECOND", "|Llong-Lshort|/vRel");
    }
  }
}
