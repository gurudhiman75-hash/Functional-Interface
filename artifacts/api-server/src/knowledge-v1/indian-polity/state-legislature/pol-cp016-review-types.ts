export type PolCp016Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp016ReviewQuestion {
  questionId: string;
  qlId: string;
  difficulty: PolCp016Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
}
