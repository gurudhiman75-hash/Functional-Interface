import type { SpatialPoint } from "./types";

export const PFC_001_FOUNDATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-001-FOUNDATION-V2-MULTI-SHAPE" as const,
  supersedesForNewDiscovery: "PFC-001-FOUNDATION-V1" as const,
  stage: "SOURCE_SATURATED_FOUNDATION_REOPEN" as const,
  sourceSheetShapes: ["SQUARE", "RECTANGLE", "CIRCLE"] as const,
  circleAuthority: "ANALYTIC_BOUNDARY_NOT_POLYGON_APPROXIMATION" as const,
  cutGeometryAuthority: "SHAPE_AWARE_ORIENTED_GEOMETRY" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcSheetShapeV2 = "SQUARE" | "RECTANGLE" | "CIRCLE";

export type PfcSourceSheetV2 =
  | {
      sheetId: string;
      shape: "SQUARE";
      origin: SpatialPoint;
      size: number;
    }
  | {
      sheetId: string;
      shape: "RECTANGLE";
      origin: SpatialPoint;
      width: number;
      height: number;
    }
  | {
      sheetId: string;
      shape: "CIRCLE";
      center: SpatialPoint;
      radius: number;
    };

export type PfcCutGeometryV2 =
  | {
      cutId: string;
      kind: "CIRCLE_HOLE";
      center: SpatialPoint;
      radius: number;
    }
  | {
      cutId: string;
      kind: "POLYGON_CUT";
      vertices: SpatialPoint[];
      semanticShape: "SQUARE" | "RECTANGLE" | "DIAMOND" | "TRIANGLE" | "GENERAL_POLYGON";
    }
  | {
      cutId: string;
      kind: "EDGE_NOTCH";
      vertices: SpatialPoint[];
      semanticShape: "V_NOTCH" | "ROUNDED_NOTCH" | "GENERAL_NOTCH";
    }
  | {
      cutId: string;
      kind: "SLIT";
      a: SpatialPoint;
      b: SpatialPoint;
      width: number;
    };

export class PfcFoundationErrorV2 extends Error {
  constructor(
    public readonly code:
      | "PFC_V2_INVALID_SHEET"
      | "PFC_V2_INVALID_CUT"
      | "PFC_V2_CUT_OUTSIDE_SOURCE_SHEET"
      | "PFC_V2_CIRCLE_REQUIRES_CURVED_FRAGMENT_ENGINE",
    message: string,
  ) {
    super(message);
    this.name = "PfcFoundationErrorV2";
  }
}

const EPSILON = 1e-7;

function finitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function finitePoint(point: SpatialPoint): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

export function validatePfcSourceSheetV2(sheet: PfcSourceSheetV2): PfcSourceSheetV2 {
  if (sheet.shape === "SQUARE") {
    if (!finitePoint(sheet.origin) || !finitePositive(sheet.size)) {
      throw new PfcFoundationErrorV2("PFC_V2_INVALID_SHEET", "Square sheet requires a finite origin and positive size.");
    }
  } else if (sheet.shape === "RECTANGLE") {
    if (!finitePoint(sheet.origin) || !finitePositive(sheet.width) || !finitePositive(sheet.height)) {
      throw new PfcFoundationErrorV2("PFC_V2_INVALID_SHEET", "Rectangle sheet requires a finite origin and positive width/height.");
    }
    if (Math.abs(sheet.width - sheet.height) <= EPSILON) {
      throw new PfcFoundationErrorV2(
        "PFC_V2_INVALID_SHEET",
        "RECTANGLE is reserved for a non-square source sheet; use SQUARE for a 1:1 sheet.",
      );
    }
  } else if (!finitePoint(sheet.center) || !finitePositive(sheet.radius)) {
    throw new PfcFoundationErrorV2("PFC_V2_INVALID_SHEET", "Circular sheet requires a finite centre and positive radius.");
  }
  return sheet;
}

export function createSquarePfcSheetV2(size = 100, origin: SpatialPoint = { x: 0, y: 0 }): PfcSourceSheetV2 {
  return validatePfcSourceSheetV2({ sheetId: "PFC-SHEET-SQUARE", shape: "SQUARE", origin, size });
}

export function createRectangularPfcSheetV2(
  width = 120,
  height = 80,
  origin: SpatialPoint = { x: 0, y: 0 },
): PfcSourceSheetV2 {
  return validatePfcSourceSheetV2({ sheetId: "PFC-SHEET-RECTANGLE", shape: "RECTANGLE", origin, width, height });
}

export function createCircularPfcSheetV2(
  radius = 50,
  center: SpatialPoint = { x: 50, y: 50 },
): PfcSourceSheetV2 {
  return validatePfcSourceSheetV2({ sheetId: "PFC-SHEET-CIRCLE", shape: "CIRCLE", center, radius });
}

