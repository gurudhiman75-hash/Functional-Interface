import type { MenCp010PrototypeDefinition, MenCp010PrototypeId } from "./types";

const rows = [
  ["SQUARE-PYRAMID-VOLUME", "findSquarePyramidVolume", "Square-pyramid volume", "SQUARE_PYRAMID", "VOLUME", "Easy", false],
  ["SQUARE-PYRAMID-HEIGHT-FROM-VOLUME", "findSquarePyramidHeightFromVolume", "Square-pyramid height from volume", "SQUARE_PYRAMID", "LENGTH", "Medium", false],
  ["RECTANGULAR-PYRAMID-VOLUME", "findRectangularPyramidVolume", "Rectangular-pyramid volume", "RECTANGULAR_PYRAMID", "VOLUME", "Easy", false],
  ["TRIANGULAR-PYRAMID-VOLUME", "findTriangularPyramidVolumeFromBaseArea", "Triangular-pyramid volume from base area", "TRIANGULAR_PYRAMID", "VOLUME", "Medium", false],
  ["SQUARE-PYRAMID-SLANT-HEIGHT", "findSquarePyramidSlantHeight", "Square-pyramid slant height", "SQUARE_PYRAMID", "LENGTH", "Medium", false],
  ["SQUARE-PYRAMID-VERTICAL-HEIGHT", "findSquarePyramidVerticalHeight", "Square-pyramid vertical height", "SQUARE_PYRAMID", "LENGTH", "Medium", false],
  ["SQUARE-PYRAMID-LSA", "findSquarePyramidLateralSurfaceArea", "Square-pyramid lateral surface area", "SQUARE_PYRAMID", "LATERAL_SURFACE_AREA", "Medium", false],
  ["SQUARE-PYRAMID-TSA", "findSquarePyramidTotalSurfaceArea", "Square-pyramid total surface area", "SQUARE_PYRAMID", "TOTAL_SURFACE_AREA", "Medium", false],
  ["CONICAL-FRUSTUM-SLANT-HEIGHT", "findConicalFrustumSlantHeight", "Conical-frustum slant height", "CONICAL_FRUSTUM", "LENGTH", "Medium", false],
  ["CONICAL-FRUSTUM-VOLUME", "findConicalFrustumVolume", "Conical-frustum volume", "CONICAL_FRUSTUM", "VOLUME", "Medium", true],
  ["CONICAL-FRUSTUM-CSA", "findConicalFrustumCurvedSurfaceArea", "Conical-frustum curved surface area", "CONICAL_FRUSTUM", "SURFACE_AREA", "Medium", true],
  ["CONICAL-FRUSTUM-TSA", "findConicalFrustumTotalSurfaceArea", "Conical-frustum total surface area", "CONICAL_FRUSTUM", "TOTAL_SURFACE_AREA", "Hard", true],
  ["SQUARE-FRUSTUM-SLANT-HEIGHT", "findSquareFrustumSlantHeight", "Square-pyramid frustum slant height", "SQUARE_PYRAMID_FRUSTUM", "LENGTH", "Medium", false],
  ["SQUARE-FRUSTUM-VOLUME", "findSquareFrustumVolume", "Square-pyramid frustum volume", "SQUARE_PYRAMID_FRUSTUM", "VOLUME", "Hard", false],
  ["SQUARE-FRUSTUM-LSA", "findSquareFrustumLateralSurfaceArea", "Square-pyramid frustum lateral area", "SQUARE_PYRAMID_FRUSTUM", "LATERAL_SURFACE_AREA", "Hard", false],
  ["SQUARE-FRUSTUM-TSA", "findSquareFrustumTotalSurfaceArea", "Square-pyramid frustum total area", "SQUARE_PYRAMID_FRUSTUM", "TOTAL_SURFACE_AREA", "Hard", false],
] as const;

export const MEN_CP_010_PROTOTYPES: readonly MenCp010PrototypeDefinition[] = rows.map((row) => ({
  prototypeId: `MEN-CP010-PROT-${row[0]}` as MenCp010PrototypeId,
  solveMode: row[1], title: row[2], shape: row[3], target: row[4], difficultyFloor: row[5], usesPi: row[6],
  ownership: "MEN-CP-010", disposition: "PROVISIONALLY_RETAIN", permanentQlId: null,
  questionStudioDiscoverable: false, publiclyPublishable: false,
}));

const byId = new Map(MEN_CP_010_PROTOTYPES.map((row) => [row.prototypeId, row]));
export function getMenCp010Prototype(prototypeId: MenCp010PrototypeId) {
  const row = byId.get(prototypeId);
  if (!row) throw new Error(`Unknown MEN-CP-010 prototype: ${prototypeId}`);
  return row;
}
export function auditMenCp010Registry() {
  const ids = MEN_CP_010_PROTOTYPES.map((row) => row.prototypeId);
  const modes = MEN_CP_010_PROTOTYPES.map((row) => row.solveMode);
  return {
    prototypeCount: ids.length,
    uniquePrototypeCount: new Set(ids).size,
    uniqueSolveModeCount: new Set(modes).size,
    shapeCount: new Set(MEN_CP_010_PROTOTYPES.map((row) => row.shape)).size,
    permanentQlCount: MEN_CP_010_PROTOTYPES.filter((row) => row.permanentQlId !== null).length,
    lifecycleLocked: MEN_CP_010_PROTOTYPES.every((row) => row.permanentQlId === null && !row.questionStudioDiscoverable && !row.publiclyPublishable),
  } as const;
}
