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
