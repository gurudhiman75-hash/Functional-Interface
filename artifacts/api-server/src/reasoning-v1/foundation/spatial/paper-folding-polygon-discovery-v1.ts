import { applyAffineTransform, reflectionAcrossLineTransform, type AffineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  signedSideOfLineV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
  type PfcLineV1,
} from "./paper-folding-foundation-v1";
import {
  createTriangularPfcSheetV3,
  pfcPolygonBoundaryForFoldEngineV3,
  validatePfcCutGeometryV3,
  validatePfcSourceSheetV3,
  type PfcSourceSheetV3,
} from "./paper-folding-foundation-v3";
import type { PfcCutGeometryV2 } from "./paper-folding-foundation-v2";
import type { SpatialPoint } from "./types";

export const PFC_001_TRIANGLE_DISCOVERY_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-TRIANGLE-SUBSTRATE-DISCOVERY-V1" as const,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V3" as const,
  foundationAuthority: "PFC-001-FOUNDATION-V3-POLYGON-SUBSTRATE" as const,
  status: "EXECUTABLE_SOURCE_BACKED_POLYGON_GAP_CLOSURE" as const,
  activatedSourceShape: "TRIANGLE" as const,
  foldCoverage: ["SYMMETRY_MEDIAN", "OFF_CENTRE_GENERAL_LINE"] as const,
  engineCapability: ["TRIANGLE", "REGULAR_HEXAGON", "GENERAL_CONVEX_POLYGON"] as const,
  learnerReviewActivation: ["TRIANGLE"] as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcTriangleMappedCutV1 =
  | { cutId: string; kind: "CIRCLE_HOLE"; center: SpatialPoint; radius: number }
  | { cutId: string; kind: "POLYGON_CUT"; semanticShape: "DIAMOND" | "TRIANGLE"; vertices: SpatialPoint[] }
  | { cutId: string; kind: "SLIT"; a: SpatialPoint; b: SpatialPoint; width: number };

export interface PfcTriangleScenarioV1 {
  scenarioId: string;
  sourceSheet: PfcSourceSheetV3;
  fold: PfcFoldV1;
  cut: PfcCutGeometryV2;
  family:
    | "TRIANGLE_MEDIAN_HOLE"
    | "TRIANGLE_MEDIAN_POLYGON_CUT"
    | "TRIANGLE_MEDIAN_SLIT"
    | "TRIANGLE_GENERAL_LINE_HOLE"
    | "TRIANGLE_GENERAL_LINE_POLYGON_CUT";
  proposalId: "PFC-PROP-01" | "PFC-PROP-03" | "PFC-PROP-04";
}

export interface PfcTriangleSolutionV1 {
  scenarioId: string;
  sourceSemanticShape: "TRIANGLE";
  affectedLayerCount: number;
  mappedCuts: PfcTriangleMappedCutV1[];
  fingerprint: string;
}

const q = (value: number) => Math.round(value * 1000) / 1000;

function mapBack(point: SpatialPoint, history: readonly AffineTransform[]): SpatialPoint {
  let out = { ...point };
  for (let i = history.length - 1; i >= 0; i -= 1) out = applyAffineTransform(out, history[i]);
  return { x: q(out.x), y: q(out.y) };
}

