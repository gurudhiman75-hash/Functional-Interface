import { applyAffineTransform, reflectionAcrossLineTransform } from "./geometry";
import { signedSideOfLineV1, type PfcFoldV1 } from "./paper-folding-foundation-v1";
import {
  solveTransparentPatternFoldWave1,
  type TpfPatternPrimitiveWave1,
} from "./transparent-pattern-folding-discovery-v1";
import type { SpatialPoint } from "./types";

export const TPF_001_DISCOVERY_WAVE2_AUTHORITY = Object.freeze({
  authorityId: "TPF-001-TRANSPARENT-PATTERN-DISCOVERY-WAVE2" as const,
  supersedesDiscoveryBreadth: "TPF-001-TRANSPARENT-PATTERN-DISCOVERY-WAVE1" as const,
  sourceGapAuditAuthority: "PFC-TPF-POST-EXECUTION-SOURCE-GAP-AUDIT-V1" as const,
  mechanism: "RICH_VECTOR_PATTERN_REFLECTION_AND_SUPERPOSITION" as const,
  sourceSheetShape: "SQUARE" as const,
  supportedFoldKinds: ["VERTICAL", "HORIZONTAL"] as const,
  supportedPrimitiveKinds: ["POINT_MARK", "SEGMENT", "POLYLINE", "POLYGON_OUTLINE", "CIRCLE_OUTLINE"] as const,
  diagonalStatus: "HELD_PENDING_DIRECT_SOURCE_RECURRENCE" as const,
  multiFoldStatus: "HELD_PENDING_DIRECT_SOURCE_RECURRENCE" as const,
  rectangularSheetStatus: "HELD_PREPARATION_EVIDENCE_ONLY" as const,
  permanentQlAllocation: "NONE_DISCOVERY_REQUIRED" as const,
  questionStudioAllowed: false,
} as const);

export type TpfPatternPrimitiveWave2 =
  | TpfPatternPrimitiveWave1
  | { primitiveId: string; kind: "POLYLINE"; points: SpatialPoint[] }
  | { primitiveId: string; kind: "POLYGON_OUTLINE"; vertices: SpatialPoint[] }
  | { primitiveId: string; kind: "CIRCLE_OUTLINE"; center: SpatialPoint; radius: number };

export interface TpfTransparentScenarioWave2 {
  scenarioId: string;
  sheetSize: number;
  folds: PfcFoldV1[];
  pattern: TpfPatternPrimitiveWave2[];
  sourceFamily: string;
}

export interface TpfTransparentSolutionWave2 {
  scenarioId: string;
  sourceFamily: string;
  atomicPrimitives: TpfPatternPrimitiveWave1[];
  circleOutlines: Array<{ primitiveId: string; center: SpatialPoint; radius: number }>;
  fingerprint: string;
}

export class TpfDiscoveryWave2Error extends Error {
  constructor(
    public readonly code:
      | "TPF_W2_UNSUPPORTED_FOLD"
      | "TPF_W2_MULTIFOLD_HELD"
      | "TPF_W2_INVALID_RICH_PRIMITIVE"
      | "TPF_W2_CIRCLE_CROSSES_FOLD",
    message: string,
  ) {
    super(message);
    this.name = "TpfDiscoveryWave2Error";
  }
}

const EPSILON = 1e-7;
const q = (value: number) => Math.round(value * 1_000_000) / 1_000_000;
const pointKey = (point: SpatialPoint) => `${q(point.x)},${q(point.y)}`;

function segment(primitiveId: string, a: SpatialPoint, b: SpatialPoint): TpfPatternPrimitiveWave1 {
  return { primitiveId, kind: "SEGMENT", a: { ...a }, b: { ...b } };
}

function flattenPrimitive(primitive: TpfPatternPrimitiveWave2): TpfPatternPrimitiveWave1[] {
  if (primitive.kind === "POINT_MARK" || primitive.kind === "SEGMENT") return [{ ...primitive } as TpfPatternPrimitiveWave1];
  if (primitive.kind === "CIRCLE_OUTLINE") return [];
  const points = primitive.kind === "POLYLINE" ? primitive.points : primitive.vertices;
  const minimum = primitive.kind === "POLYLINE" ? 2 : 3;
  if (points.length < minimum) {
    throw new TpfDiscoveryWave2Error("TPF_W2_INVALID_RICH_PRIMITIVE", `${primitive.primitiveId} has too few points.`);
  }
  const result: TpfPatternPrimitiveWave1[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    result.push(segment(`${primitive.primitiveId}:S${index + 1}`, points[index], points[index + 1]));
  }
  if (primitive.kind === "POLYGON_OUTLINE") {
    result.push(segment(`${primitive.primitiveId}:S${points.length}`, points[points.length - 1], points[0]));
  }
  return result;
}

