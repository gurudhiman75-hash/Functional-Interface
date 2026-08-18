import {
  pfcMappedCutFingerprintWave1,
  solvePfcForwardScenarioWave1,
  solvePfcReverseInferenceWave1,
  type PfcForwardScenarioWave1,
  type PfcForwardSolutionWave1,
  type PfcMappedCutWave1,
} from "./paper-folding-multishape-discovery-v1";
import {
  pfcPointOnSourceBoundaryV2,
  type PfcCutGeometryV2,
  type PfcSourceSheetV2,
} from "./paper-folding-foundation-v2";
import type { PfcFoldV1 } from "./paper-folding-foundation-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY = Object.freeze({
  authorityId: "PFC-001-MULTISHAPE-DISCOVERY-WAVE2" as const,
  supersedesDiscoveryBreadth: "PFC-001-MULTISHAPE-DISCOVERY-WAVE1" as const,
  sourceGapAuditAuthority: "PFC-TPF-POST-EXECUTION-SOURCE-GAP-AUDIT-V1" as const,
  status: "EXECUTABLE_GAP_CLOSURE_CANDIDATE_NOT_PERMANENT_RUNTIME" as const,
  closes: [
    "THREE_FOLD_AND_FOUR_STAGE_OPAQUE_SEQUENCES",
    "CREASE_EDGE_NOTCH_TO_INTERIOR_CUT_TOPOLOGY",
    "GENERATED_REVERSE_FOLD_PUNCH_GRAMMAR",
  ] as const,
  sourceShapes: ["SQUARE", "RECTANGLE"] as const,
  circleWave1Preserved: true,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcTopologyKindWave2 =
  | "HOLE"
  | "SLIT"
  | "POLYGON_CUT"
  | "BOUNDARY_NOTCH"
  | "INTERIOR_COALESCED_CUT";

export interface PfcTopologyComponentWave2 {
  sourceCutId: string;
  topology: PfcTopologyKindWave2;
  atomicMappedCount: number;
  vertices?: SpatialPoint[];
  fingerprint: string;
}

export interface PfcForwardSolutionWave2 extends PfcForwardSolutionWave1 {
  topologyComponents: PfcTopologyComponentWave2[];
  coalescedFingerprint: string;
}

const EPSILON = 1e-7;
const q = (value: number) => Math.round(value * 1_000_000) / 1_000_000;
const pointKey = (point: SpatialPoint) => `${q(point.x)},${q(point.y)}`;

function uniquePoints(points: readonly SpatialPoint[]): SpatialPoint[] {
  const seen = new Map<string, SpatialPoint>();
  for (const point of points) if (!seen.has(pointKey(point))) seen.set(pointKey(point), { x: q(point.x), y: q(point.y) });
  return [...seen.values()];
}

function convexHull(points: readonly SpatialPoint[]): SpatialPoint[] {
  const sorted = uniquePoints(points).sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length <= 2) return sorted;
  const cross = (o: SpatialPoint, a: SpatialPoint, b: SpatialPoint) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: SpatialPoint[] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= EPSILON) lower.pop();
    lower.push(point);
  }
  const upper: SpatialPoint[] = [];
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= EPSILON) upper.pop();
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

function canonicalPolygon(vertices: readonly SpatialPoint[]): string {
  const keys = vertices.map(pointKey);
  const rotations: string[] = [];
  for (const ordered of [keys, [...keys].reverse()]) {
    for (let index = 0; index < ordered.length; index += 1) {
      rotations.push([...ordered.slice(index), ...ordered.slice(0, index)].join("|"));
    }
  }
  return rotations.sort()[0] ?? "";
}

function sharedVertexCount(left: readonly SpatialPoint[], right: readonly SpatialPoint[]): number {
  const keys = new Set(left.map(pointKey));
  return right.reduce((count, point) => count + (keys.has(pointKey(point)) ? 1 : 0), 0);
}

