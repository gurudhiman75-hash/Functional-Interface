export type PolCp011Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp011ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp011Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};
