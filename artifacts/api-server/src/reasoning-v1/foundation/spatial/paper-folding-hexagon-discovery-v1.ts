import { applyAffineTransform, reflectionAcrossLineTransform } from "./geometry";
import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import type { PfcCutGeometryV2 } from "./paper-folding-foundation-v2";
import {
  createRegularHexagonalPfcSheetV4,
  pfcPolygonBoundaryForFoldEngineV4,
  validatePfcCutGeometryV4,
  type PfcSourceSheetV4,
} from "./paper-folding-foundation-v4";
import type { SpatialPoint } from "./types";

export const PFC_001_HEXAGON_DISCOVERY_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-HEXAGON-SUBSTRATE-DISCOVERY-V1" as const,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V4" as const,
  foundationAuthority: "PFC-001-FOUNDATION-V4-HEXAGON-ACTIVATED" as const,
  sourceShape: "REGULAR_HEXAGON" as const,
  executableFamilies: ["HEXAGON_SINGLE_AXIS", "HEXAGON_SIX_SECTOR_RADIAL"] as const,
  sixSectorAuthority: "ROTATIONAL_UNFOLDING_BY_60_DEGREE_SECTOR_REPLICATION" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcHexMappedCutV1 =
  | { kind: "CIRCLE_HOLE"; center: SpatialPoint; radius: number }
  | { kind: "POLYGON_CUT"; semanticShape: "DIAMOND" | "TRIANGLE"; vertices: SpatialPoint[] }
  | { kind: "SLIT"; a: SpatialPoint; b: SpatialPoint; width: number };

export interface PfcHexagonScenarioV1 {
  scenarioId: string;
  sourceSheet: PfcSourceSheetV4;
  family: "HEXAGON_SINGLE_AXIS" | "HEXAGON_SIX_SECTOR_RADIAL";
  fold?: PfcFoldV1;
  cut: PfcCutGeometryV2;
  proposalId: "PFC-PROP-01" | "PFC-PROP-03" | "PFC-PROP-04";
}

export interface PfcHexagonSolutionV1 {
  scenarioId: string;
  family: PfcHexagonScenarioV1["family"];
  affectedLayerCount: number;
  mappedCuts: PfcHexMappedCutV1[];
  fingerprint: string;
}

const CENTER = { x: 60, y: 60 };
const q = (v: number) => Math.round(v * 1000) / 1000;
const pointKey = (p: SpatialPoint) => `${q(p.x)},${q(p.y)}`;

function rotatePoint(point: SpatialPoint, degrees: number): SpatialPoint {
  const r = degrees * Math.PI / 180;
  const dx = point.x - CENTER.x, dy = point.y - CENTER.y;
  return { x: q(CENTER.x + dx * Math.cos(r) - dy * Math.sin(r)), y: q(CENTER.y + dx * Math.sin(r) + dy * Math.cos(r)) };
}

function mapCut(cut: PfcCutGeometryV2, map: (p: SpatialPoint) => SpatialPoint): PfcHexMappedCutV1 {
  if (cut.kind === "CIRCLE_HOLE") return { kind: cut.kind, center: map(cut.center), radius: cut.radius };
  if (cut.kind === "SLIT") return { kind: cut.kind, a: map(cut.a), b: map(cut.b), width: cut.width };
  if (cut.kind !== "POLYGON_CUT" || (cut.semanticShape !== "DIAMOND" && cut.semanticShape !== "TRIANGLE")) throw new Error(`Unsupported hexagon cut ${cut.kind}.`);
  return { kind: cut.kind, semanticShape: cut.semanticShape, vertices: cut.vertices.map(map) };
}

function key(cut: PfcHexMappedCutV1): string {
  if (cut.kind === "CIRCLE_HOLE") return `H:${pointKey(cut.center)}:${q(cut.radius)}`;
  if (cut.kind === "SLIT") return `S:${[pointKey(cut.a), pointKey(cut.b)].sort().join("|")}:${q(cut.width)}`;
  return `${cut.semanticShape}:${cut.vertices.map(pointKey).sort().join("|")}`;
}

function solveSingleAxis(scenario: PfcHexagonScenarioV1): PfcHexagonSolutionV1 {
  if (!scenario.fold) throw new Error(`${scenario.scenarioId} requires a fold.`);
  const boundary = pfcPolygonBoundaryForFoldEngineV4(scenario.sourceSheet);
  let fragments: PfcLayerFragmentV1[] = [{ fragmentId: "HEX-ROOT", sourceSheetRegionId: "HEX-ROOT", polygon: boundary, transformHistory: [] }];
  fragments = applyPfcFoldV1(fragments, scenario.fold);
  validatePfcCutGeometryV4(scenario.sourceSheet, scenario.cut);
  const anchors = scenario.cut.kind === "CIRCLE_HOLE" ? [scenario.cut.center]
    : scenario.cut.kind === "SLIT" ? [scenario.cut.a, scenario.cut.b]
    : scenario.cut.vertices;
  const affected = fragments.filter((fragment) => anchors.some((point) => pointInPolygonInclusiveV1(point, fragment.polygon)));
  if (affected.length !== 2) throw new Error(`${scenario.scenarioId} expected exactly two folded hexagon layers, found ${affected.length}.`);
  const mapped = affected.map((fragment) => mapCut(scenario.cut, (point) => {
    let out = { ...point };
    for (let i = fragment.transformHistory.length - 1; i >= 0; i -= 1) out = applyAffineTransform(out, fragment.transformHistory[i]);
    return { x: q(out.x), y: q(out.y) };
  }));
  const unique = [...new Map(mapped.map((item) => [key(item), item])).values()];
  return { scenarioId: scenario.scenarioId, family: scenario.family, affectedLayerCount: 2, mappedCuts: unique, fingerprint: `HEX::${unique.map(key).sort().join(";")}` };
}

