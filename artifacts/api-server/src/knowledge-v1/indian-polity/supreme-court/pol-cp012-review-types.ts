export type PolCp012Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp012ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp012Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
