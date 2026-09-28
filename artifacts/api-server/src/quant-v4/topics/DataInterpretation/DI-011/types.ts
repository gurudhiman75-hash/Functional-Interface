export type Di011ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di011Difficulty = "Easy" | "Medium" | "Hard";
export type Di011PairKind = "BAR_TABLE" | "LINE_TABLE" | "PIE_TABLE" | "BAR_LINE" | "TWO_TABLE_JOIN";
export type Di011TaskKind =
  | "SAME_CATEGORY_COMBINED_TOTAL"
  | "SAME_CATEGORY_ABSOLUTE_DIFFERENCE"
  | "LEFT_TO_RIGHT_RATIO"
  | "TWO_CATEGORY_CROSS_SUM"
  | "HIGHEST_COMBINED_CATEGORY"
  | "CROSS_COMPONENT_AVERAGE"
  | "TWO_GROUP_CROSS_RATIO"
  | "TWO_GROUP_COMBINED_DIFFERENCE"
  | "THREE_CATEGORY_CROSS_TOTAL"
  | "FOUR_VALUE_CROSS_AVERAGE";

export type Di011Datum = Readonly<{ category: string; left: number; right: number }>;
export type Di011Stimulus = Readonly<{
  kind: "MIXED_MULTI_CHART";
  pairKind: Di011PairKind;
  title: string;
  instruction: string;
  leftTitle: string;
  rightTitle: string;
  leftUnit: string;
  rightUnit: string;
  rows: readonly Di011Datum[];
}>;

export type Di011Explanation = Readonly<{ keyIdea: string; steps: readonly string[] }>;
export type Di011Question = Readonly<{
  questionId: string;
  kind: Di011TaskKind;
  difficulty: Di011Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Di011Explanation;
}>;
export type Di011QuestionSet = Readonly<{
  packageId: "DI-011";
  setId: string;
  seed: string;
  examProfile: Di011ExamProfile;
  stimulus: Di011Stimulus;
  questions: readonly Di011Question[];
}>;
