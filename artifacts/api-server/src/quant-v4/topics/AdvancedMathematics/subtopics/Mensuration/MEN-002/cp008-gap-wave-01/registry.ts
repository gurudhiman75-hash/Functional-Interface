import type {
  MenCp008Wave01Definition,
  MenCp008Wave01PrototypeId,
} from "./types";

export const MEN_CP_008_WAVE_01_PROTOTYPES: readonly MenCp008Wave01Definition[] = [
  { prototypeId: "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-TSA", solveMode: "findCylinderHeightFromTotalSurfaceArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CYLINDER-CSA-TSA-RATIO", solveMode: "findCylinderCurvedToTotalSurfaceRatio", target: "RATIO", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W1-PROT-CYLINDER-RADIUS-FROM-AREA-RATIO", solveMode: "findCylinderRadiusFromSurfaceRatioAndHeight", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-AREA-RATIO", solveMode: "findCylinderHeightFromSurfaceRatioAndRadius", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CYLINDER-VOLUME-PERCENT-CHANGE", solveMode: "findCylinderVolumePercentageChange", target: "PERCENT_CHANGE", shape: "CYLINDER", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA", solveMode: "findRollerLengthFromSweptArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
  { prototypeId: "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA", solveMode: "findRollerRadiusFromSweptArea", target: "LENGTH", shape: "CYLINDER", disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-CSA", solveMode: "findConeRadiusFromCurvedSurfaceArea", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-SLANT-FROM-CSA", solveMode: "findConeSlantHeightFromCurvedSurfaceArea", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-SLANT-FROM-TSA", solveMode: "findConeSlantHeightFromTotalSurfaceArea", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-TSA", solveMode: "findConeRadiusFromTotalSurfaceArea", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-RADIUS-SLANT", solveMode: "findConeVolumeFromRadiusAndSlantHeight", target: "VOLUME", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-HEIGHT-SLANT", solveMode: "findConeVolumeFromHeightAndSlantHeight", target: "VOLUME", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-CSA-TSA-RATIO", solveMode: "findConeCurvedToTotalSurfaceRatio", target: "RATIO", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
  { prototypeId: "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT", solveMode: "findConeHeightForEqualCylinderVolume", target: "LENGTH", shape: "CONE", disposition: "PROVISIONALLY_RETAIN" },
  { prototypeId: "MEN-CP008-W1-PROT-CONE-VOLUME-PERCENT-CHANGE", solveMode: "findConeVolumePercentageChange", target: "PERCENT_CHANGE", shape: "CONE", disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION" },
] as const;

const byId = new Map(MEN_CP_008_WAVE_01_PROTOTYPES.map((item) => [item.prototypeId, item]));

export function getMenCp008Wave01Definition(prototypeId: MenCp008Wave01PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 Wave-01 prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008Wave01PrototypeIds() {
  return MEN_CP_008_WAVE_01_PROTOTYPES.map((item) => item.prototypeId);
}
