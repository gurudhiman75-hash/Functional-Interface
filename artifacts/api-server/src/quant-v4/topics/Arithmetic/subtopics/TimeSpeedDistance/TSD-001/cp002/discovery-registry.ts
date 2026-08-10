import type { TsdCp002AnswerKind, TsdCp002SolveMode } from "./types";

export const TSD_CP002_SOURCE_CANDIDATES = [
  "findAverageSpeedFromTwoSegments",
  "findAverageSpeedFromMultipleSegments",
  "findAverageSpeedForEqualDistances",
  "findAverageSpeedForEqualTimes",
  "findAverageSpeedForUnequalDistances",
  "findAverageSpeedForUnequalTimes",
  "findAverageSpeedFromDistanceFractions",
  "findAverageSpeedFromTimeFractions",
  "findAverageSpeedFromDistanceRatio",
  "findAverageSpeedFromTimeRatio",
  "findAveragePaceFromSegmentPaces",
  "findUnknownSegmentSpeedFromOverallAverage",
  "findUnknownSegmentTimeFromOverallAverage",
  "findUnknownSegmentDistanceFromOverallAverage",
  "findUnknownDistanceFractionFromOverallAverage",
  "findUnknownTimeFractionFromOverallAverage",
  "findReturnSpeedFromOutwardSpeedAndOverallAverage",
  "findOutwardSpeedFromReturnSpeedAndOverallAverage",
  "findOneWayDistanceFromRoundTripTimeAndSpeeds",
  "findRoundTripTimeFromOneWayDistanceAndSpeeds",
  "findTotalDistanceFromAverageSpeedAndTotalTime",
  "findSegmentDistanceFromTotalDistanceTimeAndSpeeds",
  "findSegmentTimeFromTotalDistanceAndSpeeds",
  "findDistanceRatioFromAverageAndSegmentSpeeds",
  "findTimeRatioFromAverageAndSegmentSpeeds",
  "findRequiredRemainingSpeedForTargetAverage",
  "findDistanceCoveredAtEachSpeedFromTotalDistanceAndTime",
  "findTimeSpentAtEachSpeedFromTotalDistanceAndAverage",
  "compareCandidateAverageSpeeds",
  "findAverageSpeedAfterRouteReversal",
  "findAverageSpeedWithMixedUnits",
  "reconstructSegmentedJourneyFromTable",
  "classifyAverageSpeedStateAsPossibleUniqueOrMultiple",
  "verifyAverageSpeedClaim",
] as const;

export type TsdCp002SourceCandidate = (typeof TSD_CP002_SOURCE_CANDIDATES)[number];

export interface TsdCp002DiscoveryAuthority {
  readonly provisionalId: `TSD-CP002-DISC-${string}`;
  readonly solveMode: TsdCp002SolveMode;
  readonly answerKind: TsdCp002AnswerKind | "DISTANCE_OR_TIME";
  readonly governingRule: "TOTAL_DISTANCE_OVER_TOTAL_TIME" | "PACE_WEIGHTING" | "AVERAGE_INVERSE" | "ROUND_TRIP_HARMONIC" | "SEGMENT_SYSTEM" | "PLAN_COMPARISON" | "STATE_VALIDITY";
  readonly sourceCandidates: readonly TsdCp002SourceCandidate[];
  readonly learnerFacing: boolean;
  readonly discoveryStatus: "FROZEN";
  readonly publiclyPublishable: false;
}

function authority(
  ordinal: number,
  solveMode: TsdCp002SolveMode,
  answerKind: TsdCp002AnswerKind | "DISTANCE_OR_TIME",
  governingRule: TsdCp002DiscoveryAuthority["governingRule"],
  sourceCandidates: readonly TsdCp002SourceCandidate[],
  learnerFacing = true,
): TsdCp002DiscoveryAuthority {
  return Object.freeze({
    provisionalId: `TSD-CP002-DISC-${String(ordinal).padStart(3, "0")}`,
    solveMode,
    answerKind,
    governingRule,
    sourceCandidates,
    learnerFacing,
    discoveryStatus: "FROZEN",
    publiclyPublishable: false,
  });
}

