import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp008PiPolicy = "EXACT_PI" | "PI_22_OVER_7" | "PI_3_14";

export type MenCp008PrototypeId =
  | "MEN-CP008-PROT-CYLINDER-VOLUME"
  | "MEN-CP008-PROT-CYLINDER-CSA"
  | "MEN-CP008-PROT-CYLINDER-TSA"
  | "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-VOLUME"
  | "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-VOLUME"
  | "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-CSA"
  | "MEN-CP008-PROT-CYLINDER-HEIGHT-FROM-CSA"
  | "MEN-CP008-PROT-CYLINDER-RADIUS-FROM-TSA"
  | "MEN-CP008-PROT-CYLINDER-CAPACITY-22-OVER-7"
  | "MEN-CP008-PROT-ROLLER-REVOLUTIONS"
  | "MEN-CP008-PROT-CONE-VOLUME"
  | "MEN-CP008-PROT-CONE-CSA"
  | "MEN-CP008-PROT-CONE-TSA"
  | "MEN-CP008-PROT-CONE-SLANT-HEIGHT"
  | "MEN-CP008-PROT-CONE-HEIGHT-FROM-SLANT"
  | "MEN-CP008-PROT-CONE-RADIUS-FROM-SLANT"
  | "MEN-CP008-PROT-CONE-HEIGHT-FROM-VOLUME"
  | "MEN-CP008-PROT-CONE-RADIUS-FROM-VOLUME"
  | "MEN-CP008-PROT-CONE-CANVAS-COST"
  | "MEN-CP008-PROT-CYLINDER-CONE-VOLUME-RATIO";

export type MenCp008SolveMode =
  | "findCylinderVolume"
  | "findCylinderCurvedSurfaceArea"
  | "findCylinderTotalSurfaceArea"
  | "findCylinderRadiusFromVolume"
  | "findCylinderHeightFromVolume"
  | "findCylinderRadiusFromCurvedSurfaceArea"
  | "findCylinderHeightFromCurvedSurfaceArea"
  | "findCylinderRadiusFromTotalSurfaceArea"
  | "findCylinderCapacityWithTwentyTwoOverSeven"
  | "findRollerRevolutionsFromSweptArea"
  | "findConeVolume"
  | "findConeCurvedSurfaceArea"
  | "findConeTotalSurfaceArea"
  | "findConeSlantHeight"
  | "findConeHeightFromSlantHeight"
  | "findConeRadiusFromSlantHeight"
  | "findConeHeightFromVolume"
  | "findConeRadiusFromVolume"
  | "findConeCanvasCost"
  | "findCylinderConeVolumeRatio";

export type MenCp008Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC";

export interface MenCp008Definition {
  prototypeId: MenCp008PrototypeId;
  solveMode: MenCp008SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  disposition: MenCp008Disposition;
}

export interface MenCp008State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  prototypeId: MenCp008PrototypeId;
  solveMode: MenCp008SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  seed: string;
  difficulty: Men002Difficulty;
  piPolicy: MenCp008PiPolicy;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  displayMode: "UNIT" | "RATIO";
}

export interface MenCp008Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  prototypeId: MenCp008PrototypeId;
  solveMode: MenCp008SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp008PiPolicy;
  stem: string;
  options: MenCp008Option[];
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
  state: MenCp008State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
