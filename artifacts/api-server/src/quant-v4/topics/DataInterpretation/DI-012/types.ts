export type Di012ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";
export type Di012Difficulty = "Easy" | "Medium" | "Hard";
export type Di012ModelKind =
  | "SINGLE_X_TOTAL"
  | "X_Y_SUM_DIFFERENCE"
  | "X_Y_RATIO_TOTAL"
  | "TWO_MISSING_COLUMN_TOTALS"
  | "MISSING_RATE"
  | "AVERAGE_CONSTRAINED"
  | "CHAINED_RECOVERY";

export type Di012TaskKind =
  | "RECOVER_X"
  | "RECOVER_Y"
  | "UNKNOWN_SUM"
  | "UNKNOWN_DIFFERENCE"
  | "UNKNOWN_RATIO"
  | "RECOVERED_ROW_TOTAL"
  | "RECOVERED_COLUMN_TOTAL"
  | "RECOVERED_SHARE_OF_TOTAL"
  | "CROSS_ROW_RATIO_AFTER_RECOVERY"
  | "COMBINED_RECOVERED_PERCENT";

export type Di012Cell = number | "x" | "y";
export type Di012Row = Readonly<{ label: string; a: Di012Cell; b: Di012Cell }>;
export type Di012Stimulus = Readonly<{
  kind: "ADVANCED_MISSING_VARIABLE_TABLE";
  modelKind: Di012ModelKind;
  title: string;
  instruction: string;
  columnA: string;
  columnB: string;
  rows: readonly Di012Row[];
  condition: string;
}>;
export type Di012Explanation = Readonly<{ keyIdea: string; steps: readonly string[] }>;
export type Di012Question = Readonly<{
  questionId: string;
  kind: Di012TaskKind;
  difficulty: Di012Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Di012Explanation;
}>;
export type Di012Set = Readonly<{
  packageId: "DI-012";
  setId: string;
  seed: string;
  examProfile: Di012ExamProfile;
  stimulus: Di012Stimulus;
  solution: Readonly<{ x: number; y?: number }>;
  questions: readonly Di012Question[];
}>;
