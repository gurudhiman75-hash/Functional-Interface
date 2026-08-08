import type {
  SpatialAnalogyDirection,
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyShape,
} from "./analogy-types";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialNode,
  type SpatialPoint,
  type SpatialScene,
  type SpatialStyle,
} from "./types";

const OUTER_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 2.2,
  fill: "none",
  lineJoin: "round",
};

const INNER_OPEN_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 2,
  fill: "none",
  lineJoin: "round",
};

const INNER_SHADED_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 2,
  fill: "#c7cbd1",
  lineJoin: "round",
};

const LINE_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 2.1,
  lineCap: "round",
  lineJoin: "round",
};

const MARKER_POINTS: Record<SpatialAnalogyMarkerPosition, SpatialPoint> = {
  TOP_LEFT: { x: 23, y: 23 },
  TOP_RIGHT: { x: 77, y: 23 },
  BOTTOM_RIGHT: { x: 77, y: 77 },
  BOTTOM_LEFT: { x: 23, y: 77 },
};

const DIRECTION_VECTOR: Record<SpatialAnalogyDirection, SpatialPoint> = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
};

function regularPolygonPoints(
  sides: number,
  radius: number,
  startAngleDeg: number,
): SpatialPoint[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = ((startAngleDeg + (360 / sides) * index) * Math.PI) / 180;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });
}

function shapeNode(
  id: string,
  role: string,
  shape: SpatialAnalogyShape,
  radius: number,
  style: SpatialStyle,
): SpatialNode {
  switch (shape) {
    case "CIRCLE":
      return {
        kind: "circle",
        id,
        role,
        center: { x: 50, y: 50 },
        radius,
        style,
      };
    case "SQUARE":
      return {
        kind: "polygon",
        id,
        role,
        points: [
          { x: 50 - radius, y: 50 - radius },
          { x: 50 + radius, y: 50 - radius },
          { x: 50 + radius, y: 50 + radius },
          { x: 50 - radius, y: 50 + radius },
        ],
        style,
      };
    case "TRIANGLE":
      return {
        kind: "polygon",
        id,
        role,
        points: regularPolygonPoints(3, radius, -90),
        style,
      };
    case "PENTAGON":
      return {
        kind: "polygon",
        id,
        role,
        points: regularPolygonPoints(5, radius, -90),
        style,
      };
  }
}

function directionNodes(direction: SpatialAnalogyDirection): SpatialNode[] {
  const vector = DIRECTION_VECTOR[direction];
  const perpendicular = { x: -vector.y, y: vector.x };
  const start = { x: 50 - vector.x * 5, y: 50 - vector.y * 5 };
  const end = { x: 50 + vector.x * 12, y: 50 + vector.y * 12 };
  const headBase = { x: end.x - vector.x * 5, y: end.y - vector.y * 5 };

  return [
    {
      kind: "line",
      id: "direction-shaft",
      role: "direction-indicator",
      start,
      end,
      style: LINE_STYLE,
    },
    {
      kind: "line",
      id: "direction-head-a",
      role: "direction-indicator",
      start: end,
      end: {
        x: headBase.x + perpendicular.x * 3.5,
        y: headBase.y + perpendicular.y * 3.5,
      },
      style: LINE_STYLE,
    },
    {
      kind: "line",
      id: "direction-head-b",
      role: "direction-indicator",
      start: end,
      end: {
        x: headBase.x - perpendicular.x * 3.5,
        y: headBase.y - perpendicular.y * 3.5,
      },
      style: LINE_STYLE,
    },
  ];
}

function segmentNodes(count: number): SpatialNode[] {
  const spacing = 8;
  const startX = 50 - ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => ({
    kind: "line" as const,
    id: `segment-${index + 1}`,
    role: "count-segment",
    start: { x: startX + index * spacing, y: 68 },
    end: { x: startX + index * spacing, y: 75 },
    style: {
      stroke: "#111",
      strokeWidth: 2.4,
      lineCap: "round" as const,
    },
  }));
}

export function buildSpatialAnalogyFigureScene(
  state: SpatialAnalogyFigureState,
  id: string,
): SpatialScene {
  const markerPoint = MARKER_POINTS[state.markerPosition];

  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes: [
      shapeNode("outer-shape", "outer-shape", state.outerShape, 34, OUTER_STYLE),
      shapeNode(
        "inner-shape",
        "inner-shape",
        state.innerShape,
        16,
        state.shadedInner ? INNER_SHADED_STYLE : INNER_OPEN_STYLE,
      ),
      {
        kind: "circle",
        id: "marker",
        role: "distinguishing-marker",
        center: markerPoint,
        radius: 3.5,
        style: { stroke: "#111", strokeWidth: 1.2, fill: "#111" },
      },
      ...directionNodes(state.direction),
      ...segmentNodes(state.segmentCount),
    ],
    metadata: {
      chapterCode: "FAN-001",
      semanticRole: "FIGURE_ANALOGY_STATE",
      outerShape: state.outerShape,
      innerShape: state.innerShape,
      markerPosition: state.markerPosition,
      direction: state.direction,
      shadedInner: state.shadedInner,
      segmentCount: state.segmentCount,
    },
  };
}
