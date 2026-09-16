export type PolCp017Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp017ReviewQuestion {
  questionId: string;
  qlId: string;
  difficulty: PolCp017Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
}
