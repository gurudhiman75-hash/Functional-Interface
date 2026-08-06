import type {
  SapCp002PermanentEnglishPackage,
  SapCp002PermanentQlId,
} from "../permanent-runtime/runtime";

export type SapCp002V2Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SapCp002V2AnswerContract =
  | "SIMPLIFIED_RATIONAL"
  | "MISSING_INTEGER"
  | "MISSING_RATIONAL"
  | "COMPARISON_STATEMENT"
  | "LOWEST_TERM_SELECTION"
  | "FIRST_ERROR_SELECTION";

export type SapCp002V2SolveModeSubtype =
  | "FRACTION_SUM_DIFFERENCE"
  | "FRACTION_PRODUCT_COMPLETE_REDUCTION"
  | "FRACTION_DIVISION_RECIPROCAL"
  | "INTEGER_WITH_GROUPED_FRACTION_OPERATION"
  | "MIXED_NUMBER_CONVERSION"
  | "SCOPED_FRACTION_OF_GROUP"
  | "COMPLETE_BLOCK_COMPLEX_FRACTION"
  | "SIGNED_FRACTION_BRACKET_SCOPE"
  | "SUM_DIFFERENCE_IDENTITY"
  | "RECIPROCAL_OF_COMPLETE_GROUP"
  | "FRACTION_COMPLEMENT"
  | "BOUNDED_CONTINUED_FRACTION"
  | "MISSING_NUMERATOR"
  | "MISSING_DENOMINATOR"
  | "MISSING_FRACTION_OPERAND"
  | "EXACT_FRACTION_COMPARISON"
  | "VALUE_AND_LOWEST_TERM_FORM"
  | "FIRST_INVALID_TRANSFORMATION";

export interface SapCp002V2Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
  readonly numericEquivalenceToCorrect: boolean;
  readonly satisfiesRequiredForm: boolean;
}

export interface SapCp002V2Explanation {
  readonly answerContract: SapCp002V2AnswerContract;
  readonly methodId: string;
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface SapCp002V2Validation {
  readonly ok: boolean;
  readonly errors: readonly string[];
  readonly sentenceHashes: readonly string[];
  readonly numericEquivalentOptionCount: number;
  readonly fullConditionCorrectOptionCount: number;
  readonly explanationWordCount: number;
}

export interface SapCp002ExamReadinessV2Package extends Omit<
  SapCp002PermanentEnglishPackage,
  | "difficulty"
  | "stem"
  | "canonicalAnswer"
  | "verifierAnswer"
  | "options"
  | "correctIndex"
  | "explanation"
  | "editorialStatus"
  | "reviewDecision"
  | "lifecycle"
> {
  readonly permanentQlId: SapCp002PermanentQlId;
  readonly difficulty: SapCp002V2Difficulty;
  readonly difficultyScore: number;
  readonly difficultyEvidence: readonly string[];
  readonly solveModeLabel: string;
  readonly solveModeSubtype: SapCp002V2SolveModeSubtype;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly options: readonly SapCp002V2Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp002V2Explanation;
  readonly editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V2";
  readonly reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING";
  readonly humanReviewStatus: "PENDING";
  readonly reviewVersion: "SAP_CP002_EXAM_READINESS_V2";
  readonly payloadFingerprint: string;
  readonly validation: SapCp002V2Validation;
  readonly lifecycle: {
    readonly permanentQlId: SapCp002PermanentQlId;
    readonly identityStatus: "PERMANENT_ID_RETAINED";
    readonly contentStatus: "EDITORIALLY_UNFROZEN_V2_HUMAN_REVIEW_PENDING";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp002ReviewRecord {
  readonly questionId: string;
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-002";
  readonly permanentQlId: SapCp002PermanentQlId;
  readonly solveModeLabel: string;
  readonly solveModeSubtype: SapCp002V2SolveModeSubtype;
  readonly taskDirection: string;
  readonly difficulty: SapCp002V2Difficulty;
  readonly difficultyScore: number;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly SapCp002V2Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly explanation: SapCp002V2Explanation;
  readonly validation: SapCp002V2Validation;
  readonly humanReviewStatus: "PENDING";
  readonly reviewerNotes: "";
  readonly payloadFingerprint: string;
}
