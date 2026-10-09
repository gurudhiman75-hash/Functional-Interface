export const TSD_CP003_SOURCE_CANDIDATES = [
  "findTimeSavedFromSpeedIncrease",
  "findDelayFromSpeedDecrease",
  "findDistanceFromTwoSpeedsAndTimeDifference",
  "findOriginalSpeedFromPercentChangeAndTimeDifference",
  "findChangedSpeedFromTimeDifference",
  "findOriginalDistanceFromSpeedChangeAndTimeDifference",
  "findUsualSpeedFromEarlyLatePair",
  "findDistanceFromEarlyLatePair",
  "findScheduledArrivalTimeFromActualSpeed",
  "findRequiredSpeedAfterLateStart",
  "findRequiredSpeedAfterUnplannedStop",
  "findRequiredRemainingSpeedAfterSlowInitialSegment",
  "findRequiredRemainingSpeedAfterFastInitialSegment",
  "findStoppageDurationFromRunningAndOverallSpeed",
  "findOverallSpeedIncludingStops",
  "findRunningSpeedFromOverallSpeedAndStops",
  "findNumberOfStopsFromOverallDelay",
  "findDelayFromRegularStops",
  "findRestTimeInRepeatedTravelRestCycle",
  "findTotalTimeWithStopsAfterFixedDistance",
  "findTotalTimeWithStopsAfterFixedTime",
  "findDistanceCoveredBeforeSpeedChange",
  "findFractionOfRouteAtChangedSpeed",
  "findSpeedChangePointFromArrivalDifference",
  "findBreakdownDurationFromArrivalDelay",
  "findRepairTimeFromRequiredRecoverySpeed",
  "findStartTimeShiftForSameArrival",
  "findArrivalShiftFromDepartureAndSpeedChanges",
  "findWalkingRidingTimeSplit",
  "findWalkingRidingDistanceSplit",
  "findScheduleBuffer",
  "findHiddenDistanceFromTimeGap",
  "findHiddenSpeedFromArrivalDifference",
  "classifyScheduleStateAsPossibleUniqueOrMultiple",
  "verifyEarlyLateOrStopClaim",
] as const;

export type TsdCp003SourceCandidate = (typeof TSD_CP003_SOURCE_CANDIDATES)[number];

export type TsdCp003AnswerKind =
  | "TIME"
  | "DISTANCE"
  | "SPEED"
  | "CLOCK_TIME"
  | "COUNT"
  | "PERCENT"
  | "ALLOCATION"
  | "CLASSIFICATION"
  | "BOOLEAN";

export type TsdCp003GoverningRule =
  | "FIXED_ROUTE_RECIPROCAL_TIME"
  | "EARLY_LATE_PAIR"
  | "SCHEDULE_RECOVERY"
  | "STOPPAGE_WEIGHTING"
  | "REGULAR_STOP_ACCUMULATION"
  | "CHANGE_POINT_SYSTEM"
  | "DEPARTURE_ARRIVAL_SHIFT"
  | "MIXED_MODE_ALLOCATION"
  | "STATE_VALIDITY";

