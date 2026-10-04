import { absRational, add, compare, divide, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import type { Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp008Direction, TsdCp008ExecutableInput, TsdCp008ExecutableSolution } from "./executable-types";

function positive(value: Rational, label: string): Rational {
  if (compare(value, rational(0)) <= 0) throw new Error(`${label} must be positive`);
  return value;
}

function relativeSpeed(speedA: Rational, speedB: Rational, direction: TsdCp008Direction): Rational {
  if (direction === "OPPOSITE") return positive(add(speedA, speedB), "opposite-direction relative speed");
  return positive(subtract(speedA, speedB), "same-direction relative speed");
}

export function solveTsdCp008(input: TsdCp008ExecutableInput): TsdCp008ExecutableSolution {
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime": {
      const distance = add(input.lengthA, input.lengthB);
      const speed = add(input.speedA, input.speedB);
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(distance, positive(speed, "relative speed")), unit: "SECOND" as const });
    }
    case "sameDirectionTrainCrossingTime": {
      const distance = add(input.lengthA, input.lengthB);
      const speed = subtract(input.fasterSpeed, input.slowerSpeed);
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(distance, positive(speed, "closing speed")), unit: "SECOND" as const });
    }
    case "relativeSpeedFromTrainCrossing": {
      const distance = add(input.lengthA, input.lengthB);
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(distance, positive(input.crossingTime, "crossing time")), unit: "METRE_PER_SECOND" as const });
    }
    case "trainLengthFromTrainCrossingEvidence": {
      const speed = relativeSpeed(input.speedA, input.speedB, input.direction);
      const totalLength = multiply(speed, positive(input.crossingTime, "crossing time"));
      const unknown = subtract(totalLength, input.knownLength);
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(unknown, "unknown train length"), unit: "METRE" as const });
    }
    case "trainSpeedFromTrainCrossingEvidence": {
      const combinedLength = add(input.lengthA, input.lengthB);
      const rel = divide(combinedLength, positive(input.crossingTime, "crossing time"));
      const speed = input.direction === "OPPOSITE" ? subtract(rel, input.otherSpeed) : add(input.otherSpeed, rel);
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(speed, "unknown train speed"), unit: "METRE_PER_SECOND" as const });
    }
    case "movingObserverTrainCrossingTime": {
      const rel = input.direction === "OPPOSITE"
        ? add(input.trainSpeed, input.observerSpeed)
        : subtract(input.trainSpeed, input.observerSpeed);
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(input.trainLength, positive(rel, "train-observer relative speed")), unit: "SECOND" as const });
    }
    case "trainObserverStateFromCrossingTimes": {
      const sameRel = divide(input.trainLength, positive(input.sameDirectionTime, "same-direction time"));
      const oppositeRel = divide(input.trainLength, positive(input.oppositeDirectionTime, "opposite-direction time"));
      const two = rational(2);
      const trainSpeed = divide(add(sameRel, oppositeRel), two);
      const observerSpeed = divide(subtract(oppositeRel, sameRel), two);
      const value = input.target === "TRAIN_SPEED" ? trainSpeed : observerSpeed;
      return Object.freeze({ authorityKey: input.authorityKey, value: positive(value, input.target), unit: "METRE_PER_SECOND" as const });
    }
    case "sharedFixedObjectTwoTrainEvidence": {
      const ratioMinusOne = subtract(input.lengthRatioAtoB, rational(1));
      if (compare(ratioMinusOne, rational(0)) === 0) throw new Error("train length ratio must not equal 1");
      const travelledA = multiply(input.speedA, input.crossingTimeA);
      const travelledB = multiply(input.speedB, input.crossingTimeB);
      const lengthB = divide(subtract(travelledA, travelledB), ratioMinusOne);
      const lengthA = multiply(input.lengthRatioAtoB, lengthB);
      const fixedObject = subtract(travelledB, lengthB);
      positive(lengthA, "train A length");
      positive(lengthB, "train B length");
      positive(fixedObject, "fixed object length");
      const value = input.target === "FIXED_OBJECT_LENGTH" ? fixedObject : lengthA;
      return Object.freeze({ authorityKey: input.authorityKey, value, unit: "METRE" as const });
    }
    case "fullContainmentOverlapDuration": {
      const lengthDifference = absRational(subtract(input.lengthA, input.lengthB));
      positive(lengthDifference, "unequal train-length difference");
      const rel = relativeSpeed(input.speedA, input.speedB, input.direction);
      return Object.freeze({ authorityKey: input.authorityKey, value: divide(lengthDifference, rel), unit: "SECOND" as const });
    }
  }
}
