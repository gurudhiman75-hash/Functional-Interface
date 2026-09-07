export type Di002ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di002TaskKind =
  | "MISSING_REVERSE_PERCENTAGE"
  | "PERCENT_CHANGE_SELECTED"
  | "SHARE_OF_TOTAL_SELECTED"
  | "COMBINED_SELECTED_RATIO"
  | "RELATIVE_SELECTION_RATE_CHANGE";

export type Di002Difficulty = "Medium" | "Hard";

export type Di002Row = Readonly<{
  branch: string;
  applicants: number | "?";
  selected: number;
  selectionPercent: number;
}>;

export type Di002Stimulus = Readonly<{
  kind: "TABLE";
  title: string;
  instruction: string;
  columns: readonly ["Branch", "Applicants", "Selected", "Selection %"];
  rows: readonly Di002Row[];
  hiddenApplicantIndex: number;
  unit: "candidates";
}>;

export type Di002Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di002Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di002Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di002TaskKind;
  difficulty: Di002Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di002Option[];
  correctIndex: number;
  answer: string;
  explanation: Di002Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di002ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di002QuestionSet = Readonly<{
  packageId: "DI-002";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di002ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "ADVANCED_TABLE_MIXED";
  stimulus: Di002Stimulus;
  questions: readonly Di002Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di002ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-002";
    representation: "TABLE";
    parentFoundation: "DI-001";
    setContractVersion: "DI-002-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