function notchComponents(
  sheet: PfcSourceSheetV2,
  sourceCutId: string,
  cuts: readonly Extract<PfcMappedCutWave1, { kind: "EDGE_NOTCH" }>[],
): PfcTopologyComponentWave2[] {
  const pending = new Set(cuts.map((_, index) => index));
  const groups: number[][] = [];
  while (pending.size) {
    const first = pending.values().next().value as number;
    pending.delete(first);
    const group = [first];
    const queue = [first];
    while (queue.length) {
      const current = queue.shift()!;
      for (const candidate of [...pending]) {
        if (sharedVertexCount(cuts[current].vertices, cuts[candidate].vertices) >= 2) {
          pending.delete(candidate);
          group.push(candidate);
          queue.push(candidate);
        }
      }
    }
    groups.push(group);
  }

  return groups.map((group, groupIndex) => {
    const members = group.map((index) => cuts[index]);
    const vertices = members.length > 1
      ? convexHull(members.flatMap((cut) => cut.vertices))
      : uniquePoints(members[0].vertices);
    const boundaryContact = vertices.some((point) => pfcPointOnSourceBoundaryV2(sheet, point));
    const topology: PfcTopologyKindWave2 = members.length > 1 && !boundaryContact
      ? "INTERIOR_COALESCED_CUT"
      : boundaryContact
        ? "BOUNDARY_NOTCH"
        : "POLYGON_CUT";
    return {
      sourceCutId,
      topology,
      atomicMappedCount: members.length,
      vertices,
      fingerprint: `${sourceCutId}:${topology}:${groupIndex}:${canonicalPolygon(vertices)}`,
    };
  });
}

export function resolvePfcTopologyWave2(
  sheet: PfcSourceSheetV2,
  mappedCuts: readonly PfcMappedCutWave1[],
): PfcTopologyComponentWave2[] {
  const result: PfcTopologyComponentWave2[] = [];
  const notchIds = new Set(mappedCuts.filter((cut) => cut.kind === "EDGE_NOTCH").map((cut) => cut.sourceCutId));

  for (const sourceCutId of notchIds) {
    const cuts = mappedCuts.filter(
      (cut): cut is Extract<PfcMappedCutWave1, { kind: "EDGE_NOTCH" }> =>
        cut.kind === "EDGE_NOTCH" && cut.sourceCutId === sourceCutId,
    );
    result.push(...notchComponents(sheet, sourceCutId, cuts));
  }

  for (const cut of mappedCuts) {
    if (cut.kind === "EDGE_NOTCH") continue;
    if (cut.kind === "CIRCLE_HOLE") {
      result.push({
        sourceCutId: cut.sourceCutId,
        topology: "HOLE",
        atomicMappedCount: 1,
        fingerprint: `${cut.sourceCutId}:HOLE:${pointKey(cut.center)}:r${q(cut.radius)}`,
      });
      continue;
    }
    if (cut.kind === "SLIT") {
      result.push({
        sourceCutId: cut.sourceCutId,
        topology: "SLIT",
        atomicMappedCount: 1,
        fingerprint: `${cut.sourceCutId}:SLIT:${[pointKey(cut.a), pointKey(cut.b)].sort().join("|")}:w${q(cut.width)}`,
      });
      continue;
    }
    result.push({
      sourceCutId: cut.sourceCutId,
      topology: "POLYGON_CUT",
      atomicMappedCount: 1,
      vertices: uniquePoints(cut.vertices),
      fingerprint: `${cut.sourceCutId}:POLYGON_CUT:${canonicalPolygon(cut.vertices)}`,
    });
  }

  const unique = new Map<string, PfcTopologyComponentWave2>();
  for (const component of result) if (!unique.has(component.fingerprint)) unique.set(component.fingerprint, component);
  return [...unique.values()].sort((left, right) => left.fingerprint.localeCompare(right.fingerprint));
}

export function solvePfcForwardScenarioWave2(scenario: PfcForwardScenarioWave1): PfcForwardSolutionWave2 {
  const base = solvePfcForwardScenarioWave1(scenario);
  const topologyComponents = resolvePfcTopologyWave2(scenario.sourceSheet, base.mappedCuts);
  return {
    ...base,
    topologyComponents,
    coalescedFingerprint: `${scenario.sourceSheet.shape}::${topologyComponents.map((item) => item.fingerprint).sort().join(";")}`,
  };
}

function verticalFold(x: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x, y: -200 }, b: { x, y: 300 } }, movingSide };
}
function horizontalFold(y: number, id: string, movingSide: "POSITIVE" | "NEGATIVE" = "POSITIVE"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: -200, y }, b: { x: 300, y } }, movingSide };
}
function vNotch(cutId: string, edgeX: number, centerY: number, inward: 1 | -1, depth = 7, halfMouth = 5): PfcCutGeometryV2 {
  return { cutId, kind: "EDGE_NOTCH", semanticShape: "V_NOTCH", vertices: [
    { x: edgeX, y: centerY - halfMouth },
    { x: edgeX + inward * depth, y: centerY },
    { x: edgeX, y: centerY + halfMouth },
  ] };
}
function diamond(cutId: string, x: number, y: number, radius = 4): PfcCutGeometryV2 {
  return { cutId, kind: "POLYGON_CUT", semanticShape: "DIAMOND", vertices: [
    { x, y: y - radius }, { x: x + radius, y }, { x, y: y + radius }, { x: x - radius, y },
  ] };
}

