import type { ExactValue, Men002Difficulty, Men002Target, Men002Unit } from "../foundation/types";

export const MEN_CP_010_ID = "MEN-CP-010" as const;
export const MEN_CP_010_AUTHORITY = "MEN-CP010-FOUNDATION-WAVE-01-V1" as const;

export type MenCp010PiPolicy = "EXACT_PI" | "PI_22_OVER_7" | "PI_3_14";
export type MenCp010Shape =
  | "SQUARE_PYRAMID"
  | "RECTANGULAR_PYRAMID"
  | "TRIANGULAR_PYRAMID"
  | "CONICAL_FRUSTUM"
  | "SQUARE_PYRAMID_FRUSTUM";

export type MenCp010PrototypeId =
  | "MEN-CP010-PROT-SQUARE-PYRAMID-VOLUME"
  | "MEN-CP010-PROT-SQUARE-PYRAMID-HEIGHT-FROM-VOLUME"
  | "MEN-CP010-PROT-RECTANGULAR-PYRAMID-VOLUME"
  | "MEN-CP010-PROT-TRIANGULAR-PYRAMID-VOLUME"
  | "MEN-CP010-PROT-SQUARE-PYRAMID-SLANT-HEIGHT"
  | "MEN-CP010-PROT-SQUARE-PYRAMID-VERTICAL-HEIGHT"
  | "MEN-CP010-PROT-SQUARE-PYRAMID-LSA"
  | "MEN-CP010-PROT-SQUARE-PYRAMID-TSA"
  | "MEN-CP010-PROT-CONICAL-FRUSTUM-SLANT-HEIGHT"
  | "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME"
  | "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA"
  | "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA"
  | "MEN-CP010-PROT-SQUARE-FRUSTUM-SLANT-HEIGHT"
  | "MEN-CP010-PROT-SQUARE-FRUSTUM-VOLUME"
  | "MEN-CP010-PROT-SQUARE-FRUSTUM-LSA"
  | "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA";

export type MenCp010SolveMode =
  | "findSquarePyramidVolume"
  | "findSquarePyramidHeightFromVolume"
  | "findRectangularPyramidVolume"
  | "findTriangularPyramidVolumeFromBaseArea"
  | "findSquarePyramidSlantHeight"
  | "findSquarePyramidVerticalHeight"
  | "findSquarePyramidLateralSurfaceArea"
  | "findSquarePyramidTotalSurfaceArea"
  | "findConicalFrustumSlantHeight"
  | "findConicalFrustumVolume"
  | "findConicalFrustumCurvedSurfaceArea"
  | "findConicalFrustumTotalSurfaceArea"
  | "findSquareFrustumSlantHeight"
  | "findSquareFrustumVolume"
  | "findSquareFrustumLateralSurfaceArea"
  | "findSquareFrustumTotalSurfaceArea";

export interface MenCp010PrototypeDefinition {
  prototypeId: MenCp010PrototypeId;
  solveMode: MenCp010SolveMode;
  title: string;
  shape: MenCp010Shape;
  target: Men002Target;
  difficultyFloor: Men002Difficulty;
  usesPi: boolean;
  ownership: "MEN-CP-010";
  disposition: "PROVISIONALLY_RETAIN";
  permanentQlId: null;
  questionStudioDiscoverable: false;
  publiclyPublishable: false;
}

export interface MenCp010State {
  authority: typeof MEN_CP_010_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_010_ID;
  permanentQlId: null;
  prototypeId: MenCp010PrototypeId;
  solveMode: MenCp010SolveMode;
  seed: string;
  shape: MenCp010Shape;
  target: Men002Target;
  difficulty: Men002Difficulty;
  piPolicy: MenCp010PiPolicy | null;
  unit: Men002Unit;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  contextId: string;
}

export interface MenCp010Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp010Diagram {
  kind: "PYRAMID" | "CONICAL_FRUSTUM" | "SQUARE_FRUSTUM";
  viewBox: "0 0 520 300";
  alt: string;
  svg: string;
  responsive: true;
  minWidthPx: 0;
}

export interface MenCp010Question {
  authority: typeof MEN_CP_010_AUTHORITY;
  packageId: "MEN-002";
  canonicalProblemId: typeof MEN_CP_010_ID;
  permanentQlId: null;
  prototypeId: MenCp010PrototypeId;
  solveMode: MenCp010SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp010PiPolicy | null;
  stem: string;
  options: MenCp010Option[];
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
  diagram: MenCp010Diagram;
  state: MenCp010State;
  verification: {
    valid: boolean;
    method: string;
    reconstructed: string;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  maturity: "EXECUTABLE_DISCOVERY";
  allocationStatus: "NO_PERMANENT_QL";
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
