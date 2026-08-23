import type { Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp009AuthorityKey } from "./source-saturation-final";

export type { TsdCp009AuthorityKey } from "./source-saturation-final";
export type TsdCp009Direction = "ASSISTED" | "OPPOSED";
export type TsdCp009ValueUnit = "SECOND" | "METRE" | "METRE_PER_SECOND";

export type TsdCp009ExecutableInput =
  | Readonly<{ authorityKey: "mediumAdjustedGroundSpeed"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; direction: TsdCp009Direction }>
  | Readonly<{ authorityKey: "mediumComponentsFromAssistedOpposedSpeeds"; assistedGroundSpeed: Rational; opposedGroundSpeed: Rational; target: "BODY_SPEED" | "MEDIUM_SPEED" }>
  | Readonly<{ authorityKey: "mediumLegTravelState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; direction: TsdCp009Direction; target: "TIME"; distance: Rational }>
  | Readonly<{ authorityKey: "mediumLegTravelState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; direction: TsdCp009Direction; target: "DISTANCE"; time: Rational }>
  | Readonly<{ authorityKey: "pairedEqualDistanceMediumState"; mode: "COMPONENT_FROM_DISTANCE_AND_TIMES"; equalDistance: Rational; assistedTime: Rational; opposedTime: Rational; target: "BODY_SPEED" | "MEDIUM_SPEED" }>
  | Readonly<{ authorityKey: "pairedEqualDistanceMediumState"; mode: "DISTANCE_FROM_TIME_DIFFERENCE"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; opposedMinusAssistedTime: Rational; target: "DISTANCE" }>
  | Readonly<{ authorityKey: "pairedEqualDistanceMediumState"; mode: "BODY_SPEED_FROM_TIME_RATIO"; mediumSpeed: Rational; opposedToAssistedTimeRatio: Rational; target: "BODY_SPEED" }>
  | Readonly<{ authorityKey: "pairedEqualDistanceMediumState"; mode: "MEDIUM_SPEED_FROM_TIME_RATIO"; bodyRelativeSpeed: Rational; opposedToAssistedTimeRatio: Rational; target: "MEDIUM_SPEED" }>
  | Readonly<{ authorityKey: "roundTripMediumState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; oneWayDistance: Rational; target: "TOTAL_TIME" | "AVERAGE_SPEED" }>
  | Readonly<{ authorityKey: "mixedUnequalLegMediumState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; totalTime: Rational; opposedDistance: Rational; target: "ASSISTED_DISTANCE" }>
  | Readonly<{ authorityKey: "mixedUnequalLegMediumState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; totalTime: Rational; assistedDistance: Rational; target: "OPPOSED_DISTANCE" }>
  | Readonly<{ authorityKey: "mixedUnequalLegMediumState"; mediumSpeed: Rational; totalTime: Rational; assistedDistance: Rational; opposedDistance: Rational; target: "BODY_SPEED" }>
  | Readonly<{ authorityKey: "equalTimeMediumDistanceSpread"; mediumSpeed: Rational; equalTime: Rational }>
  | Readonly<{ authorityKey: "mediumShiftedMeetingPoint"; routeDistance: Rational; fromUpstreamBodySpeed: Rational; fromDownstreamBodySpeed: Rational; mediumSpeed: Rational }>
  | Readonly<{ authorityKey: "passiveFloatingObjectState"; mediumSpeed: Rational; target: "FLOAT_SPEED" }>
  | Readonly<{ authorityKey: "passiveFloatingObjectState"; mediumSpeed: Rational; target: "TRAVEL_TIME"; distance: Rational }>
  | Readonly<{ authorityKey: "floatingObjectRecoveryState"; bodyRelativeSpeed: Rational; mediumSpeed: Rational; separationTimeBeforeTurn: Rational; target: "RECOVERY_TIME_AFTER_TURN" | "RECOVERY_DISTANCE_FROM_DROP" }>
  | Readonly<{ authorityKey: "changingMediumState"; bodyRelativeSpeed: Rational; distance: Rational; direction: TsdCp009Direction; firstTripTime: Rational; secondTripTime: Rational; target: "NEW_MEDIUM_SPEED" | "MEDIUM_SPEED_CHANGE" }>;

export interface TsdCp009ExecutableSolution {
  readonly authorityKey: TsdCp009AuthorityKey;
  readonly value: Rational;
  readonly unit: TsdCp009ValueUnit;
}

export interface TsdCp009Verification {
  readonly valid: boolean;
  readonly expected: Rational;
  readonly unit: TsdCp009ValueUnit;
  readonly invariant: string;
}

export interface TsdCp009GeneratedCase {
  readonly seed: string;
  readonly caseIndex: number;
  readonly authorityKey: TsdCp009AuthorityKey;
  readonly input: TsdCp009ExecutableInput;
  readonly solution: TsdCp009ExecutableSolution;
}
