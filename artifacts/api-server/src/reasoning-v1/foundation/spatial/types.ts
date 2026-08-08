export const SPATIAL_SCENE_VERSION = "1.0" as const;

export type SpatialSceneVersion = typeof SPATIAL_SCENE_VERSION;

export interface SpatialPoint {
  x: number;
  y: number;
}

export interface SpatialViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export type SpatialLineCap = "butt" | "round" | "square";
export type SpatialLineJoin = "miter" | "round" | "bevel";

export interface SpatialStyle {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  dashArray?: number[];
  lineCap?: SpatialLineCap;
  lineJoin?: SpatialLineJoin;
}

export interface SpatialNodeBase {
  id: string;
  layer?: number;
  role?: string;
  style?: SpatialStyle;
  explanationTags?: string[];
}

export interface SpatialLineNode extends SpatialNodeBase {
  kind: "line";
  start: SpatialPoint;
  end: SpatialPoint;
}

export interface SpatialCircleNode extends SpatialNodeBase {
  kind: "circle";
  center: SpatialPoint;
  radius: number;
}

export interface SpatialPolygonNode extends SpatialNodeBase {
  kind: "polygon";
  points: SpatialPoint[];
}

export interface SpatialPolylineNode extends SpatialNodeBase {
  kind: "polyline";
  points: SpatialPoint[];
}

export type SpatialArcSweep = "clockwise" | "counterclockwise";

export interface SpatialArcNode extends SpatialNodeBase {
  kind: "arc";
  center: SpatialPoint;
  radius: number;
  startAngleDeg: number;
  endAngleDeg: number;
  sweep: SpatialArcSweep;
}

export type SpatialNode =
  | SpatialLineNode
  | SpatialCircleNode
  | SpatialPolygonNode
  | SpatialPolylineNode
  | SpatialArcNode;

export interface SpatialSceneMetadata {
  chapterCode?: string;
  qlId?: string;
  seed?: string;
  semanticRole?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface SpatialScene {
  version: SpatialSceneVersion;
  id: string;
  viewBox: SpatialViewBox;
  nodes: SpatialNode[];
  metadata?: SpatialSceneMetadata;
}

export type SpatialLocaleMode =
  | "LANGUAGE_NEUTRAL"
  | "INSTRUCTION_LOCALISED"
  | "SCRIPT_SPECIFIC";

export type SpatialScript =
  | "LATIN"
  | "DEVANAGARI"
  | "GURMUKHI"
  | "WESTERN_ARABIC_DIGIT"
  | "SYMBOL";

export interface SpatialSymmetryProfile {
  vertical: boolean;
  horizontal: boolean;
  rotational180: boolean;
}

export type SpatialRequestedTransform =
  | "REFLECT_VERTICAL"
  | "REFLECT_HORIZONTAL"
  | "ROTATE_180";

export interface SpatialTransformCandidate {
  label: string;
  scene: SpatialScene;
}

export interface SpatialGlyphAuthorityEntry {
  glyphId: string;
  script: SpatialScript;
  localeMode: SpatialLocaleMode;
  canonicalScene: SpatialScene;
  symmetry: SpatialSymmetryProfile;
  authorityVersion: string;
}

export interface SpatialClockTime {
  hour: number;
  minute: number;
}

export interface SpatialClockHandAngles {
  hourAngleDeg: number;
  minuteAngleDeg: number;
}

export interface SpatialReviewMetadata {
  stimulusKind: string;
  requestedTransform: SpatialRequestedTransform;
  localeMode: SpatialLocaleMode;
  symmetryProfile: SpatialSymmetryProfile;
  canonicalFingerprint: string;
  correctTransformFingerprint: string;
  optionTransformLabels: string[];
  equivalentCandidateCheck: "PASS" | "FAIL";
  clockGeometryCheck?: "PASS" | "FAIL" | "NOT_APPLICABLE";
  clockShortcutCheck?: "PASS" | "FAIL" | "NOT_APPLICABLE";
  perceptualSeparationCheck?: "PASS" | "FAIL" | "NOT_APPLICABLE";
  minimumVisualEndpointDistance?: number;
  minimumMarkerClearance?: number;
  recommendedOptionPixels?: number;
}

export interface SpatialExplanationStep {
  id: string;
  operation: string;
  sourceNodeIds: string[];
  resultNodeIds?: string[];
  highlightNodeIds?: string[];
  evidence?: Record<string, string | number | boolean | string[]>;
}

export interface SpatialVisualQuestionPayload {
  kind: "visual";
  visualVersion: SpatialSceneVersion;
  stemScene?: SpatialScene;
  optionScenes: SpatialScene[];
  explanationSteps?: SpatialExplanationStep[];
}

export interface SpatialValidationIssue {
  code: string;
  message: string;
  nodeId?: string;
}

export interface SpatialValidationResult {
  ok: boolean;
  errors: SpatialValidationIssue[];
  warnings: SpatialValidationIssue[];
}
