import { add, divide, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { solveTsdCp008 } from "./executable-solver";
import type { TsdCp008AuthorityKey, TsdCp008Direction, TsdCp008ExecutableInput, TsdCp008GeneratedCase } from "./executable-types";

export const TSD_CP008_EXECUTABLE_AUTHORITIES: readonly TsdCp008AuthorityKey[] = Object.freeze([
  "oppositeDirectionTrainCrossingTime",
  "sameDirectionTrainCrossingTime",
  "relativeSpeedFromTrainCrossing",
  "trainLengthFromTrainCrossingEvidence",
  "trainSpeedFromTrainCrossingEvidence",
  "movingObserverTrainCrossingTime",
  "trainObserverStateFromCrossingTimes",
  "sharedFixedObjectTwoTrainEvidence",
  "fullContainmentOverlapDuration",
]);

const LENGTH_A = [120, 150, 180, 200, 220, 240, 160, 210, 270, 300, 144, 192] as const;
const LENGTH_B = [80, 100, 120, 150, 180, 200, 140, 160, 180, 240, 96, 128] as const;
const SPEED_A = [20, 24, 25, 30, 32, 36, 28, 35, 40, 45, 27, 33] as const;
const SPEED_B = [10, 12, 15, 18, 20, 24, 16, 21, 25, 30, 18, 22] as const;
const OBSERVER_SPEED = [4, 5, 6, 8, 10, 12, 7, 9, 11, 13, 5, 8] as const;
const FIXED_OBJECT_LENGTH = [300, 360, 420, 500, 600, 450, 480, 540, 660, 720, 400, 520] as const;

function direction(index: number): TsdCp008Direction {
  return index % 2 === 0 ? "OPPOSITE" : "SAME";
}

function inputFor(authorityKey: TsdCp008AuthorityKey, index: number): TsdCp008ExecutableInput {
  const lengthA = rational(LENGTH_A[index]!);
  const lengthB = rational(LENGTH_B[index]!);
  const speedA = rational(SPEED_A[index]!);
  const speedB = rational(SPEED_B[index]!);
  const observerSpeed = rational(OBSERVER_SPEED[index]!);
  const fixedObjectLength = rational(FIXED_OBJECT_LENGTH[index]!);
  const dir = direction(index);
  const combinedLength = add(lengthA, lengthB);
  const rel = dir === "OPPOSITE" ? add(speedA, speedB) : subtract(speedA, speedB);
  const crossingTime = divide(combinedLength, rel);

  switch (authorityKey) {
    case "oppositeDirectionTrainCrossingTime":
      return Object.freeze({ authorityKey, lengthA, lengthB, speedA, speedB });
    case "sameDirectionTrainCrossingTime":
      return Object.freeze({ authorityKey, lengthA, lengthB, fasterSpeed: speedA, slowerSpeed: speedB });
    case "relativeSpeedFromTrainCrossing":
      return Object.freeze({ authorityKey, lengthA, lengthB, crossingTime });
    case "trainLengthFromTrainCrossingEvidence":
      return Object.freeze({ authorityKey, knownLength: lengthB, speedA, speedB, direction: dir, crossingTime });
    case "trainSpeedFromTrainCrossingEvidence":
      return Object.freeze({ authorityKey, lengthA, lengthB, otherSpeed: speedB, direction: dir, crossingTime, targetRole: "FASTER_OR_OPPOSITE_A" });
    case "movingObserverTrainCrossingTime":
      return Object.freeze({ authorityKey, trainLength: lengthA, trainSpeed: speedA, observerSpeed, direction: dir });
    case "trainObserverStateFromCrossingTimes": {
      const sameDirectionTime = divide(lengthA, subtract(speedA, observerSpeed));
      const oppositeDirectionTime = divide(lengthA, add(speedA, observerSpeed));
      return Object.freeze({ authorityKey, trainLength: lengthA, sameDirectionTime, oppositeDirectionTime, target: index % 2 === 0 ? "TRAIN_SPEED" : "OBSERVER_SPEED" });
    }
    case "sharedFixedObjectTwoTrainEvidence": {
      const lengthRatioAtoB = divide(lengthA, lengthB);
      const crossingTimeA = divide(add(lengthA, fixedObjectLength), speedA);
      const crossingTimeB = divide(add(lengthB, fixedObjectLength), speedB);
      return Object.freeze({ authorityKey, speedA, speedB, crossingTimeA, crossingTimeB, lengthRatioAtoB, target: index % 2 === 0 ? "FIXED_OBJECT_LENGTH" : "TRAIN_A_LENGTH" });
    }
    case "fullContainmentOverlapDuration":
      return Object.freeze({ authorityKey, lengthA, lengthB, speedA, speedB, direction: dir });
  }
}

export function generateTsdCp008Case(authorityKey: TsdCp008AuthorityKey, caseIndex: number): TsdCp008GeneratedCase {
  if (!Number.isInteger(caseIndex) || caseIndex < 1 || caseIndex > 12) throw new Error(`CP008 caseIndex must be 1..12; received ${caseIndex}`);
  const input = inputFor(authorityKey, caseIndex - 1);
  const solution = solveTsdCp008(input);
  return Object.freeze({
    seed: `cp008:${authorityKey}:${caseIndex}`,
    caseIndex,
    authorityKey,
    input,
    solution,
  });
}
