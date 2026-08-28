import {
  applyPfcFoldV1,
  pointInPolygonInclusiveV1,
  signedSideOfLineV1,
  solvePfcCutsV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  validatePfcInnovationCandidateV1,
  type PfcInnovationCandidateV1,
  type PfcNovelSubstrateProfileV1,
} from "./paper-folding-content-innovation-envelope-v1";
import type { SpatialPoint } from "./types";

export const PFC_001_INNOVATION_DISCOVERY_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-CONTROLLED-NOVEL-DISCOVERY-V1" as const,
  policyAuthority: "PFC-001-CONTENT-INNOVATION-ENVELOPE-V1" as const,
  provenance: "CONTROLLED_NOVEL" as const,
  candidateCount: 6,
  substrateProfiles: ["REGULAR_PENTAGON", "REGULAR_OCTAGON", "SKEWED_CONVEX_POLYGON"] as const,
  answerAuthority: "EXACT_FOLD_LAYER_PROVENANCE" as const,
  pyqAttributionAllowed: false,
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowed: false,
} as const);

export interface PfcInnovationScenarioV1 {
  candidate: PfcInnovationCandidateV1;
  substrateProfile: PfcNovelSubstrateProfileV1;
  boundary: SpatialPoint[];
  folds: PfcFoldV1[];
}

export interface PfcInnovationSolvedScenarioV1 {
  candidateId: string;
  substrateProfile: PfcNovelSubstrateProfileV1;
  foldCount: number;
  affectedLayerCount: number;
  cutCenter: SpatialPoint;
  unfoldedPositions: Array<{ x: number; y: number }>;
  fingerprint: string;
}

const CENTER = { x: 60, y: 60 };
const q = (value: number) => Math.round(value * 1000) / 1000;

function regularPolygon(vertexCount: number, radius: number, rotationDegrees = -90): SpatialPoint[] {
  return Array.from({ length: vertexCount }, (_, index) => {
    const angle = (rotationDegrees + (360 * index) / vertexCount) * Math.PI / 180;
    return { x: q(CENTER.x + radius * Math.cos(angle)), y: q(CENTER.y + radius * Math.sin(angle)) };
  });
}

function skewPolygon(vertices: readonly SpatialPoint[]): SpatialPoint[] {
  return vertices.map((point) => ({
    x: q(CENTER.x + (point.x - CENTER.x) + 0.24 * (point.y - CENTER.y)),
    y: q(CENTER.y + 0.88 * (point.y - CENTER.y)),
  }));
}

function verticalFold(id: string, x: number, movingSide: "POSITIVE" | "NEGATIVE"): PfcFoldV1 {
  return { foldId: id, kind: "VERTICAL", line: { a: { x, y: -80 }, b: { x, y: 200 } }, movingSide };
}

function horizontalFold(id: string, y: number, movingSide: "POSITIVE" | "NEGATIVE"): PfcFoldV1 {
  return { foldId: id, kind: "HORIZONTAL", line: { a: { x: -80, y }, b: { x: 200, y } }, movingSide };
}

function generalFold(id: string, angleDegrees: number, offset: number, movingSide: "POSITIVE" | "NEGATIVE"): PfcFoldV1 {
  const radians = angleDegrees * Math.PI / 180;
  const dx = Math.cos(radians) * 150;
  const dy = Math.sin(radians) * 150;
  const nx = -Math.sin(radians);
  const ny = Math.cos(radians);
  const cx = CENTER.x + nx * offset;
  const cy = CENTER.y + ny * offset;
  return {
    foldId: id,
    kind: "GENERAL_LINE",
    line: { a: { x: cx - dx, y: cy - dy }, b: { x: cx + dx, y: cy + dy } },
    movingSide,
  };
}

function makeCandidate(
  candidateId: string,
  substrateProfile: PfcNovelSubstrateProfileV1,
  proposalId: PfcInnovationCandidateV1["proposalId"],
  novelAxes: PfcInnovationCandidateV1["novelAxes"],
  foldOperationCount: number,
  intendedDifficulty: PfcInnovationCandidateV1["intendedDifficulty"],
): PfcInnovationCandidateV1 {
  return validatePfcInnovationCandidateV1({
    candidateId,
    provenance: "CONTROLLED_NOVEL",
    proposalId,
    substrateProfile,
    novelAxes,
    foldOperationCount,
    intendedDifficulty,
  });
}

