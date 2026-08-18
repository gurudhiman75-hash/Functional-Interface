import { applyAffineTransform, reflectionAcrossLineTransform } from "./geometry";
import { signedSideOfLineV1, type PfcFoldSideV1, type PfcFoldV1 } from "./paper-folding-foundation-v1";
import type { SpatialPoint } from "./types";

export const TPF_001_DISCOVERY_WAVE1_AUTHORITY = Object.freeze({
  authorityId: "TPF-001-TRANSPARENT-PATTERN-DISCOVERY-WAVE1" as const,
  chapterCode: "TPF-001" as const,
  name: "Transparent Pattern Folding" as const,
  sourceAuthority: "PFC-001-SOURCE-SATURATION-AUDIT-V2" as const,
  mechanism: "VECTOR_PATTERN_REFLECTION_AND_SUPERPOSITION" as const,
  sourceSheetShape: "SQUARE" as const,
  supportedFoldKinds: ["VERTICAL", "HORIZONTAL"] as const,
  diagonalStatus: "HELD_PENDING_DIRECT_SOURCE_RECURRENCE" as const,
  permanentQlAllocation: "NONE_DISCOVERY_REQUIRED" as const,
  questionStudioAllowed: false,
} as const);

export type TpfPatternPrimitiveWave1 =
  | {
      primitiveId: string;
      kind: "POINT_MARK";
      point: SpatialPoint;
    }
  | {
      primitiveId: string;
      kind: "SEGMENT";
      a: SpatialPoint;
      b: SpatialPoint;
    };

export interface TpfTransparentScenarioWave1 {
  scenarioId: string;
  sheetSize: number;
  folds: PfcFoldV1[];
  pattern: TpfPatternPrimitiveWave1[];
  sourceFamily: string;
}

export interface TpfTransparentSolutionWave1 {
  scenarioId: string;
  sourceFamily: string;
  primitives: TpfPatternPrimitiveWave1[];
  fingerprint: string;
}

export class TpfDiscoveryWave1Error extends Error {
  constructor(
    public readonly code: "TPF_W1_INVALID_SHEET" | "TPF_W1_UNSUPPORTED_FOLD",
    message: string,
  ) {
    super(message);
    this.name = "TpfDiscoveryWave1Error";
  }
}

const EPSILON = 1e-7;

function q(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function pointKey(point: SpatialPoint): string {
  return `${q(point.x)},${q(point.y)}`;
}

function oppositeSide(side: PfcFoldSideV1): PfcFoldSideV1 {
  return side === "POSITIVE" ? "NEGATIVE" : "POSITIVE";
}

function isOnSide(point: SpatialPoint, fold: PfcFoldV1, side: PfcFoldSideV1): boolean {
  const signed = signedSideOfLineV1(point, fold.line);
  return side === "POSITIVE" ? signed >= -EPSILON : signed <= EPSILON;
}

function segmentFoldIntersection(a: SpatialPoint, b: SpatialPoint, fold: PfcFoldV1): SpatialPoint {
  const da = signedSideOfLineV1(a, fold.line);
  const db = signedSideOfLineV1(b, fold.line);
  const denominator = da - db;
  if (Math.abs(denominator) <= EPSILON) return { ...a };
  const t = da / denominator;
  return {
    x: q(a.x + (b.x - a.x) * t),
    y: q(a.y + (b.y - a.y) * t),
  };
}

function foldPointPrimitive(primitive: Extract<TpfPatternPrimitiveWave1, { kind: "POINT_MARK" }>, fold: PfcFoldV1): TpfPatternPrimitiveWave1[] {
  const stationary = oppositeSide(fold.movingSide);
  if (isOnSide(primitive.point, fold, stationary)) return [{ ...primitive, point: { ...primitive.point } }];
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  return [{
    ...primitive,
    point: applyAffineTransform(primitive.point, reflection),
  }];
}

function foldSegmentPrimitive(primitive: Extract<TpfPatternPrimitiveWave1, { kind: "SEGMENT" }>, fold: PfcFoldV1): TpfPatternPrimitiveWave1[] {
  const stationary = oppositeSide(fold.movingSide);
  const aMoving = isOnSide(primitive.a, fold, fold.movingSide) && !isOnSide(primitive.a, fold, stationary);
  const bMoving = isOnSide(primitive.b, fold, fold.movingSide) && !isOnSide(primitive.b, fold, stationary);
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);

  if (aMoving && bMoving) {
    return [{
      ...primitive,
      a: applyAffineTransform(primitive.a, reflection),
      b: applyAffineTransform(primitive.b, reflection),
    }];
  }
  if (!aMoving && !bMoving) return [{ ...primitive, a: { ...primitive.a }, b: { ...primitive.b } }];

  const intersection = segmentFoldIntersection(primitive.a, primitive.b, fold);
  if (aMoving) {
    return [
      {
        primitiveId: `${primitive.primitiveId}:S`,
        kind: "SEGMENT",
        a: { ...intersection },
        b: { ...primitive.b },
      },
      {
        primitiveId: `${primitive.primitiveId}:M`,
        kind: "SEGMENT",
        a: applyAffineTransform(primitive.a, reflection),
        b: { ...intersection },
      },
    ];
  }
  return [
    {
      primitiveId: `${primitive.primitiveId}:S`,
      kind: "SEGMENT",
      a: { ...primitive.a },
      b: { ...intersection },
    },
    {
      primitiveId: `${primitive.primitiveId}:M`,
      kind: "SEGMENT",
      a: { ...intersection },
      b: applyAffineTransform(primitive.b, reflection),
    },
  ];
}

