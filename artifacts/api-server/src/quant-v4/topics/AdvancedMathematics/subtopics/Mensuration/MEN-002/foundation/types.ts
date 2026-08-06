export const MEN_002_PACKAGE_ID = "MEN-002" as const;
export const MEN_CP_007_ID = "MEN-CP-007" as const;

export type Men002Difficulty = "Easy" | "Medium" | "Hard";
export type Men002Shape = "CUBE" | "CUBOID" | "RIGHT_PRISM" | "CYLINDER" | "CONE";
export type Men002Target =
  | "VOLUME"
  | "CAPACITY"
  | "SURFACE_AREA"
  | "LATERAL_SURFACE_AREA"
  | "TOTAL_SURFACE_AREA"
  | "LENGTH"
  | "DIAGONAL"
  | "COUNT"
  | "COST"
  | "RATE"
  | "PERCENT_CHANGE"
  | "RATIO";

export type Men002Unit =
  | "cm"
  | "m"
  | "cm²"
  | "m²"
  | "cm³"
  | "m³"
  | "litres"
  | "cubes"
  | "blocks"
  | "bricks"
  | "cuts"
  | "revolutions"
  | "%"
  | "₹"
  | "₹/m"
  | "₹/m²"
  | "₹/m³"
  | "times";

export type ExactRational = {
  kind: "RATIONAL";
  numerator: bigint;
  denominator: bigint;
};

export type ExactSurd = {
  kind: "SURD";
  coefficient: ExactRational;
  radicand: bigint;
};

export type ExactPi = {
  kind: "PI";
  coefficient: ExactRational;
};

export type ExactPiSurd = {
  kind: "PI_SURD";
  coefficient: ExactRational;
  radicand: bigint;
};

export type ExactValue = ExactRational | ExactSurd | ExactPi | ExactPiSurd;

export type MenCp007PrototypeId =
  | "MEN-CP007-PROT-CUBE-VOLUME"
  | "MEN-CP007-PROT-CUBE-TSA"
  | "MEN-CP007-PROT-CUBE-SIDE-FROM-VOLUME"
  | "MEN-CP007-PROT-CUBE-SPACE-DIAGONAL"
  | "MEN-CP007-PROT-CUBE-SIDE-FROM-SPACE-DIAGONAL"
  | "MEN-CP007-PROT-CUBOID-VOLUME"
  | "MEN-CP007-PROT-CUBOID-TSA"
  | "MEN-CP007-PROT-CUBOID-HEIGHT-FROM-VOLUME"
  | "MEN-CP007-PROT-CUBOID-SPACE-DIAGONAL"
  | "MEN-CP007-PROT-LONGEST-ROD-CUBOID"
  | "MEN-CP007-PROT-TRIANGULAR-PRISM-VOLUME"
  | "MEN-CP007-PROT-PRISM-HEIGHT-FROM-VOLUME"
  | "MEN-CP007-PROT-CUBES-CUT-FROM-CUBOID"
  | "MEN-CP007-PROT-OPEN-TOP-BOX-AREA"
  | "MEN-CP007-PROT-CUBE-VOLUME-SCALING"
  | "MEN-CP007-PROT-CUBOID-VOLUME-PERCENT-CHANGE"
  | "MEN-CP007-PROT-CUBIC-CM-TO-LITRES"
  | "MEN-CP007-PROT-CUBOID-PAINTING-COST";

export type MenCp007SolveMode =
  | "findCubeVolume"
  | "findCubeTotalSurfaceArea"
  | "findCubeSideFromVolume"
  | "findCubeSpaceDiagonal"
  | "findCubeSideFromSpaceDiagonal"
  | "findCuboidVolume"
  | "findCuboidTotalSurfaceArea"
  | "findCuboidHeightFromVolume"
  | "findCuboidSpaceDiagonal"
  | "findLongestRodInCuboid"
  | "findTriangularPrismVolume"
  | "findPrismHeightFromVolumeAndBaseArea"
  | "findSmallCubeCountFromCuboid"
  | "findOpenTopCuboidSheetArea"
  | "findCubeVolumeScaleRatio"
  | "findCuboidVolumePercentageChange"
  | "convertCubicCentimetresToLitres"
  | "findCuboidPaintingCost";

export interface MenCp007PrototypeDefinition {
  prototypeId: MenCp007PrototypeId;
  solveMode: MenCp007SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  provisionalDisposition:
    | "PROVISIONALLY_RETAIN"
    | "PROVISIONAL_MERGE_AS_PRESENTATION"
    | "PROVISIONAL_MERGE_AS_REPRESENTATION";
  legacyTrace?: string;
}

export interface MenCp007CanonicalState {
  packageId: typeof MEN_002_PACKAGE_ID;
  canonicalProblemId: typeof MEN_CP_007_ID;
  permanentQlId: null;
  prototypeId: MenCp007PrototypeId;
  solveMode: MenCp007SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  seed: string;
  difficulty: Men002Difficulty;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  contextId: string;
}

export interface MenCp007Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007Explanation {
  keyRule: string;
  steps: Array<{ title: string; body: string; equation?: string }>;
  shortcut: string;
  traps: string[];
}

export interface MenCp007QuestionPackage {
  packageId: typeof MEN_002_PACKAGE_ID;
  canonicalProblemId: typeof MEN_CP_007_ID;
  permanentQlId: null;
  prototypeId: MenCp007PrototypeId;
  solveMode: MenCp007SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007Option[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Men002Unit;
  explanation: MenCp007Explanation;
  state: MenCp007CanonicalState;
  verification: {
    valid: boolean;
    method: string;
    reconstructed: string;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
