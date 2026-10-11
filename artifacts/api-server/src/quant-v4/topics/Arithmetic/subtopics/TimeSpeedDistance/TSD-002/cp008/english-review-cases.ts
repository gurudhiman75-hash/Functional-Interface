import { add, divide, rational } from "../../TSD-001/foundation/rational";
import { solveTsdCp008 } from "./executable-solver";
import type { TsdCp008ExecutableInput, TsdCp008ExecutableSolution } from "./executable-types";
import { verifyTsdCp008 } from "./executable-verifier";

export interface TsdCp008EnglishReviewCase {
  readonly qlId: `TSD-QL-${string}`;
  readonly familyId: string;
  readonly input: TsdCp008ExecutableInput;
  readonly solution: TsdCp008ExecutableSolution;
}

const R = rational;
const letters = ["A", "B", "C", "D", "E", "F"] as const;

function checked(qlId: `TSD-QL-${string}`, familyId: string, input: TsdCp008ExecutableInput): TsdCp008EnglishReviewCase {
  const solution = solveTsdCp008(input);
  const verification = verifyTsdCp008(input, solution);
  if (!verification.valid) throw new Error(`${familyId}: natural review case failed executable verification`);
  return Object.freeze({ qlId, familyId, input, solution });
}

const output: TsdCp008EnglishReviewCase[] = [];

const q95 = [
  [120, 180, 15, 10],
  [150, 300, 20, 10],
  [180, 220, 25, 15],
  [240, 300, 30, 15],
  [192, 240, 32, 22],
  [270, 330, 35, 25],
] as const;
q95.forEach(([a, b, va, vb], i) => output.push(checked("TSD-QL-095", `95-${letters[i]}`, Object.freeze({ authorityKey: "oppositeDirectionTrainCrossingTime", lengthA: R(a), lengthB: R(b), speedA: R(va), speedB: R(vb) }))));

const q96 = [
  [100, 140, 30, 20],
  [120, 180, 30, 18],
  [120, 150, 35, 20],
  [160, 200, 38, 20],
  [200, 240, 42, 22],
  [220, 260, 48, 24],
] as const;
q96.forEach(([a, b, fast, slow], i) => output.push(checked("TSD-QL-096", `96-${letters[i]}`, Object.freeze({ authorityKey: "sameDirectionTrainCrossingTime", lengthA: R(a), lengthB: R(b), fasterSpeed: R(fast), slowerSpeed: R(slow) }))));

const q97 = [
  [140, 180, 10],
  [180, 240, 12],
  [210, 270, 15],
  [240, 300, 12],
  [270, 330, 15],
  [320, 400, 18],
] as const;
q97.forEach(([a, b, t], i) => output.push(checked("TSD-QL-097", `97-${letters[i]}`, Object.freeze({ authorityKey: "relativeSpeedFromTrainCrossing", lengthA: R(a), lengthB: R(b), crossingTime: R(t) }))));

const q98 = [
  [120, 20, 10, "OPPOSITE", 10],
  [150, 30, 18, "SAME", 25],
  [180, 25, 15, "OPPOSITE", 12],
  [180, 36, 20, "SAME", 20],
  [200, 30, 20, "OPPOSITE", 10],
  [240, 40, 25, "SAME", 24],
] as const;
q98.forEach(([known, va, vb, direction, t], i) => output.push(checked("TSD-QL-098", `98-${letters[i]}`, Object.freeze({ authorityKey: "trainLengthFromTrainCrossingEvidence", knownLength: R(known), speedA: R(va), speedB: R(vb), direction, crossingTime: R(t) }))));

const q99 = [
  [120, 180, 10, "OPPOSITE", 10],
  [150, 210, 18, "SAME", 30],
  [180, 220, 15, "OPPOSITE", 10],
  [180, 220, 20, "SAME", 25],
  [200, 300, 20, "OPPOSITE", 10],
  [240, 300, 25, "SAME", 36],
] as const;
q99.forEach(([a, b, other, direction, t], i) => output.push(checked("TSD-QL-099", `99-${letters[i]}`, Object.freeze({ authorityKey: "trainSpeedFromTrainCrossingEvidence", lengthA: R(a), lengthB: R(b), otherSpeed: R(other), direction, crossingTime: R(t), targetRole: "FASTER_OR_OPPOSITE_A" }))));

