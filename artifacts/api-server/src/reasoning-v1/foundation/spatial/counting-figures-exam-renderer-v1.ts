import type { CountingFigureGraphV1 } from "./counting-figures-graph-v1";
import type { CountingFigureMotifFamilyV2 } from "./counting-figures-production-generator-v2";

export const FCT_001_EXAM_RENDERER_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-EXAM-RENDERER-V1" as const,
  chapterCode: "FCT-001" as const,
  orientationPolicy: "CANONICAL_EXAM_ORIENTATION_WITH_RIGID_ROTATION_ONLY" as const,
  geometryFingerprintPolicy: "NORMALIZED_DISPLAYED_SEGMENTS_NOT_SOURCE_ROTATION" as const,
  strokeWidth: 1.35 as const,
  preservesSolverGraph: true,
  preservesEdgeConnectivity: true,
  automaticStudentPublication: false,
});

type Point = Readonly<{ x: number; y: number }>;

const AXIS_ALIGNED_MOTIFS = new Set<CountingFigureMotifFamilyV2>([
  "TRIANGLE_FAN",
  "CROSSED_QUADRILATERAL_TRIANGLES",
  "DOUBLE_TRIANGLE_FAN",
  "SQUARE_GRID",
  "RECTANGULAR_GRID_SQUARES",
  "IRREGULAR_RECTANGLE_GRID",
  "QUADRILATERAL_STRIP",
  "DIAGONAL_SQUARE_GRID",
  "DIAGONAL_RECTANGLE_GRID",
  "QUADRILATERAL_LATTICE",
]);

function anchorEdgePrefix(motifFamily: CountingFigureMotifFamilyV2): string | null {
  if (motifFamily === "TRIANGLE_FAN" || motifFamily === "DOUBLE_TRIANGLE_FAN") return "base";
  if (motifFamily === "CROSSED_QUADRILATERAL_TRIANGLES") return "ab";
  if (
    motifFamily === "SQUARE_GRID" ||
    motifFamily === "ROTATED_SQUARE_GRID" ||
    motifFamily === "RECTANGULAR_GRID_SQUARES" ||
    motifFamily === "IRREGULAR_RECTANGLE_GRID" ||
    motifFamily === "DIAGONAL_SQUARE_GRID" ||
    motifFamily === "DIAGONAL_RECTANGLE_GRID"
  ) {
    return "h";
  }
  if (motifFamily === "QUADRILATERAL_STRIP") return "top";
  if (motifFamily === "QUADRILATERAL_LATTICE") return "rail";
  return null;
}

function angleDegrees(a: Point, b: Point): number {
  return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
}

function rotateGraphRigidly(
  graph: CountingFigureGraphV1,
  degrees: number,
): CountingFigureGraphV1 {
  if (Math.abs(degrees) < 1e-10) return graph;
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const cx = graph.vertices.reduce((sum, vertex) => sum + vertex.x, 0) / graph.vertices.length;
  const cy = graph.vertices.reduce((sum, vertex) => sum + vertex.y, 0) / graph.vertices.length;
  return {
    vertices: graph.vertices.map((vertex) => {
      const x = vertex.x - cx;
      const y = vertex.y - cy;
      return {
        id: vertex.id,
        x: cx + x * cos - y * sin,
        y: cy + x * sin + y * cos,
      };
    }),
    edges: graph.edges,
  };
}

export function standardizeCountingFigureGraphForExamV1(
  graph: CountingFigureGraphV1,
  motifFamily: CountingFigureMotifFamilyV2,
): CountingFigureGraphV1 {
  const prefix = anchorEdgePrefix(motifFamily);
  if (!prefix) return graph;

  const edge = graph.edges.find((candidate) => candidate.id.startsWith(prefix));
  if (!edge) return graph;
  const byId = new Map(graph.vertices.map((vertex) => [vertex.id, vertex] as const));
  const a = byId.get(edge.a);
  const b = byId.get(edge.b);
  if (!a || !b) return graph;

  const currentAngle = angleDegrees(a, b);
  const targetAngle = motifFamily === "ROTATED_SQUARE_GRID" ? 45 : 0;
  return rotateGraphRigidly(graph, targetAngle - currentAngle);
}

function normalizeGraphForSvg(
  graph: CountingFigureGraphV1,
): ReadonlyMap<string, Readonly<{ x: number; y: number }>> {
  const xs = graph.vertices.map((vertex) => vertex.x);
  const ys = graph.vertices.map((vertex) => vertex.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1e-6, maxX - minX);
  const height = Math.max(1e-6, maxY - minY);
  const scale = Math.min(96 / width, 96 / height);
  const offsetX = 60 - (minX + maxX) * scale / 2;
  const offsetY = 60 - (minY + maxY) * scale / 2;
  return new Map(graph.vertices.map((vertex) => [vertex.id, {
    x: vertex.x * scale + offsetX,
    y: vertex.y * scale + offsetY,
  }] as const));
}

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function canonicalDisplayedSegments(
  graph: CountingFigureGraphV1,
  motifFamily: CountingFigureMotifFamilyV2,
): string {
  const standardized = standardizeCountingFigureGraphForExamV1(graph, motifFamily);
  const points = normalizeGraphForSvg(standardized);
  return standardized.edges.map((edge) => {
    const a = points.get(edge.a)!;
    const b = points.get(edge.b)!;
    const left = `${a.x.toFixed(5)},${a.y.toFixed(5)}`;
    const right = `${b.x.toFixed(5)},${b.y.toFixed(5)}`;
    return left < right ? `${left}-${right}` : `${right}-${left}`;
  }).sort().join(";");
}

export function countingFigureExamGeometryFingerprintV1(
  graph: CountingFigureGraphV1,
  motifFamily: CountingFigureMotifFamilyV2,
): string {
  return `fcteg-${hash32(canonicalDisplayedSegments(graph, motifFamily)).toString(16).padStart(8, "0")}`;
}

export function renderCountingFigureExamSvgV1(
  graph: CountingFigureGraphV1,
  motifFamily: CountingFigureMotifFamilyV2,
): string {
  const standardized = standardizeCountingFigureGraphForExamV1(graph, motifFamily);
  const points = normalizeGraphForSvg(standardized);
  const lines = standardized.edges.map((edge) => {
    const a = points.get(edge.a)!;
    const b = points.get(edge.b)!;
    return `<line x1="${a.x.toFixed(3)}" y1="${a.y.toFixed(3)}" x2="${b.x.toFixed(3)}" y2="${b.y.toFixed(3)}" />`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Counting figures diagram" shape-rendering="geometricPrecision"><rect width="120" height="120" fill="white"/><g fill="none" stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${lines}</g></svg>`;
}

export function expectedCountingFigureExamAxisV1(
  motifFamily: CountingFigureMotifFamilyV2,
): 0 | 45 | null {
  if (motifFamily === "ROTATED_SQUARE_GRID") return 45;
  if (AXIS_ALIGNED_MOTIFS.has(motifFamily)) return 0;
  return null;
}