export const TSD_CP002_DISCOVERY_AUTHORITIES: readonly TsdCp002DiscoveryAuthority[] = Object.freeze([
  authority(1, "averageSpeedFromSegments", "SPEED", "TOTAL_DISTANCE_OVER_TOTAL_TIME", [
    "findAverageSpeedFromTwoSegments",
    "findAverageSpeedFromMultipleSegments",
    "findAverageSpeedForEqualDistances",
    "findAverageSpeedForEqualTimes",
    "findAverageSpeedForUnequalDistances",
    "findAverageSpeedForUnequalTimes",
    "findAverageSpeedFromDistanceFractions",
    "findAverageSpeedFromTimeFractions",
    "findAverageSpeedFromDistanceRatio",
    "findAverageSpeedFromTimeRatio",
    "findAverageSpeedAfterRouteReversal",
    "findAverageSpeedWithMixedUnits",
    "reconstructSegmentedJourneyFromTable",
  ]),
  authority(2, "averagePaceFromSegments", "PACE", "PACE_WEIGHTING", ["findAveragePaceFromSegmentPaces"]),
  authority(3, "unknownSegmentSpeedFromAverage", "SPEED", "AVERAGE_INVERSE", ["findUnknownSegmentSpeedFromOverallAverage"]),
  authority(4, "unknownSegmentTimeFromAverage", "TIME", "AVERAGE_INVERSE", ["findUnknownSegmentTimeFromOverallAverage"]),
  authority(5, "unknownSegmentDistanceFromAverage", "DISTANCE", "AVERAGE_INVERSE", ["findUnknownSegmentDistanceFromOverallAverage"]),
  authority(6, "unknownSegmentShareFromAverage", "PERCENT", "AVERAGE_INVERSE", [
    "findUnknownDistanceFractionFromOverallAverage",
    "findUnknownTimeFractionFromOverallAverage",
  ]),
  authority(7, "unknownRoundTripLegSpeedFromAverage", "SPEED", "ROUND_TRIP_HARMONIC", [
    "findReturnSpeedFromOutwardSpeedAndOverallAverage",
    "findOutwardSpeedFromReturnSpeedAndOverallAverage",
  ]),
  authority(8, "oneWayDistanceFromRoundTripData", "DISTANCE", "ROUND_TRIP_HARMONIC", ["findOneWayDistanceFromRoundTripTimeAndSpeeds"]),
  authority(9, "roundTripTimeFromOneWayDistance", "TIME", "ROUND_TRIP_HARMONIC", ["findRoundTripTimeFromOneWayDistanceAndSpeeds"]),
  authority(10, "totalDistanceFromAverageAndTime", "DISTANCE", "AVERAGE_INVERSE", ["findTotalDistanceFromAverageSpeedAndTotalTime"]),
  authority(11, "segmentAllocationFromTotalsAndSpeeds", "DISTANCE_OR_TIME", "SEGMENT_SYSTEM", [
    "findSegmentDistanceFromTotalDistanceTimeAndSpeeds",
    "findSegmentTimeFromTotalDistanceAndSpeeds",
    "findDistanceCoveredAtEachSpeedFromTotalDistanceAndTime",
    "findTimeSpentAtEachSpeedFromTotalDistanceAndAverage",
  ]),
  authority(12, "segmentRatioFromAverageAndSpeeds", "RATIO", "SEGMENT_SYSTEM", [
    "findDistanceRatioFromAverageAndSegmentSpeeds",
    "findTimeRatioFromAverageAndSegmentSpeeds",
  ]),
  authority(13, "requiredRemainingSpeedForTargetAverage", "SPEED", "SEGMENT_SYSTEM", ["findRequiredRemainingSpeedForTargetAverage"]),
  authority(14, "compareSegmentedJourneyPlans", "CHOICE", "PLAN_COMPARISON", ["compareCandidateAverageSpeeds"]),
  authority(15, "classifyAverageSpeedState", "CLASSIFICATION", "STATE_VALIDITY", ["classifyAverageSpeedStateAsPossibleUniqueOrMultiple"], false),
  authority(16, "verifyAverageSpeedClaim", "BOOLEAN", "STATE_VALIDITY", ["verifyAverageSpeedClaim"], false),
]);

export const TSD_CP002_LEARNER_AUTHORITIES = TSD_CP002_DISCOVERY_AUTHORITIES.filter((entry) => entry.learnerFacing);
export const TSD_CP002_INTERNAL_AUTHORITIES = TSD_CP002_DISCOVERY_AUTHORITIES.filter((entry) => !entry.learnerFacing);
