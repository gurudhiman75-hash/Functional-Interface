import type { Rational } from "../foundation/rational";
import type { TsdCp006SolveMode } from "./discovery-registry";

export type TsdCp006Direction = 1 | -1;
export type TsdCp006AnswerKind = "VALUE" | "COUNT" | "LIST" | "PAIR" | "BOOLEAN" | "CLASSIFICATION" | "DATA_SUFFICIENCY";
export type TsdCp006Unit = "HOUR" | "KM" | "KM_PER_HOUR" | "LAP" | "COUNT" | "RATIO" | "NONE";
export type TsdCp006StateClassification = "UNIQUE" | "MULTIPLE" | "IMPOSSIBLE";
export type TsdCp006DataSufficiency = "STATEMENT_1_ONLY" | "STATEMENT_2_ONLY" | "BOTH_TOGETHER" | "EITHER_ALONE" | "NOT_SUFFICIENT";
export type TsdCp006DsFact = "TRACK_LENGTH" | "SPEED_A" | "SPEED_B" | "DIRECTIONS" | "MEETING_TIME";

export interface TsdCp006CheckpointObservation {
  readonly time: Rational;
  readonly positionA: Rational;
}

export interface TsdCp006Input {
  readonly trackLength?: Rational;
  readonly speedA?: Rational;
  readonly speedB?: Rational;
  readonly speedC?: Rational;
  readonly speedRatio?: Rational;
  readonly directionA?: TsdCp006Direction;
  readonly directionB?: TsdCp006Direction;
  readonly directionC?: TsdCp006Direction;
  readonly startPositionA?: Rational;
  readonly startPositionB?: Rational;
  readonly startPositionC?: Rational;
  readonly startDelayA?: Rational;
  readonly startDelayB?: Rational;
  readonly initialArcGap?: Rational;
  readonly timeWindow?: Rational;
  readonly nthEvent?: number;
  readonly meetingPoint?: Rational;
  readonly observedMeetingTime?: Rational;
  readonly observedMeetingCount?: number;
  readonly reversalTimeA?: Rational;
  readonly lapRestA?: Rational;
  readonly checkpointObservations?: readonly TsdCp006CheckpointObservation[];
  readonly claimedValue?: Rational;
  readonly claimedCount?: number;
  readonly dsStatement1?: readonly TsdCp006DsFact[];
  readonly dsStatement2?: readonly TsdCp006DsFact[];
}

export interface TsdCp006Solution {
  readonly checkpointId: "TSD-CP-006";
  readonly solveMode: TsdCp006SolveMode;
  readonly answerKind: TsdCp006AnswerKind;
  readonly unit: TsdCp006Unit;
  readonly value?: Rational;
  readonly count?: number;
  readonly values?: readonly Rational[];
  readonly booleanValue?: boolean;
  readonly classification?: TsdCp006StateClassification;
  readonly dataSufficiency?: TsdCp006DataSufficiency;
  readonly evidence: readonly string[];
}

export interface TsdCp006Verification {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface TsdCp006GeneratedCase {
  readonly checkpointId: "TSD-CP-006";
  readonly solveMode: TsdCp006SolveMode;
  readonly seed: string;
  readonly input: TsdCp006Input;
  readonly solution: TsdCp006Solution;
  readonly verification: TsdCp006Verification;
  readonly lifecycle: Readonly<{
    discoveryStatus: "EXECUTABLE_DISCOVERY";
    permanentQlAllocated: false;
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}
