import type {
  SpatialCircleNode,
  SpatialLineNode,
  SpatialPoint,
  SpatialPolygonNode,
  SpatialPolylineNode,
  SpatialArcNode,
  SpatialNode,
  SpatialScene,
  SpatialStyle,
  SpatialSymmetryProfile,
} from "./types";
import { SPATIAL_SCENE_VERSION } from "./types";
import {
  SPATIAL_PRIMITIVE_AUTHORITY_VERSION_V2,
  type SpatialPrimitiveAuthorityEntryV2,
  type SpatialPrimitiveCategory,
  type SpatialPrimitiveIdV2,
  type SpatialPrimitiveQuarterTurnPeriod,
  type SpatialPrimitiveTopology,
  type SpatialPrimitiveUsageRole,
} from "./primitive-types";

const CENTER: SpatialPoint = { x: 50, y: 50 };
const VIEW_BOX = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const OUTLINE_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 3,
  fill: "none",
  lineCap: "round",
  lineJoin: "round",
};
const FILLED_STYLE: SpatialStyle = {
  stroke: "#111",
  strokeWidth: 2,
  fill: "#111",
  lineCap: "round",
  lineJoin: "round",
};

function point(x: number, y: number): SpatialPoint {
  return { x, y };
}

function regularPolygonPoints(
  sides: number,
  radius: number,
  startAngleDeg: number,
): SpatialPoint[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = ((startAngleDeg + (360 * index) / sides) * Math.PI) / 180;
    return point(
      CENTER.x + radius * Math.cos(angle),
      CENTER.y + radius * Math.sin(angle),
    );
  });
}

function line(
  id: string,
  start: SpatialPoint,
  end: SpatialPoint,
  role = "primitive-stroke",
): SpatialLineNode {
  return { kind: "line", id, role, layer: 1, start, end, style: OUTLINE_STYLE };
}

function circle(
  id: string,
  radius: number,
  role = "primitive-outline",
  filled = false,
): SpatialCircleNode {
  return {
    kind: "circle",
    id,
    role,
    layer: 1,
    center: CENTER,
    radius,
    style: filled ? FILLED_STYLE : OUTLINE_STYLE,
  };
}

function polygon(
  id: string,
  points: SpatialPoint[],
  role = "primitive-outline",
  filled = false,
): SpatialPolygonNode {
  return {
    kind: "polygon",
    id,
    role,
    layer: 1,
    points,
    style: filled ? FILLED_STYLE : OUTLINE_STYLE,
  };
}

function polyline(
  id: string,
  points: SpatialPoint[],
  role = "primitive-stroke",
): SpatialPolylineNode {
  return {
    kind: "polyline",
    id,
    role,
    layer: 1,
    points,
    style: OUTLINE_STYLE,
  };
}

function arc(
  id: string,
  startAngleDeg: number,
  endAngleDeg: number,
  sweep: SpatialArcNode["sweep"],
): SpatialArcNode {
  return {
    kind: "arc",
    id,
    role: "primitive-outline",
    layer: 1,
    center: CENTER,
    radius: 30,
    startAngleDeg,
    endAngleDeg,
    sweep,
    style: OUTLINE_STYLE,
  };
}

type PrimitiveConfig = Omit<
  SpatialPrimitiveAuthorityEntryV2,
  "authorityVersion" | "canonicalScene"
>;

function primitive(config: PrimitiveConfig, nodes: SpatialNode[]): SpatialPrimitiveAuthorityEntryV2 {
  const canonicalScene: SpatialScene = {
    version: SPATIAL_SCENE_VERSION,
    id: `SPA-PRIM-V2-${config.primitiveId}`,
    viewBox: { ...VIEW_BOX },
    nodes,
    metadata: {
      chapterCode: "SPA-FND-001",
      semanticRole: "SPATIAL_PRIMITIVE_V2",
      primitiveId: config.primitiveId,
      primitiveCategory: config.category,
      primitiveTopology: config.topology,
      authorityVersion: SPATIAL_PRIMITIVE_AUTHORITY_VERSION_V2,
    },
  };
  return {
    ...config,
    authorityVersion: SPATIAL_PRIMITIVE_AUTHORITY_VERSION_V2,
    canonicalScene,
  };
}

function symmetry(
  vertical: boolean,
  horizontal: boolean,
  rotational180: boolean,
): SpatialSymmetryProfile {
  return { vertical, horizontal, rotational180 };
}

