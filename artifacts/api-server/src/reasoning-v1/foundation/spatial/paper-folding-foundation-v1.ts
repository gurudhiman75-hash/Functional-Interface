import {
  applyAffineTransform,
  reflectionAcrossLineTransform,
  type AffineTransform,
} from "./geometry";
import type { SpatialPoint } from "./types";

export const PFC_001_FOUNDATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "PFC-001-FOUNDATION-V1" as const,
  chapterCode: "PFC-001" as const,
  stage: "CP0_FOUNDATION" as const,
  permanentQlAllocationStatus: "NOT_ALLOCATED_DISCOVERY_REQUIRED" as const,
  frozenSpatialQlRange: "SPA-QL-001..SPA-QL-034" as const,
  nextAvailableQl: "SPA-QL-035" as const,
  answerAuthority: "SEMANTIC_FOLD_STATE_AND_LAYER_PROVENANCE" as const,
  svgAuthority: false,
  automaticPublication: false,
} as const);

export type PfcFoldSideV1 = "POSITIVE" | "NEGATIVE";
export type PfcCutKindV1 = "POINT_HOLE" | "BOUNDARY_NOTCH";
export type PfcOriginalContactV1 = "BOUNDARY" | "INTERIOR";

export interface PfcLineV1 {
  a: SpatialPoint;
  b: SpatialPoint;
}

export interface PfcFoldV1 {
  foldId: string;
  line: PfcLineV1;
  movingSide: PfcFoldSideV1;
  kind: "VERTICAL" | "HORIZONTAL" | "DIAGONAL" | "CORNER" | "GENERAL_LINE";
}

export interface PfcCutV1 {
  cutId: string;
  kind: PfcCutKindV1;
  center: SpatialPoint;
  radius: number;
}

export interface PfcLayerFragmentV1 {
  fragmentId: string;
  sourceSheetRegionId: string;
  polygon: SpatialPoint[];
  transformHistory: AffineTransform[];
}

export interface PfcFoldSnapshotV1 {
  foldId: string;
  fragmentCount: number;
  activeArea: number;
}

export interface PfcMappedCutV1 {
  cutId: string;
  kind: PfcCutKindV1;
  sourceFragmentId: string;
  foldedCenter: SpatialPoint;
  originalCenter: SpatialPoint;
  originalContact: PfcOriginalContactV1;
}

export interface PfcCutEvidenceV1 {
  cutId: string;
  affectedFragmentIds: string[];
  affectedLayerCount: number;
  mappedCuts: PfcMappedCutV1[];
}

export interface PfcFoundationSolutionV1 {
  sheetBoundary: SpatialPoint[];
  folds: PfcFoldV1[];
  foldSnapshots: PfcFoldSnapshotV1[];
  finalFragments: PfcLayerFragmentV1[];
  cuts: PfcCutEvidenceV1[];
  unfoldedFingerprint: string;
}

export class PfcFoundationErrorV1 extends Error {
  constructor(
    public readonly code:
      | "PFC_INVALID_FOLD_LINE"
      | "PFC_DEGENERATE_ACTIVE_POLYGON"
      | "PFC_CUT_MISSES_FOLDED_MATERIAL"
      | "PFC_CUT_TANGENCY_UNREADABLE"
      | "PFC_DUPLICATE_UNFOLDED_IMPRINT",
    message: string,
  ) {
    super(message);
    this.name = "PfcFoundationErrorV1";
  }
}

const EPSILON = 1e-7;
const MIN_AREA = 1e-6;

function assertFinitePoint(point: SpatialPoint, label: string): void {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new PfcFoundationErrorV1(
      "PFC_DEGENERATE_ACTIVE_POLYGON",
      `${label} must contain finite coordinates.`,
    );
  }
}

export function createSquarePfcSheetV1(size = 100): SpatialPoint[] {
  if (!Number.isFinite(size) || size <= 0) {
    throw new PfcFoundationErrorV1(
      "PFC_DEGENERATE_ACTIVE_POLYGON",
      "Sheet size must be positive and finite.",
    );
  }

  return [
    { x: 0, y: 0 },
    { x: size, y: 0 },
    { x: size, y: size },
    { x: 0, y: size },
  ];
}

