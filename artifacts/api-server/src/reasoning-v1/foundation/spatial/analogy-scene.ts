import { canonicalSpatialAnalogyShapeQuarter } from "./analogy-rule-authority";
import type {
  SpatialAnalogyDirection,
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyQuarterTurn,
  SpatialAnalogySegmentAnchor,
  SpatialAnalogyShape,
} from "./analogy-types";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialNode,
  type SpatialPoint,
  type SpatialScene,
  type SpatialStyle,
} from "./types";

export const SPATIAL_ANALOGY_INNER_OPEN_FILL = "none" as const;
export const SPATIAL_ANALOGY_INNER_SHADED_FILL = "#c7cbd1" as const;

const OUTER_STYLE: SpatialStyle = { stroke: "#111", strokeWidth: 2.2, fill: "none", lineJoin: "round" };
const INNER_OPEN_STYLE: SpatialStyle = { stroke: "#111", strokeWidth: 2, fill: SPATIAL_ANALOGY_INNER_OPEN_FILL, lineJoin: "round" };
const INNER_SHADED_STYLE: SpatialStyle = { stroke: "#111", strokeWidth: 2, fill: SPATIAL_ANALOGY_INNER_SHADED_FILL, lineJoin: "round" };
const LINE_STYLE: SpatialStyle = { stroke: "#111", strokeWidth: 2.1, lineCap: "round", lineJoin: "round" };

const MARKER_POINTS: Record<SpatialAnalogyMarkerPosition, SpatialPoint> = {
  TOP_LEFT: { x: 21, y: 21 },
  TOP_RIGHT: { x: 79, y: 21 },
  BOTTOM_RIGHT: { x: 79, y: 79 },
  BOTTOM_LEFT: { x: 21, y: 79 },
};
const DIRECTION_VECTOR: Record<SpatialAnalogyDirection, SpatialPoint> = {
  UP: { x: 0, y: -1 }, RIGHT: { x: 1, y: 0 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 },
};

function regularPolygonPoints(sides: number, radius: number, startAngleDeg: number): SpatialPoint[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = ((startAngleDeg + (360 / sides) * index) * Math.PI) / 180;
    return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
  });
}

function shapeNode(
  id: string,
  role: string,
  layer: number,
  shape: SpatialAnalogyShape,
  rotationQuarter: SpatialAnalogyQuarterTurn,
  radius: number,
  style: SpatialStyle,
): SpatialNode {
  const canonicalQuarter = canonicalSpatialAnalogyShapeQuarter(shape, rotationQuarter);
  const startAngleDeg = -90 + canonicalQuarter * 90;
  if (shape === "CIRCLE") {
    return { kind: "circle", id, role, layer, center: { x: 50, y: 50 }, radius, style };
  }
  if (shape === "SQUARE") {
    return {
      kind: "polygon", id, role, layer,
      points: [
        { x: 50 - radius, y: 50 - radius }, { x: 50 + radius, y: 50 - radius },
        { x: 50 + radius, y: 50 + radius }, { x: 50 - radius, y: 50 + radius },
      ],
      style,
    };
  }
  return {
    kind: "polygon", id, role, layer,
    points: regularPolygonPoints(shape === "TRIANGLE" ? 3 : 5, radius, startAngleDeg),
    style,
  };
}

function directionNodes(direction: SpatialAnalogyDirection): SpatialNode[] {
  const vector = DIRECTION_VECTOR[direction];
  const perpendicular = { x: -vector.y, y: vector.x };
  const start = { x: 50 - vector.x * 4, y: 50 - vector.y * 4 };
  const end = { x: 50 + vector.x * 11, y: 50 + vector.y * 11 };
  const headBase = { x: end.x - vector.x * 5, y: end.y - vector.y * 5 };
  return [
    { kind: "line", id: "direction-shaft", role: "direction-indicator", layer: 4, start, end, style: LINE_STYLE },
    { kind: "line", id: "direction-head-a", role: "direction-indicator", layer: 4, start: end, end: { x: headBase.x + perpendicular.x * 3.5, y: headBase.y + perpendicular.y * 3.5 }, style: LINE_STYLE },
    { kind: "line", id: "direction-head-b", role: "direction-indicator", layer: 4, start: end, end: { x: headBase.x - perpendicular.x * 3.5, y: headBase.y - perpendicular.y * 3.5 }, style: LINE_STYLE },
  ];
}

function segmentNodes(count: number, anchor: SpatialAnalogySegmentAnchor): SpatialNode[] {
  const spacing = 8;
  const first = 50 - ((count - 1) * spacing) / 2;
  const near = 84;
  const far = 92;
  return Array.from({ length: count }, (_, index) => {
    const offset = first + index * spacing;
    const endpoints: Record<SpatialAnalogySegmentAnchor, { start: SpatialPoint; end: SpatialPoint }> = {
      TOP: { start: { x: offset, y: 100 - near }, end: { x: offset, y: 100 - far } },
      RIGHT: { start: { x: near, y: offset }, end: { x: far, y: offset } },
      BOTTOM: { start: { x: offset, y: near }, end: { x: offset, y: far } },
      LEFT: { start: { x: 100 - near, y: offset }, end: { x: 100 - far, y: offset } },
    };
    return {
      kind: "line" as const,
      id: `segment-${index + 1}`,
      role: "count-segment",
      layer: 5,
      ...endpoints[anchor],
      style: { stroke: "#111", strokeWidth: 2.4, lineCap: "round" as const },
    };
  });
}

export function setSpatialAnalogyInnerShading(scene: SpatialScene, shadedInner: boolean, nextId = scene.id): SpatialScene {
  return {
    ...scene,
    id: nextId,
    nodes: scene.nodes.map((node) => node.role === "inner-shape"
      ? { ...node, style: { ...node.style, fill: shadedInner ? SPATIAL_ANALOGY_INNER_SHADED_FILL : SPATIAL_ANALOGY_INNER_OPEN_FILL } }
      : node),
    metadata: scene.metadata ? { ...scene.metadata, shadedInner } : { shadedInner },
  };
}

export function buildSpatialAnalogyFigureScene(state: SpatialAnalogyFigureState, id: string): SpatialScene {
  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes: [
      shapeNode("outer-shape", "outer-shape", 1, state.outerShape, state.outerRotationQuarter, 31, OUTER_STYLE),
      shapeNode("inner-shape", "inner-shape", 2, state.innerShape, state.innerRotationQuarter, 14, state.shadedInner ? INNER_SHADED_STYLE : INNER_OPEN_STYLE),
      ...directionNodes(state.direction),
      ...segmentNodes(state.segmentCount, state.segmentAnchor),
      { kind: "circle", id: "marker", role: "distinguishing-marker", layer: 6, center: MARKER_POINTS[state.markerPosition], radius: 3.5, style: { stroke: "#111", strokeWidth: 1.2, fill: "#111" } },
    ],
    metadata: {
      chapterCode: "FAN-001",
      semanticRole: "FIGURE_ANALOGY_STATE",
      outerShape: state.outerShape,
      innerShape: state.innerShape,
      outerRotationQuarter: state.outerRotationQuarter,
      innerRotationQuarter: state.innerRotationQuarter,
      markerPosition: state.markerPosition,
      direction: state.direction,
      shadedInner: state.shadedInner,
      segmentCount: state.segmentCount,
      segmentAnchor: state.segmentAnchor,
    },
  };
}
