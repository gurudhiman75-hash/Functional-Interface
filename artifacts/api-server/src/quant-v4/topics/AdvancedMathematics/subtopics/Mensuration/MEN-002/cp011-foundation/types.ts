import type {
  ExactValue,
  Men002Difficulty,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp011PiPolicy = "EXACT_PI" | "PI_22_OVER_7";

export type MenCp011PrototypeId =
  | "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME"
  | "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS"
  | "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS"
  | "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME";

export type MenCp011SolveMode =
  | "findHollowCylinderMaterialVolumeFromRadii"
  | "findHollowCylinderMaterialVolumeFromDiameters"
  | "findPipeMaterialVolumeFromOuterRadiusAndThickness"
  | "findPipeInnerRadiusFromMaterialVolume";

export type MenCp011Representation =
  | "RADII"
  | "DIAMETERS"
  | "OUTER_RADIUS_AND_THICKNESS"
  | "INVERSE_INNER_RADIUS";

export type MenCp011Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_INVERSE_REASONING";

export interface MenCp011Definition {
  prototypeId: MenCp011PrototypeId;
  solveMode: MenCp011SolveMode;
  target: Extract<Men002Target, "VOLUME" | "LENGTH">;
  representation: MenCp011Representation;
  disposition: MenCp011Disposition;
}

export interface MenCp011SurfaceLedgerEntry {
  surfaceId: "OUTER_CURVED" | "INNER_CURVED" | "NEAR_ANNULAR_END" | "FAR_ANNULAR_END";
  shapeOwner: "OUTER_CYLINDER" | "INNER_VOID" | "MATERIAL_RING";
  kind: "CURVED" | "PLANE";
  location: "OUTER" | "INNER" | "CUT";
  status: "EXPOSED";
  contributionSign: 1;
  reason: string;
}

export interface MenCp011State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-FOUNDATION-WAVE-01";
  prototypeId: MenCp011PrototypeId;
  solveMode: MenCp011SolveMode;
  target: Extract<Men002Target, "VOLUME" | "LENGTH">;
  representation: MenCp011Representation;
  seed: string;
  difficulty: Men002Difficulty;
  piPolicy: MenCp011PiPolicy;
  unit: Extract<Men002Unit, "cm" | "cm³">;
  outerRadius: bigint;
  innerRadius: bigint;
  height: bigint;
  thickness: bigint;
  outerDiameter: bigint;
  innerDiameter: bigint;
  ringCoefficient: bigint;
  materialVolume: ExactValue;
  surfaceLedger: readonly MenCp011SurfaceLedgerEntry[];
}

export interface MenCp011Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp011Diagram {
  kind: "HOLLOW_CYLINDER";
  svg: string;
  accessibleText: string;
  visibleLabels: readonly string[];
  notToScale: true;
}

export interface MenCp011Explanation {
  keyRule: string;
  steps: Array<{ title: string; body: string; equation?: string }>;
  shortcut: string;
  traps: string[];
}

export interface MenCp011Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-011";
  permanentQlId: null;
  waveId: "MEN-CP-011-FOUNDATION-WAVE-01";
  prototypeId: MenCp011PrototypeId;
  solveMode: MenCp011SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Extract<Men002Target, "VOLUME" | "LENGTH">;
  piPolicy: MenCp011PiPolicy;
  stem: string;
  options: MenCp011Option[];
  correctIndex: number;
  answer: string;
  exactAnswer: ExactValue;
  unit: Extract<Men002Unit, "cm" | "cm³">;
  explanation: MenCp011Explanation;
  diagram: MenCp011Diagram;
  state: MenCp011State;
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
