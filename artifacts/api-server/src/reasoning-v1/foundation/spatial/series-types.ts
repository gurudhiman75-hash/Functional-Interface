import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import type { SpatialScene } from "./types";

export type SpatialSeriesQuarterTurn = 0 | 1 | 2 | 3;
export type SpatialSeriesCardinal = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
export type SpatialSeriesDotCount = 1 | 2 | 3 | 4 | 5;

export interface SpatialSeriesFrameState {
  primitiveId: SpatialPrimitiveIdV2;
  rotationQuarterTurns: SpatialSeriesQuarterTurn;
  markerPosition: SpatialSeriesCardinal;
  dotAnchor: SpatialSeriesCardinal;
  dotCount: SpatialSeriesDotCount;
}

export interface SpatialSeriesPresentationProfile {
  showMarker: boolean;
  showDots: boolean;
}

export type SpatialSeriesRuleId =
  | "ROTATE_90_CW"
  | "ROTATE_90_CCW"
  | "ROTATE_180"
  | "MOVE_MARKER_CW"
  | "MOVE_MARKER_CCW"
  | "MOVE_MARKER_180"
  | "MOVE_DOTS_CW"
  | "MOVE_DOTS_CCW"
  | "MOVE_DOTS_180"
  | "INCREASE_DOTS"
  | "DECREASE_DOTS"
  | "ROTATE_90_CW_MOVE_MARKER_CCW"
  | "ROTATE_90_CCW_MOVE_DOTS_CW"
  | "NO_CHANGE";

export type SpatialSeriesProofRuleId =
  | "ROTATE_90_CW"
  | "ROTATE_90_CCW"
  | "ROTATE_180"
  | "MOVE_MARKER_CW"
  | "MOVE_MARKER_CCW"
  | "MOVE_DOTS_CW"
  | "MOVE_DOTS_CCW"
  | "INCREASE_DOTS"
  | "ROTATE_90_CW_MOVE_MARKER_CCW"
  | "ROTATE_90_CCW_MOVE_DOTS_CW";

export interface SpatialSeriesProofOption {
  label: string;
  appliedRuleId: SpatialSeriesRuleId;
  state: SpatialSeriesFrameState;
  scene: SpatialScene;
  sceneFingerprint: string;
}

export interface SpatialSeriesVisualValidation {
  ok: boolean;
  errors: string[];
  primitiveTransformCheck: "PASS" | "NOT_APPLICABLE";
  markerMotionCheck: "PASS" | "NOT_APPLICABLE";
  dotMotionCheck: "PASS" | "NOT_APPLICABLE";
  dotCountCheck: "PASS" | "NOT_APPLICABLE";
}

export interface SpatialSeriesSolverEvidence {
  inferredRuleIds: SpatialSeriesRuleId[];
  expectedRuleId: SpatialSeriesProofRuleId;
  uniqueInferenceCheck: "PASS";
  transitionVisualChecks: SpatialSeriesVisualValidation[];
  optionSceneFingerprints: string[];
  correctOptionIndex: number;
}

export interface SpatialSeriesProofQuestion {
  familyCode: "SPA-001";
  chapterCode: "FSR-001";
  prototypeId: string;
  instructionKey: "FSR_SELECT_NEXT_FIGURE";
  ruleId: SpatialSeriesProofRuleId;
  presentationProfile: SpatialSeriesPresentationProfile;
  seriesStates: readonly [
    SpatialSeriesFrameState,
    SpatialSeriesFrameState,
    SpatialSeriesFrameState,
    SpatialSeriesFrameState,
  ];
  seriesScenes: readonly [SpatialScene, SpatialScene, SpatialScene, SpatialScene];
  options: SpatialSeriesProofOption[];
  correctOptionIndex: number;
  solverEvidence: SpatialSeriesSolverEvidence;
  learnerExplanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  lifecycle: {
    permanentQlId: null;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

export interface SpatialSeriesProofDefinition {
  prototypeId: string;
  ruleId: SpatialSeriesProofRuleId;
  initialState: SpatialSeriesFrameState;
  presentationProfile: SpatialSeriesPresentationProfile;
  distractorRuleIds: readonly [SpatialSeriesRuleId, SpatialSeriesRuleId, SpatialSeriesRuleId];
  desiredCorrectOptionIndex: 0 | 1 | 2 | 3;
}