const q100 = [
  [120, 20, 4, "OPPOSITE"],
  [150, 20, 5, "SAME"],
  [180, 24, 6, "OPPOSITE"],
  [200, 28, 8, "SAME"],
  [240, 30, 10, "OPPOSITE"],
  [240, 36, 12, "SAME"],
] as const;
q100.forEach(([length, trainSpeed, observerSpeed, direction], i) => output.push(checked("TSD-QL-100", `100-${letters[i]}`, Object.freeze({ authorityKey: "movingObserverTrainCrossingTime", trainLength: R(length), trainSpeed: R(trainSpeed), observerSpeed: R(observerSpeed), direction }))));

const q101 = [
  [150, 20, 5, "TRAIN_SPEED"],
  [180, 24, 6, "OBSERVER_SPEED"],
  [200, 30, 10, "TRAIN_SPEED"],
  [210, 28, 7, "OBSERVER_SPEED"],
  [240, 36, 12, "TRAIN_SPEED"],
  [240, 32, 8, "OBSERVER_SPEED"],
] as const;
q101.forEach(([length, trainSpeed, observerSpeed, target], i) => {
  const sameDirectionTime = divide(R(length), R(trainSpeed - observerSpeed));
  const oppositeDirectionTime = divide(R(length), R(trainSpeed + observerSpeed));
  output.push(checked("TSD-QL-101", `101-${letters[i]}`, Object.freeze({ authorityKey: "trainObserverStateFromCrossingTimes", trainLength: R(length), sameDirectionTime, oppositeDirectionTime, target })));
});

const q102 = [
  [180, 120, 300, 20, 15, "FIXED_OBJECT_LENGTH"],
  [200, 100, 300, 25, 20, "TRAIN_A_LENGTH"],
  [240, 160, 360, 30, 20, "FIXED_OBJECT_LENGTH"],
  [300, 200, 400, 35, 25, "TRAIN_A_LENGTH"],
  [270, 180, 450, 30, 21, "FIXED_OBJECT_LENGTH"],
  [320, 160, 480, 40, 32, "TRAIN_A_LENGTH"],
] as const;
q102.forEach(([lengthA, lengthB, objectLength, speedA, speedB, target], i) => {
  const crossingTimeA = divide(add(R(lengthA), R(objectLength)), R(speedA));
  const crossingTimeB = divide(add(R(lengthB), R(objectLength)), R(speedB));
  output.push(checked("TSD-QL-102", `102-${letters[i]}`, Object.freeze({ authorityKey: "sharedFixedObjectTwoTrainEvidence", speedA: R(speedA), speedB: R(speedB), crossingTimeA, crossingTimeB, lengthRatioAtoB: divide(R(lengthA), R(lengthB)), target })));
});

const q103 = [
  [180, 120, 20, 10, "OPPOSITE"],
  [240, 120, 30, 20, "SAME"],
  [300, 180, 25, 15, "OPPOSITE"],
  [300, 180, 36, 24, "SAME"],
  [360, 240, 32, 28, "OPPOSITE"],
  [360, 180, 40, 25, "SAME"],
] as const;
q103.forEach(([a, b, va, vb, direction], i) => output.push(checked("TSD-QL-103", `103-${letters[i]}`, Object.freeze({ authorityKey: "fullContainmentOverlapDuration", lengthA: R(a), lengthB: R(b), speedA: R(va), speedB: R(vb), direction }))));

if (output.length !== 54) throw new Error(`Expected 54 CP008 natural English review cases, got ${output.length}`);
export const TSD_CP008_ENGLISH_REVIEW_CASES: readonly TsdCp008EnglishReviewCase[] = Object.freeze(output);
