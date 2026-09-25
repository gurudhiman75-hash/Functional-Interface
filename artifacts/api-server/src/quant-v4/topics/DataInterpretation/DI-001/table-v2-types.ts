import type { Di001ExamProfile } from "./types";

export type Di001V2Difficulty = "Easy" | "Medium" | "Hard";
export type Di001V2TaskKind =
  | "DIRECT_SELECTED"
  | "TOTAL_APPLICANTS"
  | "LARGEST_SELECTED"
  | "DIFFERENCE_SELECTED"
  | "PERCENTAGE_SELECTED"
  | "RATIO_APPLICANTS"
  | "AVERAGE_SELECTED"
  | "COMBINED_SELECTED"
  | "TOTAL_NOT_SELECTED"
  | "OVERALL_SELECTION_PERCENTAGE"
  | "SELECTED_TO_NOT_SELECTED_RATIO"
  | "SELECTION_RATE_DIFFERENCE";

export type Di001V2Option = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
export type Di001V2WorkingTable = Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }>;
export type Di001V2Explanation = Readonly<{ keyIdea: string; steps: readonly string[]; workingTable?: Di001V2WorkingTable }>;
export type Di001V2Row = Readonly<{ centre: string; applicants: number; selected: number }>;
export type Di001V2Stimulus = Readonly<{
  kind: "TABLE";
  title: string;
  instruction: string;
  columns: readonly ["Centre", "Applicants", "Selected"];
  rows: readonly Di001V2Row[];
  unit: "candidates";
}>;
export type Di001V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di001V2TaskKind;
  difficulty: Di001V2Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di001V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di001V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;
export type Di001V2Set = Readonly<{
  packageId: "DI-001";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di001ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "TABLE_MIXED_V2";
  stimulus: Di001V2Stimulus;
  questions: readonly Di001V2Question[];
  validation: Readonly<{ valid: boolean; checks: readonly Readonly<{ id: string; passed: boolean; message: string }>[] }>;
  traceability: Readonly<{
    packageId: "DI-001";
    representation: "TABLE";
    sourceFoundation: "DI-001-PHASE0-TABLE-STATE";
    setContractVersion: "DI-001-SET-CONTRACT-V2";
    arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligibility: "INELIGIBLE";
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  }>;
}>;
