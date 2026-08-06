import type {
  SapCp002ExamReadinessV2Package,
  SapCp002V2Difficulty,
  SapCp002V2Explanation,
  SapCp002V2Option,
  SapCp002V2SolveModeSubtype,
  SapCp002V2Validation,
} from "../exam-readiness-v2/types";

export type SapCp002V3SolveModeSubtype =
  | SapCp002V2SolveModeSubtype
  | "FRACTION_OPERATION_CHAIN"
  | "INTEGER_WITH_FRACTIONAL_PRODUCT";

export interface SapCp002V3Option extends SapCp002V2Option {
  readonly displayIndex: number;
  readonly semanticValue: string;
  readonly routeOperands: readonly string[];
  readonly reproducibleFromVisibleStem: boolean;
}

export interface SapCp002V3Explanation extends SapCp002V2Explanation {
  readonly visibleOperandSet: readonly string[];
  readonly provenanceStatus: "VISIBLE_OPERANDS_ONLY";
}

export interface SapCp002V3Validation extends SapCp002V2Validation {
  readonly optionOrderSafe: boolean;
  readonly visibleOperandProvenancePassed: boolean;
  readonly distractorReproducibilityPassed: boolean;
  readonly generationIdentityPassed: boolean;
  readonly canonicalIdentityPassed: boolean;
  readonly difficultyInvariantPassed: boolean;
}

export interface SapCp002ExamReadinessV3Package extends Omit<
  SapCp002ExamReadinessV2Package,
  | "difficulty"
  | "difficultyScore"
  | "difficultyEvidence"
  | "solveModeLabel"
  | "solveModeSubtype"
  | "stem"
  | "canonicalAnswer"
  | "verifierAnswer"
  | "options"
  | "correctIndex"
  | "explanation"
  | "editorialStatus"
  | "reviewDecision"
  | "humanReviewStatus"
  | "reviewVersion"
  | "payloadFingerprint"
  | "validation"
  | "lifecycle"
> {
  readonly difficulty: SapCp002V2Difficulty;
  readonly difficultyScore: number;
  readonly difficultyEvidence: readonly string[];
  readonly solveModeLabel: string;
  readonly solveModeSubtype: SapCp002V3SolveModeSubtype;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly sourceCanonicalAnswer: string;
  readonly answerSemanticValue: string;
  readonly options: readonly SapCp002V3Option[];
  readonly correctIndex: number;
  readonly explanation: SapCp002V3Explanation;
  readonly editorialStatus: "EDITORIALLY_UNFROZEN_REMODELED_V3";
  readonly reviewDecision: "AUTO_VALIDATED_HUMAN_REVIEW_PENDING";
  readonly humanReviewStatus: "PENDING";
  readonly reviewVersion: "SAP_CP002_EXAM_READINESS_V3";
  readonly canonicalPayloadKey: string;
  readonly payloadFingerprint: string;
  readonly generationIdentity: string;
  readonly optionOrderVersion: "SAP_CP002_OPTION_ORDER_V3";
  readonly difficultyModelVersion: "SAP_CP002_SEMANTIC_DIFFICULTY_V3";
  readonly validation: SapCp002V3Validation;
  readonly lifecycle: {
    readonly permanentQlId: SapCp002ExamReadinessV2Package["permanentQlId"];
    readonly identityStatus: "PERMANENT_ID_RETAINED";
    readonly contentStatus: "EDITORIALLY_UNFROZEN_V3_HUMAN_REVIEW_PENDING";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export interface SapCp002V3ReviewRecord {
  readonly questionId: string;
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-002";
  readonly permanentQlId: SapCp002ExamReadinessV3Package["permanentQlId"];
  readonly temporaryPrototypeId: SapCp002ExamReadinessV3Package["temporaryPrototypeId"];
  readonly solveModeLabel: string;
  readonly solveModeSubtype: SapCp002V3SolveModeSubtype;
  readonly taskDirection: string;
  readonly difficulty: SapCp002V2Difficulty;
  readonly difficultyScore: number;
  readonly seed: number;
  readonly stem: string;
  readonly options: readonly SapCp002V3Option[];
  readonly correctIndex: number;
  readonly correctAnswer: string;
  readonly answerSemanticValue: string;
  readonly explanation: SapCp002V3Explanation;
  readonly validation: SapCp002V3Validation;
  readonly humanReviewStatus: "PENDING";
  readonly reviewerNotes: "";
  readonly canonicalPayloadKey: string;
  readonly payloadFingerprint: string;
  readonly generationIdentity: string;
}
