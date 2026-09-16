export type PolCp018Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp018ReviewQuestion {
  questionId: string;
  qlId: string;
  difficulty: PolCp018Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
}
