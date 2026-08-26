import { applyAffineTransform, reflectionAcrossLineTransform, type AffineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  signedSideOfLineV1,
  type PfcFoldSideV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  pfcPolygonBoundaryForLegacyEngineV2,
  validatePfcCutGeometryV2,
  validatePfcSourceSheetV2,
  type PfcCutGeometryV2,
  type PfcSourceSheetV2,
} from "./paper-folding-foundation-v2";
import type { SpatialPoint } from "./types";

export const PFC_001_MULTISHAPE_DISCOVERY_WAVE1_AUTHORITY = Object.freeze({
  authorityId: "PFC-001-MULTISHAPE-DISCOVERY-WAVE1" as const,
  sourceAuthority: "PFC-001-SOURCE-SATURATION-AUDIT-V2" as const,
  foundationAuthority: "PFC-001-FOUNDATION-V2-MULTI-SHAPE" as const,
  status: "EXECUTABLE_DISCOVERY_WAVE_NOT_SATURATION_FREEZE" as const,
  sourceSheetShapes: ["SQUARE", "RECTANGLE", "CIRCLE"] as const,
  circleSemantics: "ANALYTIC_DISK_PLUS_HALF_PLANE_FRAGMENT_CONSTRAINTS" as const,
  cutSemantics: "ORIENTED_GEOMETRY_REFLECTED_THROUGH_LAYER_PROVENANCE" as const,
  reachabilityScope: "CONTROLLED_SMALL_CUTS_WITH_POINT_OR_VERTEX_ANCHOR_COVERAGE" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcMappedCutWave1 =
  | { sourceCutId: string; kind: "CIRCLE_HOLE"; center: SpatialPoint; radius: number }
  | {
      sourceCutId: string;
      kind: "POLYGON_CUT";
      semanticShape: "SQUARE" | "RECTANGLE" | "DIAMOND" | "TRIANGLE" | "GENERAL_POLYGON";
      vertices: SpatialPoint[];
    }
  | {
      sourceCutId: string;
      kind: "EDGE_NOTCH";
      semanticShape: "V_NOTCH" | "ROUNDED_NOTCH" | "GENERAL_NOTCH";
      vertices: SpatialPoint[];
    }
  | { sourceCutId: string; kind: "SLIT"; a: SpatialPoint; b: SpatialPoint; width: number };

export interface PfcForwardScenarioWave1 {
  scenarioId: string;
  sourceSheet: PfcSourceSheetV2;
  folds: PfcFoldV1[];
  cuts: PfcCutGeometryV2[];
  sourceFamily: string;
}

export interface PfcForwardSolutionWave1 {
  scenarioId: string;
  sourceShape: PfcSourceSheetV2["shape"];
  sourceFamily: string;
  affectedLayersByCut: Record<string, number>;
  mappedCuts: PfcMappedCutWave1[];
  fingerprint: string;
  usedAnalyticCircleEngine: boolean;
}

export class PfcDiscoveryWave1Error extends Error {
  constructor(
    public readonly code: "PFC_W1_CUT_MISSES_FOLDED_MATERIAL" | "PFC_W1_REVERSE_NOT_UNIQUE",
    message: string,
  ) {
    super(message);
    this.name = "PfcDiscoveryWave1Error";
  }
}

const EPSILON = 1e-7;
const q = (value: number) => Math.round(value * 1_000_000) / 1_000_000;
const pointKey = (point: SpatialPoint) => `${q(point.x)},${q(point.y)}`;
const flipSide = (side: PfcFoldSideV1): PfcFoldSideV1 => side === "POSITIVE" ? "NEGATIVE" : "POSITIVE";

function mapBack(point: SpatialPoint, history: readonly AffineTransform[]): SpatialPoint {
  let result = { ...point };
  for (let i = history.length - 1; i >= 0; i -= 1) result = applyAffineTransform(result, history[i]);
  return { x: q(result.x), y: q(result.y) };
}

function centroid(points: readonly SpatialPoint[]): SpatialPoint {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function probes(cut: PfcCutGeometryV2): SpatialPoint[] {
  if (cut.kind === "CIRCLE_HOLE") return [{ ...cut.center }];
  if (cut.kind === "SLIT") return [{ ...cut.a }, { ...cut.b }, { x: (cut.a.x + cut.b.x) / 2, y: (cut.a.y + cut.b.y) / 2 }];
  return [...cut.vertices.map((p) => ({ ...p })), centroid(cut.vertices)];
}

function mapCut(cut: PfcCutGeometryV2, history: readonly AffineTransform[]): PfcMappedCutWave1 {
  if (cut.kind === "CIRCLE_HOLE") {
    return { sourceCutId: cut.cutId, kind: cut.kind, center: mapBack(cut.center, history), radius: cut.radius };
  }
  if (cut.kind === "SLIT") {
    return { sourceCutId: cut.cutId, kind: cut.kind, a: mapBack(cut.a, history), b: mapBack(cut.b, history), width: cut.width };
  }
  return {
    sourceCutId: cut.cutId,
    kind: cut.kind,
    semanticShape: cut.semanticShape,
    vertices: cut.vertices.map((p) => mapBack(p, history)),
  };
}

function canonicalPolygon(vertices: readonly SpatialPoint[]): string {
  const keys = vertices.map(pointKey);
  const rotations: string[] = [];
  for (const ordered of [keys, [...keys].reverse()]) {
    for (let i = 0; i < ordered.length; i += 1) rotations.push([...ordered.slice(i), ...ordered.slice(0, i)].join("|"));
  }
  return rotations.sort()[0] ?? "";
}

export function pfcMappedCutFingerprintWave1(cut: PfcMappedCutWave1): string {
  if (cut.kind === "CIRCLE_HOLE") return `${cut.sourceCutId}:HOLE:${pointKey(cut.center)}:r${q(cut.radius)}`;
  if (cut.kind === "SLIT") return `${cut.sourceCutId}:SLIT:${[pointKey(cut.a), pointKey(cut.b)].sort().join("|")}:w${q(cut.width)}`;
  return `${cut.sourceCutId}:${cut.kind}:${cut.semanticShape}:${canonicalPolygon(cut.vertices)}`;
}

function finishSolution(
  scenario: PfcForwardScenarioWave1,
  mappedCuts: PfcMappedCutWave1[],
  counts: Record<string, number>,
  analyticCircle: boolean,
): PfcForwardSolutionWave1 {
  const marks = mappedCuts.map(pfcMappedCutFingerprintWave1).sort();
  return {
    scenarioId: scenario.scenarioId,
    sourceShape: scenario.sourceSheet.shape,
    sourceFamily: scenario.sourceFamily,
    affectedLayersByCut: counts,
    mappedCuts,
    fingerprint: `${scenario.sourceSheet.shape}::${marks.join(";")}`,
    usedAnalyticCircleEngine: analyticCircle,
  };
}

function solvePolygonScenario(scenario: PfcForwardScenarioWave1): PfcForwardSolutionWave1 {
  const boundary = pfcPolygonBoundaryForLegacyEngineV2(scenario.sourceSheet);
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "ROOT",
    sourceSheetRegionId: "ROOT",
    polygon: boundary.map((p) => ({ ...p })),
    transformHistory: [],
  }];
  for (const fold of scenario.folds) fragments = applyPfcFoldV1(fragments, fold);

  const mapped: PfcMappedCutWave1[] = [];
  const counts: Record<string, number> = {};
  for (const cut of scenario.cuts) {
    validatePfcCutGeometryV2(scenario.sourceSheet, cut);
    const cutProbes = probes(cut);
    const affected = fragments.filter((fragment) => cutProbes.some((p) => pointInPolygonInclusiveV1(p, fragment.polygon)));
    if (affected.length === 0) {
      throw new PfcDiscoveryWave1Error("PFC_W1_CUT_MISSES_FOLDED_MATERIAL", `${scenario.scenarioId}/${cut.cutId} misses folded material.`);
    }
    counts[cut.cutId] = affected.length;
    affected.forEach((fragment) => mapped.push(mapCut(cut, fragment.transformHistory)));
  }
  return finishSolution(scenario, mapped, counts, false);
}

interface CircleConstraintWave1 { line: { a: SpatialPoint; b: SpatialPoint }; side: PfcFoldSideV1 }
interface CircleFragmentWave1 {
  center: SpatialPoint;
  radius: number;
  constraints: CircleConstraintWave1[];
  history: AffineTransform[];
}

function reflectConstraint(constraint: CircleConstraintWave1, reflection: AffineTransform): CircleConstraintWave1 {
  return {
    line: {
      a: applyAffineTransform(constraint.line.a, reflection),
      b: applyAffineTransform(constraint.line.b, reflection),
    },
    side: flipSide(constraint.side),
  };
}

function foldCircleFragments(fragments: readonly CircleFragmentWave1[], fold: PfcFoldV1): CircleFragmentWave1[] {
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  const stationary = flipSide(fold.movingSide);
  return fragments.flatMap((fragment) => {
    const still: CircleFragmentWave1 = {
      center: { ...fragment.center },
      radius: fragment.radius,
      constraints: [...fragment.constraints, { line: fold.line, side: stationary }],
      history: [...fragment.history],
    };
    const moved: CircleFragmentWave1 = {
      center: applyAffineTransform(fragment.center, reflection),
      radius: fragment.radius,
      constraints: [
        ...fragment.constraints.map((constraint) => reflectConstraint(constraint, reflection)),
        reflectConstraint({ line: fold.line, side: fold.movingSide }, reflection),
      ],
      history: [...fragment.history, reflection],
    };
    return [still, moved];
  });
}

function circleFragmentContains(fragment: CircleFragmentWave1, point: SpatialPoint): boolean {
  if (Math.hypot(point.x - fragment.center.x, point.y - fragment.center.y) > fragment.radius + EPSILON) return false;
  return fragment.constraints.every((constraint) => {
    const signed = signedSideOfLineV1(point, constraint.line);
    return constraint.side === "POSITIVE" ? signed >= -EPSILON : signed <= EPSILON;
  });
}

function solveCircleScenario(scenario: PfcForwardScenarioWave1): PfcForwardSolutionWave1 {
  if (scenario.sourceSheet.shape !== "CIRCLE") throw new Error("Circle solver received a non-circular sheet.");
  let fragments: CircleFragmentWave1[] = [{
    center: { ...scenario.sourceSheet.center },
    radius: scenario.sourceSheet.radius,
    constraints: [],
    history: [],
  }];
  for (const fold of scenario.folds) fragments = foldCircleFragments(fragments, fold);

  const mapped: PfcMappedCutWave1[] = [];
  const counts: Record<string, number> = {};
  for (const cut of scenario.cuts) {
    validatePfcCutGeometryV2(scenario.sourceSheet, cut);
    const cutProbes = probes(cut);
    const affected = fragments.filter((fragment) => cutProbes.some((p) => circleFragmentContains(fragment, p)));
    if (affected.length === 0) {
      throw new PfcDiscoveryWave1Error("PFC_W1_CUT_MISSES_FOLDED_MATERIAL", `${scenario.scenarioId}/${cut.cutId} misses circular folded material.`);
    }
    counts[cut.cutId] = affected.length;
    affected.forEach((fragment) => mapped.push(mapCut(cut, fragment.history)));
  }
  return finishSolution(scenario, mapped, counts, true);
}

export function solvePfcForwardScenarioWave1(scenario: PfcForwardScenarioWave1): PfcForwardSolutionWave1 {
  validatePfcSourceSheetV2(scenario.sourceSheet);
  return scenario.sourceSheet.shape === "CIRCLE" ? solveCircleScenario(scenario) : solvePolygonScenario(scenario);
}

export interface PfcReverseCandidateWave1 { candidateId: string; scenario: PfcForwardScenarioWave1 }

export function solvePfcReverseInferenceWave1(
  targetFingerprint: string,
  candidates: readonly PfcReverseCandidateWave1[],
): { candidateId: string; solution: PfcForwardSolutionWave1 } {
  const matches = candidates
    .map((candidate) => ({ candidateId: candidate.candidateId, solution: solvePfcForwardScenarioWave1(candidate.scenario) }))
    .filter((candidate) => candidate.solution.fingerprint === targetFingerprint);
  if (matches.length !== 1) {
    throw new PfcDiscoveryWave1Error("PFC_W1_REVERSE_NOT_UNIQUE", `Reverse target matched ${matches.length} candidates; exactly one is required.`);
  }
  return matches[0];
}

function verticalFold(x: number, id = "F1"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x, y: -100 }, b: { x, y: 200 } }, movingSide: "POSITIVE" };
}
function horizontalFold(y: number, id = "F1"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: -100, y }, b: { x: 200, y } }, movingSide: "POSITIVE" };
}
function diamond(id: string, x: number, y: number, r = 4): PfcCutGeometryV2 {
  return { cutId: id, kind: "POLYGON_CUT", semanticShape: "DIAMOND", vertices: [{ x, y: y-r }, { x:x+r, y }, { x, y:y+r }, { x:x-r, y }] };
}
function triangle(id: string, x: number, y: number, r = 4): PfcCutGeometryV2 {
  return { cutId: id, kind: "POLYGON_CUT", semanticShape: "TRIANGLE", vertices: [{ x, y:y-r }, { x:x+r, y:y+r }, { x:x-r, y:y+r }] };
}

