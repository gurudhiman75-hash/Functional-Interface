import {
  FIGURE_GRAPH_V1_MATCHER_HARDENING,
  findFigureGraphEmbeddingsV1,
  spatialSceneToFigureGraphV1,
} from "../foundation/spatial/figure-graph-v1";
import type { SpatialNode, SpatialScene } from "../foundation/spatial/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function line(id: string, ax: number, ay: number, bx: number, by: number): SpatialNode {
  return {
    kind: "line",
    id,
    start: { x: ax, y: ay },
    end: { x: bx, y: by },
    style: { stroke: "#111", strokeWidth: 2, fill: "none" },
  };
}

function arc(id: string, cx: number, cy: number, radius: number, startAngleDeg: number, endAngleDeg: number): SpatialNode {
  return {
    kind: "arc",
    id,
    center: { x: cx, y: cy },
    radius,
    startAngleDeg,
    endAngleDeg,
    sweep: "clockwise",
    style: { stroke: "#111", strokeWidth: 2, fill: "none" },
  };
}

function scene(id: string, nodes: SpatialNode[]): SpatialScene {
  return {
    version: "1.0",
    id,
    viewBox: { minX: -10, minY: -10, width: 60, height: 60 },
    nodes,
  };
}

const policy = { allowRotation: true, allowReflection: false, allowScale: false as const, tolerance: 1e-4 };

assert(FIGURE_GRAPH_V1_MATCHER_HARDENING.segmentSubstructureViaHostLandmarks, "Segment landmark hardening must be enabled.");
assert(FIGURE_GRAPH_V1_MATCHER_HARDENING.exactSubArcContainment, "Sub-arc containment hardening must be enabled.");
assert(!FIGURE_GRAPH_V1_MATCHER_HARDENING.scalingAllowed, "Scaling must remain forbidden.");

const extendedLineTarget = scene("target-extended-line", [
  line("t-main", 0, 0, 10, 0),
  line("t-branch", 10, 0, 10, 8),
]);
const extendedLineHost = scene("host-extended-line", [
  line("h-main-long", -6, 0, 18, 0),
  line("h-branch", 10, 0, 10, 8),
  line("h-clutter", 2, -7, 2, 9),
]);
const lineEmbeddings = findFigureGraphEmbeddingsV1(
  spatialSceneToFigureGraphV1(extendedLineTarget),
  spatialSceneToFigureGraphV1(extendedLineHost),
  policy,
);
assert(lineEmbeddings.length > 0, "Target whose main edge is only a subsegment of a longer host line must be found.");

const subArcTarget = scene("target-sub-arc", [
  line("t-anchor", 0, 0, 10, 0),
  line("t-anchor-branch", 0, 0, 0, 5),
  arc("t-arc", 25, 20, 10, 180, 270),
]);
const subArcHost = scene("host-sub-arc", [
  line("h-anchor-long", -5, 0, 16, 0),
  line("h-anchor-branch", 0, -3, 0, 7),
  arc("h-arc-long", 25, 20, 10, 150, 300),
]);
const arcEmbeddings = findFigureGraphEmbeddingsV1(
  spatialSceneToFigureGraphV1(subArcTarget),
  spatialSceneToFigureGraphV1(subArcHost),
  policy,
);
assert(arcEmbeddings.length > 0, "Exact target sub-arc inside a longer host arc must be found.");

const wrongRadiusHost = scene("host-wrong-radius", [
  line("h-anchor-long", -5, 0, 16, 0),
  line("h-anchor-branch", 0, -3, 0, 7),
  arc("h-arc-long", 25, 20, 12, 150, 300),
]);
const wrongRadiusEmbeddings = findFigureGraphEmbeddingsV1(
  spatialSceneToFigureGraphV1(subArcTarget),
  spatialSceneToFigureGraphV1(wrongRadiusHost),
  policy,
);
assert(wrongRadiusEmbeddings.length === 0, "Different-radius host arc must not satisfy the target sub-arc.");

console.log("PASS_FIGURE_GRAPH_V1_SUBSTRUCTURE_HARDENING");
