import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";
import type { MenCp008PiPolicy } from "../cp008-foundation/types";

export type MenCp008Wave04PrototypeId =
  | "MEN-CP008-W4-PROT-CONE-SIMILAR-HEIGHT-VOLUME-FRACTION"
  | "MEN-CP008-W4-PROT-CONE-SEMICIRCLE-SECTOR-HEIGHT"
  | "MEN-CP008-W4-PROT-CYLINDER-RECTANGLE-ROLLING-VOLUME-RATIO"
  | "MEN-CP008-W4-PROT-CYLINDER-MINIMUM-TSA-HEIGHT";

export type MenCp008Wave04SolveMode =
  | "findSimilarConeVolumeFractionFromHeightFraction"
  | "findConeHeightFromSemicircularSector"
  | "findCylinderRollingOrientationVolumeRatio"
  | "findMinimumSurfaceCylinderHeightFromVolume";

export type MenCp008Wave04Disposition = "PROVISIONALLY_RETAIN";

export interface MenCp008Wave04Definition {
  prototypeId: MenCp008Wave04PrototypeId;
  solveMode: MenCp008Wave04SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  disposition: MenCp008Wave04Disposition;
}

export interface MenCp008Wave04State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-SOURCE-GAP-WAVE-04";
  prototypeId: MenCp008Wave04PrototypeId;
  solveMode: MenCp008Wave04SolveMode;
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

export interface MenCp008Wave04Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008Wave04Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-SOURCE-GAP-WAVE-04";
  prototypeId: MenCp008Wave04PrototypeId;
  solveMode: MenCp008Wave04SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp008PiPolicy;
  stem: string;
  options: MenCp008Wave04Option[];
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
  state: MenCp008Wave04State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
