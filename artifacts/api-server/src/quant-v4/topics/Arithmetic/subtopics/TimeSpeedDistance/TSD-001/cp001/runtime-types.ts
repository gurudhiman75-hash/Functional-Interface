import type { TsdEditorialDifficulty, TsdEditorialLifecycle } from "../editorial-contract";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority, TsdCp001DiscoverySolveMode } from "./discovery-registry";

export type TsdCp001Difficulty = TsdEditorialDifficulty;
export type TsdCp001MisconceptionId =
  | "CORRECT"
  | "MULTIPLY_INSTEAD_OF_DIVIDE"
  | "DIVIDE_INSTEAD_OF_MULTIPLY"
  | "ADD_INSTEAD_OF_MULTIPLY"
  | "ADD_GIVENS_BEFORE_DIVIDING"
  | "SUBTRACT_GIVENS_BEFORE_DIVIDING"
  | "REVERSE_DIVISION"
  | "TREAT_SECONDS_AS_MINUTES"
  | "INVERT_REQUIRED_RATIO"
  | "OMIT_UNIT_CONVERSION"
  | "REVERSE_UNIT_CONVERSION"
  | "USE_WRONG_CONVERSION_FACTOR"
  | "IGNORE_CLOCK_ROLLOVER"
  | "IGNORE_MINUTE_COMPONENTS"
  | "ADD_WHEN_SUBTRACTION_IS_REQUIRED"
  | "SUBTRACT_WHEN_ADDITION_IS_REQUIRED"
  | "USE_GIVEN_DURATION_AS_ANSWER"
  | "COPY_GIVEN_CLOCK_TIME"
  | "USE_FIRST_QUANTITY_ONLY"
  | "USE_SECOND_QUANTITY_ONLY"
  | "IGNORE_SPEED_CHANGE"
  | "IGNORE_TIME_CHANGE"
  | "IGNORE_DISTANCE_CHANGE"
  | "USE_DIRECT_SPEED_FACTOR"
  | "USE_DIRECT_TIME_FACTOR"
  | "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"
  | "USE_SUM_INSTEAD_OF_RATIO"
  | "USE_DIFFERENCE_INSTEAD_OF_RATIO"
  | "FAIL_TO_INVERT_PACE"
  | "MULTIPLY_PACE_AND_TIME"
  | "IGNORE_MINUTE_CONVERSION"
  | "USE_MINUTES_AS_HOURS"
  | "ADD_ONE_HOUR_TO_INTERVAL"
  | "DROP_ONE_HOUR_FROM_INTERVAL"
  | "MIX_UNCONVERTED_UNITS"
  | "CONVERT_ONLY_ONE_UNIT"
  | "APPLY_SIXTY_IN_WRONG_DIRECTION"
  | "DOUBLE_COUNT_A_FACTOR"
  | "HALVE_A_REQUIRED_FACTOR"
  | "ARITHMETIC_OFFSET"
  | "MISREAD_SPEED"
  | "MISREAD_TIME"
  | "MISREAD_DISTANCE"
  | "DIVISION_ERROR"
  | "CLASSIFY_FROM_NUMBER_OF_GIVENS_ONLY"
  | "IGNORE_INCONSISTENT_IDENTITY"
  | "ASSUME_CLAIM_WITHOUT_CHECKING";

export type TsdCp001Lifecycle = TsdEditorialLifecycle;

export interface TsdCp001OptionAudit {
  readonly text: string;
  readonly misconceptionId: TsdCp001MisconceptionId;
  readonly isCorrect: boolean;
}

export interface TsdCp001OptionAnalysis {
  readonly option: "A" | "B" | "C" | "D";
  readonly text: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: TsdCp001MisconceptionId;
  readonly reason: string;
}

export interface TsdCp001Explanation {
  /** Canonical production-facing four-tier explanation fields. */
  readonly keyRule: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly TsdCp001OptionAnalysis[];

  /** Backward-compatible compact fields retained during migration. */
  readonly concept: string;
  readonly givens: readonly string[];
  readonly working: readonly string[];
  readonly shortcut: string;
  readonly trap: string;
  readonly conclusion: string;
}

export interface TsdCp001GeneratedQuestion {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-001";
  readonly archetypeId: "TSD-001";
  readonly canonicalProblemId: "TSD-CP-001";
  readonly provisionalAuthorityId: TsdCp001DiscoveryAuthority["provisionalId"];
  readonly questionLanguageId: string;
  readonly solveMode: TsdCp001DiscoverySolveMode;
  readonly representation: string;
  readonly language: "en";
  readonly seed: string;
  readonly difficulty: TsdCp001Difficulty;
  readonly stem: string;
  readonly stemMathJax: string;
  readonly input: TsdCp001SolveInput;
  readonly solution: TsdCp001Solution;
  readonly answerText: string;
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
  readonly explanation: TsdCp001Explanation;
  readonly mathematicalFingerprint: string;
  readonly lifecycle: TsdCp001Lifecycle;
  readonly validation: {
    readonly valid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
  };
  readonly publiclyPublishable: false;
}

export interface DisplayContract {
  readonly unit?: string;
  readonly ratioLabels?: readonly [string, string];
  readonly formula: string;
  readonly givens: readonly string[];
  readonly shortcut: string;
}

export interface GeneratedState {
  readonly input: TsdCp001SolveInput;
  readonly stem: string;
  readonly display: DisplayContract;
}
