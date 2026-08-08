import type {
  SpatialAnalogyFigureState,
} from "./analogy-types";
import type {
  SpatialExplanationStep,
  SpatialLocaleMode,
  SpatialScene,
} from "./types";

export type SpatialClassificationPropertyId =
  | "OUTER_INNER_DIFFERENT"
  | "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE"
  | "MARKER_ON_ARROW_SIDE"
  | "ORIENTATIONS_MATCH"
  | "SHADING_MATCHES_ODD_SEGMENTS"
  | "MARKER_OPPOSITE_SEGMENT_ANCHOR"
  | "INNER_NEXT_AFTER_OUTER"
  | "ARROW_POINTS_TO_SEGMENT_ANCHOR";

export interface SpatialClassificationProofOption {
  label: "COMMON_PROPERTY_MEMBER" | "ODD_FIGURE";
  state: SpatialAnalogyFigureState;
  scene: SpatialScene;
  satisfiesProperty: boolean;
  stateFingerprint: string;
  sceneFingerprint: string;
}

export interface SpatialClassificationLearnerExplanation {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface SpatialClassificationSolverEvidence {
  propertyId: SpatialClassificationPropertyId;
  propertyVector: boolean[];
  separatingPropertyIds: SpatialClassificationPropertyId[];
  ambiguityCheck: "PASS";
  optionStateFingerprints: string[];
  optionSceneFingerprints: string[];
  sceneIntegrityCheck: "PASS";
  correctOptionIndex: number;
}

export interface SpatialClassificationReviewMetadata {
  localeMode: SpatialLocaleMode;
  propertyId: SpatialClassificationPropertyId;
  propertyDescription: string;
  propertyVector: boolean[];
  uniqueSeparatingPropertyCheck: "PASS";
  optionUniquenessCheck: "PASS";
  sceneIntegrityCheck: "PASS";
  deterministicRegenerationCheck: "PASS";
  recommendedOptionPixels: number;
}

export interface SpatialClassificationProofQuestion {
  familyCode: "SPA-001";
  chapterCode: "FCL-001";
  prototypeId: string;
  seed: string;
  instructionKey: "FCL_SELECT_ODD_FIGURE";
  propertyId: SpatialClassificationPropertyId;
  options: SpatialClassificationProofOption[];
  correctOptionIndex: number;
  solverEvidence: SpatialClassificationSolverEvidence;
  reviewMetadata: SpatialClassificationReviewMetadata;
  explanationSteps: SpatialExplanationStep[];
  learnerExplanation: SpatialClassificationLearnerExplanation;
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

export interface SpatialClassificationProofGeneratorInput {
  seed: string;
  prototypeId: string;
  propertyId: SpatialClassificationPropertyId;
  states: readonly [
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
    SpatialAnalogyFigureState,
  ];
  expectedOddIndex: 0 | 1 | 2 | 3;
}
