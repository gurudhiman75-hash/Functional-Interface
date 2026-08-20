import type { SpatialPoint } from "./types";
import {
  PFC_001_FOUNDATION_AUTHORITY_V3,
  pfcPolygonBoundaryForFoldEngineV3,
  pfcSheetContainsPointV3,
  validatePfcCutGeometryV3,
  validatePfcSourceSheetV3,
  type PfcSourceSheetV3,
} from "./paper-folding-foundation-v3";
import type { PfcCutGeometryV2 } from "./paper-folding-foundation-v2";

export const PFC_001_FOUNDATION_AUTHORITY_V4 = Object.freeze({
  authorityId: "PFC-001-FOUNDATION-V4-HEXAGON-ACTIVATED" as const,
  supersedesForNewPolygonDiscovery: PFC_001_FOUNDATION_AUTHORITY_V3.authorityId,
  sourceAuthority: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V4" as const,
  sourceSheetShapes: ["SQUARE", "RECTANGLE", "CIRCLE", "POLYGON"] as const,
  activatedPolygonSemanticShapes: ["TRIANGLE", "REGULAR_HEXAGON"] as const,
  capabilityOnlyPolygonSemanticShapes: ["GENERAL_CONVEX_POLYGON"] as const,
  polygonAuthority: "EXACT_VERTEX_BOUNDARY_NO_BOUNDING_BOX_SUBSTITUTION" as const,
  permanentQlAllocationAllowed: false,
  questionStudioAllowed: false,
} as const);

export type PfcSourceSheetV4 = PfcSourceSheetV3;

export function createRegularHexagonalPfcSheetV4(
  center: SpatialPoint = { x: 60, y: 60 },
  radius = 48,
): PfcSourceSheetV4 {
  const vertices = Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 3;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
  return {
    sheetId: "PFC-SHEET-HEXAGON-ACTIVE",
    shape: "POLYGON",
    semanticShape: "REGULAR_HEXAGON",
    vertices,
    learnerReviewEligible: true,
  };
}

export function validatePfcSourceSheetV4(sheet: PfcSourceSheetV4): PfcSourceSheetV4 {
  if (sheet.shape !== "POLYGON" || sheet.semanticShape !== "REGULAR_HEXAGON") return validatePfcSourceSheetV3(sheet);
  const capabilityClone = { ...sheet, learnerReviewEligible: false };
  validatePfcSourceSheetV3(capabilityClone);
  return sheet;
}

export function pfcSheetContainsPointV4(sheet: PfcSourceSheetV4, point: SpatialPoint): boolean {
  if (sheet.shape === "POLYGON" && sheet.semanticShape === "REGULAR_HEXAGON") {
    const capabilityClone = { ...sheet, learnerReviewEligible: false };
    return pfcSheetContainsPointV3(capabilityClone, point);
  }
  return pfcSheetContainsPointV3(sheet, point);
}

export function pfcPolygonBoundaryForFoldEngineV4(sheet: PfcSourceSheetV4): SpatialPoint[] {
  if (sheet.shape === "POLYGON" && sheet.semanticShape === "REGULAR_HEXAGON") return sheet.vertices.map((point) => ({ ...point }));
  return pfcPolygonBoundaryForFoldEngineV3(sheet);
}

export function validatePfcCutGeometryV4(sheet: PfcSourceSheetV4, cut: PfcCutGeometryV2): PfcCutGeometryV2 {
  if (sheet.shape === "POLYGON" && sheet.semanticShape === "REGULAR_HEXAGON") {
    const anchors = cut.kind === "CIRCLE_HOLE" ? [cut.center]
      : cut.kind === "SLIT" ? [cut.a, cut.b]
      : cut.vertices;
    if (anchors.length === 0 || anchors.every((point) => !pfcSheetContainsPointV4(sheet, point))) {
      throw new Error(`Cut ${cut.cutId} has no anchor on active hexagonal source paper.`);
    }
    return cut;
  }
  return validatePfcCutGeometryV3(sheet, cut);
}