export function pfcGapClosureScenariosWave2(): PfcForwardScenarioWave1[] {
  const square: PfcSourceSheetV2 = { sheetId: "SQ-W2", shape: "SQUARE", origin: { x: 0, y: 0 }, size: 100 };
  const rectangle: PfcSourceSheetV2 = { sheetId: "RECT-W2", shape: "RECTANGLE", origin: { x: 0, y: 0 }, width: 120, height: 80 };
  return [
    { scenarioId: "PFC-W2-SQUARE-THREE-FOLD-HOLE", sourceSheet: square, folds: [verticalFold(50,"F1"), horizontalFold(50,"F2"), verticalFold(75,"F3")], cuts: [{ cutId:"H1", kind:"CIRCLE_HOLE", center:{x:86,y:23}, radius:2.2 }], sourceFamily:"SQUARE_THREE_FOLD_EIGHT_LAYER_HOLE" },
    { scenarioId: "PFC-W2-RECT-THREE-FOLD-HOLE", sourceSheet: rectangle, folds: [verticalFold(60,"F1"), horizontalFold(40,"F2"), verticalFold(90,"F3")], cuts: [{ cutId:"H1", kind:"CIRCLE_HOLE", center:{x:103,y:18}, radius:2.2 }], sourceFamily:"RECTANGLE_THREE_FOLD_EIGHT_LAYER_HOLE" },
    { scenarioId: "PFC-W2-RECT-THREE-FOLD-DIAMOND", sourceSheet: rectangle, folds: [horizontalFold(40,"F1"), verticalFold(60,"F2"), verticalFold(90,"F3")], cuts: [diamond("D1",104,18,3.2)], sourceFamily:"RECTANGLE_THREE_FOLD_ORIENTED_DIAMOND" },
    { scenarioId: "PFC-W2-SQUARE-FOLD-EDGE-V-NOTCH", sourceSheet: square, folds: [verticalFold(50,"F1")], cuts: [vNotch("N1",50,34,1)], sourceFamily:"CREASE_EDGE_V_NOTCH_COALESCES_TO_INTERIOR_CUT" },
    { scenarioId: "PFC-W2-RECT-FOLD-EDGE-V-NOTCH", sourceSheet: rectangle, folds: [verticalFold(60,"F1")], cuts: [vNotch("N1",60,29,1)], sourceFamily:"RECTANGLE_CREASE_EDGE_V_NOTCH_COALESCENCE" },
    { scenarioId: "PFC-W2-SQUARE-OUTER-V-NOTCH", sourceSheet: square, folds: [verticalFold(50,"F1")], cuts: [vNotch("N1",100,38,-1)], sourceFamily:"OUTER_BOUNDARY_V_NOTCH_REMAINS_BOUNDARY_COMPONENTS" },
    { scenarioId: "PFC-W2-RECT-OUTER-V-NOTCH", sourceSheet: rectangle, folds: [verticalFold(60,"F1")], cuts: [vNotch("N1",120,31,-1)], sourceFamily:"RECTANGLE_OUTER_BOUNDARY_V_NOTCH" },
    { scenarioId: "PFC-W2-RECT-THREE-FOLD-MIXED-CUTS", sourceSheet: rectangle, folds: [verticalFold(60,"F1"), horizontalFold(40,"F2"), verticalFold(90,"F3")], cuts: [{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:101,y:15},radius:2},diamond("D1",110,25,3)], sourceFamily:"THREE_FOLD_MULTIPLE_DISTINCT_CUTS" },
  ];
}

export function generatePfcGapClosureWave2(): PfcForwardSolutionWave2[] {
  return pfcGapClosureScenariosWave2().map(solvePfcForwardScenarioWave2);
}

export interface PfcReverseQuestionWave2 {
  questionId: string;
  sourceShape: "SQUARE" | "RECTANGLE";
  foldDepth: 1 | 2 | 3;
  targetFingerprint: string;
  candidateIds: string[];
  correctCandidateId: string;
  candidateFingerprints: Record<string, string>;
}

