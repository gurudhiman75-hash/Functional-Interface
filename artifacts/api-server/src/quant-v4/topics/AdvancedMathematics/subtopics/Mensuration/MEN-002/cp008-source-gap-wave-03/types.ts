import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";
import type { MenCp008PiPolicy } from "../cp008-foundation/types";

export type MenCp008Wave03PrototypeId =
  | "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-VOLUME-CSA-RATIO"
  | "MEN-CP008-W3-PROT-CYLINDER-RADIUS-FROM-DIMENSION-RATIO-VOLUME"
  | "MEN-CP008-W3-PROT-CYLINDER-SURFACE-COST"
  | "MEN-CP008-W3-PROT-CONE-CSA-FROM-VOLUME-HEIGHT"
  | "MEN-CP008-W3-PROT-CONE-SLANT-FROM-VOLUME-HEIGHT"
  | "MEN-CP008-W3-PROT-CONE-HEIGHT-RATIO-FROM-VOLUME-RADIUS-RATIOS"
  | "MEN-CP008-W3-PROT-CONE-CSA-RATIO-FROM-RADIUS-SLANT-RATIOS"
  | "MEN-CP008-W3-PROT-CYLINDER-CONE-TSA-RATIO-EQUAL-BASE-HEIGHT"
  | "MEN-CP008-W3-PROT-CONE-TENT-CLOTH-LENGTH"
  | "MEN-CP008-W3-PROT-CONE-TENT-HEIGHT-FROM-FLOOR-AIR";

export type MenCp008Wave03SolveMode =
  | "findCylinderRadiusFromVolumeToCurvedAreaRatio"
  | "findCylinderRadiusFromRadiusHeightRatioAndVolume"
  | "findCylinderSurfaceCost"
  | "findConeCurvedSurfaceAreaFromVolumeAndHeight"
  | "findConeSlantHeightFromVolumeAndHeight"
  | "findConeHeightRatioFromVolumeAndRadiusRatios"
  | "findConeCurvedAreaRatioFromRadiusAndSlantRatios"
  | "findCylinderConeTotalSurfaceAreaRatioForEqualBaseHeight"
  | "findConicalTentClothLength"
  | "findConicalTentHeightFromFloorAreaAndAir";

export type MenCp008Wave03Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION"
  | "PROVISIONAL_SPLIT_BY_ANSWER_SEMANTIC";

export interface MenCp008Wave03Definition {
  prototypeId: MenCp008Wave03PrototypeId;
  solveMode: MenCp008Wave03SolveMode;
  target: Men002Target;
  shape: Extract<Men002Shape, "CYLINDER" | "CONE">;
  disposition: MenCp008Wave03Disposition;
}

export interface MenCp008Wave03State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-SOURCE-GAP-WAVE-03";
  prototypeId: MenCp008Wave03PrototypeId;
  solveMode: MenCp008Wave03SolveMode;
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

export interface MenCp008Wave03Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008Wave03Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-008";
  permanentQlId: null;
  waveId: "MEN-CP-008-SOURCE-GAP-WAVE-03";
  prototypeId: MenCp008Wave03PrototypeId;
  solveMode: MenCp008Wave03SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  piPolicy: MenCp008PiPolicy;
  stem: string;
  options: MenCp008Wave03Option[];
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
  state: MenCp008Wave03State;
  verification: { valid: boolean; method: string; reconstructed: string };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
