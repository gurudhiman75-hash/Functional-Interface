import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";
import type { MenCp008PiPolicy } from "../cp008-foundation/types";

export type MenCp008Wave02PrototypeId =
  | "MEN-CP008-W2-PROT-CYLINDER-CAPACITY-PI-3-14"
  | "MEN-CP008-W2-PROT-CYLINDER-RADIUS-SURD-FROM-VOLUME"
  | "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-RADIUS"
  | "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-TSA-RADIUS"
  | "MEN-CP008-W2-PROT-CYLINDER-RADIUS-FROM-TSA-CSA-DIFFERENCE"
  | "MEN-CP008-W2-PROT-CYLINDER-VOLUME-FROM-CSA-TSA"
  | "MEN-CP008-W2-PROT-CYLINDER-VOLUME-RATIO-DIMENSION-RATIOS"
  | "MEN-CP008-W2-PROT-ROLLER-SWEPT-AREA"
  | "MEN-CP008-W2-PROT-CONE-SLANT-HEIGHT-SURD"
  | "MEN-CP008-W2-PROT-CONE-CSA-PI-SURD"
  | "MEN-CP008-W2-PROT-CONE-RADIUS-SURD-FROM-VOLUME"
  | "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-CSA-RADIUS"
  | "MEN-CP008-W2-PROT-CONE-VOLUME-FROM-TSA-RADIUS"
  | "MEN-CP008-W2-PROT-CONE-HEIGHT-FROM-CSA-TSA"
  | "MEN-CP008-W2-PROT-CONE-VOLUME-RATIO-DIMENSION-RATIOS"
  | "MEN-CP008-W2-PROT-EQUAL-VOLUME-CYLINDER-HEIGHT";

export type MenCp008Wave02SolveMode =
  | "findCylinderCapacityWithThreePointFourteen"
  | "findCylinderSurdRadiusFromVolume"
  | "findCylinderVolumeFromCurvedSurfaceAreaAndRadius"
  | "findCylinderVolumeFromTotalSurfaceAreaAndRadius"
  | "findCylinderRadiusFromTotalMinusCurvedSurfaceArea"
  | "findCylinderVolumeFromCurvedAndTotalSurfaceAreas"
  | "findCylinderVolumeRatioFromDimensionRatios"
  | "findRollerSweptArea"
  | "findConeSurdSlantHeight"
  | "findConePiSurdCurvedSurfaceArea"
  | "findConeSurdRadiusFromVolume"
  | "findConeVolumeFromCurvedSurfaceAreaAndRadius"
  | "findConeVolumeFromTotalSurfaceAreaAndRadius"
  | "findConeHeightFromCurvedAndTotalSurfaceAreas"
  | "findConeVolumeRatioFromDimensionRatios"
  | "findCylinderHeightForEqualConeVolume";

export type MenCp008Wave02Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_PARAMETER"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC";

export interface MenCp008Wave02Definition {
  prototypeId: MenCp008Wave02PrototypeId;
  solveMode: MenCp008Wave02SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  disposition: MenCp008Wave02Disposition;
}

export interface MenCp008Wave02State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-GAP-WAVE-02";
  prototypeId: MenCp008Wave02PrototypeId;
  solveMode: MenCp008Wave02SolveMode;
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

export interface MenCp008Wave02Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008Wave02Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-GAP-WAVE-02";
  prototypeId: MenCp008Wave02PrototypeId;
  solveMode: MenCp008Wave02SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp008PiPolicy;
  stem: string;
  options: MenCp008Wave02Option[];
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
  state: MenCp008Wave02State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
