import type { Rational } from "../foundation/rational";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";

export type TsdCp004Difficulty = "EASY" | "MEDIUM" | "HARD";
export type TsdCp004ReviewUnit = "KMPH" | "HOUR" | "KM" | "RATIO" | "CLOCK_MINUTE";

export type TsdCp004MisconceptionId =
  | "CORRECT"
  | "USE_SUM_INSTEAD_OF_DIFFERENCE"
  | "USE_DIFFERENCE_INSTEAD_OF_SUM"
  | "USE_ONE_SPEED_ONLY"
  | "USE_AVERAGE_SPEED"
  | "MULTIPLY_INSTEAD_OF_DIVIDE"
  | "DIVIDE_INSTEAD_OF_MULTIPLY"
  | "IGNORE_INITIAL_GAP"
  | "IGNORE_HEAD_START"
  | "IGNORE_START_DELAY"
  | "TREAT_DELAY_AS_PURSUIT_TIME"
  | "REVERSE_RELATIVE_DECOMPOSITION"
  | "COPY_KNOWN_SPEED"
  | "REVERSE_MEETING_RATIO"
  | "ASSUME_MIDPOINT"
  | "USE_ROUTE_DIFFERENCE"
  | "COPY_DEPARTURE_CLOCK"
  | "SUBTRACT_MEETING_DURATION"
  | "DOUBLE_MEETING_DURATION"
  | "COPY_MEETING_CLOCK"
  | "ADD_MEETING_DURATION"
  | "USE_TARGET_RELATIVE_SPEED_AS_BODY_SPEED"
  | "REVERSE_TARGET_DECOMPOSITION";

export interface TsdCp004WrongWorking {
  readonly misconceptionId: Exclude<TsdCp004MisconceptionId, "CORRECT">;
  readonly value: Rational;
  readonly calculation: string;
  readonly diagnosis: string;
}

export interface TsdCp004OptionAudit {
  readonly text: string;
  readonly misconceptionId: TsdCp004MisconceptionId;
  readonly isCorrect: boolean;
  readonly wrongWorking: TsdCp004WrongWorking | null;
  readonly applicability: "CORRECT" | "EXACT_METHOD";
}

export interface TsdCp004GeneratedState {
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly solveMode: TsdCp004CoreSolveMode;
  readonly representation: string;
  readonly context: string;
  readonly input: TsdCp004CoreInput;
  readonly seed: string;
}

export interface TsdCp004Explanation {
  readonly method: string;
  readonly steps: readonly string[];
  readonly shortcut: string;
  readonly finalAnswer: string;
}

export interface TsdCp004GeneratedQuestion {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-004";
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly solveMode: TsdCp004CoreSolveMode;
  readonly representation: string;
  readonly context: string;
  readonly language: "en";
  readonly seed: string;
  readonly difficulty: TsdCp004Difficulty;
  readonly stem: string;
  readonly input: TsdCp004CoreInput;
  readonly solution: TsdCp004CoreSolution;
  readonly answerText: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly internalOptionAudit: readonly TsdCp004OptionAudit[];
  readonly explanation: TsdCp004Explanation;
  readonly mathematicalFingerprint: string;
  readonly validation: {
    readonly valid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
  };
  readonly lifecycle: Readonly<{
    reviewStatus: "ENGLISH_REVIEW_CANDIDATE";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

export interface TsdCp004ReviewPresentation {
  readonly questionNo: number;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly difficulty: TsdCp004Difficulty;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctOption: "A" | "B" | "C" | "D";
  readonly answer: string;
  readonly explanation: TsdCp004Explanation;
}

export interface TsdCp004EnglishReviewRow {
  readonly source: TsdCp004GeneratedQuestion;
  readonly presentation: TsdCp004ReviewPresentation;
}
