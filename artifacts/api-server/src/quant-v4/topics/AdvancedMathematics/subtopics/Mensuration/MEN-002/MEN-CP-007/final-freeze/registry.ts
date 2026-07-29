import type { Men002Target } from "../../foundation/types";
import type { MenCp007PrototypeId } from "../../foundation/types";
import type { MenCp007Wave01PrototypeId } from "../../gap-wave-01/types";
import type { MenCp007Wave02PrototypeId } from "../../gap-wave-02/types";
import type { MenCp007Wave03PrototypeId } from "../../gap-wave-03/types";
import type { MenCp007Wave04PrototypeId } from "../../source-gap-wave-04/types";

export type MenCp007AnyPrototypeId =
  | MenCp007PrototypeId
  | MenCp007Wave01PrototypeId
  | MenCp007Wave02PrototypeId
  | MenCp007Wave03PrototypeId
  | MenCp007Wave04PrototypeId;

export type MenCp007PermanentQlId = `MEN-002-QL-${string}`;

export interface MenCp007FrozenQlDefinition {
  qlId: MenCp007PermanentQlId;
  templateId: string;
  canonicalSolveMode: string;
  target: Men002Target;
  title: string;
  prototypeIds: readonly MenCp007AnyPrototypeId[];
  mergeRule: string;
}

export interface MenCp007Reassignment {
  prototypeId: MenCp007AnyPrototypeId;
  targetCanonicalProblemId: "MEN-CP-011" | "MEN-CP-013";
  reason: string;
}

