import type {
  SpatialExplanationStep,
  SpatialRequestedTransform,
  SpatialReviewMetadata,
  SpatialScene,
  SpatialSymmetryProfile,
} from "./types";

export type SpatialProofChapterCode = "MIR-001" | "WAT-001";

export type SpatialMisconceptionLabel =
  | "AXIS_CONFUSION"
  | "ROTATION_SUBSTITUTED_FOR_REFLECTION"
  | "PARTIAL_REFLECTION_ERROR";

export interface SpatialProofOption {
  label: "CORRECT_REFLECTION" | SpatialMisconceptionLabel;
  scene: SpatialScene;
  fingerprint: string;
}

export interface SpatialTransformSolverEvidence {
  requestedTransform: SpatialRequestedTransform;
  axisKind: "VERTICAL" | "HORIZONTAL";
  axisCoordinate: number;
  sourceFingerprint: string;
  correctFingerprint: string;
  transformedNodeIds: string[];
  symmetryProfile: SpatialSymmetryProfile;
  optionLabels: SpatialProofOption["label"][];
  optionFingerprints: string[];
  correctOptionIndex: number;
}

export interface SpatialTransformProofQuestion {
  familyCode: "SPA-001";
  chapterCode: SpatialProofChapterCode;
  prototypeId: string;
  seed: string;
  requestedTransform: SpatialRequestedTransform;
  instructionKey: string;
  sourceScene: SpatialScene;
  options: SpatialProofOption[];
  correctOptionIndex: number;
  solverEvidence: SpatialTransformSolverEvidence;
  reviewMetadata: SpatialReviewMetadata;
  explanationSteps: SpatialExplanationStep[];
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}
