import type { MenCp007PrototypeDefinition, MenCp007PrototypeId } from "./types";

export const MEN_CP_007_PROTOTYPES: readonly MenCp007PrototypeDefinition[] = [
  {
    prototypeId: "MEN-CP007-PROT-CUBE-VOLUME",
    solveMode: "findCubeVolume",
    target: "VOLUME",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBE-TSA",
    solveMode: "findCubeTotalSurfaceArea",
    target: "TOTAL_SURFACE_AREA",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBE-SIDE-FROM-VOLUME",
    solveMode: "findCubeSideFromVolume",
    target: "LENGTH",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBE-SPACE-DIAGONAL",
    solveMode: "findCubeSpaceDiagonal",
    target: "DIAGONAL",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
    legacyTrace: "men-cube-diagonal",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBE-SIDE-FROM-SPACE-DIAGONAL",
    solveMode: "findCubeSideFromSpaceDiagonal",
    target: "LENGTH",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-VOLUME",
    solveMode: "findCuboidVolume",
    target: "VOLUME",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-TSA",
    solveMode: "findCuboidTotalSurfaceArea",
    target: "TOTAL_SURFACE_AREA",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-HEIGHT-FROM-VOLUME",
    solveMode: "findCuboidHeightFromVolume",
    target: "LENGTH",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-SPACE-DIAGONAL",
    solveMode: "findCuboidSpaceDiagonal",
    target: "DIAGONAL",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-LONGEST-ROD-CUBOID",
    solveMode: "findLongestRodInCuboid",
    target: "DIAGONAL",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONAL_MERGE_AS_PRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-PROT-TRIANGULAR-PRISM-VOLUME",
    solveMode: "findTriangularPrismVolume",
    target: "VOLUME",
    shape: "RIGHT_PRISM",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
    legacyTrace: "men-prism-base",
  },
  {
    prototypeId: "MEN-CP007-PROT-PRISM-HEIGHT-FROM-VOLUME",
    solveMode: "findPrismHeightFromVolumeAndBaseArea",
    target: "LENGTH",
    shape: "RIGHT_PRISM",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBES-CUT-FROM-CUBOID",
    solveMode: "findSmallCubeCountFromCuboid",
    target: "COUNT",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-OPEN-TOP-BOX-AREA",
    solveMode: "findOpenTopCuboidSheetArea",
    target: "SURFACE_AREA",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBE-VOLUME-SCALING",
    solveMode: "findCubeVolumeScaleRatio",
    target: "RATIO",
    shape: "CUBE",
    provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-VOLUME-PERCENT-CHANGE",
    solveMode: "findCuboidVolumePercentageChange",
    target: "PERCENT_CHANGE",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
    legacyTrace: "men-cuboid-surface-shift",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBIC-CM-TO-LITRES",
    solveMode: "convertCubicCentimetresToLitres",
    target: "CAPACITY",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-PROT-CUBOID-PAINTING-COST",
    solveMode: "findCuboidPaintingCost",
    target: "COST",
    shape: "CUBOID",
    provisionalDisposition: "PROVISIONALLY_RETAIN",
  },
] as const;

const prototypeById = new Map(
  MEN_CP_007_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function getMenCp007Prototype(prototypeId: MenCp007PrototypeId) {
  const prototype = prototypeById.get(prototypeId);
  if (!prototype) throw new Error(`Unknown MEN-CP-007 prototype: ${prototypeId}`);
  return prototype;
}

export function getMenCp007PrototypeIds() {
  return MEN_CP_007_PROTOTYPES.map((prototype) => prototype.prototypeId);
}
