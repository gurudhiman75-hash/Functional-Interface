import type {
  BlrCp007V3Difficulty,
  GeneratedBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3-model";

export const BLR_CP007_EDITORIAL_V4_RUNTIME_VERSION =
  "blr-cp007-coded-construction-editorial-v4" as const;
export const BLR_CP007_EDITORIAL_V4_REVIEW_VERSION =
  "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V4" as const;

export type BlrCp007V4Disposition =
  | "FOUNDATION_PRACTICE"
  | "RELEASE_CANDIDATE"
  | "REMEDIATION_HOLD";

export type BlrCp007V4RecommendedUse =
  | "GUIDED_PRACTICE"
  | "STANDARD_MOCK"
  | "ADVANCED_PRACTICE"
  | "NOT_ELIGIBLE";

export type BlrCp007V4PromptPlacement = "ITEM" | "SET_HEADER";

export type GeneratedBlrCp007EditorialV4Question = Omit<
  GeneratedBlrCp007EditorialV3Question,
  "delivery" | "keyStyle" | "metadata" | "reviewProof"
> & {
  keyStyle: "SYMBOL" | "LETTER";
  delivery: GeneratedBlrCp007EditorialV3Question["delivery"] & {
    promptPlacement: BlrCp007V4PromptPlacement;
    renderSharedPromptOnce: boolean;
  };
  reviewProof: GeneratedBlrCp007EditorialV3Question["reviewProof"] & {
    difficulty: BlrCp007V3Difficulty;
  };
  metadata: GeneratedBlrCp007EditorialV3Question["metadata"] & {
    v4RuntimeVersion: typeof BLR_CP007_EDITORIAL_V4_RUNTIME_VERSION;
    v4ReviewVersion: typeof BLR_CP007_EDITORIAL_V4_REVIEW_VERSION;
    v4EditorialStatus: "EXAM_READINESS_REMEDIATION_CANDIDATE";
    disposition: BlrCp007V4Disposition;
    recommendedUse: BlrCp007V4RecommendedUse;
    promptPlacement: BlrCp007V4PromptPlacement;
    neutralWordCodesRemoved: true;
    explanationRemodelled: true;
    difficultyRecalibratedByReasoningDepth: true;
    sourceV3SemanticFingerprint: string;
    v4EditorialFingerprint: string;
    candidateNetworkComponentCount?: number;
    activeEditorialBlockers: readonly string[];
  };
  v4ReviewProof: {
    datasetVersion: typeof BLR_CP007_EDITORIAL_V4_REVIEW_VERSION;
    sourceDatasetVersion: "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V3";
    disposition: BlrCp007V4Disposition;
    recommendedUse: BlrCp007V4RecommendedUse;
    promptPlacement: BlrCp007V4PromptPlacement;
    reasoningDepth: number;
    decisiveLinkCount: number;
    candidateNetworkComponentCount?: number;
    activeEditorialBlockers: readonly string[];
    humanReviewRequired: true;
  };
};

export interface BlrCp007EditorialV4Telemetry {
  recordCount: number;
  qlCounts: Readonly<Record<string, number>>;
  keyStyleCounts: Readonly<Record<"SYMBOL" | "LETTER", number>>;
  difficultyCounts: Readonly<Record<BlrCp007V3Difficulty, number>>;
  dispositionCounts: Readonly<Record<BlrCp007V4Disposition, number>>;
  recommendedUseCounts: Readonly<Record<BlrCp007V4RecommendedUse, number>>;
  sharedSetCount: number;
  sharedSetQuestionCount: number;
  standaloneQuestionCount: number;
  neutralWordCodeQuestions: number;
  colourTokenOccurrences: number;
  releaseCandidateCount: number;
  foundationPracticeCount: number;
  remediationHoldCount: number;
  ql034DisconnectedNetworkCount: number;
  maximumExactShortcutRepeat: number;
  maximumExactTrapRepeat: number;
  duplicateStemCount: number;
  repeatedStepConclusionCount: number;
  humanReviewRequired: true;
}