function primitiveFingerprint(primitive: TpfPatternPrimitiveWave1): string {
  if (primitive.kind === "POINT_MARK") return `P:${pointKey(primitive.point)}`;
  const endpoints = [pointKey(primitive.a), pointKey(primitive.b)].sort();
  return `S:${endpoints.join("|")}`;
}

function canonicalizePattern(primitives: readonly TpfPatternPrimitiveWave1[]): TpfPatternPrimitiveWave1[] {
  const unique = new Map<string, TpfPatternPrimitiveWave1>();
  for (const primitive of primitives) {
    const key = primitiveFingerprint(primitive);
    if (!unique.has(key)) unique.set(key, primitive);
  }
  return [...unique.values()].sort((left, right) => primitiveFingerprint(left).localeCompare(primitiveFingerprint(right)));
}

export function solveTransparentPatternFoldWave1(scenario: TpfTransparentScenarioWave1): TpfTransparentSolutionWave1 {
  if (!Number.isFinite(scenario.sheetSize) || scenario.sheetSize <= 0) {
    throw new TpfDiscoveryWave1Error("TPF_W1_INVALID_SHEET", "Transparent sheet size must be positive and finite.");
  }
  let primitives = scenario.pattern.map((primitive) =>
    primitive.kind === "POINT_MARK"
      ? { ...primitive, point: { ...primitive.point } }
      : { ...primitive, a: { ...primitive.a }, b: { ...primitive.b } },
  );

  for (const fold of scenario.folds) {
    if (fold.kind !== "VERTICAL" && fold.kind !== "HORIZONTAL") {
      throw new TpfDiscoveryWave1Error(
        "TPF_W1_UNSUPPORTED_FOLD",
        `TPF Wave 1 supports source-proved vertical/horizontal transparent folds only; got ${fold.kind}.`,
      );
    }
    primitives = primitives.flatMap((primitive) =>
      primitive.kind === "POINT_MARK"
        ? foldPointPrimitive(primitive, fold)
        : foldSegmentPrimitive(primitive, fold),
    );
    primitives = canonicalizePattern(primitives);
  }

  const canonical = canonicalizePattern(primitives);
  return {
    scenarioId: scenario.scenarioId,
    sourceFamily: scenario.sourceFamily,
    primitives: canonical,
    fingerprint: canonical.map(primitiveFingerprint).join(";"),
  };
}

export function tpfDiscoveryScenariosWave1(): TpfTransparentScenarioWave1[] {
  const vertical: PfcFoldV1 = {
    foldId: "F1",
    kind: "VERTICAL",
    line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } },
    movingSide: "POSITIVE",
  };
  const horizontal: PfcFoldV1 = {
    foldId: "F1",
    kind: "HORIZONTAL",
    line: { a: { x: 0, y: 50 }, b: { x: 100, y: 50 } },
    movingSide: "NEGATIVE",
  };
  return [
    {
      scenarioId: "TPF-W1-VERTICAL-POINT-PAIR",
      sheetSize: 100,
      folds: [vertical],
      pattern: [
        { primitiveId: "P1", kind: "POINT_MARK", point: { x: 25, y: 30 } },
        { primitiveId: "P2", kind: "POINT_MARK", point: { x: 80, y: 70 } },
      ],
      sourceFamily: "VERTICAL_MIRROR_SUPERPOSITION",
    },
    {
      scenarioId: "TPF-W1-HORIZONTAL-POINT-PAIR",
      sheetSize: 100,
      folds: [horizontal],
      pattern: [
        { primitiveId: "P1", kind: "POINT_MARK", point: { x: 28, y: 22 } },
        { primitiveId: "P2", kind: "POINT_MARK", point: { x: 72, y: 76 } },
      ],
      sourceFamily: "HORIZONTAL_WATER_SUPERPOSITION",
    },
    {
      scenarioId: "TPF-W1-VERTICAL-CROSSING-LINE",
      sheetSize: 100,
      folds: [vertical],
      pattern: [
        { primitiveId: "L1", kind: "SEGMENT", a: { x: 20, y: 35 }, b: { x: 82, y: 35 } },
        { primitiveId: "L2", kind: "SEGMENT", a: { x: 30, y: 65 }, b: { x: 42, y: 78 } },
      ],
      sourceFamily: "VERTICAL_SEGMENT_SPLIT_AND_SUPERPOSITION",
    },
    {
      scenarioId: "TPF-W1-HORIZONTAL-CROSSING-LINE",
      sheetSize: 100,
      folds: [horizontal],
      pattern: [
        { primitiveId: "L1", kind: "SEGMENT", a: { x: 35, y: 18 }, b: { x: 35, y: 82 } },
        { primitiveId: "L2", kind: "SEGMENT", a: { x: 62, y: 60 }, b: { x: 78, y: 72 } },
      ],
      sourceFamily: "HORIZONTAL_SEGMENT_SPLIT_AND_SUPERPOSITION",
    },
  ];
}

export function generateTpfDiscoveryWave1(): TpfTransparentSolutionWave1[] {
  return tpfDiscoveryScenariosWave1().map(solveTransparentPatternFoldWave1);
}
