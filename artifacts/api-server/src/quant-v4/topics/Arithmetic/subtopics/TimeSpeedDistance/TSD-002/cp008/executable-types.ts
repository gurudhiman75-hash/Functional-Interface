import type { Rational } from "../../TSD-001/foundation/rational";

export type TsdCp008AuthorityKey =
  | "oppositeDirectionTrainCrossingTime"
  | "sameDirectionTrainCrossingTime"
  | "relativeSpeedFromTrainCrossing"
  | "trainLengthFromTrainCrossingEvidence"
  | "trainSpeedFromTrainCrossingEvidence"
  | "movingObserverTrainCrossingTime"
  | "trainObserverStateFromCrossingTimes"
  | "sharedFixedObjectTwoTrainEvidence"
  | "fullContainmentOverlapDuration";

export type TsdCp008Direction = "OPPOSITE" | "SAME";
export type TsdCp008ValueUnit = "SECOND" | "METRE" | "METRE_PER_SECOND";

export type TsdCp008ExecutableInput =
  | Readonly<{ authorityKey: "oppositeDirectionTrainCrossingTime"; lengthA: Rational; lengthB: Rational; speedA: Rational; speedB: Rational }>
  | Readonly<{ authorityKey: "sameDirectionTrainCrossingTime"; lengthA: Rational; lengthB: Rational; fasterSpeed: Rational; slowerSpeed: Rational }>
  | Readonly<{ authorityKey: "relativeSpeedFromTrainCrossing"; lengthA: Rational; lengthB: Rational; crossingTime: Rational }>
  | Readonly<{ authorityKey: "trainLengthFromTrainCrossingEvidence"; knownLength: Rational; speedA: Rational; speedB: Rational; direction: TsdCp008Direction; crossingTime: Rational }>
  | Readonly<{ authorityKey: "trainSpeedFromTrainCrossingEvidence"; lengthA: Rational; lengthB: Rational; otherSpeed: Rational; direction: TsdCp008Direction; crossingTime: Rational; targetRole: "FASTER_OR_OPPOSITE_A" }>
  | Readonly<{ authorityKey: "movingObserverTrainCrossingTime"; trainLength: Rational; trainSpeed: Rational; observerSpeed: Rational; direction: TsdCp008Direction }>
  | Readonly<{ authorityKey: "trainObserverStateFromCrossingTimes"; trainLength: Rational; sameDirectionTime: Rational; oppositeDirectionTime: Rational; target: "TRAIN_SPEED" | "OBSERVER_SPEED" }>
  | Readonly<{ authorityKey: "sharedFixedObjectTwoTrainEvidence"; speedA: Rational; speedB: Rational; crossingTimeA: Rational; crossingTimeB: Rational; lengthRatioAtoB: Rational; target: "FIXED_OBJECT_LENGTH" | "TRAIN_A_LENGTH" }>
  | Readonly<{ authorityKey: "fullContainmentOverlapDuration"; lengthA: Rational; lengthB: Rational; speedA: Rational; speedB: Rational; direction: TsdCp008Direction }>;

export interface TsdCp008ExecutableSolution {
  readonly authorityKey: TsdCp008AuthorityKey;
  readonly value: Rational;
  readonly unit: TsdCp008ValueUnit;
}

export interface TsdCp008Verification {
  readonly valid: boolean;
  readonly expected: Rational;
  readonly unit: TsdCp008ValueUnit;
  readonly invariant: string;
}

export interface TsdCp008GeneratedCase {
  readonly seed: string;
  readonly caseIndex: number;
  readonly authorityKey: TsdCp008AuthorityKey;
  readonly input: TsdCp008ExecutableInput;
  readonly solution: TsdCp008ExecutableSolution;
}
