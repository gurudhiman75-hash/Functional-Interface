import type { Rational } from "../foundation/rational";

export type TsdCp003ExecutableSolveMode =
  | "timeGainLossFromSpeedChange"
  | "distanceFromSpeedTimeDifference"
  | "speedFromFixedRouteTimeDifference"
  | "usualSpeedFromEarlyLatePair"
  | "distanceFromEarlyLatePair"
  | "scheduledArrivalTimeFromActualSpeed"
  | "requiredRecoverySpeedAfterLostTime"
  | "requiredRemainingSpeedAfterPartialRoute"
  | "stoppageDurationFromRunningAndOverallSpeed"
  | "overallSpeedIncludingStops"
  | "runningSpeedFromOverallSpeedAndStops"
  | "numberOfStopsFromOverallDelay"
  | "delayFromRegularStops"
  | "restTimeInRepeatedTravelRestCycle"
  | "totalTimeWithRegularStops"
  | "speedChangePointDistance"
  | "fractionOfRouteAtChangedSpeed"
  | "lostTimeDurationFromScheduleRecovery"
  | "startTimeShiftForSameArrival"
  | "arrivalShiftFromDepartureAndSpeedChanges"
  | "walkingRidingAllocation"
  | "scheduleBuffer";

export interface TsdCp003TimeGainLossInput {
  readonly solveMode: "timeGainLossFromSpeedChange";
  readonly distance: Rational;
  readonly originalSpeed: Rational;
  readonly changedSpeed: Rational;
}

export interface TsdCp003DistanceFromTimeDifferenceInput {
  readonly solveMode: "distanceFromSpeedTimeDifference";
  readonly slowerSpeed: Rational;
  readonly fasterSpeed: Rational;
  readonly timeDifference: Rational;
}

export type TsdCp003SpeedFromTimeDifferenceInput =
  | {
      readonly solveMode: "speedFromFixedRouteTimeDifference";
      readonly representation: "KNOWN_OTHER_SPEED";
      readonly distance: Rational;
      readonly timeDifference: Rational;
      readonly knownSpeed: Rational;
      readonly unknownRole: "SLOWER" | "FASTER";
    }
  | {
      readonly solveMode: "speedFromFixedRouteTimeDifference";
      readonly representation: "KNOWN_SPEED_RATIO";
      readonly distance: Rational;
      readonly timeDifference: Rational;
      readonly slowerRatio: Rational;
      readonly fasterRatio: Rational;
      readonly target: "SLOWER" | "FASTER";
    };

export interface TsdCp003UsualSpeedFromEarlyLateInput {
  readonly solveMode: "usualSpeedFromEarlyLatePair";
  readonly slowerTrialSpeed: Rational;
  readonly fasterTrialSpeed: Rational;
  readonly lateBy: Rational;
  readonly earlyBy: Rational;
}

export interface TsdCp003DistanceFromEarlyLateInput {
  readonly solveMode: "distanceFromEarlyLatePair";
  readonly slowerTrialSpeed: Rational;
  readonly fasterTrialSpeed: Rational;
  readonly lateBy: Rational;
  readonly earlyBy: Rational;
}

export interface TsdCp003ScheduledArrivalInput {
  readonly solveMode: "scheduledArrivalTimeFromActualSpeed";
  readonly departureMinuteFromDayZero: Rational;
  readonly distance: Rational;
  readonly actualSpeed: Rational;
}

export interface TsdCp003RequiredRecoverySpeedInput {
  readonly solveMode: "requiredRecoverySpeedAfterLostTime";
  readonly remainingDistance: Rational;
  readonly remainingAvailableTime: Rational;
}

export interface TsdCp003RequiredRemainingSpeedInput {
  readonly solveMode: "requiredRemainingSpeedAfterPartialRoute";
  readonly totalDistance: Rational;
  readonly scheduledTotalTime: Rational;
  readonly completedDistance: Rational;
  readonly completedSpeed: Rational;
}

export interface TsdCp003StoppageDurationInput {
  readonly solveMode: "stoppageDurationFromRunningAndOverallSpeed";
  readonly distance: Rational;
  readonly runningSpeed: Rational;
  readonly overallSpeed: Rational;
}

export interface TsdCp003OverallSpeedIncludingStopsInput {
  readonly solveMode: "overallSpeedIncludingStops";
  readonly distance: Rational;
  readonly runningSpeed: Rational;
  readonly totalStopTime: Rational;
}

export interface TsdCp003RunningSpeedFromStopsInput {
  readonly solveMode: "runningSpeedFromOverallSpeedAndStops";
  readonly distance: Rational;
  readonly overallSpeed: Rational;
  readonly totalStopTime: Rational;
}

