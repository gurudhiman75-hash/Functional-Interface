import type { MenCp008Wave03Definition, MenCp008Wave03PrototypeId } from "./types";

export const MEN_CP_008_WAVE_03_PROTOTYPES: readonly MenCp008Wave03Definition[] = [
  { prototypeId: "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO", solveMode: "findCylinderRadiusFromVolumeToCurvedAreaRatio", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME", solveMode: "findCylinderRadiusFromRadiusHeightRatioAndVolume", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST", solveMode: "findCylinderSurfaceCost", target: "COST", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT", solveMode: "findConeCurvedSurfaceAreaFromVolumeAndHeight", target: "LATERAL_SURFACE_AREA", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT", solveMode: "findConeSlantHeightFromVolumeAndHeight", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS", solveMode: "findConeHeightRatioFromVolumeAndRadiusRatios", target: "RATIO", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS", solveMode: "findConeCurvedAreaRatioFromRadiusAndSlantRatios", target: "RATIO", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT", solveMode: "findCylinderConeTotalSurfaceAreaRatioForEqualBaseHeight", target: "RATIO", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH", solveMode: "findConicalTentClothLength", target: "LENGTH", shape: "CONE", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
  { prototypeId: "MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR", solveMode: "findConicalTentHeightFromFloorAreaAndAir", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
] as const;

const byId = new Map(MEN_CP_008_WAVE_03_PROTOTYPES.map((definition) => [definition.prototypeId, definition]));

export function getMenCp008Wave03Definition(prototypeId: MenCp008Wave03PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 Wave-03 prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008Wave03PrototypeIds() {
  return MEN_CP_008_WAVE_03_PROTOTYPES.map((definition) => definition.prototypeId);
}
