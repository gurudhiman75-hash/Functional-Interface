export type Di003ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di003TaskKind =
  | "CROSS_SERIES_DIFFERENCE"
  | "COMBINED_CATEGORY_RATIO"
  | "PERCENT_CHANGE_WITHIN_SERIES"
  | "CATEGORY_SHARE_OF_SERIES_TOTAL"
  | "TOTAL_SERIES_PERCENT_EXCESS";

export type Di003Difficulty = "Medium" | "Hard";

export type Di003BarPoint = Readonly<{
  category: string;
  seriesA: number;
  seriesB: number;
}>;

export type Di003Stimulus = Readonly<{
  kind: "GROUPED_BAR";
  title: string;
  instruction: string;
  categories: readonly string[];
  series: readonly [
    Readonly<{ id: "SERIES_A"; label: string }>,
    Readonly<{ id: "SERIES_B"; label: string }>,
  ];
  points: readonly Di003BarPoint[];
  yAxisLabel: string;
  unit: "units";
}>;

export type Di003Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di003Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di003Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di003TaskKind;
  difficulty: Di003Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di003Option[];
  correctIndex: number;
  answer: string;
  explanation: Di003Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di003ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di003QuestionSet = Readonly<{
  packageId: "DI-003";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di003ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "GROUPED_BAR_MIXED";
  stimulus: Di003Stimulus;
  questions: readonly Di003Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di003ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-003";
    representation: "GROUPED_BAR";
    parentFoundation: "DI-001";
    advancedTableSibling: "DI-002";
    setContractVersion: "DI-003-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