export interface TsdCp003NumberOfStopsInput {
  readonly solveMode: "numberOfStopsFromOverallDelay";
  readonly totalDelay: Rational;
  readonly stopDuration: Rational;
}

export interface TsdCp003DelayFromStopsInput {
  readonly solveMode: "delayFromRegularStops";
  readonly stopCount: Rational;
  readonly stopDuration: Rational;
}

export interface TsdCp003RestTimeCycleInput {
  readonly solveMode: "restTimeInRepeatedTravelRestCycle";
  readonly travelTimePerCycle: Rational;
  readonly cycleCount: Rational;
  readonly restEvents: Rational;
  readonly totalElapsedTime: Rational;
}

export interface TsdCp003TotalTimeWithStopsInput {
  readonly solveMode: "totalTimeWithRegularStops";
  readonly runningTime: Rational;
  readonly stopCount: Rational;
  readonly stopDuration: Rational;
}

export interface TsdCp003SpeedChangePointInput {
  readonly solveMode: "speedChangePointDistance";
  readonly totalDistance: Rational;
  readonly totalTravelTime: Rational;
  readonly firstSpeed: Rational;
  readonly secondSpeed: Rational;
}

export interface TsdCp003ChangedRouteFractionInput {
  readonly solveMode: "fractionOfRouteAtChangedSpeed";
  readonly totalDistance: Rational;
  readonly totalTravelTime: Rational;
  readonly originalSpeed: Rational;
  readonly changedSpeed: Rational;
}

export interface TsdCp003LostTimeDurationInput {
  readonly solveMode: "lostTimeDurationFromScheduleRecovery";
  readonly remainingDistance: Rational;
  readonly usualSpeed: Rational;
  readonly recoverySpeed: Rational;
  readonly finalArrivalDelay: Rational;
}

export interface TsdCp003StartTimeShiftInput {
  readonly solveMode: "startTimeShiftForSameArrival";
  readonly distance: Rational;
  readonly originalSpeed: Rational;
  readonly newSpeed: Rational;
}

export interface TsdCp003ArrivalShiftInput {
  readonly solveMode: "arrivalShiftFromDepartureAndSpeedChanges";
  readonly distance: Rational;
  readonly originalSpeed: Rational;
  readonly newSpeed: Rational;
  readonly departureShift: Rational;
}

export interface TsdCp003WalkingRidingAllocationInput {
  readonly solveMode: "walkingRidingAllocation";
  readonly totalDistance: Rational;
  readonly totalTime: Rational;
  readonly walkingSpeed: Rational;
  readonly ridingSpeed: Rational;
  readonly target: "WALKING_TIME" | "RIDING_TIME" | "WALKING_DISTANCE" | "RIDING_DISTANCE";
}

export interface TsdCp003ScheduleBufferInput {
  readonly solveMode: "scheduleBuffer";
  readonly scheduledDuration: Rational;
  readonly plannedTravelDuration: Rational;
}

export type TsdCp003SolveInput =
  | TsdCp003TimeGainLossInput
  | TsdCp003DistanceFromTimeDifferenceInput
  | TsdCp003SpeedFromTimeDifferenceInput
  | TsdCp003UsualSpeedFromEarlyLateInput
  | TsdCp003DistanceFromEarlyLateInput
  | TsdCp003ScheduledArrivalInput
  | TsdCp003RequiredRecoverySpeedInput
  | TsdCp003RequiredRemainingSpeedInput
  | TsdCp003StoppageDurationInput
  | TsdCp003OverallSpeedIncludingStopsInput
  | TsdCp003RunningSpeedFromStopsInput
  | TsdCp003NumberOfStopsInput
  | TsdCp003DelayFromStopsInput
  | TsdCp003RestTimeCycleInput
  | TsdCp003TotalTimeWithStopsInput
  | TsdCp003SpeedChangePointInput
  | TsdCp003ChangedRouteFractionInput
  | TsdCp003LostTimeDurationInput
  | TsdCp003StartTimeShiftInput
  | TsdCp003ArrivalShiftInput
  | TsdCp003WalkingRidingAllocationInput
  | TsdCp003ScheduleBufferInput;

export type TsdCp003SolvedUnit = "HOUR" | "KM" | "KMPH" | "COUNT" | "PERCENT" | "CLOCK_MINUTE";

export interface TsdCp003SolveCertificate {
  readonly solveMode: TsdCp003ExecutableSolveMode;
  readonly answer: Rational;
  readonly unit: TsdCp003SolvedUnit;
  readonly governingEquation: string;
  readonly intermediate: Readonly<Record<string, Rational>>;
}
