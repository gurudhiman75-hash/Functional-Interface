import type { TsdEditorialDifficulty, TsdEditorialLifecycle } from "../editorial-contract";
import type { Rational } from "../foundation/rational";
import type { TsdCp003DiscoveryAuthority } from "./discovery-registry";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

export type TsdCp003MisconceptionId =
  | "CORRECT"
  | "ADD_TRAVEL_TIMES"
  | "USE_ONE_TRAVEL_TIME"
  | "TREAT_SPEED_DIFFERENCE_AS_SPEED"
  | "MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE"
  | "USE_SLOWER_SPEED_ONLY"
  | "USE_FASTER_SPEED_ONLY"
  | "TREAT_TIME_GAP_AS_TOTAL_TIME"
  | "IGNORE_RECIPROCAL_RELATION"
  | "USE_ARITHMETIC_MEAN_SPEED"
  | "USE_HARMONIC_MEAN_SPEED"
  | "USE_EARLY_LATE_GAP_AS_TOTAL_TIME"
  | "IGNORE_EARLY_COMPONENT"
  | "IGNORE_LATE_COMPONENT"
  | "TREAT_HOURS_AS_MINUTES"
  | "ADD_DISTANCE_TO_CLOCK"
  | "ADD_SPEED_TO_CLOCK"
  | "ADD_INSTEAD_OF_DIVIDE"
  | "MULTIPLY_INSTEAD_OF_DIVIDE"
  | "REVERSE_DIVISION"
  | "USE_OVERALL_AVERAGE_SPEED"
  | "IGNORE_TIME_ALREADY_SPENT"
  | "CONTINUE_AT_INITIAL_SPEED"
  | "USE_TOTAL_TIME_AS_STOPPAGE"
  | "USE_RUNNING_TIME_AS_STOPPAGE"
  | "ADD_RUNNING_AND_TOTAL_TIME"
  | "IGNORE_STOPS"
  | "USE_STOP_TIME_AS_TOTAL_TIME"
  | "SUBTRACT_STOP_TIME_FROM_RUNNING_TIME"
  | "USE_OVERALL_SPEED_AS_RUNNING_SPEED"
  | "ADD_STOP_TIME_TO_TOTAL_TIME"
  | "USE_DELAY_MINUTES_AS_COUNT"
  | "USE_STOP_MINUTES_AS_COUNT"
  | "MULTIPLY_STOP_MINUTES"
  | "COUNT_ONLY_ONE_STOP"
  | "EXTRA_SIXTY_DIVISION"
  | "EXTRA_SIXTY_MULTIPLICATION"
  | "DIVIDE_REST_BY_CYCLES"
  | "IGNORE_TRAVEL_TIME"
  | "AVERAGE_FULL_CYCLE"
  | "COUNT_ONE_STOP_ONLY"
  | "TREAT_STOP_COUNT_AS_HOURS"
  | "HALVE_ROUTE_BY_DEFAULT"
  | "USE_FIRST_SPEED_FOR_WHOLE_TIME"
  | "USE_SECOND_SPEED_FOR_WHOLE_TIME"
  | "USE_COMPLEMENT_ROUTE_FRACTION"
  | "USE_SPEED_CHANGE_PERCENT"
  | "USE_SPEED_RATIO_AS_PERCENT"
  | "IGNORE_FINAL_DELAY"
  | "USE_FINAL_DELAY_ONLY"
  | "SUBTRACT_FINAL_DELAY"
  | "USE_OLD_TRAVEL_TIME"
  | "USE_NEW_TRAVEL_TIME"
  | "ADD_TRAVEL_TIMES_FOR_SHIFT"
  | "IGNORE_DEPARTURE_SHIFT"
  | "IGNORE_SPEED_SHIFT"
  | "SUBTRACT_SHIFT_COMPONENTS"
  | "USE_OTHER_MODE_COMPONENT"
  | "USE_TOTAL_QUANTITY"
  | "ASSUME_WHOLE_ROUTE_IN_TARGET_MODE"
  | "USE_SCHEDULED_DURATION"
  | "USE_PLANNED_DURATION"
  | "ADD_SCHEDULE_DURATIONS";

export interface TsdCp003WrongWorking {
  readonly misconceptionId: Exclude<TsdCp003MisconceptionId, "CORRECT">;
  readonly value: Rational;
  readonly calculation: string;
  readonly diagnosis: string;
}

export interface TsdCp003OptionAudit {
  readonly text: string;
  readonly misconceptionId: TsdCp003MisconceptionId;
  readonly isCorrect: boolean;
  readonly wrongWorking: TsdCp003WrongWorking | null;
  readonly applicability: "EXACT_METHOD" | "CORRECT";
}

export interface TsdCp003OptionAnalysis {
  readonly option: "A" | "B" | "C" | "D";
  readonly text: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: TsdCp003MisconceptionId;
  readonly reason: string;
}

export interface TsdCp003Explanation {
  readonly keyRule: string;
  readonly stepByStepSolution: readonly string[];
  readonly examSpeedShortcut: string;
  readonly optionAnalysis: readonly TsdCp003OptionAnalysis[];
  readonly conclusion: string;
}

export interface TsdCp003GeneratedState {
  readonly input: TsdCp003SolveInput;
  readonly representation: string;
  readonly context: string;
  readonly stemVariant: number;
}

export interface TsdCp003GeneratedQuestion {
  readonly chapterId: "TSD-001";
  readonly checkpointId: "TSD-CP-003";
  readonly archetypeId: "TSD-001";
  readonly canonicalProblemId: "TSD-CP-003";
  readonly provisionalAuthorityId: TsdCp003DiscoveryAuthority["provisionalId"];
  readonly permanentQlId: null;
  readonly questionLanguageId: string;
  readonly solveMode: string;
  readonly representation: string;
  readonly language: "en";
  readonly seed: string;
  readonly difficulty: TsdEditorialDifficulty;
  readonly stem: string;
  readonly input: TsdCp003SolveInput;
  readonly solution: TsdCp003SolveCertificate;
  readonly answerText: string;
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp003OptionAudit[];
  readonly correctIndex: number;
  readonly explanation: TsdCp003Explanation;
  readonly mathematicalFingerprint: string;
  readonly lifecycle: TsdEditorialLifecycle;
  readonly validation: {
    readonly valid: boolean;
    readonly errors: readonly string[];
    readonly warnings: readonly string[];
  };
  readonly publiclyPublishable: false;
}
