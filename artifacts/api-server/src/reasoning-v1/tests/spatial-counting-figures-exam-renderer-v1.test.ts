import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import type { CountingFigureGraphV1 } from "../foundation/spatial/counting-figures-graph-v1";
import {
  countingFigureExamGeometryFingerprintV1,
  expectedCountingFigureExamAxisV1,
  renderCountingFigureExamSvgV1,
  standardizeCountingFigureGraphForExamV1,
} from "../foundation/spatial/counting-figures-exam-renderer-v1";
import { generateCountingFiguresPermanentEnglishQuestionV1 } from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import type { CountingFigureMotifFamilyV2 } from "../foundation/spatial/counting-figures-production-generator-v2";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

function rotateGraph(graph: CountingFigureGraphV1, degrees: number): CountingFigureGraphV1 {
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

function edgeAngle(graph: CountingFigureGraphV1, edgeId: string): number {
  const edge = graph.edges.find((candidate) => candidate.id === edgeId);
  assert.ok(edge, `Missing edge ${edgeId}.`);
  const byId = new Map(graph.vertices.map((vertex) => [vertex.id, vertex] as const));
  const a = byId.get(edge.a)!;
  const b = byId.get(edge.b)!;
  return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
}

function edgeLength(graph: CountingFigureGraphV1, edgeId: string): number {
  const edge = graph.edges.find((candidate) => candidate.id === edgeId);
  assert.ok(edge, `Missing edge ${edgeId}.`);
  const byId = new Map(graph.vertices.map((vertex) => [vertex.id, vertex] as const));
  const a = byId.get(edge.a)!;
  const b = byId.get(edge.b)!;
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function anchorPrefix(motifFamily: CountingFigureMotifFamilyV2): string | null {
  if (motifFamily === "TRIANGLE_FAN" || motifFamily === "DOUBLE_TRIANGLE_FAN") return "base";
  if (motifFamily === "CROSSED_QUADRILATERAL_TRIANGLES") return "ab";
  if (motifFamily === "QUADRILATERAL_STRIP") return "top";
  if (motifFamily === "QUADRILATERAL_LATTICE") return "rail";
  if (
    motifFamily === "SQUARE_GRID" ||
    motifFamily === "ROTATED_SQUARE_GRID" ||
    motifFamily === "RECTANGULAR_GRID_SQUARES" ||
    motifFamily === "IRREGULAR_RECTANGLE_GRID" ||
    motifFamily === "DIAGONAL_SQUARE_GRID" ||
    motifFamily === "DIAGONAL_RECTANGLE_GRID"
  ) return "h";
  return null;
}

const squareGrid: CountingFigureGraphV1 = {
  vertices: [
    { id: "p0_0", x: 0, y: 0 },
    { id: "p1_0", x: 20, y: 0 },
    { id: "p0_1", x: 0, y: 20 },
    { id: "p1_1", x: 20, y: 20 },
  ],
  edges: [
    { id: "h0_0", a: "p0_0", b: "p1_0", kind: "LINE" },
    { id: "h0_1", a: "p0_1", b: "p1_1", kind: "LINE" },
    { id: "v0_0", a: "p0_0", b: "p0_1", kind: "LINE" },
    { id: "v1_0", a: "p1_0", b: "p1_1", kind: "LINE" },
  ],
};

const tiltedGrid = rotateGraph(squareGrid, 7.25);
const uprightGrid = standardizeCountingFigureGraphForExamV1(tiltedGrid, "SQUARE_GRID");
assert.ok(Math.abs(edgeAngle(uprightGrid, "h0_0")) < 1e-9, "Ordinary square grids must render exactly upright.");
assert.ok(Math.abs(edgeLength(tiltedGrid, "h0_0") - edgeLength(uprightGrid, "h0_0")) < 1e-9, "Rigid exam normalization must preserve edge length.");
assert.equal(
  countingFigureExamGeometryFingerprintV1(rotateGraph(squareGrid, -3.2), "SQUARE_GRID"),
  countingFigureExamGeometryFingerprintV1(rotateGraph(squareGrid, 8.7), "SQUARE_GRID"),
  "Random source rotation must not manufacture a distinct displayed-geometry fingerprint.",
);

const arbitraryRotatedGrid = rotateGraph(squareGrid, 31.75);
const canonicalRotatedGrid = standardizeCountingFigureGraphForExamV1(arbitraryRotatedGrid, "ROTATED_SQUARE_GRID");
assert.ok(Math.abs(edgeAngle(canonicalRotatedGrid, "h0_0") - 45) < 1e-9, "Rotated square grids must use the canonical 45-degree exam orientation.");
assert.ok(Math.abs(edgeLength(arbitraryRotatedGrid, "h0_0") - edgeLength(canonicalRotatedGrid, "h0_0")) < 1e-9, "Canonical 45-degree rotation must preserve geometry.");
assert.notEqual(
  countingFigureExamGeometryFingerprintV1(squareGrid, "SQUARE_GRID"),
  countingFigureExamGeometryFingerprintV1(squareGrid, "ROTATED_SQUARE_GRID"),
  "Intentional 45-degree rotated-square presentation must remain a distinct visible geometry.",
);

const triangleFan: CountingFigureGraphV1 = {
  vertices: [
    { id: "b0", x: 0, y: 50 },
    { id: "b1", x: 20, y: 50 },
    { id: "b2", x: 40, y: 50 },
    { id: "a", x: 20, y: 0 },
  ],
  edges: [
    { id: "base0", a: "b0", b: "b1", kind: "LINE" },
    { id: "base1", a: "b1", b: "b2", kind: "LINE" },
    { id: "ray0", a: "a", b: "b0", kind: "LINE" },
    { id: "ray1", a: "a", b: "b1", kind: "LINE" },
    { id: "ray2", a: "a", b: "b2", kind: "LINE" },
  ],
};
const tiltedTriangleFan = rotateGraph(triangleFan, 14.6);
const uprightTriangleFan = standardizeCountingFigureGraphForExamV1(tiltedTriangleFan, "TRIANGLE_FAN");
assert.ok(Math.abs(edgeAngle(uprightTriangleFan, "base0")) < 1e-9, "Triangle fans must render with an exactly horizontal base.");
assert.ok(Math.abs(edgeLength(tiltedTriangleFan, "ray0") - edgeLength(uprightTriangleFan, "ray0")) < 1e-9, "Triangle fan normalization must preserve ray geometry.");

const crossedQuadrilateral: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 70, y: 0 },
    { id: "C", x: 70, y: 70 },
    { id: "D", x: 0, y: 70 },
    { id: "O", x: 35, y: 35 },
  ],
  edges: [
    { id: "ab", a: "A", b: "B", kind: "LINE" },
    { id: "bc", a: "B", b: "C", kind: "LINE" },
    { id: "cd", a: "C", b: "D", kind: "LINE" },
    { id: "da", a: "D", b: "A", kind: "LINE" },
    { id: "ao", a: "A", b: "O", kind: "LINE" },
    { id: "oc", a: "O", b: "C", kind: "LINE" },
    { id: "bo", a: "B", b: "O", kind: "LINE" },
    { id: "od", a: "O", b: "D", kind: "LINE" },
  ],
};
const tiltedCrossed = rotateGraph(crossedQuadrilateral, -11.2);
const uprightCrossed = standardizeCountingFigureGraphForExamV1(tiltedCrossed, "CROSSED_QUADRILATERAL_TRIANGLES");
assert.ok(Math.abs(edgeAngle(uprightCrossed, "ab")) < 1e-9, "Crossed quadrilateral triangle motifs must render with a horizontal top edge.");
assert.ok(Math.abs(edgeLength(tiltedCrossed, "ao") - edgeLength(uprightCrossed, "ao")) < 1e-9, "Crossed-motif diagonals must remain connected and unchanged in length.");

