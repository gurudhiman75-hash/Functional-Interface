import type { MenCp008Definition, MenCp008PrototypeId } from "./types";

export const MEN_CP_008_PROTOTYPES: readonly MenCp008Definition[] = [
  { prototypeId: "MEN-CP008-PROT-CYLINDER-VOLUME", solveMode: "findCylinderVolume", target: "VOLUME", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-CSA", solveMode: "findCylinderCurvedSurfaceArea", target: "LATERAL_SURFACE_AREA", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_PARAMETER" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-TSA", solveMode: "findCylinderTotalSurfaceArea", target: "TOTAL_SURFACE_AREA", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_PARAMETER" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME", solveMode: "findCylinderRadiusFromVolume", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME", solveMode: "findCylinderHeightFromVolume", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA", solveMode: "findCylinderRadiusFromCurvedSurfaceArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA", solveMode: "findCylinderHeightFromCurvedSurfaceArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA", solveMode: "findCylinderRadiusFromTotalSurfaceArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7", solveMode: "findCylinderCapacityWithTwentyTwoOverSeven", target: "CAPACITY", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-PROT-ROLLER-REVOLUTIONS", solveMode: "findRollerRevolutionsFromSweptArea", target: "COUNT", shape: "CYLINDER", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
  { prototypeId: "MEN-CP008-PROT-CONE-VOLUME", solveMode: "findConeVolume", target: "VOLUME", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-CSA", solveMode: "findConeCurvedSurfaceArea", target: "LATERAL_SURFACE_AREA", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_PARAMETER" },
  { prototypeId: "MEN-CP008-PROT-CONE-TSA", solveMode: "findConeTotalSurfaceArea", target: "TOTAL_SURFACE_AREA", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_PARAMETER" },
  { prototypeId: "MEN-CP008-PROT-CONE-SLANT-HEIGHT", solveMode: "findConeSlantHeight", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT", solveMode: "findConeHeightFromSlantHeight", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT", solveMode: "findConeRadiusFromSlantHeight", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME", solveMode: "findConeHeightFromVolume", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME", solveMode: "findConeRadiusFromVolume", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-PROT-CONE-CANVAS-COST", solveMode: "findConeCanvasCost", target: "COST", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_PARAMETER" },
  { prototypeId: "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO", solveMode: "findCylinderConeVolumeRatio", target: "RATIO", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
] as const;

const byId = new Map(MEN_CP_008_PROTOTYPES.map((definition) => [definition.prototypeId, definition]));

export function getMenCp008Definition(prototypeId: MenCp008PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008PrototypeIds() {
  return MEN_CP_008_PROTOTYPES.map((definition) => definition.prototypeId);
}
