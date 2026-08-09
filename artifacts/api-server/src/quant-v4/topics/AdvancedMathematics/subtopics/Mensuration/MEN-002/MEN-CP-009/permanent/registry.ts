import type { MenCp009QlDefinition } from "./types";

const rows = [
  ["SPHERE_SURFACE_FROM_RADIUS", "findSphereSurfaceAreaFromRadius", "Sphere surface area from radius", "SPHERE", "SURFACE_AREA", "Easy"],
  ["SPHERE_SURFACE_FROM_DIAMETER", "findSphereSurfaceAreaFromDiameter", "Sphere surface area from diameter", "SPHERE", "SURFACE_AREA", "Easy"],
  ["SPHERE_VOLUME_FROM_RADIUS", "findSphereVolumeFromRadius", "Sphere volume from radius", "SPHERE", "VOLUME", "Easy"],
  ["SPHERE_VOLUME_FROM_DIAMETER", "findSphereVolumeFromDiameter", "Sphere volume from diameter", "SPHERE", "VOLUME", "Medium"],
  ["SPHERE_RADIUS_FROM_SURFACE", "findSphereRadiusFromSurfaceArea", "Sphere radius from surface area", "SPHERE", "LENGTH", "Medium"],
  ["SPHERE_DIAMETER_FROM_SURFACE", "findSphereDiameterFromSurfaceArea", "Sphere diameter from surface area", "SPHERE", "LENGTH", "Medium"],
  ["SPHERE_RADIUS_FROM_VOLUME", "findSphereRadiusFromVolume", "Sphere radius from volume", "SPHERE", "LENGTH", "Medium"],
  ["SPHERE_DIAMETER_FROM_VOLUME", "findSphereDiameterFromVolume", "Sphere diameter from volume", "SPHERE", "LENGTH", "Hard"],
  ["HEMISPHERE_CSA_FROM_RADIUS", "findHemisphereCurvedSurfaceArea", "Hemisphere curved surface area", "HEMISPHERE", "SURFACE_AREA", "Easy"],
  ["HEMISPHERE_TSA_FROM_RADIUS", "findHemisphereTotalSurfaceArea", "Hemisphere total surface area", "HEMISPHERE", "TOTAL_SURFACE_AREA", "Easy"],
  ["HEMISPHERE_VOLUME_FROM_RADIUS", "findHemisphereVolume", "Hemisphere volume", "HEMISPHERE", "VOLUME", "Easy"],
  ["HEMISPHERE_RADIUS_FROM_CSA", "findHemisphereRadiusFromCurvedSurfaceArea", "Hemisphere radius from curved surface area", "HEMISPHERE", "LENGTH", "Medium"],
  ["HEMISPHERE_RADIUS_FROM_TSA", "findHemisphereRadiusFromTotalSurfaceArea", "Hemisphere radius from total surface area", "HEMISPHERE", "LENGTH", "Medium"],
  ["HEMISPHERE_RADIUS_FROM_VOLUME", "findHemisphereRadiusFromVolume", "Hemisphere radius from volume", "HEMISPHERE", "LENGTH", "Medium"],
  ["HEMISPHERE_CAPACITY_LITRES", "findHemisphericalCapacityInLitres", "Hemispherical vessel capacity", "HEMISPHERE", "CAPACITY", "Medium"],
  ["SPHERE_PAINTING_COST", "findSpherePaintingCost", "Cost of painting a sphere", "SPHERE", "COST", "Medium"],
  ["HEMISPHERE_INNER_POLISHING_COST", "findHemisphericalInnerPolishingCost", "Cost of polishing a hemispherical bowl", "HEMISPHERE", "COST", "Medium"],
  ["SPHERE_SURFACE_RATIO", "findSphereSurfaceAreaRatio", "Sphere surface-area ratio", "SPHERE", "RATIO", "Medium"],
  ["SPHERE_VOLUME_RATIO", "findSphereVolumeRatio", "Sphere volume ratio", "SPHERE", "RATIO", "Medium"],
  ["RADIUS_RATIO_FROM_SURFACE_RATIO", "findRadiusRatioFromSphereSurfaceAreas", "Radius ratio from sphere surface areas", "SPHERE", "RATIO", "Hard"],
  ["RADIUS_RATIO_FROM_VOLUME_RATIO", "findRadiusRatioFromSphereVolumes", "Radius ratio from sphere volumes", "SPHERE", "RATIO", "Hard"],
  ["SPHERE_SURFACE_PERCENT_CHANGE", "findSphereSurfaceAreaPercentageChange", "Sphere surface-area percentage change", "SPHERE", "PERCENT_CHANGE", "Medium"],
  ["SPHERE_VOLUME_PERCENT_CHANGE", "findSphereVolumePercentageChange", "Sphere volume percentage change", "SPHERE", "PERCENT_CHANGE", "Hard"],
  ["SPHERE_HEMISPHERE_MEASURE_RATIO", "compareSphereAndHemisphereMeasure", "Sphere and hemisphere measure comparison", "HEMISPHERE", "RATIO", "Medium"],
] as const;

export const MEN_CP_009_FROZEN_QLS: readonly MenCp009QlDefinition[] = rows.map((row, index) => ({
  qlId: `MEN-002-QL-${String(96 + index).padStart(3, "0")}`,
  templateId: `MEN-CP009-TPL-${String(index + 1).padStart(3, "0")}`,
  familyId: row[0],
  solveMode: row[1],
  title: row[2],
  shape: row[3],
  target: row[4],
  difficultyFloor: row[5],
  sourceClassification: "DESIGN_AND_FORMULA_AUTHORITY",
  ownership: "MEN-CP-009",
  permanentIdentityFrozen: true,
  questionStudioDiscoverable: false,
  publiclyPublishable: false,
}));

const byQlId = new Map(MEN_CP_009_FROZEN_QLS.map((row) => [row.qlId, row]));
const byFamilyId = new Map(MEN_CP_009_FROZEN_QLS.map((row) => [row.familyId, row]));

export function getMenCp009QlDefinition(qlId: string) {
  const row = byQlId.get(qlId);
  if (!row) throw new Error(`Unknown MEN-CP-009 permanent QL: ${qlId}`);
  return row;
}

export function getMenCp009QlForFamily(familyId: MenCp009QlDefinition["familyId"]) {
  const row = byFamilyId.get(familyId);
  if (!row) throw new Error(`Unknown MEN-CP-009 family: ${familyId}`);
  return row;
}

export function auditMenCp009Registry() {
  const qlIds = MEN_CP_009_FROZEN_QLS.map((row) => row.qlId);
  const familyIds = MEN_CP_009_FROZEN_QLS.map((row) => row.familyId);
  const expected = MEN_CP_009_FROZEN_QLS.map((_row, index) =>
    `MEN-002-QL-${String(96 + index).padStart(3, "0")}`,
  );
  return {
    qlCount: qlIds.length,
    firstQlId: qlIds[0],
    lastQlId: qlIds.at(-1),
    uniqueQlIds: new Set(qlIds).size,
    uniqueFamilyIds: new Set(familyIds).size,
    contiguous: JSON.stringify(qlIds) === JSON.stringify(expected),
    lifecycleLocked: MEN_CP_009_FROZEN_QLS.every(
      (row) => row.permanentIdentityFrozen && !row.questionStudioDiscoverable && !row.publiclyPublishable,
    ),
  } as const;
}