export function signedSideOfLineV1(point: SpatialPoint, line: PfcLineV1): number {
  assertFinitePoint(point, "Point");
  assertFinitePoint(line.a, "Fold line start");
  assertFinitePoint(line.b, "Fold line end");

  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const length = Math.hypot(dx, dy);
  if (!Number.isFinite(length) || length <= EPSILON) {
    throw new PfcFoundationErrorV1(
      "PFC_INVALID_FOLD_LINE",
      "Fold line must contain two distinct finite points.",
    );
  }

  return ((dx * (point.y - line.a.y)) - (dy * (point.x - line.a.x))) / length;
}

function sideIsInside(value: number, side: PfcFoldSideV1): boolean {
  return side === "POSITIVE" ? value >= -EPSILON : value <= EPSILON;
}

function lineSegmentIntersectionWithFold(
  from: SpatialPoint,
  to: SpatialPoint,
  fromDistance: number,
  toDistance: number,
): SpatialPoint {
  const denominator = fromDistance - toDistance;
  if (Math.abs(denominator) <= EPSILON) {
    return { x: from.x, y: from.y };
  }
  const t = fromDistance / denominator;
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

export function clipPolygonToFoldSideV1(
  polygon: readonly SpatialPoint[],
  line: PfcLineV1,
  side: PfcFoldSideV1,
): SpatialPoint[] {
  if (polygon.length < 3) return [];

  const output: SpatialPoint[] = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const currentDistance = signedSideOfLineV1(current, line);
    const nextDistance = signedSideOfLineV1(next, line);
    const currentInside = sideIsInside(currentDistance, side);
    const nextInside = sideIsInside(nextDistance, side);

    if (currentInside && nextInside) {
      output.push({ ...next });
      continue;
    }

    if (currentInside && !nextInside) {
      output.push(
        lineSegmentIntersectionWithFold(current, next, currentDistance, nextDistance),
      );
      continue;
    }

    if (!currentInside && nextInside) {
      output.push(
        lineSegmentIntersectionWithFold(current, next, currentDistance, nextDistance),
      );
      output.push({ ...next });
    }
  }

  return removeNearDuplicatePolygonPoints(output);
}

function removeNearDuplicatePolygonPoints(points: SpatialPoint[]): SpatialPoint[] {
  if (points.length === 0) return [];
  const result: SpatialPoint[] = [];
  for (const point of points) {
    const previous = result[result.length - 1];
    if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) > EPSILON) {
      result.push(point);
    }
  }
  if (
    result.length > 1 &&
    Math.hypot(
      result[0].x - result[result.length - 1].x,
      result[0].y - result[result.length - 1].y,
    ) <= EPSILON
  ) {
    result.pop();
  }
  return result;
}

export function polygonAreaV1(polygon: readonly SpatialPoint[]): number {
  if (polygon.length < 3) return 0;
  let doubledArea = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    doubledArea += current.x * next.y - next.x * current.y;
  }
  return Math.abs(doubledArea) / 2;
}

function reflectPolygon(
  polygon: readonly SpatialPoint[],
  transform: AffineTransform,
): SpatialPoint[] {
  return polygon.map((point) => applyAffineTransform(point, transform));
}

function oppositeSide(side: PfcFoldSideV1): PfcFoldSideV1 {
  return side === "POSITIVE" ? "NEGATIVE" : "POSITIVE";
}

