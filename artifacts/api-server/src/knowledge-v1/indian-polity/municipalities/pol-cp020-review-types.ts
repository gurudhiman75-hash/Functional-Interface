export type PolCp020Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp020ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp020Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
};
