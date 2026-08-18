import type {
  InternalConclusionClass,
} from "../foundation/types";
import type {
  GeneratedSylQuestionV4,
  SylLearnerConclusionResultV4,
  SylLearnerDiagramV4,
  SylLearnerExplanationV4,
  SylLearnerOptionAnalysisV4,
  SylLearnerPresentationV4,
} from "./learner-v4-types";
import type {
  SylSemanticStatusV3,
  SylTaskStatusV3,
} from "./structured-proof-v3-types";

export const SYL_LEARNER_V5_AUTHORITY = "SYL_001_EXAM_READINESS_REMEDIATION_V5" as const;
export const SYL_LEARNER_V5_APPROVAL_AUTHORITY = "SYL_001_V5_PRODUCT_OWNER_APPROVAL_2026_08_08" as const;
export const SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT = "cf14902141176f09bff0b8524773ad173fc480cd" as const;
export const SYL_LEARNER_V5_APPROVED_ON = "2026-08-08" as const;

export type SylLearnerExplanationModeV5 =
  | SylLearnerExplanationV4["mode"]
  | "PAIR_CLASSIFICATION";

export type SylDiagramModeV5 =
  | SylLearnerDiagramV4["mode"]
  | "VENN_FOCUSED_CONCLUSION_CHECK";

export type SylDiagramOmissionReasonV5 =
  | SylLearnerDiagramV4["omissionReason"]
  | "ANSWER_MODE_MISMATCH"
  | "UNKNOWN_RELATION_NOT_DRAWN"
  | "MODEL_TARGET_MISMATCH";

export interface SylLearnerConclusionResultV5
  extends Omit<SylLearnerConclusionResultV4, "shortReason"> {
  status: InternalConclusionClass;
  shortReason: string;
}

export interface SylLearnerExplanationV5
  extends Omit<
    SylLearnerExplanationV4,
    "mode" | "shortReasoning" | "conclusionResults"
  > {
  mode: SylLearnerExplanationModeV5;
  shortReasoning: readonly string[];
  conclusionResults: readonly SylLearnerConclusionResultV5[];
}

export interface SylLearnerOptionAnalysisV5
  extends SylLearnerOptionAnalysisV4 {
  logicalStatus: SylSemanticStatusV3;
  taskDisposition: SylTaskStatusV3;
}

export interface SylLearnerDiagramV5
  extends Omit<
    SylLearnerDiagramV4,
    "mode" | "omissionReason" | "mobileViewBoxWidth"
  > {
  mode: SylDiagramModeV5;
  omissionReason: SylDiagramOmissionReasonV5;
  mobileViewBoxWidth: 340;
}

export interface SylLearnerModelEvidenceV5 {
  required: boolean;
  canonicalModelCount: number;
  source:
    | "NOT_REQUIRED"
    | "CORRECT_PROOF_MODEL"
    | "COUNTERMODEL"
    | "TRUE_FALSE_MODELS";
}

export type SylEditorialReviewStatusV5 =
  | "PENDING"
  | "APPROVED_BY_PRODUCT_OWNER";

export type SylViewportReviewStatusV5 =
  | "PENDING"
  | "EVIDENCE_READY_PENDING_APPROVAL"
  | "APPROVED";

export interface SylLearnerRemediationEvidenceV5 {
  answerDerivedExplanationMode: true;
  answerDerivedDiagramMode: true;
  everyDisplayedConclusionExplained: true;
  logicalStatusSeparatedFromTaskDisposition: true;
  nonEmptyClassDirectionVisibleBeforeAttempt: true;
  unknownRelationsNeverRenderedAsProvedSeparation: true;
  nativeEnglishEditorialStatus: SylEditorialReviewStatusV5;
  nativeHindiEditorialStatus: SylEditorialReviewStatusV5;
  nativePunjabiEditorialStatus: SylEditorialReviewStatusV5;
  humanViewportStatus: SylViewportReviewStatusV5;
  approvalAuthority: typeof SYL_LEARNER_V5_APPROVAL_AUTHORITY | null;
  approvedContentCommit: typeof SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT | null;
  approvedOn: typeof SYL_LEARNER_V5_APPROVED_ON | null;
  deadOptionRemediationStatus:
    | "PENDING_SEPARATE_SOURCE_DECISION"
    | "REMOVED_THREE_STATUS_DIAGNOSTIC";
  mockWeightCalibrationStatus: "PENDING_SEPARATE_SOURCE_DECISION";
}

export interface SylLearnerPresentationV5
  extends Omit<
    SylLearnerPresentationV4,
    "authority" | "schemaVersion" | "learnerExplanation" | "optionAnalysis" | "diagram"
  > {
  authority: typeof SYL_LEARNER_V5_AUTHORITY;
  schemaVersion: "syl-learner-v5";
  preTestDirection: string;
  learnerExplanation: SylLearnerExplanationV5;
  optionAnalysis: readonly SylLearnerOptionAnalysisV5[];
  diagram: SylLearnerDiagramV5;
  modelEvidence: SylLearnerModelEvidenceV5;
  remediationEvidence: SylLearnerRemediationEvidenceV5;
}

export type GeneratedSylQuestionV5 = GeneratedSylQuestionV4 & {
  learnerPresentationV5: SylLearnerPresentationV5;
};
