export type PolCp019Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp019ReviewQuestion {
  questionId: string;
  qlId: string;
  difficulty: PolCp019Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
}
