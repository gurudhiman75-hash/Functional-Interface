import type {
  MenCp007Wave01Definition,
  MenCp007Wave01PrototypeId,
} from "./types";

export const MEN_CP_007_WAVE_01_PROTOTYPES: readonly MenCp007Wave01Definition[] = [
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-LSA",
    solveMode: "findCubeLateralSurfaceArea",
    target: "LATERAL_SURFACE_AREA",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-TSA",
    solveMode: "findCubeSideFromTotalSurfaceArea",
    target: "LENGTH",
    shape: "CUBE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-FACE-DIAGONAL",
    solveMode: "findCubeFaceDiagonal",
    target: "DIAGONAL",
    shape: "CUBE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-FACE-DIAGONAL",
    solveMode: "findCubeSideFromFaceDiagonal",
    target: "LENGTH",
    shape: "CUBE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBOID-LSA",
    solveMode: "findCuboidLateralSurfaceArea",
    target: "LATERAL_SURFACE_AREA",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-LSA",
    solveMode: "findCuboidHeightFromLateralSurfaceArea",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-TSA",
    solveMode: "findCuboidHeightFromTotalSurfaceArea",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-PRISM-LSA",
    solveMode: "findPrismLateralSurfaceArea",
    target: "LATERAL_SURFACE_AREA",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-PRISM-TSA",
    solveMode: "findPrismTotalSurfaceArea",
    target: "TOTAL_SURFACE_AREA",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-PRISM-HEIGHT-FROM-LSA",
    solveMode: "findPrismHeightFromLateralSurfaceArea",
    target: "LENGTH",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-HEXAGONAL-PRISM-VOLUME",
    solveMode: "findRegularHexagonalPrismVolume",
    target: "VOLUME",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-INTERNAL-CAPACITY-WITH-THICKNESS",
    solveMode: "findInternalCapacityFromExternalDimensionsAndThickness",
    target: "CAPACITY",
    shape: "CUBOID",
    disposition: "PROVISIONAL_REASSIGN_CP011",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUT-CUBES-WITH-REMAINDER",
    solveMode: "findUnusedVolumeAfterCuttingCubes",
    target: "VOLUME",
    shape: "CUBOID",
    disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBOID-FROM-STACKED-CUBES",
    solveMode: "findStackedCuboidHeightFromCubeArrangement",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-VOLUME-RATIO",
    solveMode: "findCubeSideRatioFromVolumeRatio",
    target: "RATIO",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-SURFACE-RATIO",
    solveMode: "findCubeSideRatioFromSurfaceAreaRatio",
    target: "RATIO",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
] as const;

const byId = new Map(
  MEN_CP_007_WAVE_01_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function getMenCp007Wave01Prototype(prototypeId: MenCp007Wave01PrototypeId) {
  const prototype = byId.get(prototypeId);
  if (!prototype) throw new Error(`Unknown MEN-CP-007 wave-01 prototype: ${prototypeId}`);
  return prototype;
}

export function getMenCp007Wave01PrototypeIds() {
  return MEN_CP_007_WAVE_01_PROTOTYPES.map((prototype) => prototype.prototypeId);
}
