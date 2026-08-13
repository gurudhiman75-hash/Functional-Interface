import type { SpatialScene } from "./types";
import type { SpatialGapChapterV1, SpatialGapIdV1, SpatialGapLifecycleLockV1 } from "./gap-types-v1";

export type SpatialGapQuestionInstructionKeyV1 =
  | "FAN_SELECT_FIGURE_COMPLETING_ANALOGY"
  | "FCL_SELECT_ODD_FIGURE"
  | "FSR_SELECT_NEXT_FIGURE";

export type SpatialGapQuestionMisconceptionV1 =
  | "CORRECT_RULE_APPLICATION"
  | "NO_CHANGE"
  | "PARTIAL_RULE"
  | "WRONG_COMPONENT"
  | "WRONG_DIRECTION"
  | "WRONG_AXIS"
  | "WRONG_COUNT_CHANGE"
  | "WRONG_FILL_LOCATION"
  | "WRONG_RELATION"
  | "WHOLE_FIGURE_SHORTCUT";

export interface SpatialGapQuestionOptionV1 {
  misconception: SpatialGapQuestionMisconceptionV1;
  scene: SpatialScene;
  sceneFingerprint: string;
}

export interface SpatialGapQuestionSolverEvidenceV1 {
  expectedGapId: SpatialGapIdV1;
  decisiveProperty: string;
  propertyVector?: readonly boolean[];
  expectedCorrectSceneFingerprint: string;
  optionSceneFingerprints: readonly string[];
  correctOptionIndex: number;
  optionUniquenessCheck: "PASS";
  semanticRuleCheck: "PASS";
  chapterContractCheck: "PASS";
  runtimeAuthorityCheck: "PASS";
}

export interface SpatialGapQuestionLearnerExplanationV1 {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface SpatialGapQuestionReviewMetadataV1 {
  stemExamStyleCheck: "PASS";
  optionUniquenessCheck: "PASS";
  solverEvidenceCheck: "PASS";
  explanationSpecificityCheck: "PASS";
  recommendedStimulusPixels: number;
  recommendedOptionPixels: number;
  mobileReviewStatus: "ARTIFACT_READY_HUMAN_REVIEW_PENDING";
  englishFreezeStatus: "HUMAN_REVIEW_PENDING";
}

export interface SpatialGapLearnerQuestionV1 {
  version: "SPA-FND-001-GAP-QUESTION-V1";
  familyCode: "SPA-001";
  chapterCode: SpatialGapChapterV1;
  gapId: SpatialGapIdV1;
  prototypeId: string;
  seed: string;
  instructionKey: SpatialGapQuestionInstructionKeyV1;
  stemText: string;
  stimulusScenes: SpatialScene[];
  options: SpatialGapQuestionOptionV1[];
  correctOptionIndex: number;
  solverEvidence: SpatialGapQuestionSolverEvidenceV1;
  learnerExplanation: SpatialGapQuestionLearnerExplanationV1;
  reviewMetadata: SpatialGapQuestionReviewMetadataV1;
  contentFingerprint: string;
  deliveryFingerprint: string;
  lifecycle: SpatialGapLifecycleLockV1;
}

export interface SpatialGapQuestionBatchRequestV1 {
  seedPrefix: string;
  requestedPerGap: number;
}

export interface SpatialGapQuestionBatchResultV1 {
  version: "SPA-FND-001-GAP-QUESTION-BATCH-V1";
  seedPrefix: string;
  requestedPerGap: number;
  totalAccepted: number;
  accepted: SpatialGapLearnerQuestionV1[];
  gapCounts: Record<SpatialGapIdV1, number>;
  chapterCounts: Record<SpatialGapChapterV1, number>;
  correctSlotCounts: [number, number, number, number];
  correctSlotCountsByGap: Record<SpatialGapIdV1, [number, number, number, number]>;
  lifecycle: SpatialGapLifecycleLockV1;
}
