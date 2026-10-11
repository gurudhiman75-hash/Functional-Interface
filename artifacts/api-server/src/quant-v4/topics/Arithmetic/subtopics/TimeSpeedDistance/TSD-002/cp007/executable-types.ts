import type { Rational } from "../../TSD-001/foundation/rational";

export const TSD_CP007_EXECUTABLE_AUTHORITIES = Object.freeze([
  "fixedPointCrossingTime",
  "finiteFixedObjectCrossingTime",
  "trainLengthFromPointCrossing",
  "trainSpeedFromPointCrossing",
  "fixedObjectLengthFromCrossingEvidence",
  "trainLengthFromPointAndObjectTimes",
  "trainSpeedFromPointAndObjectTimes",
  "fixedObjectLengthDifferenceFromCrossingTimes",
  "fullOccupancyDuration",
  "trainCrossingEventTimeline",
  "fixedSpacingPointCount",
] as const);

export type TsdCp007AuthorityKey = (typeof TSD_CP007_EXECUTABLE_AUTHORITIES)[number];
export type TsdCp007ObjectKind = "PLATFORM" | "BRIDGE" | "TUNNEL";
export type TsdCp007ObjectLengthEvidenceMode = "DIRECT_SPEED" | "PAIRED_POINT_TIME";
export type TsdCp007OccupancyTarget = "DURATION" | "OBJECT_LENGTH";
export type TsdCp007TimelineIntervalKind = "POINT_CROSSING" | "FULL_CROSSING" | "FULL_OCCUPANCY";
export type TsdCp007TimelineTarget = "FORWARD_CLOCK" | "BACKWARD_CLOCK";
export type TsdCp007SpacingTarget = "POINT_COUNT" | "SPACING" | "SPEED";
export type TsdCp007AnswerKind = "VALUE" | "COUNT";
export type TsdCp007Unit = "SECOND" | "METRE" | "METRE_PER_SECOND" | "CLOCK_SECOND" | "COUNT";

export interface TsdCp007ExecutableInput {
  readonly trainLength?: Rational;
  readonly speed?: Rational;
  readonly fixedObjectLength?: Rational;
  readonly pointCrossingTime?: Rational;
  readonly fixedObjectCrossingTime?: Rational;
  readonly secondFixedObjectCrossingTime?: Rational;
  readonly occupancyDuration?: Rational;
  readonly knownClockSecond?: Rational;
  readonly distanceWindow?: Rational;
  readonly spacing?: Rational;
  readonly timeWindow?: Rational;
  readonly observedPointCount?: bigint;
  readonly includeStartingPoint?: boolean;
  readonly objectKind?: TsdCp007ObjectKind;
  readonly objectLengthEvidenceMode?: TsdCp007ObjectLengthEvidenceMode;
  readonly occupancyTarget?: TsdCp007OccupancyTarget;
  readonly timelineIntervalKind?: TsdCp007TimelineIntervalKind;
  readonly timelineTarget?: TsdCp007TimelineTarget;
  readonly spacingTarget?: TsdCp007SpacingTarget;
}

export interface TsdCp007ExecutableSolution {
  readonly checkpointId: "TSD-CP-007";
  readonly authorityKey: TsdCp007AuthorityKey;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly answerKind: TsdCp007AnswerKind;
  readonly unit: TsdCp007Unit;
  readonly value?: Rational;
  readonly count?: bigint;
  readonly evidence: readonly string[];
}

export interface TsdCp007VerificationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface TsdCp007ExecutableGeneratedCase {
  readonly checkpointId: "TSD-CP-007";
  readonly authorityKey: TsdCp007AuthorityKey;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly seed: string;
  readonly input: TsdCp007ExecutableInput;
  readonly solution: TsdCp007ExecutableSolution;
  readonly verification: TsdCp007VerificationResult;
  readonly lifecycle: {
    readonly permanentQlAllocated: true;
    readonly englishFreezeStatus: "UNFROZEN";
    readonly questionStudioEnabled: false;
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
  };
}