const OUTER_INNER: readonly SpatialPrimitiveUsageRole[] = [
  "OUTER_CONTAINER",
  "INNER_OBJECT",
  "ROTATION_STIMULUS",
  "REFLECTION_STIMULUS",
];
const INNER_TRANSFORM: readonly SpatialPrimitiveUsageRole[] = [
  "INNER_OBJECT",
  "ROTATION_STIMULUS",
  "REFLECTION_STIMULUS",
];
const LINE_TRANSFORM: readonly SpatialPrimitiveUsageRole[] = [
  "INNER_OBJECT",
  "COUNTABLE_SYMBOL",
  "ROTATION_STIMULUS",
  "REFLECTION_STIMULUS",
];
const PARTITIONED: readonly SpatialPrimitiveUsageRole[] = [
  "ROTATION_STIMULUS",
  "REFLECTION_STIMULUS",
  "PARTITION_STIMULUS",
];
const SYMBOL: readonly SpatialPrimitiveUsageRole[] = [
  "INNER_OBJECT",
  "COUNTABLE_SYMBOL",
  "ROTATION_STIMULUS",
  "REFLECTION_STIMULUS",
];

export const SPATIAL_PRIMITIVE_IDS_V2: readonly SpatialPrimitiveIdV2[] = [
  "CIRCLE", "TRIANGLE", "SQUARE", "RECTANGLE", "DIAMOND", "PENTAGON", "HEXAGON", "TRAPEZIUM", "SEMICIRCLE",
  "L_SHAPE", "T_SHAPE", "V_SHAPE", "U_SHAPE", "Z_SHAPE", "CHEVRON_RIGHT", "ZIGZAG",
  "PLUS", "X_CROSS", "PARALLEL_PAIR", "TRIPLE_PARALLEL", "THREE_SPOKE", "SIX_SPOKE", "ARROW_RIGHT",
  "SQUARE_DIAGONAL_DIVIDED", "SQUARE_CROSS_DIVIDED", "CIRCLE_DIAMETER", "CIRCLE_CROSS_DIVIDED", "TRIANGLE_MEDIAN_DIVIDED",
  "DOT", "RING", "TICK_DIAGONAL", "SMALL_CROSS", "FOUR_POINT_STAR",
] as const;

