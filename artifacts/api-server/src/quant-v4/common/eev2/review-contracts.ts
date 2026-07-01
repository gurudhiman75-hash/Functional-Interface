import type { EEV2DetailMode, EEV2Metadata } from "./contracts";

export const BLIND_REVIEW_DIMENSIONS = [
  "TUTOR_REALISM",
  "COGNITIVE_LOAD",
  "METHOD_VISIBILITY",
  "CONCEPT_ISOLATION",
  "ANSWER_CONFIDENCE",
  "SIMPLICITY",
] as const;
export type BlindReviewDimension = (typeof BLIND_REVIEW_DIMENSIONS)[number];
export type BlindReviewCandidateLabel = "A" | "B";
export type BlindReviewEngine = "v1" | "v2";
export type BlindReviewScore = 1 | 2 | 3 | 4 | 5;
export type BlindReviewPreference = BlindReviewCandidateLabel | "NO_PREFERENCE";
export interface BlindReviewDimensionPrompt {
  dimension: BlindReviewDimension;
  question: string;
}
export interface BlindReviewCandidateInput {
  engine: BlindReviewEngine;
  deterministicIdentity: string;
  lines: readonly string[];
}
export interface BlindReviewPairInput {
  instanceId: string;
  locale: string;
  detailMode: EEV2DetailMode;
  candidates: readonly [BlindReviewCandidateInput, BlindReviewCandidateInput];
  metadata: EEV2Metadata;
}
export interface BlindReviewExplanation {
  label: `Explanation ${BlindReviewCandidateLabel}`;
  candidateId: string;
  lines: readonly string[];
}
export interface BlindReviewPacket {
  reviewId: string;
  instanceId: string;
  locale: string;
  detailMode: EEV2DetailMode;
  explanations: readonly [BlindReviewExplanation, BlindReviewExplanation];
  dimensions: readonly BlindReviewDimensionPrompt[];
  preferenceQuestion: string;
  metadata: EEV2Metadata;
}
export interface BlindReviewAssignmentCandidate {
  label: BlindReviewCandidateLabel;
  candidateId: string;
  engine: BlindReviewEngine;
  deterministicIdentity: string;
}
export interface BlindReviewAssignment {
  reviewId: string;
  candidates: readonly [
    BlindReviewAssignmentCandidate,
    BlindReviewAssignmentCandidate,
  ];
}
export interface BlindReviewDimensionScores {
  A: BlindReviewScore;
  B: BlindReviewScore;
}
export type BlindReviewScores = Readonly<
  Record<BlindReviewDimension, BlindReviewDimensionScores>
>;
export interface BlindReviewSubmissionInput {
  scores: BlindReviewScores;
  preference: BlindReviewPreference;
  notes: readonly string[];
  timestamp: string;
  metadata: EEV2Metadata;
}
export interface BlindReviewRecord {
  reviewId: string;
  instanceId: string;
  locale: string;
  detailMode: EEV2DetailMode;
  scores: BlindReviewScores;
  preference: BlindReviewPreference;
  notes: readonly string[];
  timestamp: string;
  metadata: EEV2Metadata;
}
export interface BlindReviewBundle {
  packet: BlindReviewPacket;
  assignment: BlindReviewAssignment;
}

