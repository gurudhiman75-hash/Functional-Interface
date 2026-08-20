import type { SpatialPoint } from "./types";
import {
  PFC_001_FOUNDATION_AUTHORITY_V2,
  pfcPolygonBoundaryForLegacyEngineV2,
  pfcSheetContainsPointV2,
  validatePfcCutGeometryV2,
  validatePfcSourceSheetV2,
  type PfcCutGeometryV2,
  type PfcSourceSheetV2,
} from "./paper-folding-foundation-v2";

export const PFC_001_FOUNDATION_AUTHORITY_V3 = Object.freeze({
  authorityId: "PFC-001-FOUNDATION-V3-POLYGON-SUBSTRATE" as const,
  supersedesForNewDiscovery: PFC_001_FOUNDATION_AUTHORITY_V2.authorityId,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V3" as const,
  stage: "POLYGON_SUBSTRATE_FOUNDATION_REOPEN" as const,
  sourceSheetShapes: ["SQUARE", "RECTANGLE", "CIRCLE", "POLYGON"] as const,
  activatedPolygonSemanticShapes: ["TRIANGLE"] as const,
  capabilityOnlyPolygonSemanticShapes: ["REGULAR_HEXAGON", "GENERAL_CONVEX_POLYGON"] as const,
  polygonAuthority: "EXACT_VERTEX_BOUNDARY_NO_BOUNDING_BOX_SUBSTITUTION" as const,
  circleAuthority: PFC_001_FOUNDATION_AUTHORITY_V2.circleAuthority,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcPolygonSemanticShapeV3 = "TRIANGLE" | "REGULAR_HEXAGON" | "GENERAL_CONVEX_POLYGON";

export type PfcSourceSheetV3 = PfcSourceSheetV2 | {
  sheetId: string;
  shape: "POLYGON";
  semanticShape: PfcPolygonSemanticShapeV3;
  vertices: SpatialPoint[];
  learnerReviewEligible: boolean;
};

export class PfcFoundationErrorV3 extends Error {
  constructor(
    public readonly code:
      | "PFC_V3_INVALID_POLYGON_SHEET"
      | "PFC_V3_NON_CONVEX_POLYGON_UNSUPPORTED"
      | "PFC_V3_POLYGON_REVIEW_SHAPE_NOT_SOURCE_APPROVED",
    message: string,
  ) {
    super(message);
    this.name = "PfcFoundationErrorV3";
  }
}

const EPSILON = 1e-7;

function finitePoint(point: SpatialPoint): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function cross(a: SpatialPoint, b: SpatialPoint, c: SpatialPoint): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function polygonArea2(vertices: readonly SpatialPoint[]): number {
  let sum = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum;
}

function isConvex(vertices: readonly SpatialPoint[]): boolean {
  let sign = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const z = cross(vertices[i], vertices[(i + 1) % vertices.length], vertices[(i + 2) % vertices.length]);
    if (Math.abs(z) <= EPSILON) continue;
    const nextSign = Math.sign(z);
    if (sign !== 0 && nextSign !== sign) return false;
    sign = nextSign;
  }
  return sign !== 0;
}

function pointOnSegment(point: SpatialPoint, a: SpatialPoint, b: SpatialPoint): boolean {
  if (Math.abs(cross(a, b, point)) > EPSILON) return false;
  return point.x >= Math.min(a.x, b.x) - EPSILON && point.x <= Math.max(a.x, b.x) + EPSILON &&
    point.y >= Math.min(a.y, b.y) - EPSILON && point.y <= Math.max(a.y, b.y) + EPSILON;
}

function pointInPolygonInclusive(point: SpatialPoint, vertices: readonly SpatialPoint[]): boolean {
  for (let i = 0; i < vertices.length; i += 1) {
    if (pointOnSegment(point, vertices[i], vertices[(i + 1) % vertices.length])) return true;
  }
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const a = vertices[i];
    const b = vertices[j];
    const intersects = ((a.y > point.y) !== (b.y > point.y)) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function validatePfcSourceSheetV3(sheet: PfcSourceSheetV3): PfcSourceSheetV3 {
  if (sheet.shape !== "POLYGON") return validatePfcSourceSheetV2(sheet);
  if (sheet.vertices.length < 3 || sheet.vertices.some((p) => !finitePoint(p)) || Math.abs(polygonArea2(sheet.vertices)) <= EPSILON) {
    throw new PfcFoundationErrorV3("PFC_V3_INVALID_POLYGON_SHEET", "Polygon paper requires at least three finite non-collinear vertices.");
  }
  if (!isConvex(sheet.vertices)) {
    throw new PfcFoundationErrorV3(
      "PFC_V3_NON_CONVEX_POLYGON_UNSUPPORTED",
      "PFC V3 intentionally supports convex source-paper polygons only; concave/irregular folding remains held for separate source and physical validation.",
    );
  }
  if (sheet.learnerReviewEligible && sheet.semanticShape !== "TRIANGLE") {
    throw new PfcFoundationErrorV3(
      "PFC_V3_POLYGON_REVIEW_SHAPE_NOT_SOURCE_APPROVED",
      `${sheet.semanticShape} is engine-capable but not source-approved for the learner review.`,
    );
  }
  return sheet;
}

export function createTriangularPfcSheetV3(
  vertices: SpatialPoint[] = [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
): PfcSourceSheetV3 {
  return validatePfcSourceSheetV3({
    sheetId: "PFC-SHEET-TRIANGLE",
    shape: "POLYGON",
    semanticShape: "TRIANGLE",
    vertices,
    learnerReviewEligible: true,
  });
}

export function createRegularHexagonalPfcSheetV3(
  center: SpatialPoint = { x: 50, y: 50 },
  radius = 48,
): PfcSourceSheetV3 {
  const vertices = Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 3;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
  return validatePfcSourceSheetV3({
    sheetId: "PFC-SHEET-HEXAGON",
    shape: "POLYGON",
    semanticShape: "REGULAR_HEXAGON",
    vertices,
    learnerReviewEligible: false,
  });
}

export function createGeneralConvexPfcSheetV3(vertices: SpatialPoint[]): PfcSourceSheetV3 {
  return validatePfcSourceSheetV3({
    sheetId: "PFC-SHEET-GENERAL-CONVEX",
    shape: "POLYGON",
    semanticShape: "GENERAL_CONVEX_POLYGON",
    vertices,
    learnerReviewEligible: false,
  });
}

export function pfcSheetContainsPointV3(sheet: PfcSourceSheetV3, point: SpatialPoint): boolean {
  validatePfcSourceSheetV3(sheet);
  if (!finitePoint(point)) return false;
  return sheet.shape === "POLYGON" ? pointInPolygonInclusive(point, sheet.vertices) : pfcSheetContainsPointV2(sheet, point);
}

export function pfcPolygonBoundaryForFoldEngineV3(sheet: PfcSourceSheetV3): SpatialPoint[] {
  validatePfcSourceSheetV3(sheet);
  if (sheet.shape === "POLYGON") return sheet.vertices.map((p) => ({ ...p }));
  return pfcPolygonBoundaryForLegacyEngineV2(sheet);
}

export function validatePfcCutGeometryV3(sheet: PfcSourceSheetV3, cut: PfcCutGeometryV2): PfcCutGeometryV2 {
  if (sheet.shape !== "POLYGON") return validatePfcCutGeometryV2(sheet, cut);
  const anchors = cut.kind === "CIRCLE_HOLE" ? [cut.center]
    : cut.kind === "SLIT" ? [cut.a, cut.b]
    : cut.vertices;
  if (anchors.length === 0 || anchors.every((point) => !pfcSheetContainsPointV3(sheet, point))) {
    throw new PfcFoundationErrorV3("PFC_V3_INVALID_POLYGON_SHEET", `Cut ${cut.cutId} has no anchor on polygon source paper.`);
  }
  return cut;
}