function centroid(points: readonly SpatialPoint[]): SpatialPoint {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function anchors(cut: PfcCutGeometryV2): SpatialPoint[] {
  if (cut.kind === "CIRCLE_HOLE") return [cut.center];
  if (cut.kind === "SLIT") return [cut.a, cut.b, { x: (cut.a.x + cut.b.x) / 2, y: (cut.a.y + cut.b.y) / 2 }];
  return [...cut.vertices, centroid(cut.vertices)];
}

function mapCut(cut: PfcCutGeometryV2, history: readonly AffineTransform[]): PfcTriangleMappedCutV1 {
  if (cut.kind === "CIRCLE_HOLE") return { cutId: cut.cutId, kind: cut.kind, center: mapBack(cut.center, history), radius: cut.radius };
  if (cut.kind === "SLIT") return { cutId: cut.cutId, kind: cut.kind, a: mapBack(cut.a, history), b: mapBack(cut.b, history), width: cut.width };
  if (cut.kind !== "POLYGON_CUT" || (cut.semanticShape !== "DIAMOND" && cut.semanticShape !== "TRIANGLE")) {
    throw new Error(`Triangle discovery does not activate cut kind ${cut.kind}/${"semanticShape" in cut ? cut.semanticShape : ""}.`);
  }
  return { cutId: cut.cutId, kind: cut.kind, semanticShape: cut.semanticShape, vertices: cut.vertices.map((p) => mapBack(p, history)) };
}

function pointKey(p: SpatialPoint): string {
  return `${q(p.x)},${q(p.y)}`;
}

function mappedKey(cut: PfcTriangleMappedCutV1): string {
  if (cut.kind === "CIRCLE_HOLE") return `H:${pointKey(cut.center)}:${q(cut.radius)}`;
  if (cut.kind === "SLIT") return `S:${[pointKey(cut.a), pointKey(cut.b)].sort().join("|")}:${q(cut.width)}`;
  return `${cut.semanticShape}:${cut.vertices.map(pointKey).sort().join("|")}`;
}

export function solvePfcTriangleScenarioV1(scenario: PfcTriangleScenarioV1): PfcTriangleSolutionV1 {
  validatePfcSourceSheetV3(scenario.sourceSheet);
  if (scenario.sourceSheet.shape !== "POLYGON" || scenario.sourceSheet.semanticShape !== "TRIANGLE" || !scenario.sourceSheet.learnerReviewEligible) {
    throw new Error(`${scenario.scenarioId} must use the source-approved triangular paper substrate.`);
  }
  validatePfcCutGeometryV3(scenario.sourceSheet, scenario.cut);
  const boundary = pfcPolygonBoundaryForFoldEngineV3(scenario.sourceSheet);
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "TRI-ROOT",
    sourceSheetRegionId: "TRI-ROOT",
    polygon: boundary.map((p) => ({ ...p })),
    transformHistory: [],
  }];
  fragments = applyPfcFoldV1(fragments, scenario.fold);
  const cutAnchors = anchors(scenario.cut);
  const affected = fragments.filter((fragment) => cutAnchors.some((point) => pointInPolygonInclusiveV1(point, fragment.polygon)));
  if (affected.length < 1) throw new Error(`${scenario.scenarioId} cut misses folded triangular material.`);
  const mappedCuts = affected.map((fragment) => mapCut(scenario.cut, fragment.transformHistory));
  const unique = new Map(mappedCuts.map((cut) => [mappedKey(cut), cut]));
  return {
    scenarioId: scenario.scenarioId,
    sourceSemanticShape: "TRIANGLE",
    affectedLayerCount: affected.length,
    mappedCuts: [...unique.values()],
    fingerprint: `TRIANGLE::${[...unique.keys()].sort().join(";")}`,
  };
}

const TRIANGLE_VERTICES: SpatialPoint[] = [
  { x: 60, y: 98 - 52 * Math.sqrt(3) },
  { x: 112, y: 98 },
  { x: 8, y: 98 },
];
const TRIANGLE_CENTROID = centroid(TRIANGLE_VERTICES);

function midpoint(a: SpatialPoint, b: SpatialPoint): SpatialPoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

const AXES: { id: string; line: PfcLineV1 }[] = [
  { id: "A", line: { a: TRIANGLE_VERTICES[0], b: midpoint(TRIANGLE_VERTICES[1], TRIANGLE_VERTICES[2]) } },
  { id: "B", line: { a: TRIANGLE_VERTICES[1], b: midpoint(TRIANGLE_VERTICES[0], TRIANGLE_VERTICES[2]) } },
  { id: "C", line: { a: TRIANGLE_VERTICES[2], b: midpoint(TRIANGLE_VERTICES[0], TRIANGLE_VERTICES[1]) } },
];

function stationaryPunch(line: PfcLineV1, offset: number, along = 0): { point: SpatialPoint; movingSide: "POSITIVE" | "NEGATIVE" } {
  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  let point = { x: TRIANGLE_CENTROID.x + nx * offset + ux * along, y: TRIANGLE_CENTROID.y + ny * offset + uy * along };
  const side = signedSideOfLineV1(point, line);
  if (Math.abs(side) < 1e-6) point = { x: point.x + nx * 2, y: point.y + ny * 2 };
  const stationarySide = signedSideOfLineV1(point, line) >= 0 ? "POSITIVE" : "NEGATIVE";
  return { point: { x: q(point.x), y: q(point.y) }, movingSide: stationarySide === "POSITIVE" ? "NEGATIVE" : "POSITIVE" };
}

function fold(axisIndex: number, movingSide: "POSITIVE" | "NEGATIVE", id: string): PfcFoldV1 {
  return { foldId: id, kind: axisIndex === 0 ? "VERTICAL" : "GENERAL_LINE", line: AXES[axisIndex].line, movingSide };
}

function offCentreTipFold(id: string): PfcFoldV1 {
  return {
    foldId: id,
    kind: "HORIZONTAL",
    line: { a: { x: -20, y: 52 }, b: { x: 140, y: 52 } },
    movingSide: "NEGATIVE",
  };
}

function diamond(cutId: string, center: SpatialPoint, r = 3): PfcCutGeometryV2 {
  return { cutId, kind: "POLYGON_CUT", semanticShape: "DIAMOND", vertices: [
    { x: center.x, y: center.y - r }, { x: center.x + r, y: center.y },
    { x: center.x, y: center.y + r }, { x: center.x - r, y: center.y },
  ] };
}