export const SPATIAL_PRIMITIVE_AUTHORITY_V2: readonly SpatialPrimitiveAuthorityEntryV2[] = [
  primitive({ primitiveId: "CIRCLE", label: "Circle", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: null, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["closed", "curved", "container"] }, [circle("circle", 30)]),
  primitive({ primitiveId: "TRIANGLE", label: "Triangle", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 3, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "three-sides", "directional"] }, [polygon("triangle", regularPolygonPoints(3, 32, -90))]),
  primitive({ primitiveId: "SQUARE", label: "Square", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 4, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "four-sides", "container"] }, [polygon("square", regularPolygonPoints(4, 31, -45))]),
  primitive({ primitiveId: "RECTANGLE", label: "Rectangle", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 4, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "four-sides", "elongated"] }, [polygon("rectangle", [point(20, 32), point(80, 32), point(80, 68), point(20, 68)])]),
  primitive({ primitiveId: "DIAMOND", label: "Diamond", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 4, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "four-sides", "diamond"] }, [polygon("diamond", regularPolygonPoints(4, 31, 0))]),
  primitive({ primitiveId: "PENTAGON", label: "Pentagon", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 5, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "five-sides", "directional"] }, [polygon("pentagon", regularPolygonPoints(5, 32, -90))]),
  primitive({ primitiveId: "HEXAGON", label: "Hexagon", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 6, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "six-sides", "container"] }, [polygon("hexagon", regularPolygonPoints(6, 32, 0))]),
  primitive({ primitiveId: "TRAPEZIUM", label: "Trapezium", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: 4, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: true, supportsFill: true, usageRoles: OUTER_INNER, examTags: ["polygon", "four-sides", "unequal-parallel-sides"] }, [polygon("trapezium", [point(34, 28), point(66, 28), point(80, 72), point(20, 72)])]),
  primitive({ primitiveId: "SEMICIRCLE", label: "Semicircle", category: "CLOSED_SHAPE", topology: "CLOSED", polygonSideCount: null, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["closed", "curved", "half-circle"] }, [arc("semicircle-arc", 180, 0, "clockwise"), line("semicircle-base", point(20, 50), point(80, 50), "primitive-outline")]),

  primitive({ primitiveId: "L_SHAPE", label: "L shape", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(false, false, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "right-angle", "directional"] }, [polyline("l-shape", [point(28, 25), point(28, 72), point(75, 72)])]),
  primitive({ primitiveId: "T_SHAPE", label: "T shape", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "junction", "directional"] }, [line("t-top", point(22, 30), point(78, 30)), line("t-stem", point(50, 30), point(50, 75))]),
  primitive({ primitiveId: "V_SHAPE", label: "V shape", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "angle", "directional"] }, [polyline("v-shape", [point(25, 28), point(50, 72), point(75, 28)])]),
  primitive({ primitiveId: "U_SHAPE", label: "U shape", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "three-stroke", "directional"] }, [polyline("u-shape", [point(25, 28), point(25, 70), point(75, 70), point(75, 28)])]),
  primitive({ primitiveId: "Z_SHAPE", label: "Z shape", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 2, symmetry: symmetry(false, false, true), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "zig", "half-turn-symmetry"] }, [polyline("z-shape", [point(24, 30), point(76, 30), point(24, 70), point(76, 70)])]),
  primitive({ primitiveId: "CHEVRON_RIGHT", label: "Right chevron", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(false, true, false), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "chevron", "directional"] }, [polyline("chevron", [point(32, 24), point(68, 50), point(32, 76)])]),
  primitive({ primitiveId: "ZIGZAG", label: "Zigzag", category: "OPEN_FIGURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 2, symmetry: symmetry(false, false, true), canContainInner: false, supportsFill: false, usageRoles: INNER_TRANSFORM, examTags: ["open", "alternating", "half-turn-symmetry"] }, [polyline("zigzag", [point(20, 34), point(40, 66), point(60, 34), point(80, 66)])]),

  primitive({ primitiveId: "PLUS", label: "Plus", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "cross", "four-rays"] }, [line("plus-h", point(22, 50), point(78, 50)), line("plus-v", point(50, 22), point(50, 78))]),
  primitive({ primitiveId: "X_CROSS", label: "X cross", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "cross", "diagonal"] }, [line("x-a", point(28, 28), point(72, 72)), line("x-b", point(72, 28), point(28, 72))]),
  primitive({ primitiveId: "PARALLEL_PAIR", label: "Parallel pair", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "parallel", "two-lines"] }, [line("parallel-a", point(24, 40), point(76, 40)), line("parallel-b", point(24, 60), point(76, 60))]),
  primitive({ primitiveId: "TRIPLE_PARALLEL", label: "Triple parallel", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "parallel", "three-lines"] }, [line("parallel-1", point(24, 34), point(76, 34)), line("parallel-2", point(24, 50), point(76, 50)), line("parallel-3", point(24, 66), point(76, 66))]),
  primitive({ primitiveId: "THREE_SPOKE", label: "Three-spoke Y", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "spokes", "three-rays"] }, [line("spoke-top", CENTER, point(50, 20)), line("spoke-left", CENTER, point(24, 68)), line("spoke-right", CENTER, point(76, 68))]),
  primitive({ primitiveId: "SIX_SPOKE", label: "Six-spoke structure", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "spokes", "six-rays"] }, [line("six-0", point(20, 50), point(80, 50)), line("six-60", point(35, 76), point(65, 24)), line("six-120", point(35, 24), point(65, 76))]),
  primitive({ primitiveId: "ARROW_RIGHT", label: "Right arrow", category: "LINE_STRUCTURE", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(false, true, false), canContainInner: false, supportsFill: false, usageRoles: LINE_TRANSFORM, examTags: ["line-structure", "arrow", "directional"] }, [line("arrow-shaft", point(22, 50), point(76, 50)), line("arrow-head-up", point(76, 50), point(61, 37)), line("arrow-head-down", point(76, 50), point(61, 63))]),

  primitive({ primitiveId: "SQUARE_DIAGONAL_DIVIDED", label: "Square divided diagonally", category: "PARTITIONED_FIGURE", topology: "COMPOSITE", polygonSideCount: 4, enclosedRegionCount: 2, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 2, symmetry: symmetry(false, false, true), canContainInner: false, supportsFill: false, usageRoles: PARTITIONED, examTags: ["partitioned", "square", "two-regions"] }, [polygon("sd-square", regularPolygonPoints(4, 31, -45)), line("sd-diagonal", point(28.08, 28.08), point(71.92, 71.92), "partition-line")]),
  primitive({ primitiveId: "SQUARE_CROSS_DIVIDED", label: "Square divided into four", category: "PARTITIONED_FIGURE", topology: "COMPOSITE", polygonSideCount: 4, enclosedRegionCount: 4, interiorIntersectionCount: 1, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: PARTITIONED, examTags: ["partitioned", "square", "four-regions"] }, [polygon("sc-square", regularPolygonPoints(4, 31, -45)), line("sc-h", point(28.08, 50), point(71.92, 50), "partition-line"), line("sc-v", point(50, 28.08), point(50, 71.92), "partition-line")]),
  primitive({ primitiveId: "CIRCLE_DIAMETER", label: "Circle with diameter", category: "PARTITIONED_FIGURE", topology: "COMPOSITE", polygonSideCount: null, enclosedRegionCount: 2, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: false, rotationPeriodQuarterTurns: 2, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: PARTITIONED, examTags: ["partitioned", "circle", "two-regions"] }, [circle("cd-circle", 30), line("cd-diameter", point(20, 50), point(80, 50), "partition-line")]),
  primitive({ primitiveId: "CIRCLE_CROSS_DIVIDED", label: "Circle divided into four", category: "PARTITIONED_FIGURE", topology: "COMPOSITE", polygonSideCount: null, enclosedRegionCount: 4, interiorIntersectionCount: 1, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: PARTITIONED, examTags: ["partitioned", "circle", "four-regions"] }, [circle("cc-circle", 30), line("cc-h", point(20, 50), point(80, 50), "partition-line"), line("cc-v", point(50, 20), point(50, 80), "partition-line")]),
  primitive({ primitiveId: "TRIANGLE_MEDIAN_DIVIDED", label: "Triangle divided by median", category: "PARTITIONED_FIGURE", topology: "COMPOSITE", polygonSideCount: 3, enclosedRegionCount: 2, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 4, symmetry: symmetry(true, false, false), canContainInner: false, supportsFill: false, usageRoles: PARTITIONED, examTags: ["partitioned", "triangle", "two-regions"] }, [polygon("tm-triangle", regularPolygonPoints(3, 32, -90)), line("tm-median", point(50, 18), point(50, 66), "partition-line")]),

  primitive({ primitiveId: "DOT", label: "Dot", category: "INTERNAL_SYMBOL", topology: "POINT", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: true, usageRoles: SYMBOL, examTags: ["symbol", "dot", "countable"] }, [circle("dot", 5, "primitive-symbol", true)]),
  primitive({ primitiveId: "RING", label: "Ring", category: "INTERNAL_SYMBOL", topology: "CLOSED", polygonSideCount: null, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: true, usageRoles: SYMBOL, examTags: ["symbol", "ring", "countable"] }, [circle("ring", 12, "primitive-symbol")]),
  primitive({ primitiveId: "TICK_DIAGONAL", label: "Diagonal tick", category: "INTERNAL_SYMBOL", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 0, orientationSensitive: true, reflectionSensitive: true, rotationPeriodQuarterTurns: 2, symmetry: symmetry(false, false, true), canContainInner: false, supportsFill: false, usageRoles: SYMBOL, examTags: ["symbol", "tick", "directional"] }, [line("tick", point(38, 60), point(62, 40), "primitive-symbol")]),
  primitive({ primitiveId: "SMALL_CROSS", label: "Small cross", category: "INTERNAL_SYMBOL", topology: "OPEN", polygonSideCount: null, enclosedRegionCount: 0, interiorIntersectionCount: 1, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: false, usageRoles: SYMBOL, examTags: ["symbol", "cross", "countable"] }, [line("small-cross-h", point(38, 50), point(62, 50), "primitive-symbol"), line("small-cross-v", point(50, 38), point(50, 62), "primitive-symbol")]),
  primitive({ primitiveId: "FOUR_POINT_STAR", label: "Four-point star", category: "INTERNAL_SYMBOL", topology: "CLOSED", polygonSideCount: null, enclosedRegionCount: 1, interiorIntersectionCount: 0, orientationSensitive: false, reflectionSensitive: false, rotationPeriodQuarterTurns: 1, symmetry: symmetry(true, true, true), canContainInner: false, supportsFill: true, usageRoles: SYMBOL, examTags: ["symbol", "star", "countable"] }, [polygon("four-star", [point(50, 34), point(55, 45), point(66, 50), point(55, 55), point(50, 66), point(45, 55), point(34, 50), point(45, 45)], "primitive-symbol", true)]),
] as const;

const PRIMITIVE_BY_ID = new Map(
  SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => [entry.primitiveId, entry]),
);

export function getSpatialPrimitiveV2(
  primitiveId: SpatialPrimitiveIdV2,
): SpatialPrimitiveAuthorityEntryV2 {
  const entry = PRIMITIVE_BY_ID.get(primitiveId);
  if (!entry) throw new Error(`Unknown spatial primitive '${primitiveId}'.`);
  return entry;
}

export function listSpatialPrimitivesByCategoryV2(
  category: SpatialPrimitiveCategory,
): SpatialPrimitiveAuthorityEntryV2[] {
  return SPATIAL_PRIMITIVE_AUTHORITY_V2.filter((entry) => entry.category === category);
}

export function spatialPrimitiveQuarterTurnPeriodLabel(
  period: SpatialPrimitiveQuarterTurnPeriod,
): string {
  if (period === 1) return "90°-invariant";
  if (period === 2) return "180° period";
  return "360° period";
}

export function spatialPrimitiveTopologyLabel(topology: SpatialPrimitiveTopology): string {
  return topology.toLowerCase();
}
