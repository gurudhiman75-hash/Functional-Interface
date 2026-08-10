import type { Rational } from "../foundation/rational";

export type TsdCp003ExecutableSolveMode =
  | "timeGainLossFromSpeedChange"
  | "distanceFromSpeedTimeDifference"
  | "usualSpeedFromEarlyLatePair"
  | "distanceFromEarlyLatePair"
  | "requiredRecoverySpeedAfterLostTime"
  | "requiredRemainingSpeedAfterPartialRoute"
  | "stoppageDurationFromRunningAndOverallSpeed"
  | "overallSpeedIncludingStops"
  | "runningSpeedFromOverallSpeedAndStops"
  | "numberOfStopsFromOverallDelay"
  | "delayFromRegularStops"
  | "restTimeInRepeatedTravelRestCycle"
  | "totalTimeWithRegularStops";

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

export type TsdCp003SolveInput =
  | TsdCp003TimeGainLossInput
  | TsdCp003DistanceFromTimeDifferenceInput
  | TsdCp003UsualSpeedFromEarlyLateInput
  | TsdCp003DistanceFromEarlyLateInput
  | TsdCp003RequiredRecoverySpeedInput
  | TsdCp003RequiredRemainingSpeedInput
  | TsdCp003StoppageDurationInput
  | TsdCp003OverallSpeedIncludingStopsInput
  | TsdCp003RunningSpeedFromStopsInput
  | TsdCp003NumberOfStopsInput
  | TsdCp003DelayFromStopsInput
  | TsdCp003RestTimeCycleInput
  | TsdCp003TotalTimeWithStopsInput;

export type TsdCp003SolvedUnit = "HOUR" | "KM" | "KMPH" | "COUNT";

export interface TsdCp003SolveCertificate {
  readonly solveMode: TsdCp003ExecutableSolveMode;
  readonly answer: Rational;
  readonly unit: TsdCp003SolvedUnit;
  readonly governingEquation: string;
  readonly intermediate: Readonly<Record<string, Rational>>;
}
