import type {
  SpatialExplanationStep,
  SpatialLocaleMode,
  SpatialScene,
} from "./types";

export type SpatialAnalogyShape =
  | "SQUARE"
  | "CIRCLE"
  | "TRIANGLE"
  | "PENTAGON";

export type SpatialAnalogyMarkerPosition =
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_RIGHT"
  | "BOTTOM_LEFT";

export type SpatialAnalogyDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";
export type SpatialAnalogyQuarterTurn = 0 | 1 | 2 | 3;
export type SpatialAnalogySegmentAnchor = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

export interface SpatialAnalogyFigureState {
  outerShape: SpatialAnalogyShape;
  innerShape: SpatialAnalogyShape;
  outerRotationQuarter: SpatialAnalogyQuarterTurn;
  innerRotationQuarter: SpatialAnalogyQuarterTurn;
  markerPosition: SpatialAnalogyMarkerPosition;
  direction: SpatialAnalogyDirection;
  shadedInner: boolean;
  segmentCount: 1 | 2 | 3 | 4;
  segmentAnchor: SpatialAnalogySegmentAnchor;
}

export type SpatialAnalogyRuleId =
  | "ROTATE_90_CW"
  | "ROTATE_90_CCW"
  | "ROTATE_180"
  | "REFLECT_VERTICAL"
  | "REFLECT_HORIZONTAL"
  | "MOVE_MARKER_CLOCKWISE"
  | "MOVE_MARKER_COUNTERCLOCKWISE"
  | "ADD_SEGMENT"
  | "REMOVE_SEGMENT"
  | "SUBSTITUTE_INNER_NEXT"
  | "TOGGLE_INNER_SHADING"
  | "SWAP_INNER_OUTER"
  | "REVERSE_DIRECTION"
  | "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING"
  | "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING"
  | "NO_CHANGE";

export type SpatialAnalogyRuleComplexity = "SINGLE_STEP" | "COMPOUND_TWO_STEP";

export type SpatialAnalogyMisconceptionLabel =
  | "WRONG_ROTATION_DIRECTION"
  | "WRONG_ROTATION_ANGLE"
  | "WRONG_REFLECTION_AXIS"
  | "MARKER_ONLY_MOVEMENT"
  | "MARKER_MOVED_WRONG_WAY"
  | "ROTATION_SUBSTITUTED_FOR_RULE"
  | "DIRECTION_ONLY_PARTIAL_RULE"
  | "COUNT_CHANGED_WRONG_WAY"
  | "COUNT_UNCHANGED"
  | "SHADING_CHANGED_INSTEAD"
  | "SHAPE_SUBSTITUTION_SKIPPED"
  | "INNER_OUTER_EXCHANGE_INSTEAD"
  | "SHADING_UNCHANGED"
  | "SHAPE_CHANGED_INSTEAD"
  | "DIRECTION_CHANGED_INSTEAD"
  | "INNER_OUTER_UNCHANGED"
  | "PARTIAL_RULE_ROTATION_ONLY"
  | "PARTIAL_RULE_SHADING_ONLY"
  | "NO_CHANGE";

export interface SpatialAnalogyProofOption {
  label: "CORRECT_RULE_APPLICATION" | SpatialAnalogyMisconceptionLabel;
  appliedRuleId: SpatialAnalogyRuleId;
  state: SpatialAnalogyFigureState;
  scene: SpatialScene;
  stateFingerprint: string;
  sceneFingerprint: string;
}

export interface SpatialAnalogyLearnerExplanation {
  observation: string;
  rule: string;
  application: string;
  check: string;
}

export interface SpatialAnalogySolverEvidence {
  inferredRuleIds: SpatialAnalogyRuleId[];
  expectedRuleId: SpatialAnalogyRuleId;
  ambiguityCheck: "PASS";
  geometricTransformCheck: "PASS" | "NOT_APPLICABLE";
  visualDeltaCheck: "PASS";
  visibleRoleCheck: "PASS";
  stateFingerprints: { a: string; b: string; c: string; correct: string };
  optionLabels: SpatialAnalogyProofOption["label"][];
  optionRuleIds: SpatialAnalogyRuleId[];
  optionStateFingerprints: string[];
  optionSceneFingerprints: string[];
  correctOptionIndex: number;
}

export interface SpatialAnalogyReviewMetadata {
  localeMode: SpatialLocaleMode;
  ruleId: SpatialAnalogyRuleId;
  ruleComplexity: SpatialAnalogyRuleComplexity;
  ambiguityCheck: "PASS";
  optionUniquenessCheck: "PASS";
  deterministicRegenerationCheck: "PASS";
  geometricTransformCheck: "PASS" | "NOT_APPLICABLE";
  visualDeltaCheck: "PASS";
  visibleRoleCheck: "PASS";
  expectedChangedFeatures: string[];
  actualChangedFeatures: string[];
  changedVisualRoles: string[];
  recommendedFigurePixels: number;
  recommendedOptionPixels: number;
}

export interface SpatialAnalogyProofQuestion {
  familyCode: "SPA-001";
  chapterCode: "FAN-001";
  prototypeId: string;
  seed: string;
  instructionKey: "FAN_SELECT_FIGURE_COMPLETING_ANALOGY";
  ruleId: SpatialAnalogyRuleId;
  aState: SpatialAnalogyFigureState;
  bState: SpatialAnalogyFigureState;
  cState: SpatialAnalogyFigureState;
  aScene: SpatialScene;
  bScene: SpatialScene;
  cScene: SpatialScene;
  options: SpatialAnalogyProofOption[];
  correctOptionIndex: number;
  solverEvidence: SpatialAnalogySolverEvidence;
  reviewMetadata: SpatialAnalogyReviewMetadata;
  explanationSteps: SpatialExplanationStep[];
  learnerExplanation: SpatialAnalogyLearnerExplanation;
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

export interface SpatialAnalogyDistractorInput {
  ruleId: SpatialAnalogyRuleId;
  label: SpatialAnalogyMisconceptionLabel;
}

export interface SpatialAnalogyProofGeneratorInput {
  seed: string;
  prototypeId: string;
  ruleId: SpatialAnalogyRuleId;
  aState: SpatialAnalogyFigureState;
  cState: SpatialAnalogyFigureState;
  distractors: readonly [SpatialAnalogyDistractorInput, SpatialAnalogyDistractorInput, SpatialAnalogyDistractorInput];
}
