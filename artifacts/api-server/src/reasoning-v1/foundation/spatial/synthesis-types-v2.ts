import type { SpatialPrimitiveClassificationPropertyIdV2 } from "./primitive-classification-v2";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import type { SpatialScene } from "./types";
import type {
  SpatialSynthesisChapterV1,
  SpatialSynthesisLifecycleLockV1,
  SpatialSynthesisPayloadV1,
} from "./synthesis-types-v1";

export interface SpatialFclPrimitiveInstanceV2 {
  primitiveId: SpatialPrimitiveIdV2;
  rotationQuarterTurns: 0 | 1 | 2 | 3;
  visibleOrientationClass: number;
  scene: SpatialScene;
  sceneFingerprint: string;
}

export interface SpatialFclInstanceDescriptorAuditV2 {
  descriptorId: string;
  values: string[];
  frequencies: Record<string, number>;
  threeToOne: boolean;
  minorityIndex: number | null;
  supportsCorrectOdd: boolean;
}

export interface SpatialFclInstanceQuestionV2 {
  chapterCode: "FCL-001";
  prototypeId: string;
  propertyId: SpatialPrimitiveClassificationPropertyIdV2;
  propertyDescription: string;
  instances: SpatialFclPrimitiveInstanceV2[];
  optionScenes: SpatialScene[];
  propertyVector: boolean[];
  correctOptionIndex: number;
  descriptorAudits: SpatialFclInstanceDescriptorAuditV2[];
  globalRotationOrbitFingerprint: string;
  learnerExplanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  lifecycle: SpatialSynthesisLifecycleLockV1;
}

export type SpatialProductionScalePayloadV2 =
  | SpatialSynthesisPayloadV1
  | SpatialFclInstanceQuestionV2;

export interface SpatialProductionScaleCandidateV2 {
  chapterCode: SpatialSynthesisChapterV1;
  seed: string;
  familyId: string;
  correctOptionIndex: number;
  contentFingerprint: string;
  deliveryFingerprint: string;
  payload: SpatialProductionScalePayloadV2;
  lifecycle: SpatialSynthesisLifecycleLockV1;
}

export interface SpatialProductionScaleChapterResultV2 {
  chapterCode: SpatialSynthesisChapterV1;
  requested: number;
  accepted: SpatialProductionScaleCandidateV2[];
  attempts: number;
  duplicateRejects: number;
  generatorRejects: number;
  correctSlotCounts: [number, number, number, number];
  familyCounts: Record<string, number>;
}

export interface SpatialProductionScaleBatchRequestV2 {
  seedPrefix: string;
  requestedPerChapter: number;
  maxAttemptsPerChapter?: number;
}

export interface SpatialProductionScaleBatchResultV2 {
  version: "SPA-FND-001-PRODUCTION-SCALE-V2";
  seedPrefix: string;
  requestedPerChapter: number;
  totalAccepted: number;
  fclInstanceCatalogCapacity: number;
  fclCanonicalCatalogCapacity: number;
  fsrSafeStateTotalCapacity: number;
  chapters: Record<SpatialSynthesisChapterV1, SpatialProductionScaleChapterResultV2>;
  lifecycle: SpatialSynthesisLifecycleLockV1;
}