export function pfcMultishapeDiscoveryScenariosWave1(): PfcForwardScenarioWave1[] {
  const square: PfcSourceSheetV2 = { sheetId: "SQ", shape: "SQUARE", origin: { x:0,y:0 }, size:100 };
  const rectangle: PfcSourceSheetV2 = { sheetId: "R", shape: "RECTANGLE", origin: { x:0,y:0 }, width:120, height:80 };
  const circle: PfcSourceSheetV2 = { sheetId: "C", shape: "CIRCLE", center: { x:50,y:50 }, radius:50 };
  return [
    { scenarioId:"PFC-W1-SQ-V-HOLE", sourceSheet:square, folds:[verticalFold(50)], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:72,y:31},radius:2.4}], sourceFamily:"SQUARE_SINGLE_AXIAL_HOLE" },
    { scenarioId:"PFC-W1-RECT-V-HOLE", sourceSheet:rectangle, folds:[verticalFold(60)], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:84,y:26},radius:2.4}], sourceFamily:"RECTANGLE_SINGLE_AXIAL_HOLE" },
    { scenarioId:"PFC-W1-RECT-H-DIAMOND", sourceSheet:rectangle, folds:[horizontalFold(40)], cuts:[diamond("D1",78,24,4)], sourceFamily:"RECTANGLE_DIAMOND_CUT" },
    { scenarioId:"PFC-W1-RECT-DOUBLE-TRIANGLE", sourceSheet:rectangle, folds:[verticalFold(60,"F1"),horizontalFold(40,"F2")], cuts:[triangle("T1",86,24,3.5)], sourceFamily:"RECTANGLE_COMPOUND_TRIANGLE_CUT" },
    { scenarioId:"PFC-W1-RECT-SLIT", sourceSheet:rectangle, folds:[verticalFold(60)], cuts:[{cutId:"S1",kind:"SLIT",a:{x:81,y:47},b:{x:93,y:47},width:1.6}], sourceFamily:"RECTANGLE_ORIENTED_SLIT" },
    { scenarioId:"PFC-W1-RECT-MIXED", sourceSheet:rectangle, folds:[verticalFold(60,"F1"),horizontalFold(40,"F2")], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:82,y:21},radius:2.2},diamond("D1",101,31,3)], sourceFamily:"RECTANGLE_MIXED_HOLE_DIAMOND" },
    { scenarioId:"PFC-W1-CIRCLE-V-HOLE", sourceSheet:circle, folds:[verticalFold(50)], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:70,y:44},radius:2.4}], sourceFamily:"CIRCLE_DIAMETER_FOLD_HOLE" },
    { scenarioId:"PFC-W1-CIRCLE-H-HOLE", sourceSheet:circle, folds:[horizontalFold(50)], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:56,y:32},radius:2.4}], sourceFamily:"CIRCLE_HORIZONTAL_DIAMETER_HOLE" },
    { scenarioId:"PFC-W1-CIRCLE-DOUBLE-TRIANGLE", sourceSheet:circle, folds:[verticalFold(50,"F1"),horizontalFold(50,"F2")], cuts:[triangle("T1",67,34,3)], sourceFamily:"CIRCLE_QUARTER_FOLD_TRIANGLE" },
    { scenarioId:"PFC-W1-CIRCLE-DIAMOND", sourceSheet:circle, folds:[verticalFold(50)], cuts:[diamond("D1",73,55,3.5)], sourceFamily:"CIRCLE_DIAMOND_CUT" },
    { scenarioId:"PFC-W1-RECT-OFFCENTER", sourceSheet:rectangle, folds:[verticalFold(45)], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:67,y:58},radius:2.2}], sourceFamily:"RECTANGLE_OFF_CENTER_FOLD" },
    { scenarioId:"PFC-W1-SQ-DIAGONAL", sourceSheet:square, folds:[{foldId:"F1",kind:"DIAGONAL",line:{a:{x:0,y:0},b:{x:100,y:100}},movingSide:"POSITIVE"}], cuts:[triangle("T1",70,34,3)], sourceFamily:"SQUARE_DIAGONAL_ORIENTED_CUT" },
  ];
}

export function generatePfcMultishapeDiscoveryWave1(): PfcForwardSolutionWave1[] {
  return pfcMultishapeDiscoveryScenariosWave1().map(solvePfcForwardScenarioWave1);
}
