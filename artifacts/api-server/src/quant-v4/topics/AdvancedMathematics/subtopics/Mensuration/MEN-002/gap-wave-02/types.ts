import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp007Wave02PrototypeId =
  | "MEN-CP007-W2-PROT-CUBOID-FACE-DIAGONAL"
  | "MEN-CP007-W2-PROT-CUBOID-BREADTH-FROM-FACE-DIAGONAL"
  | "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-VOLUME"
  | "MEN-CP007-W2-PROT-PRISM-BASE-PERIMETER-FROM-LSA"
  | "MEN-CP007-W2-PROT-PRISM-BASE-AREA-FROM-TSA"
  | "MEN-CP007-W2-PROT-TRAPEZOIDAL-PRISM-VOLUME"
  | "MEN-CP007-W2-PROT-MIXED-UNIT-CUBOID-VOLUME"
  | "MEN-CP007-W2-PROT-BRICK-COUNT-IN-WALL"
  | "MEN-CP007-W2-PROT-CUBOID-TOTAL-EDGE-LENGTH"
  | "MEN-CP007-W2-PROT-CUBE-SIDE-FROM-TOTAL-EDGE-LENGTH"
  | "MEN-CP007-W2-PROT-PAINTING-RATE-FROM-COST"
  | "MEN-CP007-W2-PROT-EQUAL-VOLUME-NEW-HEIGHT"
  | "MEN-CP007-W2-PROT-CUBE-SURFACE-RATIO-FROM-VOLUME-RATIO"
  | "MEN-CP007-W2-PROT-CUBE-VOLUME-RATIO-FROM-SURFACE-RATIO"
  | "MEN-CP007-W2-PROT-MATERIAL-COST-FROM-VOLUME";

export type MenCp007Wave02SolveMode =
  | "findCuboidFaceDiagonal"
  | "findCuboidBreadthFromFaceDiagonal"
  | "findPrismBaseAreaFromVolume"
  | "findPrismBasePerimeterFromLateralSurfaceArea"
  | "findPrismBaseAreaFromTotalSurfaceArea"
  | "findTrapezoidalPrismVolume"
  | "findCuboidVolumeFromMixedLinearUnits"
  | "findBrickCountInWall"
  | "findCuboidTotalEdgeLength"
  | "findCubeSideFromTotalEdgeLength"
  | "findPaintingRateFromCost"
  | "findNewHeightForEqualCuboidVolume"
  | "findCubeSurfaceAreaRatioFromVolumeRatio"
  | "findCubeVolumeRatioFromSurfaceAreaRatio"
  | "findMaterialCostFromCuboidVolume";

export type MenCp007Wave02Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC";

export interface MenCp007Wave02Definition {
  prototypeId: MenCp007Wave02PrototypeId;
  solveMode: MenCp007Wave02SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  disposition: MenCp007Wave02Disposition;
}

export interface MenCp007Wave02State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-02";
  prototypeId: MenCp007Wave02PrototypeId;
  solveMode: MenCp007Wave02SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  seed: string;
  difficulty: Men002Difficulty;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  displayMode: "UNIT" | "RATIO";
}

export interface MenCp007Wave02Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007Wave02Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-02";
  prototypeId: MenCp007Wave02PrototypeId;
  solveMode: MenCp007Wave02SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007Wave02Option[];
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
  state: MenCp007Wave02State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
