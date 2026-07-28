export type AlpLocale = "en-IN" | "hi-IN" | "pa-IN";
export type AlpCheckpointId =
  | "ALP-CP-001"
  | "ALP-CP-002"
  | "ALP-CP-003"
  | "ALP-CP-004"
  | "ALP-CP-005";
export type AlpDifficulty = "EASY" | "MEDIUM" | "HARD";
export type AlpRenderer = "TEXT" | "STRUCTURED_TEXT" | "TOKEN_ROW" | "POSITION_TRACK";
export type AlpAnswerType = "LETTER" | "NUMBER" | "NUMBER_PAIR" | "LETTER_PAIR" | "PAIR_SELECTION" | "DIRECTION_OFFSET" | "LETTER_SET";
export type AlpStatus = "IMPLEMENTED" | "REVIEWED" | "FROZEN";

export type AlpSolveMode =
  | "LETTER_AT_LEFT_RANK"
  | "LETTER_AT_RIGHT_RANK"
  | "LEFT_RANK_OF_LETTER"
  | "RIGHT_RANK_OF_LETTER"
  | "RIGHT_RANK_FROM_LEFT_RANK"
  | "LEFT_RANK_FROM_RIGHT_RANK"
  | "OPPOSITE_OF_LETTER"
  | "OPPOSITE_OF_LEFT_RANK"
  | "OPPOSITE_OF_RIGHT_RANK"
  | "LEFT_RANK_OF_OPPOSITE"
  | "BOTH_RANKS_OF_LETTER"
  | "IDENTIFY_LETTER_FROM_RANK_PAIR"
  | "IDENTIFY_OPPOSITE_PAIR"
  | "SHIFT_RIGHT_FROM_LETTER_BOUNDED"
  | "SHIFT_LEFT_FROM_LETTER_BOUNDED"
  | "SHIFT_RIGHT_FROM_LEFT_RANK"
  | "SHIFT_LEFT_FROM_LEFT_RANK"
  | "SHIFT_RIGHT_FROM_RIGHT_RANK"
  | "SHIFT_LEFT_FROM_RIGHT_RANK"
  | "RECOVER_ANCHOR_FROM_RIGHT_SHIFT"
  | "RECOVER_ANCHOR_FROM_LEFT_SHIFT"
  | "FIND_FORWARD_OFFSET"
  | "FIND_BACKWARD_OFFSET"
  | "FIND_SIGNED_DIRECTION_AND_OFFSET"
  | "TWO_STAGE_RIGHT_THEN_LEFT"
  | "TWO_STAGE_LEFT_THEN_RIGHT"
  | "POSITION_AFTER_SHIFT_FROM_LEFT"
  | "POSITION_AFTER_SHIFT_FROM_RIGHT"
  | "CYCLIC_SHIFT_RIGHT_FROM_LETTER"
  | "CYCLIC_SHIFT_LEFT_FROM_LETTER"
  | "RECOVER_ANCHOR_CYCLIC"
  | "EXCLUSIVE_GAP"
  | "INCLUSIVE_SPAN"
  | "ABSOLUTE_POSITION_DISTANCE"
  | "MIDPOINT_SINGLE"
  | "MIDPOINT_PAIR"
  | "IDENTIFY_PAIR_WITH_GAP"
  | "IDENTIFY_PAIR_WITH_DISTANCE"
  | "RECOVER_RIGHT_ENDPOINT_FROM_GAP"
  | "RECOVER_LEFT_ENDPOINT_FROM_GAP"
  | "RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION"
  | "MIDPOINT_DISTANCE_FROM_ENDPOINTS"
  | "RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE"
  | "COMPARE_TWO_GAPS"
  | "COUNT_LETTERS_OUTSIDE_INTERVAL"
  | "COUNT_LETTERS_BEFORE_AND_AFTER"
  | "EQUAL_SIDE_GAP"
  | "LETTER_AT_TRANSFORMED_POSITION"
  | "TRANSFORMED_POSITION_OF_LETTER"
  | "WORD_LETTER_FROM_LEFT"
  | "WORD_LETTER_FROM_RIGHT"
  | "WORD_LEFT_POSITION_OF_LETTER"
  | "WORD_RIGHT_POSITION_OF_LETTER"
  | "WORD_RELATIVE_RIGHT"
  | "WORD_RELATIVE_LEFT"
  | "WORD_MIDDLE_SINGLE"
  | "WORD_MIDDLE_PAIR"
  | "WORD_AFTER_REVERSE_POSITION"
  | "WORD_POSITION_AFTER_REVERSE"
  | "WORD_AFTER_ASC_SORT_POSITION"
  | "WORD_POSITION_AFTER_ASC_SORT"
  | "WORD_AFTER_DESC_SORT_POSITION"
  | "WORD_POSITION_AFTER_DESC_SORT"
  | "WORD_COUNT_UNCHANGED_ASC"
  | "WORD_IDENTIFY_UNCHANGED_ASC"
  | "WORD_COUNT_UNCHANGED_DESC"
  | "WORD_VOWELS_FIRST_POSITION"
  | "WORD_POSITION_AFTER_VOWELS_FIRST"
  | "WORD_CONSONANTS_FIRST_POSITION"
  | "WORD_POSITION_AFTER_CONSONANTS_FIRST"
  | "WORD_ODD_THEN_EVEN_POSITION"
  | "WORD_POSITION_AFTER_ODD_THEN_EVEN"
  | "WORD_EVEN_THEN_ODD_POSITION"
  | "WORD_POSITION_AFTER_EVEN_THEN_ODD"
  | "WORD_SWAP_ADJACENT_POSITION"
  | "WORD_POSITION_AFTER_SWAP_ADJACENT"
  | "WORD_REVERSE_RANGE_POSITION"
  | "WORD_POSITION_AFTER_REVERSE_RANGE"
  | "WORD_COUNT_UNCHANGED_SELECTED_TRANSFORM";

