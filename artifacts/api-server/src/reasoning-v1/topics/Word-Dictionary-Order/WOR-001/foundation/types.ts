export type WorLocale = "en-IN" | "hi-IN" | "pa-IN";
export type WorDifficulty = "EASY" | "MEDIUM" | "HARD";
export type WorCheckpointId = "WOR-CP-001" | "WOR-CP-002" | "WOR-CP-003" | "WOR-CP-004";
export type WorSortDirection = "ASCENDING" | "DESCENDING";

export type WorTaskKind =
  | "SELECT_COMPLETE_ORDER"
  | "SELECT_DESCENDING_ORDER"
  | "SELECT_FIRST"
  | "SELECT_LAST"
  | "SELECT_KTH"
  | "FIND_RANK"
  | "SELECT_PREDECESSOR"
  | "SELECT_SUCCESSOR"
  | "SELECT_MIDDLE"
  | "INSERT_WORD"
  | "RANK_AFTER_INSERTION"
  | "PREDECESSOR_AFTER_INSERTION"
  | "FIND_MISPLACED_WORD"
  | "FIND_INCORRECT_PAIR"
  | "COMPLETE_PARTIAL_ORDER";

export type WorAnswerType = "WORD" | "WORD_SEQUENCE" | "RANK" | "WORD_PAIR";
export type WorAllocationDecision = "RETAIN" | "MERGE_AS_INSTANCE_VARIANT";
export type WorSourceEvidenceStatus = "PYQ_SUPPORTED" | "PLATFORM_SUPPORTED" | "EXPLORATORY_SOURCE_GAP";

export interface WorPrototypeContract {
  readonly prototypeId: string;
  readonly checkpointId: WorCheckpointId;
  readonly taskKind: WorTaskKind;
  readonly answerType: WorAnswerType;
  readonly title: string;
  readonly allocationDecision: WorAllocationDecision;
  readonly sourceEvidenceStatus: WorSourceEvidenceStatus;
  readonly hardOnly?: boolean;
}

export interface WorWordRecord {
  readonly id: string;
  readonly word: string;
  readonly normalized: string;
  readonly familiarity: "COMMON" | "STANDARD" | "ADVANCED_SAFE";
  readonly morphologyTags: readonly string[];
  readonly prefixKeys: readonly string[];
  readonly containsRepeatedLetters: boolean;
  readonly editorialStatus: "PROVISIONAL_REVIEW" | "APPROVED";
}

export interface WorWordFamily {
  readonly id: string;
  readonly tier: WorDifficulty;
  readonly words: readonly WorWordRecord[];
}

export interface LexicalComparisonTrace {
  readonly left: string;
  readonly right: string;
  readonly commonPrefix: string;
  readonly commonPrefixLength: number;
  readonly decision: "FIRST_DIFFERING_CHARACTER" | "LEFT_IS_PREFIX" | "RIGHT_IS_PREFIX";
  readonly leftDecisionChar?: string;
  readonly rightDecisionChar?: string;
  readonly leftAlphabetPosition?: number;
  readonly rightAlphabetPosition?: number;
  readonly winner: "LEFT_FIRST" | "RIGHT_FIRST";
}

export interface WorDifficultyFeatures {
  readonly wordCount: number;
  readonly commonPrefixDepthMax: number;
  readonly commonPrefixDepthMean: number;
  readonly lateDecisionCount: number;
  readonly prefixContainmentCount: number;
  readonly reverseDirection: boolean;
  readonly taskInferenceBurden: number;
  readonly score: number;
}

export interface WorQuestionState {
  readonly prototypeId: string;
  readonly checkpointId: WorCheckpointId;
  readonly taskKind: WorTaskKind;
  readonly words: readonly string[];
  readonly sortDirection: WorSortDirection;
  readonly canonicalAscendingOrder: readonly string[];
  readonly requestedOrder: readonly string[];
  readonly targetWord?: string;
  readonly insertionWord?: string;
  readonly queryRank?: number;
  readonly presentedSequence?: readonly string[];
  readonly partialSequence?: readonly string[];
  readonly comparisonTrace: readonly LexicalComparisonTrace[];
  readonly correctAnswer: string;
  readonly difficulty: WorDifficulty;
  readonly difficultyFeatures: WorDifficultyFeatures;
  readonly sourceFamilyId: string;
}

export interface WorOption {
  readonly value: string;
  readonly misconceptionId: string | null;
}

export interface GeneratedWorQuestion {
  readonly chapterId: "WOR-001";
  readonly checkpointId: WorCheckpointId;
  readonly prototypeId: string;
  readonly permanentQlId: null;
  readonly lifecycleStatus: "REVIEW_ONLY";
  readonly questionStudioVisible: false;
  readonly locale: WorLocale;
  readonly seed: number;
  readonly difficulty: WorDifficulty;
  readonly renderer: "STRUCTURED_TEXT";
  readonly taskKind: WorTaskKind;
  readonly stem: string;
  readonly structuredPrompt: {
    readonly words: readonly string[];
    readonly insertionWord?: string;
    readonly presentedSequence?: readonly string[];
    readonly partialSequence?: readonly string[];
  };
  readonly options: readonly WorOption[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly metadata: {
    readonly runtimeVersion: "WOR-001-RUNTIME-V1";
    readonly localeMode: "TRANSLATABLE";
    readonly sortDirection: WorSortDirection;
    readonly wordCount: number;
    readonly sourceFamilyId: string;
    readonly independentSolverVerified: true;
    readonly ambiguityAudit: "LEXICALLY_UNIQUE";
    readonly difficultyFeatures: WorDifficultyFeatures;
    readonly canonicalOrder: readonly string[];
    readonly comparisonTrace: readonly LexicalComparisonTrace[];
    readonly allocationDecision: WorAllocationDecision;
    readonly sourceEvidenceStatus: WorSourceEvidenceStatus;
  };
}