export function applyPfcFoldV1(
  fragments: readonly PfcLayerFragmentV1[],
  fold: PfcFoldV1,
): PfcLayerFragmentV1[] {
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  const stationarySide = oppositeSide(fold.movingSide);
  const nextFragments: PfcLayerFragmentV1[] = [];
  let movedArea = 0;
  let stationaryArea = 0;

  for (const fragment of fragments) {
    const stationary = clipPolygonToFoldSideV1(fragment.polygon, fold.line, stationarySide);
    const moving = clipPolygonToFoldSideV1(fragment.polygon, fold.line, fold.movingSide);
    const stationaryPieceArea = polygonAreaV1(stationary);
    const movingPieceArea = polygonAreaV1(moving);

    if (stationaryPieceArea > MIN_AREA) {
      stationaryArea += stationaryPieceArea;
      nextFragments.push({
        fragmentId: `${fragment.fragmentId}|${fold.foldId}:S`,
        sourceSheetRegionId: fragment.sourceSheetRegionId,
        polygon: stationary,
        transformHistory: [...fragment.transformHistory],
      });
    }

    if (movingPieceArea > MIN_AREA) {
      movedArea += movingPieceArea;
      nextFragments.push({
        fragmentId: `${fragment.fragmentId}|${fold.foldId}:M`,
        sourceSheetRegionId: fragment.sourceSheetRegionId,
        polygon: reflectPolygon(moving, reflection),
        transformHistory: [...fragment.transformHistory, reflection],
      });
    }
  }

  if (movedArea <= MIN_AREA || stationaryArea <= MIN_AREA) {
    throw new PfcFoundationErrorV1(
      "PFC_INVALID_FOLD_LINE",
      `Fold ${fold.foldId} must divide active material into moving and stationary regions.`,
    );
  }

  if (nextFragments.some((fragment) => polygonAreaV1(fragment.polygon) <= MIN_AREA)) {
    throw new PfcFoundationErrorV1(
      "PFC_DEGENERATE_ACTIVE_POLYGON",
      `Fold ${fold.foldId} produced a degenerate layer fragment.`,
    );
  }

  return nextFragments;
}

function pointOnSegment(point: SpatialPoint, a: SpatialPoint, b: SpatialPoint): boolean {
  const cross = (point.x - a.x) * (b.y - a.y) - (point.y - a.y) * (b.x - a.x);
  if (Math.abs(cross) > EPSILON * Math.max(1, Math.hypot(b.x - a.x, b.y - a.y))) {
    return false;
  }
  const dot = (point.x - a.x) * (point.x - b.x) + (point.y - a.y) * (point.y - b.y);
  return dot <= EPSILON;
}

export function pointInPolygonInclusiveV1(
  point: SpatialPoint,
  polygon: readonly SpatialPoint[],
): boolean {
  if (polygon.length < 3) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    if (pointOnSegment(point, polygon[index], polygon[(index + 1) % polygon.length])) {
      return true;
    }
  }

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const pi = polygon[i];
    const pj = polygon[j];
    const intersects =
      (pi.y > point.y) !== (pj.y > point.y) &&
      point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function pointOnPolygonBoundaryV1(
  point: SpatialPoint,
  polygon: readonly SpatialPoint[],
): boolean {
  return polygon.some((vertex, index) =>
    pointOnSegment(point, vertex, polygon[(index + 1) % polygon.length]),
  );
}

function mapCurrentPointBackToOriginal(
  point: SpatialPoint,
  transformHistory: readonly AffineTransform[],
): SpatialPoint {
  let mapped = { ...point };
  for (let index = transformHistory.length - 1; index >= 0; index -= 1) {
    // Reflection transforms are self-inverse.
    mapped = applyAffineTransform(mapped, transformHistory[index]);
  }
  return mapped;
}

