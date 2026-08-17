import type { ExactRational } from "../foundation/types";

export const MEN_CP_012_ID = "MEN-CP-012" as const;
export const MEN_CP_012_FOUNDATION_AUTHORITY = "MEN-CP012-FOUNDATION-WAVE-01-V1" as const;

export type MenCp012PrototypeId =
  | "MEN-CP012-PROT-SPHERE-TO-SMALL-SPHERES-COUNT"
  | "MEN-CP012-PROT-CYLINDER-TO-SPHERES-COUNT"
  | "MEN-CP012-PROT-CUBE-TO-SMALL-CUBES-COUNT"
  | "MEN-CP012-PROT-CYLINDER-TO-CONE-HEIGHT"
  | "MEN-CP012-PROT-CONE-TO-CYLINDER-HEIGHT"
  | "MEN-CP012-PROT-CUBOID-TO-CUBE-SIDE"
  | "MEN-CP012-PROT-SPHERE-TO-CYLINDER-HEIGHT"
  | "MEN-CP012-PROT-CYLINDER-TO-WIRE-LENGTH"
  | "MEN-CP012-PROT-ROD-TO-WIRE-METRE-CONVERSION"
  | "MEN-CP012-PROT-TWO-SPHERES-TO-CYLINDER-HEIGHT"
  | "MEN-CP012-PROT-CUBE-WASTAGE-TO-SMALL-CUBES"
  | "MEN-CP012-PROT-WASTAGE-INVERSE-CYLINDER-HEIGHT"
  | "MEN-CP012-PROT-HOLLOW-CYLINDER-TO-SOLID-CYLINDER"
  | "MEN-CP012-PROT-SLAB-TO-THIN-SHEET-LENGTH"
  | "MEN-CP012-PROT-CUBIC-METRE-TO-CM-CUBES"
  | "MEN-CP012-PROT-MANY-CONES-TO-ONE-CYLINDER";

export type MenCp012SolveMode =
  | "findSmallSphereCountByVolumeConservation"
  | "findSphereCountFromCylinder"
  | "findSmallCubeCountAfterRecasting"
  | "findConeHeightAfterRecastingCylinder"
  | "findCylinderHeightAfterRecastingCone"
  | "findCubeSideAfterRecastingCuboid"
  | "findCylinderHeightAfterRecastingSphere"
  | "findWireLengthByAreaLengthConservation"
  | "findWireLengthWithCmToMConversion"
  | "findCylinderHeightFromCombinedSpheres"
  | "findSmallCubeCountAfterMaterialLoss"
  | "findSourceCylinderHeightWithMaterialLoss"
  | "findSolidCylinderCountFromHollowCylinderMaterial"
  | "findSheetLengthAfterThicknessChange"
  | "findCmCubeCountFromCubicMetreBlock"
  | "findCylinderHeightFromManyCones";

export type MenCp012Target = "COUNT" | "LENGTH";
export type MenCp012Difficulty = "Easy" | "Medium" | "Hard";
export type MenCp012AnswerUnit = "spheres" | "cubes" | "cylinders" | "cm" | "m";

export interface MenCp012PrototypeDefinition {
  prototypeId: MenCp012PrototypeId;
  solveMode: MenCp012SolveMode;
  target: MenCp012Target;
  difficulty: MenCp012Difficulty;
  reasoningCluster:
    | "ONE_TO_MANY_COUNT"
    | "ONE_TO_ONE_INVERSE"
    | "WIRE_SHEET_DRAWING"
    | "COMBINED_SOURCE_SOLIDS"
    | "WASTAGE_CONSERVATION"
    | "HOLLOW_TO_SOLID_CONSERVATION"
    | "UNIT_CONVERSION";
  provisionalDisposition: "PROVISIONALLY_RETAIN" | "PROVISIONAL_MERGE_AS_REPRESENTATION";
}

export interface MenCp012CanonicalState {
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_012_ID;
  permanentQlId: null;
  prototypeId: MenCp012PrototypeId;
  solveMode: MenCp012SolveMode;
  seed: string;
  target: MenCp012Target;
  difficulty: MenCp012Difficulty;
  dimensions: Record<string, bigint>;
  lossPercent: ExactRational;
  exactAnswer: ExactRational;
  answerUnit: MenCp012AnswerUnit;
  conservationStatement: string;
  contextId: string;
}

export interface MenCp012Option {
  label: "A" | "B" | "C" | "D";
  value: ExactRational;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp012Explanation {
  keyRule: string;
  steps: Array<{ title: string; body: string }>;
  shortcut: string;
  traps: string[];
}

export interface MenCp012QuestionPackage {
  authority: typeof MEN_CP_012_FOUNDATION_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_012_ID;
  permanentQlId: null;
  prototypeId: MenCp012PrototypeId;
  solveMode: MenCp012SolveMode;
  language: "en";
  seed: string;
  difficulty: MenCp012Difficulty;
  target: MenCp012Target;
  stem: string;
  options: MenCp012Option[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactRational;
  answerUnit: MenCp012AnswerUnit;
  explanation: MenCp012Explanation;
  state: MenCp012CanonicalState;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