function solveSixSector(scenario: PfcHexagonScenarioV1): PfcHexagonSolutionV1 {
  validatePfcCutGeometryV4(scenario.sourceSheet, scenario.cut);
  const mapped = Array.from({ length: 6 }, (_, index) => mapCut(scenario.cut, (point) => rotatePoint(point, index * 60)));
  const unique = [...new Map(mapped.map((item) => [key(item), item])).values()];
  if (unique.length !== 6) throw new Error(`${scenario.scenarioId} six-sector cut did not produce six distinct unfolded placements.`);
  return { scenarioId: scenario.scenarioId, family: scenario.family, affectedLayerCount: 6, mappedCuts: unique, fingerprint: `HEX::${unique.map(key).sort().join(";")}` };
}

export function solvePfcHexagonScenarioV1(scenario: PfcHexagonScenarioV1): PfcHexagonSolutionV1 {
  return scenario.family === "HEXAGON_SINGLE_AXIS" ? solveSingleAxis(scenario) : solveSixSector(scenario);
}

function foldThroughCenter(angleDeg: number, movingSide: "POSITIVE" | "NEGATIVE", id: string): PfcFoldV1 {
  const r = angleDeg * Math.PI / 180;
  const dx = Math.cos(r) * 100, dy = Math.sin(r) * 100;
  return { foldId: id, kind: angleDeg % 90 === 0 ? (angleDeg % 180 === 0 ? "HORIZONTAL" : "VERTICAL") : "GENERAL_LINE", line: { a: { x: CENTER.x - dx, y: CENTER.y - dy }, b: { x: CENTER.x + dx, y: CENTER.y + dy } }, movingSide };
}

function diamond(id: string, x: number, y: number, r = 3): PfcCutGeometryV2 { return { cutId:id, kind:"POLYGON_CUT", semanticShape:"DIAMOND", vertices:[{x,y:y-r},{x:x+r,y},{x,y:y+r},{x:x-r,y}] }; }
function tri(id: string, x: number, y: number, r = 3): PfcCutGeometryV2 { return { cutId:id, kind:"POLYGON_CUT", semanticShape:"TRIANGLE", vertices:[{x,y:y-r},{x:x+r,y:y+r},{x:x-r,y:y+r}] }; }
function slit(id: string, x: number, y: number): PfcCutGeometryV2 { return { cutId:id, kind:"SLIT", a:{x:x-4,y:y-1}, b:{x:x+4,y:y+1}, width:1.4 }; }

export function pfcHexagonDiscoveryScenariosV1(): PfcHexagonScenarioV1[] {
  const sheet = createRegularHexagonalPfcSheetV4(CENTER, 48);
  return [
    { scenarioId:"PFC-HEX-01", sourceSheet:sheet, family:"HEXAGON_SINGLE_AXIS", fold:foldThroughCenter(90,"POSITIVE","F1"), cut:{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:78,y:48},radius:2.3}, proposalId:"PFC-PROP-01" },
    { scenarioId:"PFC-HEX-02", sourceSheet:sheet, family:"HEXAGON_SINGLE_AXIS", fold:foldThroughCenter(0,"POSITIVE","F2"), cut:{cutId:"H2",kind:"CIRCLE_HOLE",center:{x:48,y:78},radius:2.3}, proposalId:"PFC-PROP-01" },
    { scenarioId:"PFC-HEX-03", sourceSheet:sheet, family:"HEXAGON_SINGLE_AXIS", fold:foldThroughCenter(30,"POSITIVE","F3"), cut:diamond("D1",72,67), proposalId:"PFC-PROP-03" },
    { scenarioId:"PFC-HEX-04", sourceSheet:sheet, family:"HEXAGON_SINGLE_AXIS", fold:foldThroughCenter(-30,"NEGATIVE","F4"), cut:slit("S1",72,53), proposalId:"PFC-PROP-04" },
    { scenarioId:"PFC-HEX-05", sourceSheet:sheet, family:"HEXAGON_SIX_SECTOR_RADIAL", cut:{cutId:"H5",kind:"CIRCLE_HOLE",center:{x:82,y:60},radius:2.3}, proposalId:"PFC-PROP-02" as "PFC-PROP-01" },
    { scenarioId:"PFC-HEX-06", sourceSheet:sheet, family:"HEXAGON_SIX_SECTOR_RADIAL", cut:{cutId:"H6",kind:"CIRCLE_HOLE",center:{x:78,y:64},radius:2.3}, proposalId:"PFC-PROP-02" as "PFC-PROP-01" },
    { scenarioId:"PFC-HEX-07", sourceSheet:sheet, family:"HEXAGON_SIX_SECTOR_RADIAL", cut:diamond("D7",80,61), proposalId:"PFC-PROP-04" },
    { scenarioId:"PFC-HEX-08", sourceSheet:sheet, family:"HEXAGON_SIX_SECTOR_RADIAL", cut:tri("T8",79,58), proposalId:"PFC-PROP-04" },
  ];
}

export function solvePfcHexagonReverseInferenceV1(targetFingerprint: string, candidates: readonly PfcHexagonScenarioV1[]): PfcHexagonScenarioV1 {
  const matches = candidates.filter((scenario) => solvePfcHexagonScenarioV1(scenario).fingerprint === targetFingerprint);
  if (matches.length !== 1) throw new Error(`Hexagon reverse inference expected one match, found ${matches.length}.`);
  return matches[0];
}

export function reflectedHexPointV1(point: SpatialPoint, fold: PfcFoldV1): SpatialPoint {
  const t = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  const p = applyAffineTransform(point, t);
  return { x:q(p.x), y:q(p.y) };
}