export interface TsdCp003DiscoveryAuthority {
  readonly provisionalId: `TSD-CP003-DISC-${string}`;
  readonly solveMode: string;
  readonly answerKind: TsdCp003AnswerKind;
  readonly governingRule: TsdCp003GoverningRule;
  readonly sourceCandidates: readonly TsdCp003SourceCandidate[];
  readonly learnerFacing: boolean;
  readonly discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

function authority(
  ordinal: number,
  solveMode: string,
  answerKind: TsdCp003AnswerKind,
  governingRule: TsdCp003GoverningRule,
  sourceCandidates: readonly TsdCp003SourceCandidate[],
  learnerFacing = true,
): TsdCp003DiscoveryAuthority {
  return Object.freeze({
    provisionalId: `TSD-CP003-DISC-${String(ordinal).padStart(3, "0")}`,
    solveMode,
    answerKind,
    governingRule,
    sourceCandidates,
    learnerFacing,
    discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY",
    permanentQlId: null,
    englishFreezeStatus: "UNFROZEN",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}

export const TSD_CP003_DISCOVERY_AUTHORITIES: readonly TsdCp003DiscoveryAuthority[] = Object.freeze([
  authority(1, "timeGainLossFromSpeedChange", "TIME", "FIXED_ROUTE_RECIPROCAL_TIME", [
    "findTimeSavedFromSpeedIncrease",
    "findDelayFromSpeedDecrease",
  ]),
  authority(2, "distanceFromSpeedTimeDifference", "DISTANCE", "FIXED_ROUTE_RECIPROCAL_TIME", [
    "findDistanceFromTwoSpeedsAndTimeDifference",
    "findOriginalDistanceFromSpeedChangeAndTimeDifference",
    "findHiddenDistanceFromTimeGap",
  ]),
  authority(3, "speedFromFixedRouteTimeDifference", "SPEED", "FIXED_ROUTE_RECIPROCAL_TIME", [
    "findOriginalSpeedFromPercentChangeAndTimeDifference",
    "findChangedSpeedFromTimeDifference",
    "findHiddenSpeedFromArrivalDifference",
  ]),
  authority(4, "usualSpeedFromEarlyLatePair", "SPEED", "EARLY_LATE_PAIR", [
    "findUsualSpeedFromEarlyLatePair",
  ]),
  authority(5, "distanceFromEarlyLatePair", "DISTANCE", "EARLY_LATE_PAIR", [
    "findDistanceFromEarlyLatePair",
  ]),
  authority(6, "scheduledArrivalTimeFromActualSpeed", "CLOCK_TIME", "EARLY_LATE_PAIR", [
    "findScheduledArrivalTimeFromActualSpeed",
  ]),
  authority(7, "requiredRecoverySpeedAfterLostTime", "SPEED", "SCHEDULE_RECOVERY", [
    "findRequiredSpeedAfterLateStart",
    "findRequiredSpeedAfterUnplannedStop",
  ]),
  authority(8, "requiredRemainingSpeedAfterPartialRoute", "SPEED", "SCHEDULE_RECOVERY", [
    "findRequiredRemainingSpeedAfterSlowInitialSegment",
    "findRequiredRemainingSpeedAfterFastInitialSegment",
  ]),
  authority(9, "stoppageDurationFromRunningAndOverallSpeed", "TIME", "STOPPAGE_WEIGHTING", [
    "findStoppageDurationFromRunningAndOverallSpeed",
  ]),
  authority(10, "overallSpeedIncludingStops", "SPEED", "STOPPAGE_WEIGHTING", [
    "findOverallSpeedIncludingStops",
  ]),
  authority(11, "runningSpeedFromOverallSpeedAndStops", "SPEED", "STOPPAGE_WEIGHTING", [
    "findRunningSpeedFromOverallSpeedAndStops",
  ]),
  authority(12, "numberOfStopsFromOverallDelay", "COUNT", "REGULAR_STOP_ACCUMULATION", [
    "findNumberOfStopsFromOverallDelay",
  ]),
  authority(13, "delayFromRegularStops", "TIME", "REGULAR_STOP_ACCUMULATION", [
    "findDelayFromRegularStops",
  ]),
  authority(14, "restTimeInRepeatedTravelRestCycle", "TIME", "REGULAR_STOP_ACCUMULATION", [
    "findRestTimeInRepeatedTravelRestCycle",
  ]),
  authority(15, "totalTimeWithRegularStops", "TIME", "REGULAR_STOP_ACCUMULATION", [
    "findTotalTimeWithStopsAfterFixedDistance",
    "findTotalTimeWithStopsAfterFixedTime",
  ]),
  authority(16, "speedChangePointDistance", "DISTANCE", "CHANGE_POINT_SYSTEM", [
    "findDistanceCoveredBeforeSpeedChange",
    "findSpeedChangePointFromArrivalDifference",
  ]),
  authority(17, "fractionOfRouteAtChangedSpeed", "PERCENT", "CHANGE_POINT_SYSTEM", [
    "findFractionOfRouteAtChangedSpeed",
  ]),
  authority(18, "lostTimeDurationFromScheduleRecovery", "TIME", "SCHEDULE_RECOVERY", [
    "findBreakdownDurationFromArrivalDelay",
    "findRepairTimeFromRequiredRecoverySpeed",
  ]),
  authority(19, "startTimeShiftForSameArrival", "TIME", "DEPARTURE_ARRIVAL_SHIFT", [
    "findStartTimeShiftForSameArrival",
  ]),
  authority(20, "arrivalShiftFromDepartureAndSpeedChanges", "TIME", "DEPARTURE_ARRIVAL_SHIFT", [
    "findArrivalShiftFromDepartureAndSpeedChanges",
  ]),
  authority(21, "walkingRidingAllocation", "ALLOCATION", "MIXED_MODE_ALLOCATION", [
    "findWalkingRidingTimeSplit",
    "findWalkingRidingDistanceSplit",
  ]),
  authority(22, "scheduleBuffer", "TIME", "DEPARTURE_ARRIVAL_SHIFT", [
    "findScheduleBuffer",
  ]),
  authority(23, "classifyScheduleState", "CLASSIFICATION", "STATE_VALIDITY", [
    "classifyScheduleStateAsPossibleUniqueOrMultiple",
  ], false),
  authority(24, "verifyEarlyLateOrStopClaim", "BOOLEAN", "STATE_VALIDITY", [
    "verifyEarlyLateOrStopClaim",
  ], false),
]);

export const TSD_CP003_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP003_DISCOVERY_AUTHORITIES.filter((entry) => entry.learnerFacing),
);

export const TSD_CP003_INTERNAL_AUTHORITIES = Object.freeze(
  TSD_CP003_DISCOVERY_AUTHORITIES.filter((entry) => !entry.learnerFacing),
);

export function cp003AuthorityByProvisionalId(provisionalId: string): TsdCp003DiscoveryAuthority {
  const authority = TSD_CP003_DISCOVERY_AUTHORITIES.find((entry) => entry.provisionalId === provisionalId);
  if (!authority) throw new Error(`Unknown CP-003 provisional authority: ${provisionalId}`);
  return authority;
}