const strip: CountingFigureGraphV1 = {
  vertices: [
    { id: "t0", x: 0, y: 0 },
    { id: "t1", x: 20, y: 0 },
    { id: "b0", x: 6, y: 30 },
    { id: "b1", x: 26, y: 30 },
  ],
  edges: [
    { id: "top0", a: "t0", b: "t1", kind: "LINE" },
    { id: "bottom0", a: "b0", b: "b1", kind: "LINE" },
    { id: "side0", a: "t0", b: "b0", kind: "LINE" },
    { id: "side1", a: "t1", b: "b1", kind: "LINE" },
  ],
};
const tiltedStrip = rotateGraph(strip, -13.4);
const uprightStrip = standardizeCountingFigureGraphForExamV1(tiltedStrip, "QUADRILATERAL_STRIP");
assert.ok(Math.abs(edgeAngle(uprightStrip, "top0")) < 1e-9, "Quadrilateral strips must keep their rail horizontal while preserving intended side slant.");
assert.ok(Math.abs(edgeLength(tiltedStrip, "side0") - edgeLength(uprightStrip, "side0")) < 1e-9, "Strip slant geometry must remain intact.");

const svg = renderCountingFigureExamSvgV1(tiltedGrid, "SQUARE_GRID");
assert.match(svg, /stroke-width="1\.35"/);
assert.doesNotMatch(svg, /stroke-width="2\.2"/);
assert.match(svg, /fill="white"/);
assert.match(svg, /shape-rendering="geometricPrecision"/);

