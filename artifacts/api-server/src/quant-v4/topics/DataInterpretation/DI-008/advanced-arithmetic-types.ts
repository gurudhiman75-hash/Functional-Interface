export type Di008AdvancedExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di008AdvancedDifficulty = "Easy" | "Medium" | "Hard";
export type Di008AdvancedDomain =
  | "TIME_WORK"
  | "TIME_SPEED_DISTANCE"
  | "PARTNERSHIP"
  | "MIXTURE_ALLIGATION"
  | "INTEREST_LOAN"
  | "PROBABILITY_SELECTION";

export type Di008AdvancedTask =
  | "ROW_DERIVED_VALUE"
  | "TWO_ROW_DERIVED_TOTAL"
  | "DERIVED_DIFFERENCE"
  | "DERIVED_RATIO"
  | "DERIVED_SHARE_OF_TOTAL"
  | "THREE_ROW_DERIVED_TOTAL"
  | "GROUP_DERIVED_RATIO"
  | "DERIVED_PERCENT_EXCESS"
  | "AVERAGE_DERIVED_VALUE"
  | "REMAINDER_DERIVED_TOTAL";

export type Di008AdvancedRow = Readonly<{
  label: string;
  a: number;
  b: number;
  c?: number;
}>;

export type Di008AdvancedStimulus = Readonly<{
  kind: "ADVANCED_ARITHMETIC_DI";
  domain: Di008AdvancedDomain;
  title: string;
  instruction: string;
  columnA: string;
  columnB: string;
  columnC?: string;
  rows: readonly Di008AdvancedRow[];
  note: string;
}>;

export type Di008AdvancedQuestion = Readonly<{
  questionId: string;
  kind: Di008AdvancedTask;
  difficulty: Di008AdvancedDifficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{ keyIdea: string; steps: readonly string[] }>;
}>;

export type Di008AdvancedSet = Readonly<{
  packageId: "DI-008";
  mode: "ADVANCED_ARITHMETIC_DOMAINS_V1";
  seed: string;
  examProfile: Di008AdvancedExamProfile;
  stimulus: Di008AdvancedStimulus;
  derivedValues: readonly number[];
  questions: readonly Di008AdvancedQuestion[];
}>;
