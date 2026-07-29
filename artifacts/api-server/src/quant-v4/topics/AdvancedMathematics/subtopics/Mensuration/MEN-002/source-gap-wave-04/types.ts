import type {
  ExactValue,
  Men002Difficulty,
  Men002Shape,
  Men002Target,
  Men002Unit,
} from "../foundation/types";

export type MenCp007Wave04PrototypeId =
  | "MEN-CP007-W4-PROT-CUBOID-VOLUME-FROM-ADJACENT-FACE-AREAS"
  | "MEN-CP007-W4-PROT-CUBOID-LENGTH-FROM-ADJACENT-FACE-AREAS"
  | "MEN-CP007-W4-PROT-SHORTEST-SIDE-FROM-FACE-AREA-RATIO-VOLUME";

export type MenCp007Wave04SolveMode =
  | "findCuboidVolumeFromAdjacentFaceAreas"
  | "findCuboidLengthFromAdjacentFaceAreas"
  | "findShortestCuboidSideFromFaceAreaRatioAndVolume";

export type MenCp007Wave04Disposition =
  | "PROVISIONALLY_RETAIN"
  | "PROVISIONAL_MERGE_AS_REPRESENTATION";

export interface MenCp007Wave04Definition {
  prototypeId: MenCp007Wave04PrototypeId;
  solveMode: MenCp007Wave04SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  disposition: MenCp007Wave04Disposition;
  sourceEvidence: readonly string[];
}

export interface MenCp007Wave04State {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-SOURCE-GAP-WAVE-04";
  prototypeId: MenCp007Wave04PrototypeId;
  solveMode: MenCp007Wave04SolveMode;
  target: Men002Target;
  shape: Men002Shape;
  seed: string;
  difficulty: Men002Difficulty;
  dimensions: Record<string, bigint>;
  derived: Record<string, ExactValue>;
  unit: Men002Unit;
  displayMode: "UNIT";
}

export interface MenCp007Wave04Option {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007Wave04Package {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  permanentQlId: null;
  waveId: "MEN-CP-007-SOURCE-GAP-WAVE-04";
  prototypeId: MenCp007Wave04PrototypeId;
  solveMode: MenCp007Wave04SolveMode;
  language: "en";
  seed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007Wave04Option[];
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
  state: MenCp007Wave04State;
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