const TARGETS: readonly CountingFigureTargetShapeV1[] = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"];
const seenMotifs = new Set<CountingFigureMotifFamilyV2>();
let runtimeChecks = 0;
for (const targetShape of TARGETS) {
  for (let index = 0; index < 20; index += 1) {
    const question = generateCountingFiguresPermanentEnglishQuestionV1({
      seed: `FCT-EXAM-RENDERER-${targetShape}-${index}`,
      targetShape,
    });
    seenMotifs.add(question.motifFamily);
    assert.equal(
      question.svg,
      renderCountingFigureExamSvgV1(question.graph, question.motifFamily),
      `${question.seed}: permanent runtime must expose the exam-standard SVG renderer.`,
    );
    assert.equal(
      question.geometryFingerprint,
      countingFigureExamGeometryFingerprintV1(question.graph, question.motifFamily),
      `${question.seed}: permanent runtime must dedupe using displayed exam geometry.`,
    );
    assert.match(question.svg, /stroke-width="1\.35"/);
    assert.doesNotMatch(question.svg, /stroke-width="2\.2"/);
    const expectedAxis = expectedCountingFigureExamAxisV1(question.motifFamily);
    if (expectedAxis !== null) {
      const standardized = standardizeCountingFigureGraphForExamV1(question.graph, question.motifFamily);
      const prefix = anchorPrefix(question.motifFamily);
      assert.ok(prefix, `${question.seed}: missing anchor policy for ${question.motifFamily}.`);
      const anchor = standardized.edges.find((edge) => edge.id.startsWith(prefix));
      assert.ok(anchor, `${question.seed}: missing orientation anchor.`);
      const axis = edgeAngle(standardized, anchor.id);
      assert.ok(Math.abs(axis - expectedAxis) < 1e-8, `${question.seed}: expected ${expectedAxis} degree exam axis, got ${axis}.`);
    }
    runtimeChecks += 1;
  }
}

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  authority: "FCT-001-EXAM-RENDERER-V1",
  result: "PASS",
  ordinaryGridAxisDegrees: edgeAngle(uprightGrid, "h0_0"),
  rotatedGridAxisDegrees: edgeAngle(canonicalRotatedGrid, "h0_0"),
  triangleFanBaseAxisDegrees: edgeAngle(uprightTriangleFan, "base0"),
  crossedQuadrilateralTopAxisDegrees: edgeAngle(uprightCrossed, "ab"),
  stripRailAxisDegrees: edgeAngle(uprightStrip, "top0"),
  strokeWidth: 1.35,
  runtimeChecks,
  seenMotifs: [...seenMotifs].sort(),
  invariants: [
    "NO_RANDOM_WHOLE_FIGURE_TILT_ON_STANDARD_EXAM_MOTIFS",
    "TRIANGLE_FAN_BASES_CANONICAL_HORIZONTAL",
    "CROSSED_TRIANGLE_MOTIFS_CANONICAL_HORIZONTAL",
    "ROTATED_SQUARE_GRID_CANONICAL_45_DEGREES",
    "RIGID_ROTATION_PRESERVES_EDGE_CONNECTIVITY_AND_LENGTHS",
    "DISPLAY_GEOMETRY_FINGERPRINT_IGNORES_RANDOM_SOURCE_ROTATION",
    "INTENTIONAL_ROTATED_SQUARE_PRESENTATION_REMAINS_DISTINCT",
    "THIN_EXAM_STANDARD_STROKE",
    "WHITE_BACKGROUND",
  ],
};
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-exam-renderer-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
);
console.log(JSON.stringify(evidence, null, 2));
