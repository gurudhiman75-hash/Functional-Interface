export type PolCp013Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp013ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp013Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
