import type { Rational } from "../foundation/rational";
import type { TsdCp004AuthorityId } from "./authority";

export type TsdCp004Language = "en" | "hi" | "pa";
export type TsdCp004Representation = "PROSE" | "NUMBER_LINE" | "TIMELINE";
export type TsdCp004Difficulty = "Easy" | "Medium" | "Hard";
export type TsdCp004ActorKind = "RUNNER" | "CYCLIST" | "CAR" | "BUS" | "SCOOTER" | "DELIVERY_VAN";
export type TsdCp004DirectionCase = "OPPOSITE_TOWARD" | "SAME_DIRECTION" | "OPPOSITE_AWAY";
export type TsdCp004AnswerKind = "SPEED" | "TIME" | "DISTANCE" | "RATIO" | "ORDER";

export interface TsdCp004CanonicalState {
  readonly authorityId: TsdCp004AuthorityId;
  readonly actorKind: TsdCp004ActorKind;
  readonly representation: TsdCp004Representation;
  readonly variant: number;
  readonly directionCase: TsdCp004DirectionCase;
  readonly speedAKmph: Rational;
  readonly speedBKmph: Rational;
  readonly speedCKmph: Rational;
  readonly initialGapKm: Rational;
  readonly elapsedMinutes: Rational;
  readonly startDelayMinutes: Rational;
  readonly targetSeparationKm: Rational;
  readonly routeLengthKm: Rational;
  readonly meetingFromAKm: Rational;
  readonly deadlineMinutes: Rational;
  readonly ratioA: bigint;
  readonly ratioB: bigint;
  readonly extraGapCKm: Rational;
}

export interface TsdCp004SolveCertificate {
  readonly authorityId: TsdCp004AuthorityId;
  readonly answerKind: TsdCp004AnswerKind;
  readonly answerValue: Rational | null;
  readonly answerRatio: readonly [bigint, bigint] | null;
  readonly answerOrder: string | null;
  readonly answerText: string;
  readonly decisiveEquation: string;
  readonly eventTimeMinutes: Rational | null;
  readonly eventPositionFromAKm: Rational | null;
  readonly mathematicalFingerprint: string;
}

export type TsdCp004MisconceptionId =
  | "CORRECT"
  | "ADD_INSTEAD_OF_SUBTRACT_RELATIVE_SPEED"
  | "SUBTRACT_INSTEAD_OF_ADD_RELATIVE_SPEED"
  | "USE_ONE_BODY_SPEED"
  | "IGNORE_INITIAL_GAP"
  | "DOUBLE_CLOSING_TIME"
  | "HALVE_CLOSING_TIME"
  | "USE_SUM_FOR_PURSUIT"
  | "USE_DIFFERENCE_FOR_OPPOSITE"
  | "IGNORE_START_DELAY"
  | "TREAT_DELAY_AS_CHASE_TIME"
  | "USE_TOTAL_SPEED_AS_DISTANCE_SHARE"
  | "REVERSE_MEETING_DISTANCE_SHARE"
  | "REVERSE_SPEED_RATIO"
  | "USE_ARITHMETIC_MEAN_SPEED"
  | "IGNORE_TARGET_SEPARATION"
  | "ADD_TARGET_SEPARATION_WRONG_WAY"
  | "USE_TARGET_SPEED_AS_REQUIRED_SPEED"
  | "COMPARE_SPEEDS_INSTEAD_OF_CATCH_TIMES";

export interface TsdCp004OptionAudit {
  readonly text: string;
  readonly misconceptionId: TsdCp004MisconceptionId;
  readonly isCorrect: boolean;
}

export interface TsdCp004Explanation {
  readonly method: string;
  readonly steps: readonly string[];
  readonly shortcut: string;
  readonly answer: string;
}

export interface TsdCp004Visual {
  readonly kind: "NUMBER_LINE" | "TIMELINE";
  readonly svg: string;
  readonly alt: string;
}

export interface TsdCp004Question {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-004";
  readonly authorityId: TsdCp004AuthorityId;
  readonly candidateQlId: string;
  readonly permanentQlId: null;
  readonly language: TsdCp004Language;
  readonly seed: string;
  readonly difficulty: TsdCp004Difficulty;
  readonly state: TsdCp004CanonicalState;
  readonly stem: string;
  readonly visual: TsdCp004Visual | null;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly optionAudit: readonly TsdCp004OptionAudit[];
  readonly solution: TsdCp004SolveCertificate;
  readonly explanation: TsdCp004Explanation;
  readonly reviewStatus: "CP004_REVIEW_CANDIDATE";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}
