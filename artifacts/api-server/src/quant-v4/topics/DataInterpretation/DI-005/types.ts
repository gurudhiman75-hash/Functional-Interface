export type Di005ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di005TaskKind =
  | "MISSING_SECTOR_PERCENT"
  | "SECTOR_ANGLE_DEGREES"
  | "SECTOR_COUNT_FROM_TOTAL"
  | "RATIO_OF_TWO_SECTORS"
  | "RELATIVE_SECTOR_PERCENT_EXCESS";

export type Di005Difficulty = "Medium" | "Hard";

export type Di005Slice = Readonly<{
  category: string;
  percent: number;
  displayPercent: number | "?";
  angleDegrees: number;
}>;

export type Di005Stimulus = Readonly<{
  kind: "PIE";
  title: string;
  instruction: string;
  totalStudents: number;
  slices: readonly Di005Slice[];
  hiddenPercentIndex: number;
  unit: "students";
}>;

export type Di005Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di005Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di005Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di005TaskKind;
  difficulty: Di005Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di005Option[];
  correctIndex: number;
  answer: string;
  explanation: Di005Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di005ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di005QuestionSet = Readonly<{
  packageId: "DI-005";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di005ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "PIE_PART_WHOLE_MIXED";
  stimulus: Di005Stimulus;
  questions: readonly Di005Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di005ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-005";
    representation: "PIE";
    parentFoundation: "DI-001";
    advancedTableSibling: "DI-002";
    groupedBarSibling: "DI-003";
    lineSibling: "DI-004";
    setContractVersion: "DI-005-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
