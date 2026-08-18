import type { Rational } from "../foundation/rational";

export type TsdCp005SolveMode =
  | "findSpeedRatioFromPostMeetingArrivalTimes"
  | "findPostMeetingArrivalTimeFromSpeedRatio"
  | "findTotalDistanceFromPostMeetingTimes"
  | "findSpeedsFromPostMeetingTimesAndDistance"
  | "findMeetingPointFromPostMeetingTimes"
  | "findSecondMeetingTimeAfterEndpointTurnaround"
  | "findSecondMeetingPointAfterEndpointTurnaround"
  | "findNthMeetingTimeOnLine"
  | "findNthMeetingPointOnLine"
  | "findRepeatedMeetingCountInTimeWindow"
  | "findMeetingAfterOneTravellerTurnsBack"
  | "findMeetingAfterBothTurnAtEndpoints"
  | "findShuttleMeetingTime"
  | "findShuttleDistanceCovered"
  | "findReturnJourneyMeetingPoint"
  | "findMeetingPointShiftAfterSpeedChange"
  | "findSpeedChangeFromMeetingPointShift"
  | "findStartDelayFromMeetingPoint"
  | "findStaggeredDepartureMeetingPoint"
  | "findIntermediateStartPointFromMeetingData"
  | "findEndpointRestTimeFromNextMeeting"
  | "findTimeBetweenFirstAndSecondMeetings"
  | "findDistanceBetweenEndpointsFromRepeatedMeetings"
  | "findRouteReversalScheduleParameter"
  | "findPassThenCatchAfterTurnaround"
  | "findMeetingAtSpecifiedCheckpoint"
  | "reconstructCompleteLinearItinerary"
  | "detectContradictoryMeetingStatements"
  | "classifyPostMeetingStateAsPossibleUniqueOrMultiple"
  | "verifyPostMeetingClaim"
  | "solvePostMeetingDataSufficiency";

export type TsdCp005ScalarUnit = "RATIO" | "HOUR" | "KM" | "KM_PER_HOUR" | "COUNT" | "NONE";
export type TsdCp005Classification = "UNIQUE" | "MULTIPLE" | "IMPOSSIBLE";
export type TsdCp005DataSufficiency = "STATEMENT_1_ONLY" | "STATEMENT_2_ONLY" | "BOTH_TOGETHER" | "EITHER_ALONE" | "INSUFFICIENT";
export type TsdCp005DsFact = "POST_TIME_A" | "POST_TIME_B" | "SPEED_A" | "SPEED_B";

export interface TsdCp005Input {
  readonly routeDistance?: Rational;
  readonly speedA?: Rational;
  readonly speedB?: Rational;
  readonly postMeetingTimeA?: Rational;
  readonly postMeetingTimeB?: Rational;
  readonly speedRatio?: Rational;
  readonly targetPostBody?: "A" | "B";
  readonly nthMeeting?: number;
  readonly timeWindow?: Rational;
  readonly changedSpeedA?: Rational;
  readonly meetingPointShift?: Rational;
  readonly startDelayA?: Rational;
  readonly meetingPointFromA?: Rational;
  readonly startPositionA?: Rational;
  readonly endpointRestA?: Rational;
  readonly observedFirstMeetingTime?: Rational;
  readonly observedSecondMeetingTime?: Rational;
  readonly specifiedCheckpoint?: Rational;
  readonly claimedMeetingTime?: Rational;
  readonly claimedMeetingPoint?: Rational;
  readonly dsStatement1?: readonly TsdCp005DsFact[];
  readonly dsStatement2?: readonly TsdCp005DsFact[];
}

export type TsdCp005AnswerKind = "VALUE" | "PAIR" | "BOOLEAN" | "CLASSIFICATION" | "DATA_SUFFICIENCY" | "ITINERARY";

export interface TsdCp005Solution {
  readonly solveMode: TsdCp005SolveMode;
  readonly answerKind: TsdCp005AnswerKind;
  readonly unit: TsdCp005ScalarUnit;
  readonly value?: Rational;
  readonly values?: readonly Rational[];
  readonly booleanValue?: boolean;
  readonly classification?: TsdCp005Classification;
  readonly dataSufficiency?: TsdCp005DataSufficiency;
  readonly meetingPointFromA?: Rational;
  readonly derivation: readonly string[];
}

export interface TsdCp005Verification {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface TsdCp005GeneratedCase {
  readonly checkpointId: "TSD-CP-005";
  readonly solveMode: TsdCp005SolveMode;
  readonly seed: string;
  readonly input: TsdCp005Input;
  readonly solution: TsdCp005Solution;
  readonly verification: TsdCp005Verification;
  readonly lifecycle: {
    readonly discoveryStatus: "EXECUTABLE_DISCOVERY";
    readonly permanentQlAllocated: false;
    readonly englishFreezeStatus: "UNFROZEN";
    readonly questionStudioEnabled: false;
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
  };
}
