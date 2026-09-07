export type Di004ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di004TaskKind =
  | "FIRST_OVERTAKE_PERIOD"
  | "CLOSEST_LINES_PERIOD"
  | "CONSECUTIVE_PERCENT_INCREASE_A"
  | "THREE_PERIOD_AVERAGE_B"
  | "B_RANGE_PERCENT_INCREASE";

export type Di004Difficulty = "Medium" | "Hard";

export type Di004LinePoint = Readonly<{
  period: string;
  seriesA: number;
  seriesB: number;
}>;

export type Di004Stimulus = Readonly<{
  kind: "LINE";
  title: string;
  instruction: string;
  categories: readonly string[];
  series: readonly [
    Readonly<{ id: "SERIES_A"; label: string }>,
    Readonly<{ id: "SERIES_B"; label: string }>,
  ];
  points: readonly Di004LinePoint[];
  yAxisLabel: string;
  unit: "orders";
}>;

export type Di004Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di004Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di004Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di004TaskKind;
  difficulty: Di004Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di004Option[];
  correctIndex: number;
  answer: string;
  explanation: Di004Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di004ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di004QuestionSet = Readonly<{
  packageId: "DI-004";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di004ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "LINE_TREND_MIXED";
  stimulus: Di004Stimulus;
  questions: readonly Di004Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di004ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-004";
    representation: "LINE";
    parentFoundation: "DI-001";
    advancedTableSibling: "DI-002";
    groupedBarSibling: "DI-003";
    setContractVersion: "DI-004-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