function quantize(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function canonicalPointKey(point: SpatialPoint): string {
  return `${quantize(point.x)},${quantize(point.y)}`;
}

function canonicalMappedCutKey(cut: PfcMappedCutV1): string {
  return `${cut.cutId}|${cut.kind}|${cut.originalContact}|${canonicalPointKey(cut.originalCenter)}`;
}

export function solvePfcCutsV1(
  sheetBoundary: readonly SpatialPoint[],
  folds: readonly PfcFoldV1[],
  cuts: readonly PfcCutV1[],
): PfcFoundationSolutionV1 {
  if (sheetBoundary.length < 3 || polygonAreaV1(sheetBoundary) <= MIN_AREA) {
    throw new PfcFoundationErrorV1(
      "PFC_DEGENERATE_ACTIVE_POLYGON",
      "Sheet boundary must have positive area.",
    );
  }

  let fragments: PfcLayerFragmentV1[] = [
    {
      fragmentId: "SHEET-ROOT",
      sourceSheetRegionId: "SHEET-ROOT",
      polygon: sheetBoundary.map((point) => ({ ...point })),
      transformHistory: [],
    },
  ];

  const foldSnapshots: PfcFoldSnapshotV1[] = [];
  for (const fold of folds) {
    fragments = applyPfcFoldV1(fragments, fold);
    foldSnapshots.push({
      foldId: fold.foldId,
      fragmentCount: fragments.length,
      activeArea: fragments.reduce((total, fragment) => total + polygonAreaV1(fragment.polygon), 0),
    });
  }

  const cutEvidence: PfcCutEvidenceV1[] = cuts.map((cut) => {
    if (!Number.isFinite(cut.radius) || cut.radius <= 0) {
      throw new PfcFoundationErrorV1(
        "PFC_CUT_TANGENCY_UNREADABLE",
        `Cut ${cut.cutId} must have a positive visible radius.`,
      );
    }

    const affected = fragments.filter((fragment) =>
      pointInPolygonInclusiveV1(cut.center, fragment.polygon),
    );

    if (affected.length === 0) {
      throw new PfcFoundationErrorV1(
        "PFC_CUT_MISSES_FOLDED_MATERIAL",
        `Cut ${cut.cutId} does not touch folded material.`,
      );
    }

    const mappedCuts = affected.map<PfcMappedCutV1>((fragment) => {
      const originalCenter = mapCurrentPointBackToOriginal(
        cut.center,
        fragment.transformHistory,
      );
      return {
        cutId: cut.cutId,
        kind: cut.kind,
        sourceFragmentId: fragment.fragmentId,
        foldedCenter: { ...cut.center },
        originalCenter,
        originalContact: pointOnPolygonBoundaryV1(originalCenter, sheetBoundary)
          ? "BOUNDARY"
          : "INTERIOR",
      };
    });

    const uniqueBySemanticPosition = new Map<string, PfcMappedCutV1>();
    for (const mappedCut of mappedCuts) {
      const semanticPositionKey = `${mappedCut.cutId}|${mappedCut.kind}|${canonicalPointKey(mappedCut.originalCenter)}`;
      if (!uniqueBySemanticPosition.has(semanticPositionKey)) {
        uniqueBySemanticPosition.set(semanticPositionKey, mappedCut);
      }
    }

    if (uniqueBySemanticPosition.size !== mappedCuts.length) {
      throw new PfcFoundationErrorV1(
        "PFC_DUPLICATE_UNFOLDED_IMPRINT",
        `Cut ${cut.cutId} mapped two physical layers to the same original imprint.`,
      );
    }

    return {
      cutId: cut.cutId,
      affectedFragmentIds: affected.map((fragment) => fragment.fragmentId).sort(),
      affectedLayerCount: affected.length,
      mappedCuts: [...uniqueBySemanticPosition.values()].sort((left, right) =>
        canonicalMappedCutKey(left).localeCompare(canonicalMappedCutKey(right)),
      ),
    };
  });

  const unfoldedFingerprint = cutEvidence
    .flatMap((evidence) => evidence.mappedCuts)
    .map(canonicalMappedCutKey)
    .sort()
    .join(";");

  return {
    sheetBoundary: sheetBoundary.map((point) => ({ ...point })),
    folds: folds.map((fold) => ({
      ...fold,
      line: { a: { ...fold.line.a }, b: { ...fold.line.b } },
    })),
    foldSnapshots,
    finalFragments: fragments.map((fragment) => ({
      ...fragment,
      polygon: fragment.polygon.map((point) => ({ ...point })),
      transformHistory: fragment.transformHistory.map((transform) => ({ ...transform })),
    })),
    cuts: cutEvidence,
    unfoldedFingerprint,
  };
}

export function canonicalPfcCutPositionsV1(
  solution: PfcFoundationSolutionV1,
  cutId: string,
): Array<{ x: number; y: number; contact: PfcOriginalContactV1 }> {
  const evidence = solution.cuts.find((cut) => cut.cutId === cutId);
  if (!evidence) return [];
  return evidence.mappedCuts
    .map((mappedCut) => ({
      x: quantize(mappedCut.originalCenter.x),
      y: quantize(mappedCut.originalCenter.y),
      contact: mappedCut.originalContact,
    }))
    .sort((left, right) => left.x - right.x || left.y - right.y || left.contact.localeCompare(right.contact));
}
