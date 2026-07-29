import type {
  MenCp007Wave04Definition,
  MenCp007Wave04PrototypeId,
} from "./types";

export const MEN_CP_007_WAVE_04_PROTOTYPES: readonly MenCp007Wave04Definition[] = [
  {
    prototypeId: "MEN-CP007-W4-PROT-CUBOID-VOLUME-FROM-ADJACENT-FACE-AREAS",
    solveMode: "findCuboidVolumeFromAdjacentFaceAreas",
    target: "VOLUME",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
    sourceEvidence: [
      "SSC 3D Mensuration PYQ: cuboid volume from three adjacent face areas",
      "Competitive aptitude references: V²=(lb)(bh)(hl)",
    ],
  },
  {
    prototypeId: "MEN-CP007-W4-PROT-CUBOID-LENGTH-FROM-ADJACENT-FACE-AREAS",
    solveMode: "findCuboidLengthFromAdjacentFaceAreas",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONALLY_RETAIN",
    sourceEvidence: [
      "Competitive aptitude references: dimension recovery from three adjacent face areas",
      "Inverse companion to the source-backed volume identity",
    ],
  },
  {
    prototypeId: "MEN-CP007-W4-PROT-SHORTEST-SIDE-FROM-FACE-AREA-RATIO-VOLUME",
    solveMode: "findShortestCuboidSideFromFaceAreaRatioAndVolume",
    target: "LENGTH",
    shape: "CUBOID",
    disposition: "PROVISIONAL_MERGE_AS_REPRESENTATION",
    sourceEvidence: [
      "Competitive aptitude reference: adjacent face-area ratio with known volume",
      "Representation of adjacent-face inverse measurement",
    ],
  },
] as const;

const byId = new Map(
  MEN_CP_007_WAVE_04_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function getMenCp007Wave04Prototype(prototypeId: MenCp007Wave04PrototypeId) {
  const prototype = byId.get(prototypeId);
  if (!prototype) throw new Error(`Unknown MEN-CP-007 wave-04 prototype: ${prototypeId}`);
  return prototype;
}

export function getMenCp007Wave04PrototypeIds() {
  return MEN_CP_007_WAVE_04_PROTOTYPES.map((prototype) => prototype.prototypeId);
}
