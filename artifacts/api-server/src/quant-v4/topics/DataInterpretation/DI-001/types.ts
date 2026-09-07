export type Di001ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";
export type Di001Difficulty = "Easy" | "Medium" | "Hard";
export type Di001QuestionKind =
  | "TOTAL"
  | "DIFFERENCE"
  | "PERCENTAGE"
  | "RATIO"
  | "AVERAGE";

export type Di001Option = Readonly<{
  text: string;
  misconceptionId: "CORRECT" | string;
  derivation: string;
}>;

export type Di001Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut?: string;
  trap: string;
}>;

export type Di001TableRow = Readonly<{
  branch: string;
  applicants: number;
  selected: number;
}>;

export type Di001Stimulus = Readonly<{
  kind: "TABLE";
  title: string;
  instruction: string;
  columns: readonly ["Branch", "Applicants", "Selected"];
  rows: readonly Di001TableRow[];
  unit: "candidates";
}>;

export type Di001Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di001QuestionKind;
  difficulty: Di001Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di001Option[];
  correctIndex: number;
  answer: string;
  explanation: Di001Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

export type Di001SetValidation = Readonly<{
  valid: boolean;
  checks: readonly Readonly<{
    id: string;
    passed: boolean;
    message: string;
  }>[];
}>;

export type Di001QuestionSet = Readonly<{
  packageId: "DI-001";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di001ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "FOUNDATIONAL_MIXED";
  stimulus: Di001Stimulus;
  questions: readonly Di001Question[];
  validation: Di001SetValidation;
  traceability: Readonly<{
    packageId: "DI-001";
    representation: "TABLE";
    setContractVersion: "DI-001-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
