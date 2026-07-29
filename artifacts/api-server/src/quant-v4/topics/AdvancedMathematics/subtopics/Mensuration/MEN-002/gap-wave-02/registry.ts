import type {
  MenCp007Wave02Definition,
  MenCp007Wave02PrototypeId,
} from "./types";

export const MEN_CP_007_WAVE_02_PROTOTYPES: readonly MenCp007Wave02Definition[] = [
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBOID-FACE-DIAGONAL",
    solveMode: "findCuboidFaceDiagonal",
    target: "DIAGONAL",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBOID-BREADTH-FROM-FACE-DIAGONAL",
    solveMode: "findCuboidBreadthFromFaceDiagonal",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-VOLUME",
    solveMode: "findPrismBaseAreaFromVolume",
    target: "SURFACE_AREA",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-PRISM-BASE-PERIMETER-FROM-LSA",
    solveMode: "findPrismBasePerimeterFromLateralSurfaceArea",
    target: "LENGTH",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-TSA",
    solveMode: "findPrismBaseAreaFromTotalSurfaceArea",
    target: "SURFACE_AREA",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-TRAPEZOIDAL-PRISM-VOLUME",
    solveMode: "findTrapezoidalPrismVolume",
    target: "VOLUME",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-MIXED-UNIT-CUBOID-VOLUME",
    solveMode: "findCuboidVolumeFromMixedLinearUnits",
    target: "VOLUME",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-BRICK-COUNT-IN-WALL",
    solveMode: "findBrickCountInWall",
    target: "COUNT",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBOID-TOTAL-EDGE-LENGTH",
    solveMode: "findCuboidTotalEdgeLength",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBE-SIDE-FROM-TOTAL-EDGE-LENGTH",
    solveMode: "findCubeSideFromTotalEdgeLength",
    target: "LENGTH",
    shape: "CUBE",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-PAINTING-RATE-FROM-COST",
    solveMode: "findPaintingRateFromCost",
    target: "RATE",
    shape: "CUBOID",
    disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-EQUAL-VOLUME-NEW-HEIGHT",
    solveMode: "findNewHeightForEqualCuboidVolume",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBE-SURFACE-RATIO-FROM-VOLUME-RATIO",
    solveMode: "findCubeSurfaceAreaRatioFromVolumeRatio",
    target: "RATIO",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-CUBE-VOLUME-RATIO-FROM-SURFACE-RATIO",
    solveMode: "findCubeVolumeRatioFromSurfaceAreaRatio",
    target: "RATIO",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W2-PROT-MATERIAL-COST-FROM-VOLUME",
    solveMode: "findMaterialCostFromCuboidVolume",
    target: "COST",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
] as const;

const byId = new Map(
  MEN_CP_007_WAVE_02_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function getMenCp007Wave02Prototype(prototypeId: MenCp007Wave02PrototypeId) {
  const prototype = byId.get(prototypeId);
  if (!prototype) throw new Error(`Unknown MEN-CP-007 wave-02 prototype: ${prototypeId}`);
  return prototype;
}

export function getMenCp007Wave02PrototypeIds() {
  return MEN_CP_007_WAVE_02_PROTOTYPES.map((prototype) => prototype.prototypeId);
}