export function pfcInnovationDiscoveryScenariosV1(): PfcInnovationScenarioV1[] {
  const pentagon = regularPolygon(5, 48);
  const octagon = regularPolygon(8, 47, -67.5);
  const skewed = skewPolygon(regularPolygon(6, 46, -90));

  return [
    {
      candidate: makeCandidate("PFC-INNOV-01", "REGULAR_PENTAGON", "PFC-PROP-01", ["SOURCE_SHEET_GEOMETRY", "FOLD_LINE_POSITION"], 1, "MEDIUM"),
      substrateProfile: "REGULAR_PENTAGON",
      boundary: pentagon,
      folds: [verticalFold("I1-F1", 56, "POSITIVE")],
    },
    {
      candidate: makeCandidate("PFC-INNOV-02", "REGULAR_PENTAGON", "PFC-PROP-03", ["SOURCE_SHEET_GEOMETRY", "FOLD_LINE_ANGLE"], 1, "MEDIUM"),
      substrateProfile: "REGULAR_PENTAGON",
      boundary: pentagon,
      folds: [generalFold("I2-F1", 23, 0, "NEGATIVE")],
    },
    {
      candidate: makeCandidate("PFC-INNOV-03", "REGULAR_OCTAGON", "PFC-PROP-01", ["SOURCE_SHEET_GEOMETRY", "FOLD_LINE_POSITION"], 1, "MEDIUM"),
      substrateProfile: "REGULAR_OCTAGON",
      boundary: octagon,
      folds: [horizontalFold("I3-F1", 55, "POSITIVE")],
    },
    {
      candidate: makeCandidate("PFC-INNOV-04", "REGULAR_OCTAGON", "PFC-PROP-03", ["SOURCE_SHEET_GEOMETRY", "FOLD_LINE_ANGLE"], 1, "MEDIUM"),
      substrateProfile: "REGULAR_OCTAGON",
      boundary: octagon,
      folds: [generalFold("I4-F1", -17, 4, "POSITIVE")],
    },
    {
      candidate: makeCandidate("PFC-INNOV-05", "SKEWED_CONVEX_POLYGON", "PFC-PROP-03", ["SOURCE_SHEET_GEOMETRY", "SYMMETRY_BREAK"], 1, "MEDIUM"),
      substrateProfile: "SKEWED_CONVEX_POLYGON",
      boundary: skewed,
      folds: [generalFold("I5-F1", 31, -3, "NEGATIVE")],
    },
    {
      candidate: makeCandidate("PFC-INNOV-06", "REGULAR_PENTAGON", "PFC-PROP-02", ["SOURCE_SHEET_GEOMETRY", "FOLD_LINE_POSITION", "FOLD_SEQUENCE"], 2, "HARD"),
      substrateProfile: "REGULAR_PENTAGON",
      boundary: pentagon,
      folds: [verticalFold("I6-F1", 57, "POSITIVE"), horizontalFold("I6-F2", 61, "NEGATIVE")],
    },
  ];
}

function foldedFragments(boundary: readonly SpatialPoint[], folds: readonly PfcFoldV1[]): PfcLayerFragmentV1[] {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "INNOV-ROOT",
    sourceSheetRegionId: "INNOV-ROOT",
    polygon: boundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  for (const fold of folds) fragments = applyPfcFoldV1(fragments, fold);
  return fragments;
}

function findReachableInteriorCut(
  fragments: readonly PfcLayerFragmentV1[],
  folds: readonly PfcFoldV1[],
): SpatialPoint {
  const all = fragments.flatMap((fragment) => fragment.polygon);
  const minX = Math.floor(Math.min(...all.map((point) => point.x)));
  const maxX = Math.ceil(Math.max(...all.map((point) => point.x)));
  const minY = Math.floor(Math.min(...all.map((point) => point.y)));
  const maxY = Math.ceil(Math.max(...all.map((point) => point.y)));
  const offsets = [{ x: 0, y: 0 }, { x: 1.25, y: 0 }, { x: -1.25, y: 0 }, { x: 0, y: 1.25 }, { x: 0, y: -1.25 }];

  let best: { point: SpatialPoint; layers: number; creaseDistance: number } | null = null;
  for (let y = minY + 2; y <= maxY - 2; y += 2) {
    for (let x = minX + 2; x <= maxX - 2; x += 2) {
      const point = { x, y };
      const layerCount = fragments.filter((fragment) => pointInPolygonInclusiveV1(point, fragment.polygon)).length;
      if (layerCount < 2) continue;
      const stable = offsets.every((offset) => {
        const probe = { x: x + offset.x, y: y + offset.y };
        return fragments.filter((fragment) => pointInPolygonInclusiveV1(probe, fragment.polygon)).length >= layerCount;
      });
      if (!stable) continue;
      const creaseDistance = Math.min(...folds.map((fold) => Math.abs(signedSideOfLineV1(point, fold.line))));
      if (creaseDistance < 3.5) continue;
      if (!best || layerCount > best.layers || (layerCount === best.layers && creaseDistance > best.creaseDistance)) {
        best = { point, layers: layerCount, creaseDistance };
      }
    }
  }
  if (!best) throw new Error("Controlled-novel scenario has no stable multi-layer cut region.");
  return best.point;
}

export function solvePfcInnovationScenarioV1(scenario: PfcInnovationScenarioV1): PfcInnovationSolvedScenarioV1 {
  validatePfcInnovationCandidateV1(scenario.candidate);
  const fragments = foldedFragments(scenario.boundary, scenario.folds);
  const cutCenter = findReachableInteriorCut(fragments, scenario.folds);
  const solution = solvePfcCutsV1(scenario.boundary, scenario.folds, [{
    cutId: `${scenario.candidate.candidateId}-CUT`,
    kind: "POINT_HOLE",
    center: cutCenter,
    radius: 2.2,
  }]);
  const cut = solution.cuts[0];
  const unfoldedPositions = cut.mappedCuts.map((mapped) => ({ x: q(mapped.originalCenter.x), y: q(mapped.originalCenter.y) }));
  if (cut.affectedLayerCount < 2 || unfoldedPositions.length < 2) {
    throw new Error(`${scenario.candidate.candidateId} did not produce a meaningful multi-layer unfolding.`);
  }
  return {
    candidateId: scenario.candidate.candidateId,
    substrateProfile: scenario.substrateProfile,
    foldCount: scenario.folds.length,
    affectedLayerCount: cut.affectedLayerCount,
    cutCenter: { x: q(cutCenter.x), y: q(cutCenter.y) },
    unfoldedPositions,
    fingerprint: solution.unfoldedFingerprint,
  };
}

export function solveAllPfcInnovationScenariosV1(): PfcInnovationSolvedScenarioV1[] {
  return pfcInnovationDiscoveryScenariosV1().map(solvePfcInnovationScenarioV1);
}
