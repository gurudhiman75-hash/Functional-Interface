import type {
  SapCp002ExamReadinessV3Package,
  SapCp002V3Explanation,
  SapCp002V3Option,
  SapCp002V3ReviewRecord,
  SapCp002V3Validation,
} from "../exam-readiness-v3/types";

export interface SapCp002V4Option extends SapCp002V3Option {}

export interface SapCp002V4Explanation extends SapCp002V3Explanation {
  readonly methodId: string;
  readonly solutionComplete: true;
  readonly finalWorkingValue: string;
  readonly substitutionVerified: boolean;
}

export interface SapCp002V4Validation extends SapCp002V3Validation {
  readonly noFallbackPassed: boolean;
  readonly finalWorkingMatchesAnswer: boolean;
  readonly surfaceSyntaxPassed: boolean;
  readonly symbolNormalizationPassed: boolean;
  readonly ql032FormTrapPassed: boolean;
  readonly explanationCompletenessPassed: boolean;
}

export interface SapCp002ExamReadinessV4Package extends Omit<
  SapCp002ExamReadinessV3Package,
  | "difficulty"
  | "difficultyScore"
  | "difficultyEvidence"
  | "stem"
  | "canonicalAnswer"
  | "verifierAnswer"
  | "answerSemanticValue"
  | "options"
  | "correctIndex"
  | "explanation"
  | "editorialStatus"
  | "reviewDecision"
  | "humanReviewStatus"
  | "reviewVersion"
  | "canonicalPayloadKey"
  | "payloadFingerprint"
  | "generationIdentity"
  | "optionOrderVersion"
  | "difficultyModelVersion"
  | "validation"
  | "lifecycle"
> {
  readonly difficulty: SapCp002ExamReadinessV3Package["difficulty"];
  readonly difficultyScore: number;
  readonly difficultyEvidence: readonly string[];
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly answerSemanticValue: string;
  readonly options: readonly SapCp002V4Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp002V4Explanation;
  readonly editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V4";
  readonly reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING";
  readonly humanReviewStatus: "PENDING";
  readonly reviewVersion: "SAP_CP002_EXAM_READINESS_V4";
  readonly canonicalPayloadKey: string;
  readonly payloadFingerprint: string;
  readonly generationIdentity: string;
  readonly optionOrderVersion: "SAP_CP002_OPTION_ORDER_V4";
  readonly difficultyModelVersion: "SAP_CP002_SEMANTIC_DIFFICULTY_V4";
  readonly validation: SapCp002V4Validation;
  readonly lifecycle: {
    readonly permanentQlId: SapCp002ExamReadinessV3Package["permanentQlId"];
    readonly identityStatus: "PERMANENT_ID_RETAINED";
    readonly contentStatus: "EDITORIALLY_UNFROZEN_V4_HUMAN_REVIEW_PENDING";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp002V4ReviewRecord extends Omit<
  SapCp002V3ReviewRecord,
  | "questionId"
  | "difficulty"
  | "difficultyScore"
  | "stem"
  | "options"
  | "correctIndex"
  | "correctAnswer"
  | "answerSemanticValue"
  | "explanation"
  | "validation"
  | "canonicalPayloadKey"
  | "payloadFingerprint"
  | "generationIdentity"
> {
  readonly questionId: string;
  readonly difficulty: SapCp002ExamReadinessV4Package["difficulty"];
  readonly difficultyScore: number;
  readonly stem: string;
  readonly options: readonly SapCp002V4Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly answerSemanticValue: string;
  readonly explanation: SapCp002V4Explanation;
  readonly validation: SapCp002V4Validation;
  readonly canonicalPayloadKey: string;
  readonly payloadFingerprint: string;
  readonly generationIdentity: string;
}