export const MEN_CP_007_FROZEN_QLS: readonly MenCp007FrozenQlDefinition[] = [
  {
    qlId: "MEN-002-QL-001",
    templateId: "MEN-CP007-TPL-CUBE-VOLUME",
    canonicalSolveMode: "findCubeVolume",
    target: "VOLUME",
    title: "Cube volume from side",
    prototypeIds: ["MEN-CP007-PROT-CUBE-VOLUME"],
    mergeRule: "Direct cube-volume authority.",
  },
  {
    qlId: "MEN-002-QL-002",
    templateId: "MEN-CP007-TPL-CUBE-SURFACE-AREA",
    canonicalSolveMode: "findCubeSurfaceArea",
    target: "SURFACE_AREA",
    title: "Cube total or lateral surface area",
    prototypeIds: ["MEN-CP007-PROT-CUBE-TSA", "MEN-CP007-W1-PROT-CUBE-LSA"],
    mergeRule: "Included-face count is a parameter; target remains surface area.",
  },
  {
    qlId: "MEN-002-QL-003",
    templateId: "MEN-CP007-TPL-CUBE-SIDE-FROM-VOLUME",
    canonicalSolveMode: "findCubeSideFromVolume",
    target: "LENGTH",
    title: "Cube side from volume",
    prototypeIds: ["MEN-CP007-PROT-CUBE-SIDE-FROM-VOLUME", "MEN-CP007-W3-PROT-CUBE-SIDE-EQUAL-CUBOID-VOLUME"],
    mergeRule: "A cuboid supplying the equal volume is a source representation of the same cube-root task.",
  },
  {
    qlId: "MEN-002-QL-004",
    templateId: "MEN-CP007-TPL-CUBE-DIAGONAL",
    canonicalSolveMode: "findCubeDiagonal",
    target: "DIAGONAL",
    title: "Cube face or space diagonal from side",
    prototypeIds: ["MEN-CP007-PROT-CUBE-SPACE-DIAGONAL", "MEN-CP007-W1-PROT-CUBE-FACE-DIAGONAL"],
    mergeRule: "Diagonal kind is an explicit parameter with distinct formula and traps inside one learner contract.",
  },
  {
    qlId: "MEN-002-QL-005",
    templateId: "MEN-CP007-TPL-CUBE-SIDE-FROM-DIAGONAL",
    canonicalSolveMode: "findCubeSideFromDiagonal",
    target: "LENGTH",
    title: "Cube side from face or space diagonal",
    prototypeIds: ["MEN-CP007-PROT-CUBE-SIDE-FROM-SPACE-DIAGONAL", "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-FACE-DIAGONAL"],
    mergeRule: "Face-versus-space evidence is parameterised while the requested answer remains cube side.",
  },
  {
    qlId: "MEN-002-QL-006",
    templateId: "MEN-CP007-TPL-CUBE-SIDE-FROM-SURFACE-EVIDENCE",
    canonicalSolveMode: "findCubeSideFromSurfaceEvidence",
    target: "LENGTH",
    title: "Cube side from total, lateral or surface-difference evidence",
    prototypeIds: ["MEN-CP007-W1-PROT-CUBE-SIDE-FROM-TSA", "MEN-CP007-W3-PROT-CUBE-SIDE-FROM-TSA-LSA-DIFFERENCE"],
    mergeRule: "Surface coefficient/evidence is a parameter before the same positive square-root recovery.",
  },
  {
    qlId: "MEN-002-QL-007",
    templateId: "MEN-CP007-TPL-CUBE-RATIO-TRANSFORMATION",
    canonicalSolveMode: "transformCubeSideSurfaceVolumeRatio",
    target: "RATIO",
    title: "Transform cube side, surface-area and volume ratios",
    prototypeIds: [
      "MEN-CP007-PROT-CUBE-VOLUME-SCALING",
      "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-VOLUME-RATIO",
      "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-SURFACE-RATIO",
      "MEN-CP007-W2-PROT-CUBE-SURFACE-RATIO-FROM-VOLUME-RATIO",
      "MEN-CP007-W2-PROT-CUBE-VOLUME-RATIO-FROM-SURFACE-RATIO",
    ],
    mergeRule: "Source and target measure are parameters of the same first-, second- and third-power ratio system.",
  },
  {
    qlId: "MEN-002-QL-008",
    templateId: "MEN-CP007-TPL-CUBOID-VOLUME-CAPACITY",
    canonicalSolveMode: "findCuboidVolumeOrCapacity",
    target: "VOLUME",
    title: "Cuboid volume or capacity with unit normalisation",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-VOLUME", "MEN-CP007-W2-PROT-MIXED-UNIT-CUBOID-VOLUME", "MEN-CP007-PROT-CUBIC-CM-TO-LITRES"],
    mergeRule: "Mixed units and litre output are representations of direct cuboid measurement.",
  },
  {
    qlId: "MEN-002-QL-009",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-VOLUME",
    canonicalSolveMode: "findCuboidDimensionFromVolume",
    target: "LENGTH",
    title: "Missing cuboid dimension from volume",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-HEIGHT-FROM-VOLUME"],
    mergeRule: "Symmetric dimension names remain presentation parameters.",
  },
  {
    qlId: "MEN-002-QL-010",
    templateId: "MEN-CP007-TPL-CUBOID-SURFACE-AREA",
    canonicalSolveMode: "findCuboidSurfaceArea",
    target: "SURFACE_AREA",
    title: "Cuboid total or lateral surface area",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-TSA", "MEN-CP007-W1-PROT-CUBOID-LSA"],
    mergeRule: "Total-versus-lateral included faces are explicit parameters.",
  },
  {
    qlId: "MEN-002-QL-011",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-SURFACE",
    canonicalSolveMode: "findCuboidDimensionFromSurfaceArea",
    target: "LENGTH",
    title: "Missing cuboid dimension from total or lateral surface area",
    prototypeIds: ["MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-LSA", "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-TSA"],
    mergeRule: "Surface type is parameterised; requested answer remains one cuboid dimension.",
  },
  {
    qlId: "MEN-002-QL-012",
    templateId: "MEN-CP007-TPL-CUBOID-FACE-DIAGONAL",
    canonicalSolveMode: "findCuboidFaceDiagonal",
    target: "DIAGONAL",
    title: "Cuboid face diagonal",
    prototypeIds: ["MEN-CP007-W2-PROT-CUBOID-FACE-DIAGONAL"],
    mergeRule: "Two-dimensional Pythagorean face measurement remains distinct from the space diagonal.",
  },
  {
    qlId: "MEN-002-QL-013",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-FACE-DIAGONAL",
    canonicalSolveMode: "findCuboidDimensionFromFaceDiagonal",
    target: "LENGTH",
    title: "Missing cuboid face dimension from face diagonal",
    prototypeIds: ["MEN-CP007-W2-PROT-CUBOID-BREADTH-FROM-FACE-DIAGONAL"],
    mergeRule: "Requested dimension name is symmetric within the chosen face.",
  },
  {
    qlId: "MEN-002-QL-014",
    templateId: "MEN-CP007-TPL-CUBOID-SPACE-DIAGONAL",
    canonicalSolveMode: "findCuboidSpaceDiagonal",
    target: "DIAGONAL",
    title: "Cuboid space diagonal or longest rod",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-SPACE-DIAGONAL", "MEN-CP007-PROT-LONGEST-ROD-CUBOID"],
    mergeRule: "Longest rod is a context presentation of the cuboid space diagonal.",
  },
  {
    qlId: "MEN-002-QL-015",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-SPACE-DIAGONAL",
    canonicalSolveMode: "findCuboidDimensionFromSpaceDiagonal",
    target: "LENGTH",
    title: "Missing cuboid dimension from space diagonal",
    prototypeIds: ["MEN-CP007-W3-PROT-CUBOID-HEIGHT-FROM-SPACE-DIAGONAL"],
    mergeRule: "Length, breadth and height are symmetric target representations.",
  },
  {
    qlId: "MEN-002-QL-016",
    templateId: "MEN-CP007-TPL-CUBOID-VOLUME-FROM-ADJACENT-FACES",
    canonicalSolveMode: "findCuboidVolumeFromAdjacentFaceAreas",
    target: "VOLUME",
    title: "Cuboid volume from three adjacent face areas",
    prototypeIds: ["MEN-CP007-W4-PROT-CUBOID-VOLUME-FROM-ADJACENT-FACE-AREAS"],
    mergeRule: "Source-backed identity V²=(lb)(bh)(hl).",
  },
  {
    qlId: "MEN-002-QL-017",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-ADJACENT-FACES",
    canonicalSolveMode: "findCuboidDimensionFromAdjacentFaceEvidence",
    target: "LENGTH",
    title: "Cuboid dimension from adjacent face areas or their ratio with volume",
    prototypeIds: ["MEN-CP007-W4-PROT-CUBOID-LENGTH-FROM-ADJACENT-FACE-AREAS", "MEN-CP007-W4-PROT-SHORTEST-SIDE-FROM-FACE-AREA-RATIO-VOLUME"],
    mergeRule: "Ratio-plus-volume is a source representation of the same adjacent-face inverse system.",
  },
  {
    qlId: "MEN-002-QL-018",
    templateId: "MEN-CP007-TPL-CUBOID-BASE-SIDES-FROM-AREA-PERIMETER",
    canonicalSolveMode: "findCuboidBaseSideFromAreaAndPerimeter",
    target: "LENGTH",
    title: "Cuboid base side from base area and perimeter",
    prototypeIds: ["MEN-CP007-W3-PROT-BASE-LONGER-SIDE-FROM-AREA-PERIMETER"],
    mergeRule: "Longer/shorter target direction is parameterised.",
  },
  {
    qlId: "MEN-002-QL-019",
    templateId: "MEN-CP007-TPL-CUBOID-DIMENSION-FROM-VOLUME-RATIO",
    canonicalSolveMode: "findCuboidDimensionFromVolumeAndDimensionRatio",
    target: "LENGTH",
    title: "Cuboid dimension from volume and dimension ratio",
    prototypeIds: ["MEN-CP007-W3-PROT-CUBOID-LENGTH-FROM-VOLUME-RATIO"],
    mergeRule: "Requested length or breadth is a target parameter after common-scale recovery.",
  },
  {
    qlId: "MEN-002-QL-020",
    templateId: "MEN-CP007-TPL-CUBOID-VOLUME-PERCENT-CHANGE",
    canonicalSolveMode: "findCuboidVolumePercentageChange",
    target: "PERCENT_CHANGE",
    title: "Cuboid volume change after dimension percentage changes",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-VOLUME-PERCENT-CHANGE"],
    mergeRule: "Independent signed changes are parameters of one multiplicative transformation.",
  },
  {
    qlId: "MEN-002-QL-021",
    templateId: "MEN-CP007-TPL-EQUAL-VOLUME-CUBOID-DIMENSION",
    canonicalSolveMode: "findNewCuboidDimensionForEqualVolume",
    target: "LENGTH",
    title: "New cuboid dimension under equal-volume constraint",
    prototypeIds: ["MEN-CP007-W2-PROT-EQUAL-VOLUME-NEW-HEIGHT"],
    mergeRule: "Changed dimension and requested dimension are explicit parameters.",
  },
  {
    qlId: "MEN-002-QL-022",
    templateId: "MEN-CP007-TPL-CUBE-CUBOID-VOLUME-COMPARISON",
    canonicalSolveMode: "compareCubeAndCuboidVolumes",
    target: "VOLUME",
    title: "Cube and cuboid volume comparison",
    prototypeIds: ["MEN-CP007-W3-PROT-CUBE-CUBOID-VOLUME-DIFFERENCE"],
    mergeRule: "Difference and exceed-by wording share one signed/absolute comparison contract.",
  },
  {
    qlId: "MEN-002-QL-023",
    templateId: "MEN-CP007-TPL-CUBOID-TOTAL-EDGE-LENGTH",
    canonicalSolveMode: "findCuboidTotalEdgeLength",
    target: "LENGTH",
    title: "Cuboid total edge length",
    prototypeIds: ["MEN-CP007-W2-PROT-CUBOID-TOTAL-EDGE-LENGTH"],
    mergeRule: "Direct twelve-edge measurement.",
  },
  {
    qlId: "MEN-002-QL-024",
    templateId: "MEN-CP007-TPL-CUBE-SIDE-FROM-TOTAL-EDGE-LENGTH",
    canonicalSolveMode: "findCubeSideFromTotalEdgeLength",
    target: "LENGTH",
    title: "Cube side from total edge length",
    prototypeIds: ["MEN-CP007-W2-PROT-CUBE-SIDE-FROM-TOTAL-EDGE-LENGTH"],
    mergeRule: "Inverse twelve-edge cube measurement.",
  },
  {
    qlId: "MEN-002-QL-025",
    templateId: "MEN-CP007-TPL-CUBOID-PAINTING-COST",
    canonicalSolveMode: "findCuboidPaintingCost",
    target: "COST",
    title: "Cuboid painting cost from surface area and rate",
    prototypeIds: ["MEN-CP007-PROT-CUBOID-PAINTING-COST"],
    mergeRule: "Area-based direct cost output remains distinct from raw surface-area output.",
  },
  {
    qlId: "MEN-002-QL-026",
    templateId: "MEN-CP007-TPL-CUBOID-PAINTING-RATE",
    canonicalSolveMode: "findCuboidPaintingRateFromCost",
    target: "RATE",
    title: "Painting rate from cuboid dimensions and total cost",
    prototypeIds: ["MEN-CP007-W2-PROT-PAINTING-RATE-FROM-COST"],
    mergeRule: "Inverse rate output is a separate learner answer contract.",
  },
  {
    qlId: "MEN-002-QL-027",
    templateId: "MEN-CP007-TPL-CUBOID-MATERIAL-COST",
    canonicalSolveMode: "findCuboidMaterialCostFromVolume",
    target: "COST",
    title: "Cuboid material cost from volume and rate",
    prototypeIds: ["MEN-CP007-W2-PROT-MATERIAL-COST-FROM-VOLUME"],
    mergeRule: "Volume-rated material cost uses a different dimensional measure from painting.",
  },
  {
    qlId: "MEN-002-QL-028",
    templateId: "MEN-CP007-TPL-CUBOID-WIRE-FRAME-COST",
    canonicalSolveMode: "findCuboidWireFrameCost",
    target: "COST",
    title: "Cuboid wire-frame cost",
    prototypeIds: ["MEN-CP007-W3-PROT-CUBOID-WIRE-FRAME-COST"],
    mergeRule: "Edge-length cost is distinct from area- and volume-rated applications.",
  },
  {
    qlId: "MEN-002-QL-029",
    templateId: "MEN-CP007-TPL-CUBE-WIRE-RATE",
    canonicalSolveMode: "findCubeWireRateFromCost",
    target: "RATE",
    title: "Wire rate from cube frame cost",
    prototypeIds: ["MEN-CP007-W3-PROT-CUBE-WIRE-RATE-FROM-COST"],
    mergeRule: "Inverse edge-rate output is a separate learner contract.",
  },
  {
    qlId: "MEN-002-QL-030",
    templateId: "MEN-CP007-TPL-RIGHT-PRISM-VOLUME",
    canonicalSolveMode: "findRightPrismVolume",
    target: "VOLUME",
    title: "Right-prism volume from base geometry and height",
    prototypeIds: ["MEN-CP007-PROT-TRIANGULAR-PRISM-VOLUME", "MEN-CP007-W1-PROT-HEXAGONAL-PRISM-VOLUME", "MEN-CP007-W2-PROT-TRAPEZOIDAL-PRISM-VOLUME"],
    mergeRule: "Triangle, regular hexagon and trapezium are base-area representations of V=Ah.",
  },
  {
    qlId: "MEN-002-QL-031",
    templateId: "MEN-CP007-TPL-PRISM-HEIGHT-FROM-VOLUME",
    canonicalSolveMode: "findPrismHeightFromVolumeAndBaseArea",
    target: "LENGTH",
    title: "Right-prism height from volume and base area",
    prototypeIds: ["MEN-CP007-PROT-PRISM-HEIGHT-FROM-VOLUME"],
    mergeRule: "Inverse extrusion height.",
  },
  {
    qlId: "MEN-002-QL-032",
    templateId: "MEN-CP007-TPL-PRISM-BASE-AREA-FROM-VOLUME",
    canonicalSolveMode: "findPrismBaseAreaFromVolume",
    target: "SURFACE_AREA",
    title: "Right-prism base area from volume and height",
    prototypeIds: ["MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-VOLUME"],
    mergeRule: "Area output remains distinct from height output.",
  },
  {
    qlId: "MEN-002-QL-033",
    templateId: "MEN-CP007-TPL-PRISM-SURFACE-AREA",
    canonicalSolveMode: "findPrismSurfaceArea",
    target: "SURFACE_AREA",
    title: "Right-prism lateral or total surface area",
    prototypeIds: ["MEN-CP007-W1-PROT-PRISM-LSA", "MEN-CP007-W1-PROT-PRISM-TSA"],
    mergeRule: "Included bases are a parameter of one direct prism-surface contract.",
  },
  {
    qlId: "MEN-002-QL-034",
    templateId: "MEN-CP007-TPL-PRISM-HEIGHT-FROM-LSA",
    canonicalSolveMode: "findPrismHeightFromLateralSurfaceArea",
    target: "LENGTH",
    title: "Right-prism height from lateral area and base perimeter",
    prototypeIds: ["MEN-CP007-W1-PROT-PRISM-HEIGHT-FROM-LSA"],
    mergeRule: "Length output under LSA=Ph.",
  },
  {
    qlId: "MEN-002-QL-035",
    templateId: "MEN-CP007-TPL-PRISM-PERIMETER-FROM-LSA",
    canonicalSolveMode: "findPrismBasePerimeterFromLateralSurfaceArea",
    target: "LENGTH",
    title: "Right-prism base perimeter from lateral area and height",
    prototypeIds: ["MEN-CP007-W2-PROT-PRISM-BASE-PERIMETER-FROM-LSA"],
    mergeRule: "Perimeter output remains distinct from height output.",
  },
  {
    qlId: "MEN-002-QL-036",
    templateId: "MEN-CP007-TPL-PRISM-BASE-AREA-FROM-TSA",
    canonicalSolveMode: "findPrismBaseAreaFromTotalSurfaceArea",
    target: "SURFACE_AREA",
    title: "Right-prism base area from total surface area",
    prototypeIds: ["MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-TSA"],
    mergeRule: "Area answer semantic under TSA=Ph+2A.",
  },
  {
    qlId: "MEN-002-QL-037",
    templateId: "MEN-CP007-TPL-PRISM-PERIMETER-FROM-TSA",
    canonicalSolveMode: "findPrismBasePerimeterFromTotalSurfaceArea",
    target: "LENGTH",
    title: "Right-prism base perimeter from total surface area",
    prototypeIds: ["MEN-CP007-W3-PROT-PRISM-PERIMETER-FROM-TSA-BASE-AREA"],
    mergeRule: "Perimeter answer semantic under TSA=Ph+2A.",
  },
  {
    qlId: "MEN-002-QL-038",
    templateId: "MEN-CP007-TPL-CUBOID-ITEM-COUNT",
    canonicalSolveMode: "findItemCountFromCuboidVolumeOrDimensions",
    target: "COUNT",
    title: "Count cubes, blocks or bricks fitting a cuboid",
    prototypeIds: ["MEN-CP007-PROT-CUBES-CUT-FROM-CUBOID", "MEN-CP007-W2-PROT-BRICK-COUNT-IN-WALL", "MEN-CP007-W3-PROT-MIXED-UNIT-BRICK-COUNT"],
    mergeRule: "Object name and common/mixed units are representations; answer remains a complete-item count.",
  },
  {
    qlId: "MEN-002-QL-039",
    templateId: "MEN-CP007-TPL-UNUSED-VOLUME-AFTER-CUTTING",
    canonicalSolveMode: "findUnusedVolumeAfterCuttingCubes",
    target: "VOLUME",
    title: "Unused volume after cutting complete cubes",
    prototypeIds: ["MEN-CP007-W1-PROT-CUT-CUBES-WITH-REMAINDER"],
    mergeRule: "Volume output is separate from complete-cube count.",
  },
  {
    qlId: "MEN-002-QL-040",
    templateId: "MEN-CP007-TPL-WASTE-PERCENT-AFTER-CUTTING",
    canonicalSolveMode: "findWastePercentageAfterCubeCutting",
    target: "PERCENT_CHANGE",
    title: "Waste percentage after cutting complete cubes",
    prototypeIds: ["MEN-CP007-W3-PROT-WASTE-PERCENT-AFTER-CUBE-CUTTING"],
    mergeRule: "Percentage answer semantic is separate from count and unused volume.",
  },
  {
    qlId: "MEN-002-QL-041",
    templateId: "MEN-CP007-TPL-STACKED-CUBE-RECONSTRUCTION",
    canonicalSolveMode: "findCuboidDimensionFromStackedCubes",
    target: "LENGTH",
    title: "Recover a cuboid dimension from stacked cubes",
    prototypeIds: ["MEN-CP007-W1-PROT-CUBOID-FROM-STACKED-CUBES"],
    mergeRule: "Arrangement-derived dimension recovery.",
  },
  {
    qlId: "MEN-002-QL-042",
    templateId: "MEN-CP007-TPL-MAXIMUM-ROTATED-BLOCK-PACKING",
    canonicalSolveMode: "findMaximumBlocksWithRotation",
    target: "COUNT",
    title: "Maximum block count when rotation is allowed",
    prototypeIds: ["MEN-CP007-W3-PROT-MAX-BLOCKS-WITH-ROTATION"],
    mergeRule: "Orientation enumeration is materially different from ordinary volume quotient counting.",
  },
  {
    qlId: "MEN-002-QL-043",
    templateId: "MEN-CP007-TPL-GRID-PLANE-CUT-COUNT",
    canonicalSolveMode: "findGridPlaneCutCount",
    target: "COUNT",
    title: "Internal grid-plane cuts for cuboid subdivision",
    prototypeIds: ["MEN-CP007-W3-PROT-GRID-PLANE-CUT-COUNT"],
    mergeRule: "Cut-plane answer semantic remains distinct from resulting piece count.",
  },
] as const;

