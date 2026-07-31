import type { MenCp008Wave02Definition, MenCp008Wave02PrototypeId } from "./types";

export const MEN_CP_008_WAVE_02_PROTOTYPES: readonly MenCp008Wave02Definition[] = [
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14", solveMode: "findCylinderCapacityWithThreePointFourteen", target: "CAPACITY", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME", solveMode: "findCylinderSurdRadiusFromVolume", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-RADIUS", solveMode: "findCylinderVolumeFromCurvedSurfaceAreaAndRadius", target: "VOLUME", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-TSA-RADIUS", solveMode: "findCylinderVolumeFromTotalSurfaceAreaAndRadius", target: "VOLUME", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-RADIUS-FROM-TSA-CSA-DIFFERENCE", solveMode: "findCylinderRadiusFromTotalMinusCurvedSurfaceArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-TSA", solveMode: "findCylinderVolumeFromCurvedAndTotalSurfaceAreas", target: "VOLUME", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CYLINDER-VOLUME-RATIO-DIMENSION-RATIOS", solveMode: "findCylinderVolumeRatioFromDimensionRatios", target: "RATIO", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-ROLLER-SWEPT-AREA", solveMode: "findRollerSweptArea", target: "SURFACE_AREA", shape: "CYLINDER", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD", solveMode: "findConeSurdSlantHeight", target: "LENGTH", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-CSA-PI-SURD", solveMode: "findConePiSurdCurvedSurfaceArea", target: "LATERAL_SURFACE_AREA", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-RADIUS-SURD-FROM-VOLUME", solveMode: "findConeSurdRadiusFromVolume", target: "LENGTH", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-CSA-RADIUS", solveMode: "findConeVolumeFromCurvedSurfaceAreaAndRadius", target: "VOLUME", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-TSA-RADIUS", solveMode: "findConeVolumeFromTotalSurfaceAreaAndRadius", target: "VOLUME", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-HEIGHT-FROM-CSA-TSA", solveMode: "findConeHeightFromCurvedAndTotalSurfaceAreas", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W2-PROT-CONE-VOLUME-RATIO-DIMENSION-RATIOS", solveMode: "findConeVolumeRatioFromDimensionRatios", target: "RATIO", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT", solveMode: "findCylinderHeightForEqualConeVolume", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
] as const;

const byId = new Map(MEN_CP_008_WAVE_02_PROTOTYPES.map((definition) => [definition.prototypeId, definition]));

export function getMenCp008Wave02Definition(prototypeId: MenCp008Wave02PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 Wave-02 prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008Wave02PrototypeIds() {
  return MEN_CP_008_WAVE_02_PROTOTYPES.map((definition) => definition.prototypeId);
}