function triangleCut(cutId: string, center: SpatialPoint, r = 3): PfcCutGeometryV2 {
  return { cutId, kind: "POLYGON_CUT", semanticShape: "TRIANGLE", vertices: [
    { x: center.x, y: center.y - r }, { x: center.x + r, y: center.y + r }, { x: center.x - r, y: center.y + r },
  ] };
}

function slit(cutId: string, center: SpatialPoint): PfcCutGeometryV2 {
  return { cutId, kind: "SLIT", a: { x: center.x - 4, y: center.y - 1 }, b: { x: center.x + 4, y: center.y + 1 }, width: 1.4 };
}

export function pfcTriangleDiscoveryScenariosV1(): PfcTriangleScenarioV1[] {
  const sheet = createTriangularPfcSheetV3(TRIANGLE_VERTICES);
  const specs = [
    { axis: 0, offset: 13, along: -6, kind: "HOLE" as const, proposalId: "PFC-PROP-01" as const },
    { axis: 1, offset: 12, along: -5, kind: "HOLE" as const, proposalId: "PFC-PROP-03" as const },
    { axis: 2, offset: 12, along: 5, kind: "HOLE" as const, proposalId: "PFC-PROP-03" as const },
    { axis: 0, offset: 18, along: 8, kind: "HOLE" as const, proposalId: "PFC-PROP-01" as const },
    { axis: 1, offset: 14, along: 3, kind: "DIAMOND" as const, proposalId: "PFC-PROP-04" as const },
    { axis: 2, offset: 15, along: -4, kind: "TRIANGLE" as const, proposalId: "PFC-PROP-04" as const },
    { axis: 0, offset: 16, along: -12, kind: "SLIT" as const, proposalId: "PFC-PROP-04" as const },
    { axis: 0, offset: 10, along: 13, kind: "DIAMOND" as const, proposalId: "PFC-PROP-04" as const },
  ];
  return specs.map((spec, index) => {
    if (index === 3) {
      return {
        scenarioId: "PFC-POLY-TRI-04",
        sourceSheet: sheet,
        fold: offCentreTipFold("F4"),
        cut: { cutId: "C4", kind: "CIRCLE_HOLE", center: { x: 60, y: 70 }, radius: 2.4 },
        family: "TRIANGLE_GENERAL_LINE_HOLE",
        proposalId: spec.proposalId,
      };
    }
    if (index === 7) {
      return {
        scenarioId: "PFC-POLY-TRI-08",
        sourceSheet: sheet,
        fold: offCentreTipFold("F8"),
        cut: diamond("C8", { x: 60, y: 78 }),
        family: "TRIANGLE_GENERAL_LINE_POLYGON_CUT",
        proposalId: spec.proposalId,
      };
    }
    const placement = stationaryPunch(AXES[spec.axis].line, spec.offset, spec.along);
    const cut = spec.kind === "HOLE"
      ? { cutId: `C${index + 1}`, kind: "CIRCLE_HOLE" as const, center: placement.point, radius: 2.4 }
      : spec.kind === "DIAMOND" ? diamond(`C${index + 1}`, placement.point)
      : spec.kind === "TRIANGLE" ? triangleCut(`C${index + 1}`, placement.point)
      : slit(`C${index + 1}`, placement.point);
    return {
      scenarioId: `PFC-POLY-TRI-${String(index + 1).padStart(2, "0")}`,
      sourceSheet: sheet,
      fold: fold(spec.axis, placement.movingSide, `F${index + 1}`),
      cut,
      family: spec.kind === "HOLE" ? "TRIANGLE_MEDIAN_HOLE" : spec.kind === "SLIT" ? "TRIANGLE_MEDIAN_SLIT" : "TRIANGLE_MEDIAN_POLYGON_CUT",
      proposalId: spec.proposalId,
    };
  });
}

export interface PfcTriangleReverseCandidateV1 {
  candidateId: string;
  scenario: PfcTriangleScenarioV1;
}

export function solvePfcTriangleReverseInferenceV1(
  targetFingerprint: string,
  candidates: readonly PfcTriangleReverseCandidateV1[],
): PfcTriangleReverseCandidateV1 {
  const matches = candidates.filter((candidate) => solvePfcTriangleScenarioV1(candidate.scenario).fingerprint === targetFingerprint);
  if (matches.length !== 1) throw new Error(`Triangle reverse inference expected one candidate, found ${matches.length}.`);
  return matches[0];
}

export function reflectedPointForTriangleFoldV1(point: SpatialPoint, foldLine: PfcLineV1): SpatialPoint {
  const transform = reflectionAcrossLineTransform(foldLine.a, foldLine.b);
  const reflected = applyAffineTransform(point, transform);
  return { x: q(reflected.x), y: q(reflected.y) };
}