function atomicFingerprint(primitive: TpfPatternPrimitiveWave1): string {
  if (primitive.kind === "POINT_MARK") return `P:${pointKey(primitive.point)}`;
  return `S:${[pointKey(primitive.a), pointKey(primitive.b)].sort().join("|")}`;
}

function circleFingerprint(circle: { center: SpatialPoint; radius: number }): string {
  return `C:${pointKey(circle.center)}:r${q(circle.radius)}`;
}

function solveCircleOutline(
  circle: Extract<TpfPatternPrimitiveWave2, { kind: "CIRCLE_OUTLINE" }>,
  fold: PfcFoldV1,
): { primitiveId: string; center: SpatialPoint; radius: number } {
  if (!Number.isFinite(circle.radius) || circle.radius <= 0) {
    throw new TpfDiscoveryWave2Error("TPF_W2_INVALID_RICH_PRIMITIVE", `${circle.primitiveId} requires a positive radius.`);
  }
  const distance = signedSideOfLineV1(circle.center, fold.line);
  if (Math.abs(distance) < circle.radius - EPSILON) {
    throw new TpfDiscoveryWave2Error(
      "TPF_W2_CIRCLE_CROSSES_FOLD",
      `${circle.primitiveId} crosses the fold line; arc clipping is outside Wave 2 source scope.`,
    );
  }
  const moving = fold.movingSide === "POSITIVE" ? distance > EPSILON : distance < -EPSILON;
  if (!moving) return { primitiveId: circle.primitiveId, center: { ...circle.center }, radius: circle.radius };
  const reflection = reflectionAcrossLineTransform(fold.line.a, fold.line.b);
  return {
    primitiveId: circle.primitiveId,
    center: applyAffineTransform(circle.center, reflection),
    radius: circle.radius,
  };
}

export function solveTransparentPatternFoldWave2(scenario: TpfTransparentScenarioWave2): TpfTransparentSolutionWave2 {
  if (scenario.folds.length !== 1) {
    throw new TpfDiscoveryWave2Error("TPF_W2_MULTIFOLD_HELD", "Wave 2 keeps transparent multi-fold questions held pending direct source recurrence.");
  }
  const fold = scenario.folds[0];
  if (fold.kind !== "VERTICAL" && fold.kind !== "HORIZONTAL") {
    throw new TpfDiscoveryWave2Error("TPF_W2_UNSUPPORTED_FOLD", `Wave 2 does not promote transparent ${fold.kind} folds.`);
  }
  const atomic = scenario.pattern.flatMap(flattenPrimitive);
  const atomicSolution = solveTransparentPatternFoldWave1({
    scenarioId: `${scenario.scenarioId}:ATOMIC`,
    sheetSize: scenario.sheetSize,
    folds: [fold],
    pattern: atomic,
    sourceFamily: scenario.sourceFamily,
  });
  const circles = scenario.pattern
    .filter((primitive): primitive is Extract<TpfPatternPrimitiveWave2, { kind: "CIRCLE_OUTLINE" }> => primitive.kind === "CIRCLE_OUTLINE")
    .map((circle) => solveCircleOutline(circle, fold));
  const fingerprint = [
    ...atomicSolution.primitives.map(atomicFingerprint),
    ...circles.map(circleFingerprint),
  ].sort().join(";");
  return {
    scenarioId: scenario.scenarioId,
    sourceFamily: scenario.sourceFamily,
    atomicPrimitives: atomicSolution.primitives,
    circleOutlines: circles,
    fingerprint,
  };
}

function verticalFold(): PfcFoldV1 {
  return { foldId: "F1", kind: "VERTICAL", line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } }, movingSide: "POSITIVE" };
}
function horizontalFold(): PfcFoldV1 {
  return { foldId: "F1", kind: "HORIZONTAL", line: { a: { x: 0, y: 50 }, b: { x: 100, y: 50 } }, movingSide: "NEGATIVE" };
}

