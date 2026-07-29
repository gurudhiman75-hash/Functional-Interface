import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp007Wave01PrototypeId =
  | "MEN-CP007-W1-PROT-CUBE-LSA"
  | "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-TSA"
  | "MEN-CP007-W1-PROT-CUBE-FACE-DIAGONAL"
  | "MEN-CP007-W1-PROT-CUBE-SIDE-FROM-FACE-DIAGONAL"
  | "MEN-CP007-W1-PROT-CUBOID-LSA"
  | "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-LSA"
  | "MEN-CP007-W1-PROT-CUBOID-HEIGHT-FROM-TSA"
  | "MEN-CP007-W1-PROT-PRISM-LSA"
  | "MEN-CP007-W1-PROT-PRISM-TSA"
  | "MEN-CP007-W1-PROT-PRISM-HEIGHT-FROM-LSA"
  | "MEN-CP007-W1-PROT-HEXAGONAL-PRISM-VOLUME"
  | "MEN-CP007-W1-PROT-INTERNAL-CAPACITY-WITH-THICKNESS"
  | "MEN-CP007-W1-PROT-CUT-CUBES-WITH-REMAINDER"
  | "MEN-CP007-W1-PROT-CUBOID-FROM-STACKED-CUBES"
  | "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-VOLUME-RATIO"
  | "MEN-CP007-W1-PROT-CUBE-SIDE-RATIO-FROM-SURFACE-RATIO";

export type MenCp007Wave01SolveMode =
  | "findCubeLateralSurfaceArea"
  | "findCubeSideFromTotalSurfaceArea"
  | "findCubeFaceDiagonal"
  | "findCubeSideFromFaceDiagonal"
  | "findCuboidLateralSurfaceArea"
  | "findCuboidHeightFromLateralSurfaceArea"
  | "findCuboidHeightFromTotalSurfaceArea"
  | "findPrismLateralSurfaceArea"
  | "findPrismTotalSurfaceArea"
  | "findPrismHeightFromLateralSurfaceArea"
  | "findRegularHexagonalPrismVolume"
  | "findInternalCapacityFromExternalDimensionsAndThickness"
  | "findUnusedVolumeAfterCuttingCubes"
  | "findStackedCuboidHeightFromCubeArrangement"
  | "findCubeSideRatioFromVolumeRatio"
  | "findCubeSideRatioFromSurfaceAreaRatio";

export type MenCp007Wave01Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC"
  | "PROVISIONAL_REASSIGN_CP011";

export interface MenCp007Wave01Definition {
  prototypeId: MenCp007Wave01PrototypeId;
  solveMode: MenCp007Wave01SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  disposition: MenCp007Wave01Disposition;
}

export interface MenCp007Wave01State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-01";
  prototypeId: MenCp007Wave01PrototypeId;
  solveMode: MenCp007Wave01SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  seed: string;
  difficulty: Men002Difficulty;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  displayMode: "UNIT" | "RATIO";
}

export interface MenCp007Wave01Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007Wave01Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-GAP-WAVE-01";
  prototypeId: MenCp007Wave01PrototypeId;
  solveMode: MenCp007Wave01SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007Wave01Option[];
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
  state: MenCp007Wave01State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
