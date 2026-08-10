import type { Rational } from "./rational";
import type { DistanceUnit, SpeedUnit, TimeUnit } from "./units";

export const TSD_001_ARCHETYPE_ID = "TSD-001" as const;
export const TSD_CP_001_ID = "TSD-CP-001" as const;

export type Direction1D = -1 | 1;
export type TrackKind = "LINE" | "CLOSED_LOOP";
export type BodyKind =
  | "POINT_BODY"
  | "TRAIN"
  | "BOAT"
  | "RUNNER"
  | "ESCALATOR"
  | "WALKWAY"
  | "CONVEYOR"
  | "WHEEL"
  | "GENERIC";

export type MotionEventKind =
  | "START"
  | "FRONT_REACHES"
  | "REAR_CLEARS"
  | "MEET"
  | "CATCH"
  | "OVERTAKE_COMPLETE"
  | "REACH_ENDPOINT"
  | "TURNAROUND"
  | "STOP"
  | "RESUME";

export interface MotionBody {
  readonly bodyId: string;
  readonly bodyKind: BodyKind;
  readonly lengthMetres?: Rational;
  readonly intrinsicSpeedMps: Rational;
  readonly direction: Direction1D;
  readonly startPositionMetres: Rational;
  readonly startTimeSeconds: Rational;
}

export interface MotionSegment {
  readonly bodyId: string;
  readonly startTimeSeconds: Rational;
  readonly durationSeconds: Rational;
  readonly intrinsicSpeedMps: Rational;
  readonly direction: Direction1D;
  readonly mediumSpeedMps?: Rational;
  readonly stopDurationAfterSeconds?: Rational;
  readonly routeSegmentId?: string;
}

export interface MotionEvent {
  readonly eventKind: MotionEventKind;
  readonly timeSeconds: Rational;
  readonly bodyIds: readonly string[];
  readonly positionMetres?: Rational;
}

export interface MotionState {
  readonly trackKind: TrackKind;
  readonly trackLengthMetres?: Rational;
  readonly bodies: readonly MotionBody[];
  readonly segments: readonly MotionSegment[];
  readonly events: readonly MotionEvent[];
}

export interface MeasuredDistance {
  readonly value: Rational;
  readonly unit: DistanceUnit;
}

export interface MeasuredDuration {
  readonly value: Rational;
  readonly unit: TimeUnit;
}

export interface MeasuredSpeed {
  readonly value: Rational;
  readonly unit: SpeedUnit;
}

export interface TsdLifecycleState {
  readonly reviewStatus: "UNREVIEWED";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export const TSD_CANDIDATE_LIFECYCLE: TsdLifecycleState = Object.freeze({
  reviewStatus: "UNREVIEWED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});