export function tpfDiscoveryScenariosWave2(): TpfTransparentScenarioWave2[] {
  return [
    {
      scenarioId: "TPF-W2-VERTICAL-TRIANGLE-CIRCLE",
      sheetSize: 100,
      folds: [verticalFold()],
      pattern: [
        { primitiveId: "TRI", kind: "POLYGON_OUTLINE", vertices: [{ x: 16, y: 22 }, { x: 36, y: 34 }, { x: 16, y: 46 }] },
        { primitiveId: "C1", kind: "CIRCLE_OUTLINE", center: { x: 74, y: 68 }, radius: 6 },
      ],
      sourceFamily: "SSC_STYLE_TRIANGLE_AND_CIRCLE_COMPOSITE",
    },
    {
      scenarioId: "TPF-W2-HORIZONTAL-TRIANGLE-CIRCLE",
      sheetSize: 100,
      folds: [horizontalFold()],
      pattern: [
        { primitiveId: "TRI", kind: "POLYGON_OUTLINE", vertices: [{ x: 22, y: 18 }, { x: 40, y: 30 }, { x: 22, y: 42 }] },
        { primitiveId: "C1", kind: "CIRCLE_OUTLINE", center: { x: 70, y: 72 }, radius: 5 },
      ],
      sourceFamily: "HORIZONTAL_WATER_IMAGE_COMPOSITE",
    },
    {
      scenarioId: "TPF-W2-VERTICAL-CROSSING-POLYLINE",
      sheetSize: 100,
      folds: [verticalFold()],
      pattern: [
        { primitiveId: "CHEVRON", kind: "POLYLINE", points: [{ x: 20, y: 24 }, { x: 52, y: 42 }, { x: 82, y: 24 }] },
        { primitiveId: "BASE", kind: "SEGMENT", a: { x: 28, y: 72 }, b: { x: 76, y: 72 } },
      ],
      sourceFamily: "RICH_POLYLINE_CROSSING_FOLD",
    },
    {
      scenarioId: "TPF-W2-HORIZONTAL-CROSSING-POLYGON",
      sheetSize: 100,
      folds: [horizontalFold()],
      pattern: [
        { primitiveId: "KITE", kind: "POLYGON_OUTLINE", vertices: [{ x: 30, y: 24 }, { x: 44, y: 50 }, { x: 30, y: 78 }, { x: 16, y: 50 }] },
        { primitiveId: "P1", kind: "POINT_MARK", point: { x: 74, y: 70 } },
      ],
      sourceFamily: "POLYGON_OUTLINE_CROSSING_HORIZONTAL_FOLD",
    },
    {
      scenarioId: "TPF-W2-VERTICAL-MULTI-SHAPE-LINE-ART",
      sheetSize: 100,
      folds: [verticalFold()],
      pattern: [
        { primitiveId: "BOX", kind: "POLYGON_OUTLINE", vertices: [{ x: 62, y: 18 }, { x: 84, y: 18 }, { x: 84, y: 40 }, { x: 62, y: 40 }] },
        { primitiveId: "ZIG", kind: "POLYLINE", points: [{ x: 18, y: 62 }, { x: 30, y: 78 }, { x: 42, y: 62 }] },
        { primitiveId: "C1", kind: "CIRCLE_OUTLINE", center: { x: 74, y: 72 }, radius: 5 },
      ],
      sourceFamily: "COMPOSITE_TRANSPARENT_LINE_ART",
    },
    {
      scenarioId: "TPF-W2-HORIZONTAL-MULTI-SHAPE-LINE-ART",
      sheetSize: 100,
      folds: [horizontalFold()],
      pattern: [
        { primitiveId: "BOX", kind: "POLYGON_OUTLINE", vertices: [{ x: 18, y: 62 }, { x: 40, y: 62 }, { x: 40, y: 82 }, { x: 18, y: 82 }] },
        { primitiveId: "DIAG", kind: "SEGMENT", a: { x: 58, y: 22 }, b: { x: 82, y: 38 } },
        { primitiveId: "C1", kind: "CIRCLE_OUTLINE", center: { x: 70, y: 72 }, radius: 5 },
      ],
      sourceFamily: "COMPOSITE_HORIZONTAL_TRANSPARENT_PATTERN",
    },
  ];
}

export function generateTpfDiscoveryWave2(): TpfTransparentSolutionWave2[] {
  return tpfDiscoveryScenariosWave2().map(solveTransparentPatternFoldWave2);
}
