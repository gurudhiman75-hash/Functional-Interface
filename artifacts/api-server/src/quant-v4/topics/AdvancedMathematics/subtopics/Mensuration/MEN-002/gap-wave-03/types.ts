import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp007Wave03PrototypeId =
  | "MEN-CP007-W3-PROT-CUBOID-HEIGHT-FROM-SPACE-DIAGONAL"
  | "MEN-CP007-W3-PROT-BASE-LONGER-SIDE-FROM-AREA-PERIMETER"
  | "MEN-CP007-W3-PROT-CUBOID-LENGTH-FROM-VOLUME-RATIO"
  | "MEN-CP007-W3-PROT-CUBE-SIDE-FROM-TSA-LSA-DIFFERENCE"
  | "MEN-CP007-W3-PROT-CUBE-SIDE-EQUAL-CUBOID-VOLUME"
  | "MEN-CP007-W3-PROT-CUBE-CUBOID-VOLUME-DIFFERENCE"
  | "MEN-CP007-W3-PROT-MAX-BLOCKS-WITH-ROTATION"
  | "MEN-CP007-W3-PROT-WASTE-PERCENT-AFTER-CUBE-CUTTING"
  | "MEN-CP007-W3-PROT-GRID-PLANE-CUT-COUNT"
  | "MEN-CP007-W3-PROT-CUBOID-WIRE-FRAME-COST"
  | "MEN-CP007-W3-PROT-CUBE-WIRE-RATE-FROM-COST"
  | "MEN-CP007-W3-PROT-PAINTED-AREA-EXCLUDING-BASE"
  | "MEN-CP007-W3-PROT-PRISM-PERIMETER-FROM-TSA-BASE-AREA"
  | "MEN-CP007-W3-PROT-L-SHAPED-PRISM-VOLUME"
  | "MEN-CP007-W3-PROT-MIXED-UNIT-BRICK-COUNT";

export type MenCp007Wave03SolveMode =
  | "findCuboidHeightFromSpaceDiagonal"
  | "findLongerBaseSideFromAreaAndPerimeter"
  | "findCuboidLengthFromVolumeAndBaseRatio"
  | "findCubeSideFromTsaLsaDifference"
  | "findCubeSideEqualToCuboidVolume"
  | "findVolumeDifferenceBetweenCubeAndCuboid"
  | "findMaximumBlocksWithRotation"
  | "findWastePercentageAfterCubeCutting"
  | "findGridPlaneCutCount"
  | "findCuboidWireFrameCost"
  | "findCubeWireRateFromCost"
  | "findPaintedAreaExcludingBase"
  | "findPrismBasePerimeterFromTsaAndBaseArea"
  | "findLShapedPrismVolume"
  | "findBrickCountFromMixedUnits";

export type MenCp007Wave03Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC"
  | "PROVISIONAL_REASSIGN_CP011"
  | "PROVISIONAL_REASSIGN_CP013";

export interface MenCp007Wave03Definition {
  prototypeId: MenCp007Wave03PrototypeId;
  solveMode: MenCp007Wave03SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  disposition: MenCp007Wave03Disposition;
}

export interface MenCp007Wave03State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-03";
  prototypeId: MenCp007Wave03PrototypeId;
  solveMode: MenCp007Wave03SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  seed: string;
  difficulty: Men002Difficulty;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  displayMode: "UNIT" | "RATIO";
}

export interface MenCp007Wave03Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007Wave03Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-03";
  prototypeId: MenCp007Wave03PrototypeId;
  solveMode: MenCp007Wave03SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007Wave03Option[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Men002Unit;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string; equation?: string }>;
    shortcut: string;
    traps: string[];
  };
  state: MenCp007Wave03State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
