import type {
  SpatialClockHandAngles,
  SpatialClockTime,
  SpatialExplanationStep,
  SpatialRequestedTransform,
  SpatialReviewMetadata,
  SpatialScene,
  SpatialSymmetryProfile,
} from "./types";

export type SpatialProofChapterCode = "MIR-001" | "WAT-001";

export type SpatialProofStimulusKind =
  | "SEEDED_GEOMETRIC_COMPOSITION"
  | "WESTERN_ARABIC_DIGIT_STRING"
  | "LATIN_GLYPH_STRING"
  | "ANALOG_CLOCK";

export type SpatialMisconceptionLabel =
  | "AXIS_CONFUSION"
  | "ROTATION_SUBSTITUTED_FOR_REFLECTION"
  | "PARTIAL_REFLECTION_ERROR"
  | "OUTER_SHAPE_CORRECT_INNER_ORIENTATION_WRONG"
  | "OUTER_SHAPE_CORRECT_INNER_PROPERTY_WRONG"
  | "ORDER_REVERSED_GLYPHS_UNCHANGED"
  | "GLYPHS_REFLECTED_ORDER_UNCHANGED"
  | "UNCHANGED_STIMULUS"
  | "CLOCK_HOUR_HAND_SNAPPED"
  | "CLOCK_SHORTCUT_BORROW_ERROR";

export interface SpatialProofOption {
  label: "CORRECT_REFLECTION" | SpatialMisconceptionLabel;
  scene: SpatialScene;
  fingerprint: string;
}

export interface SpatialLearnerExplanation {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface SpatialClockProofEvidence {
  sourceTime: SpatialClockTime;
  sourceAngles: SpatialClockHandAngles;
  reflectedAngles: SpatialClockHandAngles;
  shortcutTime?: SpatialClockTime;
  shortcutCrossCheck?: "PASS" | "NOT_APPLICABLE";
  presentationPolicy: "TIME_OR_DIAGRAM" | "DIAGRAM_ONLY";
  minimumOptionEndpointDistance?: number;
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
  clock?: SpatialClockProofEvidence;
}

export interface SpatialTransformProofQuestion {
  familyCode: "SPA-001";
  chapterCode: SpatialProofChapterCode;
  prototypeId: string;
  seed: string;
  stimulusKind?: SpatialProofStimulusKind;
  requestedTransform: SpatialRequestedTransform;
  instructionKey: string;
  sourceScene: SpatialScene;
  options: SpatialProofOption[];
  correctOptionIndex: number;
  solverEvidence: SpatialTransformSolverEvidence;
  reviewMetadata: SpatialReviewMetadata;
  explanationSteps: SpatialExplanationStep[];
  learnerExplanation?: SpatialLearnerExplanation;
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}
