export const TSD_CP001_SOURCE_CANDIDATES = [
  "findDistanceFromSpeedAndTime",
  "findSpeedFromDistanceAndTime",
  "findTimeFromDistanceAndSpeed",
  "convertKmphToMps",
  "convertMpsToKmph",
  "convertDistanceUnit",
  "convertTimeUnit",
  "convertCompoundSpeedUnit",
  "findSpeedInRequestedUnit",
  "findDistanceWithFractionalDuration",
  "findDurationWithFractionalDistance",
  "findArrivalClockTime",
  "findDepartureClockTime",
  "findElapsedTimeAcrossClockBoundary",
  "compareDistancesAtEqualTime",
  "compareTimesAtEqualDistance",
  "compareSpeedsAtEqualTime",
  "findDistanceRatioFromSpeedAndTimeRatios",
  "findSpeedRatioFromDistanceAndTimeRatios",
  "findTimeRatioFromDistanceAndSpeedRatios",
  "findUnknownDistanceByDirectProportion",
  "findUnknownTimeByDirectProportion",
  "findUnknownSpeedByInverseProportion",
  "findTimeAfterSpeedChangeForSameDistance",
  "findSpeedChangeFromTimeChangeForSameDistance",
  "findSpeedFromPace",
  "findPaceFromSpeed",
  "findDistanceFromPaceAndTime",
  "findRequiredUniformSpeedForDeadline",
  "findUniformSpeedFromTwoEquivalentTrips",
  "classifyMotionStateAsPossibleUniqueOrIndeterminate",
  "verifyUniformMotionClaim",
] as const;

export type TsdCp001SourceCandidate = (typeof TSD_CP001_SOURCE_CANDIDATES)[number];

export const TSD_CP001_DISCOVERY_SOLVE_MODES = [
  "distanceFromSpeedAndTime",
  "speedFromDistanceAndTime",
  "timeFromDistanceAndSpeed",
  "convertSpeedUnit",
  "convertDistanceUnit",
  "convertTimeUnit",
  "speedFromMixedUnits",
  "arrivalClockTime",
  "departureClockTime",
  "elapsedClockTime",
  "compareDistancesAtEqualTime",
  "compareTimesAtEqualDistance",
  "compareSpeedsAtEqualTime",
  "distanceRatioFromSpeedAndTimeRatios",
  "speedRatioFromDistanceAndTimeRatios",
  "timeRatioFromDistanceAndSpeedRatios",
  "distanceByProportion",
  "timeByProportion",
  "speedByProportion",
  "speedFromPace",
  "paceFromSpeed",
  "distanceFromPaceAndTime",
  "requiredUniformSpeedForDeadline",
  "classifyUniformMotionState",
  "verifyUniformMotionClaim",
] as const;

export type TsdCp001DiscoverySolveMode = (typeof TSD_CP001_DISCOVERY_SOLVE_MODES)[number];
export type TsdCp001AnswerKind =
  | "DISTANCE"
  | "SPEED"
  | "TIME"
  | "CLOCK_TIME"
  | "RATIO"
  | "PACE"
  | "CLASSIFICATION"
  | "BOOLEAN";

export interface TsdCp001DiscoveryAuthority {
  readonly provisionalId: `TSD-CP001-DISC-${string}`;
  readonly solveMode: TsdCp001DiscoverySolveMode;
  readonly answerKind: TsdCp001AnswerKind;
  readonly governingRule:
    | "UNIFORM_MOTION"
    | "UNIT_CONVERSION"
    | "CLOCK_ARITHMETIC"
    | "MOTION_COMPARISON"
    | "MOTION_RATIO"
    | "MOTION_PROPORTION"
    | "PACE_RECIPROCAL"
    | "STATE_VALIDITY";
  readonly sourceCandidates: readonly TsdCp001SourceCandidate[];
  readonly discoveryStatus: "PROVISIONAL";
  readonly publiclyPublishable: false;
}

function authority(
  ordinal: number,
  solveMode: TsdCp001DiscoverySolveMode,
  answerKind: TsdCp001AnswerKind,
  governingRule: TsdCp001DiscoveryAuthority["governingRule"],
  sourceCandidates: readonly TsdCp001SourceCandidate[],
): TsdCp001DiscoveryAuthority {
  return Object.freeze({
    provisionalId: `TSD-CP001-DISC-${String(ordinal).padStart(3, "0")}`,
    solveMode,
    answerKind,
    governingRule,
    sourceCandidates,
    discoveryStatus: "PROVISIONAL",
    publiclyPublishable: false,
  });
}

