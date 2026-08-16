import type { SpatialScene } from "./types";

export const SPATIAL_GAP_IDS_V1 = [
  "FAN-GAP-01",
  "FAN-GAP-02",
  "FAN-GAP-03",
  "FAN-GAP-04",
  "FAN-GAP-05",
  "FCL-GAP-01",
  "FCL-GAP-02",
  "FCL-GAP-03",
  "FCL-GAP-04",
  "FCL-GAP-05",
  "FCL-GAP-06",
  "FSR-GAP-01",
  "FSR-GAP-02",
  "FSR-GAP-03",
  "FSR-GAP-04",
  "FSR-GAP-05",
  "FSR-GAP-06",
  "FSR-GAP-07",
  "FSR-GAP-08",
] as const;

export type SpatialGapIdV1 = (typeof SPATIAL_GAP_IDS_V1)[number];
export type SpatialGapChapterV1 = "FAN-001" | "FCL-001" | "FSR-001";

export type SpatialGapCapabilityIdV1 =
  | "SELECTED_RIGID_TRANSFORM"
  | "SELECTED_SCALE"
  | "POSITION_CYCLE"
  | "HIERARCHY_TRANSFER"
  | "FILL_STATE_MUTATION"
  | "COUNT_MUTATION"
  | "NODE_SUBSTITUTION"
  | "ROTATION_ORBIT_EQUIVALENCE"
  | "GENERAL_RELATION_EVALUATION"
  | "SUBFIGURE_TRANSFORM_RELATION"
  | "PIPELINE_COMPOSITION"
  | "ALTERNATING_PIPELINE";

export interface SpatialGapAuthorityEntryV1 {
  gapId: SpatialGapIdV1;
  chapterCode: SpatialGapChapterV1;
  name: string;
  sourceAuditId: "SPA-FND-001-SOURCE-SATURATION-AUDIT-V1";
  capabilityIds: readonly SpatialGapCapabilityIdV1[];
  runtimeStatus: "RUNTIME_CAPABILITY_SCALE_VALIDATED";
  learnerQuestionStatus: "QUESTION_SYNTHESIS_PENDING";
  permanentQlId: null;
}

export interface SpatialGapProofCheckV1 {
  name: string;
  pass: boolean;
  detail?: string;
}

export interface SpatialGapLifecycleLockV1 {
  permanentQlId: null;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

export const SPATIAL_GAP_LIFECYCLE_LOCK_V1: SpatialGapLifecycleLockV1 = {
  permanentQlId: null,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

export interface SpatialGapRuntimeCandidateV1 {
  version: "SPA-FND-001-GAP-RUNTIME-V1";
  gapId: SpatialGapIdV1;
  chapterCode: SpatialGapChapterV1;
  seed: string;
  capabilityIds: readonly SpatialGapCapabilityIdV1[];
  scenes: readonly SpatialScene[];
  operationTrace: readonly string[];
  proofChecks: readonly SpatialGapProofCheckV1[];
  contentFingerprint: string;
  deliveryFingerprint: string;
  lifecycle: SpatialGapLifecycleLockV1;
}

export interface SpatialGapRuntimeScaleRequestV1 {
  seedPrefix: string;
  requestedPerGap: number;
}

export interface SpatialGapRuntimeScaleResultV1 {
  version: "SPA-FND-001-GAP-RUNTIME-SCALE-V1";
  seedPrefix: string;
  requestedPerGap: number;
  totalAccepted: number;
  accepted: SpatialGapRuntimeCandidateV1[];
  gapCounts: Record<SpatialGapIdV1, number>;
  capabilityCounts: Record<SpatialGapCapabilityIdV1, number>;
  lifecycle: SpatialGapLifecycleLockV1;
}
