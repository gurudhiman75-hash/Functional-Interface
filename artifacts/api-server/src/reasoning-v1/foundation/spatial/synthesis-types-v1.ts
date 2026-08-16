import type { SpatialPrimitiveClassificationQuestionV2 } from "./primitive-classification-v2";
import type { SpatialPrimitiveRetrofitQuestionV2 } from "./primitive-retrofit-proof";
import type { SpatialSeriesProofQuestion } from "./series-types";

export type SpatialSynthesisChapterV1 = "FAN-001" | "FCL-001" | "FSR-001";

export type SpatialSynthesisRejectCodeV1 =
  | "DUPLICATE_CONTENT"
  | "FAN_TRANSFORM_COLLISION"
  | "FAN_OPTION_COLLISION"
  | "FCL_COMPETING_DESCRIPTOR"
  | "FCL_POOL_SHORTAGE"
  | "FSR_GENERATOR_REJECTED"
  | "SCENE_VALIDATION_FAILED"
  | "INVALID_REQUEST";

export interface SpatialSynthesisLifecycleLockV1 {
  permanentQlId: null;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

export const SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1: SpatialSynthesisLifecycleLockV1 = {
  permanentQlId: null,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

export type SpatialSynthesisPayloadV1 =
  | SpatialPrimitiveRetrofitQuestionV2
  | SpatialPrimitiveClassificationQuestionV2
  | SpatialSeriesProofQuestion;

export interface SpatialSynthesisCandidateV1 {
  chapterCode: SpatialSynthesisChapterV1;
  seed: string;
  familyId: string;
  correctOptionIndex: number;
  contentFingerprint: string;
  deliveryFingerprint: string;
  payload: SpatialSynthesisPayloadV1;
  lifecycle: SpatialSynthesisLifecycleLockV1;
}

export interface SpatialSynthesisAcceptedAttemptV1 {
  status: "ACCEPTED";
  chapterCode: SpatialSynthesisChapterV1;
  seed: string;
  familyId: string;
  attemptIndex: number;
  desiredCorrectOptionIndex: number;
  candidate: SpatialSynthesisCandidateV1;
}

export interface SpatialSynthesisRejectedAttemptV1 {
  status: "REJECTED";
  chapterCode: SpatialSynthesisChapterV1;
  seed: string;
  familyId: string;
  attemptIndex: number;
  desiredCorrectOptionIndex: number;
  rejectCode: SpatialSynthesisRejectCodeV1;
  message: string;
}

export type SpatialSynthesisAttemptV1 =
  | SpatialSynthesisAcceptedAttemptV1
  | SpatialSynthesisRejectedAttemptV1;

export interface SpatialProductionSynthesisBatchRequestV1 {
  seedPrefix: string;
  requestedPerChapter: number;
  maxAttemptsPerChapter?: number;
}

export interface SpatialProductionSynthesisChapterResultV1 {
  chapterCode: SpatialSynthesisChapterV1;
  requested: number;
  accepted: SpatialSynthesisCandidateV1[];
  attempts: SpatialSynthesisAttemptV1[];
  rejectionCounts: Partial<Record<SpatialSynthesisRejectCodeV1, number>>;
  correctSlotCounts: [number, number, number, number];
  familyCounts: Record<string, number>;
}

export interface SpatialProductionSynthesisBatchResultV1 {
  version: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1";
  seedPrefix: string;
  requestedPerChapter: number;
  totalAccepted: number;
  chapters: Record<SpatialSynthesisChapterV1, SpatialProductionSynthesisChapterResultV1>;
  lifecycle: SpatialSynthesisLifecycleLockV1;
}
