import type { Rational } from "../foundation/rational";

export type TsdCp003ExecutableSolveMode =
  | "timeGainLossFromSpeedChange"
  | "distanceFromSpeedTimeDifference"
  | "usualSpeedFromEarlyLatePair"
  | "distanceFromEarlyLatePair"
  | "requiredRecoverySpeedAfterLostTime"
  | "requiredRemainingSpeedAfterPartialRoute";

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

export type TsdCp003SolveInput =
  | TsdCp003TimeGainLossInput
  | TsdCp003DistanceFromTimeDifferenceInput
  | TsdCp003UsualSpeedFromEarlyLateInput
  | TsdCp003DistanceFromEarlyLateInput
  | TsdCp003RequiredRecoverySpeedInput
  | TsdCp003RequiredRemainingSpeedInput;

export type TsdCp003SolvedUnit = "HOUR" | "KM" | "KMPH";

export interface TsdCp003SolveCertificate {
  readonly solveMode: TsdCp003ExecutableSolveMode;
  readonly answer: Rational;
  readonly unit: TsdCp003SolvedUnit;
  readonly governingEquation: string;
  readonly intermediate: Readonly<Record<string, Rational>>;
}
