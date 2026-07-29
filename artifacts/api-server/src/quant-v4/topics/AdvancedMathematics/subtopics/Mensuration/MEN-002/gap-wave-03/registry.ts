import type {
  MenCp007Wave03Definition,
  MenCp007Wave03PrototypeId,
} from "./types";

export const MEN_CP_007_WAVE_03_PROTOTYPES: readonly MenCp007Wave03Definition[] = [
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBOID-HEIGHT-FROM-SPACE-DIAGONAL",
    solveMode: "findCuboidHeightFromSpaceDiagonal",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-BASE-LONGER-SIDE-FROM-AREA-PERIMETER",
    solveMode: "findLongerBaseSideFromAreaAndPerimeter",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBOID-LENGTH-FROM-VOLUME-RATIO",
    solveMode: "findCuboidLengthFromVolumeAndBaseRatio",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBE-SIDE-FROM-TSA-LSA-DIFFERENCE",
    solveMode: "findCubeSideFromTsaLsaDifference",
    target: "LENGTH",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBE-SIDE-EQUAL-CUBOID-VOLUME",
    solveMode: "findCubeSideEqualToCuboidVolume",
    target: "LENGTH",
    shape: "CUBE",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBE-CUBOID-VOLUME-DIFFERENCE",
    solveMode: "findVolumeDifferenceBetweenCubeAndCuboid",
    target: "VOLUME",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-MAX-BLOCKS-WITH-ROTATION",
    solveMode: "findMaximumBlocksWithRotation",
    target: "COUNT",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-WASTE-PERCENT-AFTER-CUBE-CUTTING",
    solveMode: "findWastePercentageAfterCubeCutting",
    target: "PERCENT_CHANGE",
    shape: "CUBOID",
    disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-GRID-PLANE-CUT-COUNT",
    solveMode: "findGridPlaneCutCount",
    target: "COUNT",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBOID-WIRE-FRAME-COST",
    solveMode: "findCuboidWireFrameCost",
    target: "COST",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_PARAMETER",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-CUBE-WIRE-RATE-FROM-COST",
    solveMode: "findCubeWireRateFromCost",
    target: "RATE",
    shape: "CUBE",
    disposition: "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-PAINTED-AREA-EXCLUDING-BASE",
    solveMode: "findPaintedAreaExcludingBase",
    target: "SURFACE_AREA",
    shape: "CUBOID",
    disposition: "PROVISIONAL_REASSIGN_CP011",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-PRISM-PERIMETER-FROM-TSA-BASE-AREA",
    solveMode: "findPrismBasePerimeterFromTsaAndBaseArea",
    target: "LENGTH",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONALLY_RETAIN",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-L-SHAPED-PRISM-VOLUME",
    solveMode: "findLShapedPrismVolume",
    target: "VOLUME",
    shape: "RIGHT_PRISM",
    disposition: "PROVISIONAL_REASSIGN_CP013",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-MIXED-UNIT-BRICK-COUNT",
    solveMode: "findBrickCountFromMixedUnits",
    target: "COUNT",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
  },
] as const;

const byId = new Map(
  MEN_CP_007_WAVE_03_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function getMenCp007Wave03Prototype(prototypeId: MenCp007Wave03PrototypeId) {
  const prototype = byId.get(prototypeId);
  if (!prototype) throw new Error(`Unknown MEN-CP-007 wave-03 prototype: ${prototypeId}`);
  return prototype;
}

export function getMenCp007Wave03PrototypeIds() {
  return MEN_CP_007_WAVE_03_PROTOTYPES.map((prototype) => prototype.prototypeId);
}