function reverseScenarioSet(questionId: string, sheet: PfcSourceSheetV2, width: number, height: number, foldDepth: 1 | 2 | 3, variant: number): PfcReverseQuestionWave2 {
  const yTop = q(height * (0.22 + variant * 0.035));
  const targetX = foldDepth === 3 ? q(width * (0.84 + variant * 0.018)) : q(width * (0.70 + variant * 0.025));
  const targetY = foldDepth >= 2 ? Math.min(q(height * 0.34), yTop) : q(height * (0.28 + variant * 0.06));
  const targetFolds: PfcFoldV1[] = [verticalFold(width/2,"F1")];
  if (foldDepth >= 2) targetFolds.push(horizontalFold(height/2,"F2"));
  if (foldDepth >= 3) targetFolds.push(verticalFold(width*0.75,"F3"));
  const targetScenario: PfcForwardScenarioWave1 = { scenarioId:`${questionId}-TARGET`, sourceSheet:sheet, folds:targetFolds, cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:targetX,y:targetY},radius:2}], sourceFamily:`REVERSE_TARGET_DEPTH_${foldDepth}` };
  const wrongPosition: PfcForwardScenarioWave1 = { ...targetScenario, scenarioId:`${questionId}-WRONG-POSITION`, cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:q(targetX-width*0.055),y:q(targetY+height*0.045)},radius:2}], sourceFamily:"REVERSE_WRONG_PUNCH_POSITION" };
  const wrongSide: PfcForwardScenarioWave1 = foldDepth === 1
    ? { ...targetScenario, scenarioId:`${questionId}-WRONG-SIDE`, folds:[verticalFold(width/2,"F1","NEGATIVE")], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:q(width*(0.24+variant*0.02)),y:q(targetY+height*0.035)},radius:2}], sourceFamily:"REVERSE_WRONG_FOLD_SIDE" }
    : { ...targetScenario, scenarioId:`${questionId}-WRONG-SIDE`, folds:[verticalFold(width/2,"F1"),horizontalFold(height/2,"F2","NEGATIVE")], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:q(width*0.72),y:q(height*0.72)},radius:2}], sourceFamily:"REVERSE_WRONG_SECOND_FOLD_SIDE" };
  const wrongDepth: PfcForwardScenarioWave1 = foldDepth === 3
    ? { ...targetScenario, scenarioId:`${questionId}-WRONG-DEPTH`, folds:[verticalFold(width/2,"F1"),horizontalFold(height/2,"F2"),horizontalFold(height*0.25,"F3")], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:q(width*0.72),y:q(height*0.12)},radius:2}], sourceFamily:"REVERSE_WRONG_THIRD_AXIS" }
    : { ...targetScenario, scenarioId:`${questionId}-WRONG-DEPTH`, folds:[verticalFold(width/2,"F1"),verticalFold(width*0.75,"F2")], cuts:[{cutId:"H1",kind:"CIRCLE_HOLE",center:{x:q(width*0.86),y:targetY},radius:2}], sourceFamily:"REVERSE_WRONG_FOLD_COUNT" };
  const rawCandidates = [
    { scenario:targetScenario }, { scenario:wrongPosition }, { scenario:wrongSide }, { scenario:wrongDepth },
  ];
  const rotation = (variant + foldDepth) % 4;
  const ordered = [...rawCandidates.slice(rotation), ...rawCandidates.slice(0,rotation)].map((candidate,index)=>({candidateId:["A","B","C","D"][index],scenario:candidate.scenario}));
  const target = solvePfcForwardScenarioWave1(targetScenario);
  const solved = solvePfcReverseInferenceWave1(target.fingerprint, ordered);
  const fingerprints = Object.fromEntries(ordered.map(({candidateId,scenario})=>[candidateId,solvePfcForwardScenarioWave1(scenario).fingerprint]));
  return { questionId, sourceShape:sheet.shape as "SQUARE"|"RECTANGLE", foldDepth, targetFingerprint:target.fingerprint, candidateIds:ordered.map(item=>item.candidateId), correctCandidateId:solved.candidateId, candidateFingerprints:fingerprints };
}

export function generatePfcReverseCorpusWave2(): PfcReverseQuestionWave2[] {
  const square: PfcSourceSheetV2 = { sheetId:"SQ-REV-W2", shape:"SQUARE", origin:{x:0,y:0}, size:100 };
  const rectangle: PfcSourceSheetV2 = { sheetId:"RECT-REV-W2", shape:"RECTANGLE", origin:{x:0,y:0}, width:120, height:80 };
  const questions: PfcReverseQuestionWave2[] = [];
  for (const [shape,sheet,width,height] of [["SQ",square,100,100] as const,["RECT",rectangle,120,80] as const]) {
    for (const depth of [1,2,3] as const) {
      for (let variant=0; variant<2; variant+=1) questions.push(reverseScenarioSet(`PFC-W2-REV-${shape}-D${depth}-V${variant+1}`,sheet,width,height,depth,variant));
    }
  }
  return questions;
}