export const TSD_CP001_DISCOVERY_AUTHORITIES: readonly TsdCp001DiscoveryAuthority[] = Object.freeze([
  authority(1, "distanceFromSpeedAndTime", "DISTANCE", "UNIFORM_MOTION", [
    "findDistanceFromSpeedAndTime",
    "findDistanceWithFractionalDuration",
  ]),
  authority(2, "speedFromDistanceAndTime", "SPEED", "UNIFORM_MOTION", ["findSpeedFromDistanceAndTime"]),
  authority(3, "timeFromDistanceAndSpeed", "TIME", "UNIFORM_MOTION", [
    "findTimeFromDistanceAndSpeed",
    "findDurationWithFractionalDistance",
  ]),
  authority(4, "convertSpeedUnit", "SPEED", "UNIT_CONVERSION", [
    "convertKmphToMps",
    "convertMpsToKmph",
    "convertCompoundSpeedUnit",
  ]),
  authority(5, "convertDistanceUnit", "DISTANCE", "UNIT_CONVERSION", ["convertDistanceUnit"]),
  authority(6, "convertTimeUnit", "TIME", "UNIT_CONVERSION", ["convertTimeUnit"]),
  authority(7, "speedFromMixedUnits", "SPEED", "UNIT_CONVERSION", ["findSpeedInRequestedUnit"]),
  authority(8, "arrivalClockTime", "CLOCK_TIME", "CLOCK_ARITHMETIC", ["findArrivalClockTime"]),
  authority(9, "departureClockTime", "CLOCK_TIME", "CLOCK_ARITHMETIC", ["findDepartureClockTime"]),
  authority(10, "elapsedClockTime", "TIME", "CLOCK_ARITHMETIC", ["findElapsedTimeAcrossClockBoundary"]),
  authority(11, "compareDistancesAtEqualTime", "RATIO", "MOTION_COMPARISON", ["compareDistancesAtEqualTime"]),
  authority(12, "compareTimesAtEqualDistance", "RATIO", "MOTION_COMPARISON", ["compareTimesAtEqualDistance"]),
  authority(13, "compareSpeedsAtEqualTime", "RATIO", "MOTION_COMPARISON", ["compareSpeedsAtEqualTime"]),
  authority(14, "distanceRatioFromSpeedAndTimeRatios", "RATIO", "MOTION_RATIO", [
    "findDistanceRatioFromSpeedAndTimeRatios",
  ]),
  authority(15, "speedRatioFromDistanceAndTimeRatios", "RATIO", "MOTION_RATIO", [
    "findSpeedRatioFromDistanceAndTimeRatios",
  ]),
  authority(16, "timeRatioFromDistanceAndSpeedRatios", "RATIO", "MOTION_RATIO", [
    "findTimeRatioFromDistanceAndSpeedRatios",
  ]),
  authority(17, "distanceByProportion", "DISTANCE", "MOTION_PROPORTION", [
    "findUnknownDistanceByDirectProportion",
  ]),
  authority(18, "timeByProportion", "TIME", "MOTION_PROPORTION", [
    "findUnknownTimeByDirectProportion",
    "findTimeAfterSpeedChangeForSameDistance",
  ]),
  authority(19, "speedByProportion", "SPEED", "MOTION_PROPORTION", [
    "findUnknownSpeedByInverseProportion",
    "findSpeedChangeFromTimeChangeForSameDistance",
    "findUniformSpeedFromTwoEquivalentTrips",
  ]),
  authority(20, "speedFromPace", "SPEED", "PACE_RECIPROCAL", ["findSpeedFromPace"]),
  authority(21, "paceFromSpeed", "PACE", "PACE_RECIPROCAL", ["findPaceFromSpeed"]),
  authority(22, "distanceFromPaceAndTime", "DISTANCE", "PACE_RECIPROCAL", ["findDistanceFromPaceAndTime"]),
  authority(23, "requiredUniformSpeedForDeadline", "SPEED", "CLOCK_ARITHMETIC", [
    "findRequiredUniformSpeedForDeadline",
  ]),
  authority(24, "classifyUniformMotionState", "CLASSIFICATION", "STATE_VALIDITY", [
    "classifyMotionStateAsPossibleUniqueOrIndeterminate",
  ]),
  authority(25, "verifyUniformMotionClaim", "BOOLEAN", "STATE_VALIDITY", ["verifyUniformMotionClaim"]),
]);
