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
  | "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE"
  | "MARKER_OPPOSITE_SEGMENT_ANCHOR"
  | "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER"
  | "ARROW_POINTS_TO_SEGMENT_ANCHOR";

export type SpatialClassificationNuisanceFeatureId =
  | "OUTER_SHAPE"
  | "INNER_SHAPE"
  | "OUTER_ORIENTATION"
  | "INNER_ORIENTATION"
  | "MARKER_POSITION"
  | "ARROW_DIRECTION"
  | "INNER_SHADING"
  | "SEGMENT_COUNT"
  | "SEGMENT_ANCHOR"
  | "SHAPE_PAIR"
  | "ORIENTATION_PAIR"
  | "MARKER_DIRECTION_PAIR"
  | "MARKER_SEGMENT_PAIR"
  | "ARROW_SEGMENT_PAIR"
  | "OUTER_INNER_SAME"
  | "ORIENTATIONS_MATCH"
  | "MARKER_ON_ARROW_SIDE"
  | "MARKER_OPPOSITE_SEGMENT_ANCHOR"
  | "MARKER_ON_SEGMENT_SIDE"
  | "ARROW_POINTS_TO_SEGMENT_ANCHOR"
  | "ARROW_OPPOSITE_SEGMENT_ANCHOR"
  | "SEGMENT_COUNT_ODD"
  | "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE"
  | "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE"
  | "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER"
  | "OUTER_POLYGON"
  | "INNER_POLYGON"
  | "OUTER_SIDE_PARITY"
  | "INNER_SIDE_PARITY"
  | "SIDE_COUNT_COMPARISON"
  | "TOTAL_POLYGON_SIDES_PARITY";

export interface SpatialClassificationNuisanceDistribution {
  featureId: SpatialClassificationNuisanceFeatureId;
  frequencies: Record<string, number>;
  threeToOne: boolean;
  intendedEquivalent: boolean;
}

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
  approvedPropertyAuthorityCheck: "PASS";
  nuisanceFeatureAuditCheck: "PASS";
  nuisanceFeatureDistributions: SpatialClassificationNuisanceDistribution[];
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
  uniqueWithinApprovedPropertyAuthorityCheck: "PASS";
  nuisanceFeatureAuditCheck: "PASS";
  auditedNuisanceFeatureCount: number;
  nuisanceFeatureDistributions: SpatialClassificationNuisanceDistribution[];
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
