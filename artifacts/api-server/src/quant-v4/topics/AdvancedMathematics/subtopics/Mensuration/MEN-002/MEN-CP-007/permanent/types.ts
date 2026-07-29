import type {
  ExactValue,
  Men002Difficulty,
  Men002Target,
  Men002Unit,
} from "../../foundation/types";
import type {
  MenCp007AnyPrototypeId,
  MenCp007PermanentQlId,
} from "../final-freeze/registry";

export interface MenCp007PermanentOption {
  label: "A" | "B" | "C" | "D";
  value: ExactValue;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp007PermanentPackage {
  packageId: "MEN-002";
  canonicalProblemId: "MEN-CP-007";
  qlId: MenCp007PermanentQlId;
  templateId: string;
  canonicalSolveMode: string;
  sourcePrototypeId: MenCp007AnyPrototypeId;
  sourceSolveMode: string;
  sourceWaveId:
    | "MEN-CP-007-PROTOTYPE-FOUNDATION"
    | "MEN-CP-007-GAP-WAVE-01"
    | "MEN-CP-007-GAP-WAVE-02"
    | "MEN-CP-007-GAP-WAVE-03"
    | "MEN-CP-007-SOURCE-GAP-WAVE-04";
  language: "en";
  seed: string;
  sourceSeed: string;
  difficulty: Men002Difficulty;
  target: Men002Target;
  stem: string;
  options: MenCp007PermanentOption[];
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
  sourceState: {
    prototypeId: MenCp007AnyPrototypeId;
    solveMode: string;
    seed: string;
    difficulty: Men002Difficulty;
    dimensions: Record<string, bigint>;
    derived: Record<string, ExactValue>;
    unit: Men002Unit;
  };
  verification: {
    valid: boolean;
    method: string;
    reconstructed: string;
  };
  sourceValidation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  reviewStatus: "UNREVIEWED_PERMANENT_ENGLISH";
  questionBankStatus: "NOT_STORED";
  questionBankWritable: false;
  testEligibility: "INELIGIBLE";
  testEligible: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}
