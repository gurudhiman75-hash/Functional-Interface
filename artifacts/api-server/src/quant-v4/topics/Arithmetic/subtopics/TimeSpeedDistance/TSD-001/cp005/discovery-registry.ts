import type { TsdCp005SolveMode } from "./types";

export const TSD_CP005_DISCOVERY_CANDIDATES = Object.freeze([
  "findSpeedRatioFromPostMeetingArrivalTimes",
  "findPostMeetingArrivalTimeFromSpeedRatio",
  "findTotalDistanceFromPostMeetingTimes",
  "findSpeedsFromPostMeetingTimesAndDistance",
  "findMeetingPointFromPostMeetingTimes",
  "findSecondMeetingTimeAfterEndpointTurnaround",
  "findSecondMeetingPointAfterEndpointTurnaround",
  "findNthMeetingTimeOnLine",
  "findNthMeetingPointOnLine",
  "findRepeatedMeetingCountInTimeWindow",
  "findMeetingAfterOneTravellerTurnsBack",
  "findMeetingAfterBothTurnAtEndpoints",
  "findShuttleMeetingTime",
  "findShuttleDistanceCovered",
  "findReturnJourneyMeetingPoint",
  "findMeetingPointShiftAfterSpeedChange",
  "findSpeedChangeFromMeetingPointShift",
  "findStartDelayFromMeetingPoint",
  "findStaggeredDepartureMeetingPoint",
  "findIntermediateStartPointFromMeetingData",
  "findEndpointRestTimeFromNextMeeting",
  "findTimeBetweenFirstAndSecondMeetings",
  "findDistanceBetweenEndpointsFromRepeatedMeetings",
  "findRouteReversalScheduleParameter",
  "findPassThenCatchAfterTurnaround",
  "findMeetingAtSpecifiedCheckpoint",
  "reconstructCompleteLinearItinerary",
  "detectContradictoryMeetingStatements",
  "classifyPostMeetingStateAsPossibleUniqueOrMultiple",
  "verifyPostMeetingClaim",
  "solvePostMeetingDataSufficiency",
] satisfies readonly TsdCp005SolveMode[]);

export const TSD_CP005_DISCOVERY_STATUS = "EXECUTABLE_DISCOVERY" as const;
export const TSD_CP005_PERMANENT_QL_COUNT = 0 as const;
export const TSD_CP005_NEXT_AVAILABLE_QL = "TSD-QL-058" as const;

export const TSD_CP005_DISCOVERY_BOUNDARY = Object.freeze({
  checkpointId: "TSD-CP-005" as const,
  title: "Return, Turnaround, Repeated Linear Meetings and Post-Meeting Systems" as const,
  packageId: "TSD-001" as const,
  sourceCandidateCount: TSD_CP005_DISCOVERY_CANDIDATES.length,
  dependency: "TSD-CP-004" as const,
  ownership: "BOUNDED_LINE_CONTINUES_AFTER_FIRST_MEETING_OR_ENDPOINT_REVERSAL" as const,
  collisionGuards: Object.freeze([
    "CLOSED_LOOP_MODULAR_MOTION_BELONGS_TO_CP006",
    "TIMETABLE_HEAVY_TRAIN_SYSTEMS_BELONG_TO_CP008",
  ]),
  permanentQlAllocated: false as const,
  nextAvailableQl: TSD_CP005_NEXT_AVAILABLE_QL,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
