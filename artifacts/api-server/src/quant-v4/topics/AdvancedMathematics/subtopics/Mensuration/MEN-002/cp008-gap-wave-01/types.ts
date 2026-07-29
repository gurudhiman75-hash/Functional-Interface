import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";
import type { MenCp008PiPolicy } from "../cp008-foundation/types";

export type MenCp008Wave01PrototypeId =
  | "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-TSA"
  | "MEN-CP008-W1-PROT-CYLINDER-CSA-TSA-RATIO"
  | "MEN-CP008-W1-PROT-CYLINDER-RADIUS-FROM-AREA-RATIO"
  | "MEN-CP008-W1-PROT-CYLINDER-HEIGHT-FROM-AREA-RATIO"
  | "MEN-CP008-W1-PROT-CYLINDER-VOLUME-PERCENT-CHANGE"
  | "MEN-CP008-W1-PROT-ROLLER-LENGTH-FROM-SWEPT-AREA"
  | "MEN-CP008-W1-PROT-ROLLER-RADIUS-FROM-SWEPT-AREA"
  | "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-CSA"
  | "MEN-CP008-W1-PROT-CONE-SLANT-FROM-CSA"
  | "MEN-CP008-W1-PROT-CONE-SLANT-FROM-TSA"
  | "MEN-CP008-W1-PROT-CONE-RADIUS-FROM-TSA"
  | "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-RADIUS-SLANT"
  | "MEN-CP008-W1-PROT-CONE-VOLUME-FROM-HEIGHT-SLANT"
  | "MEN-CP008-W1-PROT-CONE-CSA-TSA-RATIO"
  | "MEN-CP008-W1-PROT-EQUAL-VOLUME-CONE-HEIGHT"
  | "MEN-CP008-W1-PROT-CONE-VOLUME-PERCENT-CHANGE";

export type MenCp008Wave01SolveMode =
  | "findCylinderHeightFromTotalSurfaceArea"
  | "findCylinderCurvedToTotalSurfaceRatio"
  | "findCylinderRadiusFromSurfaceRatioAndHeight"
  | "findCylinderHeightFromSurfaceRatioAndRadius"
  | "findCylinderVolumePercentageChange"
  | "findRollerLengthFromSweptArea"
  | "findRollerRadiusFromSweptArea"
  | "findConeRadiusFromCurvedSurfaceArea"
  | "findConeSlantHeightFromCurvedSurfaceArea"
  | "findConeSlantHeightFromTotalSurfaceArea"
  | "findConeRadiusFromTotalSurfaceArea"
  | "findConeVolumeFromRadiusAndSlantHeight"
  | "findConeVolumeFromHeightAndSlantHeight"
  | "findConeCurvedToTotalSurfaceRatio"
  | "findConeHeightForEqualCylinderVolume"
  | "findConeVolumePercentageChange";

export type MenCp008Wave01Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC";

export interface MenCp008Wave01Definition {
  prototypeId: MenCp008Wave01PrototypeId;
  solveMode: MenCp008Wave01SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  disposition: MenCp008Wave01Disposition;
}

export interface MenCp008Wave01State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-GAP-WAVE-01";
  prototypeId: MenCp008Wave01PrototypeId;
  solveMode: MenCp008Wave01SolveMode;
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

export interface MenCp008Wave01Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008Wave01Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-GAP-WAVE-01";
  prototypeId: MenCp008Wave01PrototypeId;
  solveMode: MenCp008Wave01SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp008PiPolicy;
  stem: string;
  options: MenCp008Wave01Option[];
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
  state: MenCp008Wave01State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
