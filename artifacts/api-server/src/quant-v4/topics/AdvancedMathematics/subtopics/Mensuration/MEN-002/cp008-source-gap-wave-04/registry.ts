import type { MenCp008Wave04Definition, MenCp008Wave04PrototypeId } from "./types";

export const MEN_CP_008_WAVE_04_PROTOTYPES: readonly MenCp008Wave04Definition[] = [
  {
    prototypeId: "MEN-CP008-W4-PROT-CONE-SIMILAR-HEIGHT-VOLUME-FRACTION",
    solveMode: "findSimilarConeVolumeFractionFromHeightFraction",
    target: "RATIO",
    shape: "CONE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP008-W4-PROT-CONE-SEMICIRCLE-SECTOR-HEIGHT",
    solveMode: "findConeHeightFromSemicircularSector",
    target: "LENGTH",
    shape: "CONE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP008-W4-PROT-CYLINDER-RECTANGLE-ROLLING-VOLUME-RATIO",
    solveMode: "findCylinderRollingOrientationVolumeRatio",
    target: "RATIO",
    shape: "CYLINDER",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP008-W4-PROT-CYLINDER-MINIMUM-TSA-HEIGHT",
    solveMode: "findMinimumSurfaceCylinderHeightFromVolume",
    target: "LENGTH",
    shape: "CYLINDER",
    disposition: "PROVISIONALLY_RETAIN",
  },
] as const;

const byId = new Map(MEN_CP_008_WAVE_04_PROTOTYPES.map((definition) => [definition.prototypeId, definition]));

export function getMenCp008Wave04Definition(prototypeId: MenCp008Wave04PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-008 Wave-04 prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp008Wave04PrototypeIds() {
  return MEN_CP_008_WAVE_04_PROTOTYPES.map((definition) => definition.prototypeId);
}