export const MEN_CP_007_REASSIGNMENTS: readonly MenCp007Reassignment[] = [
  {
    prototypeId: "MEN-CP007-PROT-OPEN-TOP-BOX-AREA",
    targetCanonicalProblemId: "MEN-CP-011",
    reason: "Included/excluded faces are the decisive open-surface state.",
  },
  {
    prototypeId: "MEN-CP007-W1-PROT-INTERNAL-CAPACITY-WITH-THICKNESS",
    targetCanonicalProblemId: "MEN-CP-011",
    reason: "Wall and base thickness create an inner/outer solid transformation.",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-PAINTED-AREA-EXCLUDING-BASE",
    targetCanonicalProblemId: "MEN-CP-011",
    reason: "Excluded exposed surfaces determine the measured area.",
  },
  {
    prototypeId: "MEN-CP007-W3-PROT-L-SHAPED-PRISM-VOLUME",
    targetCanonicalProblemId: "MEN-CP-013",
    reason: "Composite base subtraction, not ordinary single-base prism extrusion, is decisive.",
  },
] as const;

export function getMenCp007FrozenQl(qlId: MenCp007PermanentQlId) {
  const definition = MEN_CP_007_FROZEN_QLS.find((item) => item.qlId === qlId);
  if (!definition) throw new Error(`Unknown MEN-CP-007 permanent QL: ${qlId}`);
  return definition;
}
