import type { MenCp011Definition, MenCp011PrototypeId } from "./types";

export const MEN_CP_011_FOUNDATION_PROTOTYPES: readonly MenCp011Definition[] = [
  {
    prototypeId: "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
    solveMode: "findHollowCylinderMaterialVolumeFromRadii",
    target: "VOLUME",
    representation: "RADII",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
    solveMode: "findHollowCylinderMaterialVolumeFromDiameters",
    target: "VOLUME",
    representation: "DIAMETERS",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
    solveMode: "findPipeMaterialVolumeFromOuterRadiusAndThickness",
    target: "VOLUME",
    representation: "OUTER_RADIUS_AND_THICKNESS",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME",
    solveMode: "findPipeInnerRadiusFromMaterialVolume",
    target: "LENGTH",
    representation: "INVERSE_INNER_RADIUS",
    disposition: "PROVISIONAL_SPLIT_BY_INVERSE_REASONING",
  },
] as const;

const byId = new Map(
  MEN_CP_011_FOUNDATION_PROTOTYPES.map((definition) => [definition.prototypeId, definition]),
);

export function getMenCp011FoundationDefinition(prototypeId: MenCp011PrototypeId) {
  const definition = byId.get(prototypeId);
  if (!definition) throw new Error(`Unknown MEN-CP-011 foundation prototype: ${prototypeId}`);
  return definition;
}

export function getMenCp011FoundationPrototypeIds() {
  return MEN_CP_011_FOUNDATION_PROTOTYPES.map((definition) => definition.prototypeId);
}