export type AlpTransformId =
  | "REVERSE_ALL"
  | "REVERSE_FIRST_HALF"
  | "REVERSE_SECOND_HALF"
  | "REVERSE_BOTH_HALVES"
  | "SWAP_HALVES"
  | "ROTATE_TO_START"
  | "ODD_THEN_EVEN"
  | "EVEN_THEN_ODD"
  | "ALTERNATE_LEFT_RIGHT"
  | "ALTERNATE_RIGHT_LEFT"
  | "REMOVE_VOWELS"
  | "REMOVE_CONSONANTS"
  | "SWAP_ADJACENT_PAIRS"
  | "REVERSE_BLOCKS_OF_THREE";

export type AlpWordTransformId =
  | "REVERSE"
  | "ASC_SORT"
  | "DESC_SORT"
  | "VOWELS_FIRST"
  | "CONSONANTS_FIRST"
  | "ODD_THEN_EVEN"
  | "EVEN_THEN_ODD"
  | "SWAP_ADJACENT"
  | "REVERSE_RANGE";

export interface AlpQuestionLogic {
  readonly qlId: string;
  readonly checkpointId: AlpCheckpointId;
  readonly ruleId: string;
  readonly taskKind: string;
  readonly solveMode: AlpSolveMode;
  readonly presentationMode: string;
  readonly answerType: AlpAnswerType;
  readonly renderer: AlpRenderer;
  readonly localeMode: "TRANSLATABLE";
  readonly difficultyProfile: string;
  readonly status: AlpStatus;
  readonly transformId?: AlpTransformId;
}

export interface AlpOccurrenceRef {
  readonly letter: string;
  readonly occurrence: number;
}

export interface AlpInstanceData {
  readonly sequence?: readonly string[];
  readonly transformedSequence?: readonly string[];
  readonly rank?: number;
  readonly secondRank?: number;
  readonly letter?: string;
  readonly secondLetter?: string;
  readonly targetLetter?: string;
  readonly offset?: number;
  readonly secondOffset?: number;
  readonly direction?: "LEFT" | "RIGHT";
  readonly pairOptions?: readonly (readonly [string, string])[];
  readonly pairA?: readonly [string, string];
  readonly pairB?: readonly [string, string];
  readonly midpoint?: string;
  readonly transformId?: AlpTransformId;
  readonly rotationStart?: string;
  readonly word?: string;
  readonly transformedWord?: string;
  readonly wordTransformId?: AlpWordTransformId;
  readonly position?: number;
  readonly rangeStart?: number;
  readonly rangeEnd?: number;
  readonly occurrenceRef?: AlpOccurrenceRef;
  readonly selectedTransformLabel?: string;
}

export interface AlpSolverResult {
  readonly answer: string;
  readonly canonicalValue: string | number;
  readonly trace: readonly string[];
  readonly workingSequence?: readonly string[];
}

export interface AlpOption {
  readonly value: string;
  readonly errorLabel: string | null;
}

export interface AlpDistractorAnalysis {
  readonly optionIndex: number;
  readonly optionValue: string;
  readonly errorLabel: string;
  readonly explanation: string;
}

export interface AlpExplanation {
  readonly schemaVersion: "ALP-001-PEDAGOGY-V2";
  readonly coreConcept: string;
  readonly ruleStatement: string;
  readonly steps: readonly string[];
  readonly visualWorking: readonly string[];
  readonly examShortcut: string;
  readonly conclusion: string;
  readonly distractorAnalyses: readonly AlpDistractorAnalysis[];
  readonly closestTrapRejection: string;
}

export interface GeneratedAlpQuestion {
  readonly chapterId: "ALP-001";
  readonly qlId: string;
  readonly checkpointId: AlpCheckpointId;
  readonly ruleId: string;
  readonly solveMode: AlpSolveMode;
  readonly locale: AlpLocale;
  readonly seed: number;
  readonly difficulty: AlpDifficulty;
  readonly renderer: AlpRenderer;
  readonly presentationMode: string;
  readonly stem: string;
  readonly structuredPrompt: {
    readonly sequence?: readonly string[];
    readonly transformedSequence?: readonly string[];
    readonly word?: string;
    readonly transformedWord?: string;
    readonly positionTrack?: readonly { token: string; position: number; reversePosition: number }[];
  };
  readonly options: readonly AlpOption[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: AlpExplanation;
  readonly metadata: {
    readonly runtimeVersion: "ALP-001-RUNTIME-V2";
    readonly localeMode: "TRANSLATABLE";
    readonly independentSolverVerified: true;
    readonly ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE";
    readonly transformId?: AlpTransformId;
    readonly wordTransformId?: AlpWordTransformId;
    readonly occurrenceAware: boolean;
  };
}