export function pfcSheetContainsPointV2(sheet: PfcSourceSheetV2, point: SpatialPoint): boolean {
  validatePfcSourceSheetV2(sheet);
  if (!finitePoint(point)) return false;
  if (sheet.shape === "SQUARE") {
    return point.x >= sheet.origin.x - EPSILON &&
      point.x <= sheet.origin.x + sheet.size + EPSILON &&
      point.y >= sheet.origin.y - EPSILON &&
      point.y <= sheet.origin.y + sheet.size + EPSILON;
  }
  if (sheet.shape === "RECTANGLE") {
    return point.x >= sheet.origin.x - EPSILON &&
      point.x <= sheet.origin.x + sheet.width + EPSILON &&
      point.y >= sheet.origin.y - EPSILON &&
      point.y <= sheet.origin.y + sheet.height + EPSILON;
  }
  return Math.hypot(point.x - sheet.center.x, point.y - sheet.center.y) <= sheet.radius + EPSILON;
}

export function pfcPointOnSourceBoundaryV2(sheet: PfcSourceSheetV2, point: SpatialPoint): boolean {
  if (!pfcSheetContainsPointV2(sheet, point)) return false;
  if (sheet.shape === "CIRCLE") {
    return Math.abs(Math.hypot(point.x - sheet.center.x, point.y - sheet.center.y) - sheet.radius) <= EPSILON;
  }
  const minX = sheet.origin.x;
  const minY = sheet.origin.y;
  const maxX = sheet.shape === "SQUARE" ? minX + sheet.size : minX + sheet.width;
  const maxY = sheet.shape === "SQUARE" ? minY + sheet.size : minY + sheet.height;
  return Math.abs(point.x - minX) <= EPSILON ||
    Math.abs(point.x - maxX) <= EPSILON ||
    Math.abs(point.y - minY) <= EPSILON ||
    Math.abs(point.y - maxY) <= EPSILON;
}

function cutAnchorPoints(cut: PfcCutGeometryV2): SpatialPoint[] {
  if (cut.kind === "CIRCLE_HOLE") return [cut.center];
  if (cut.kind === "SLIT") return [cut.a, cut.b];
  return cut.vertices;
}

export function validatePfcCutGeometryV2(sheet: PfcSourceSheetV2, cut: PfcCutGeometryV2): PfcCutGeometryV2 {
  const anchors = cutAnchorPoints(cut);
  if (anchors.length === 0 || anchors.some((point) => !finitePoint(point))) {
    throw new PfcFoundationErrorV2("PFC_V2_INVALID_CUT", `Cut ${cut.cutId} has invalid geometry.`);
  }
  if (cut.kind === "CIRCLE_HOLE" && !finitePositive(cut.radius)) {
    throw new PfcFoundationErrorV2("PFC_V2_INVALID_CUT", `Cut ${cut.cutId} requires a positive radius.`);
  }
  if (cut.kind === "SLIT" && (!finitePositive(cut.width) || Math.hypot(cut.a.x - cut.b.x, cut.a.y - cut.b.y) <= EPSILON)) {
    throw new PfcFoundationErrorV2("PFC_V2_INVALID_CUT", `Slit ${cut.cutId} requires distinct endpoints and positive width.`);
  }
  if ((cut.kind === "POLYGON_CUT" || cut.kind === "EDGE_NOTCH") && cut.vertices.length < 3) {
    throw new PfcFoundationErrorV2("PFC_V2_INVALID_CUT", `Cut ${cut.cutId} requires at least three vertices.`);
  }
  if (anchors.every((point) => !pfcSheetContainsPointV2(sheet, point))) {
    throw new PfcFoundationErrorV2(
      "PFC_V2_CUT_OUTSIDE_SOURCE_SHEET",
      `Cut ${cut.cutId} has no anchor on the source sheet.`,
    );
  }
  return cut;
}

export function pfcPolygonBoundaryForLegacyEngineV2(sheet: PfcSourceSheetV2): SpatialPoint[] {
  validatePfcSourceSheetV2(sheet);
  if (sheet.shape === "CIRCLE") {
    throw new PfcFoundationErrorV2(
      "PFC_V2_CIRCLE_REQUIRES_CURVED_FRAGMENT_ENGINE",
      "Circular paper cannot be downgraded to the V1 polygon engine as semantic answer authority.",
    );
  }
  const x = sheet.origin.x;
  const y = sheet.origin.y;
  const width = sheet.shape === "SQUARE" ? sheet.size : sheet.width;
  const height = sheet.shape === "SQUARE" ? sheet.size : sheet.height;
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}
