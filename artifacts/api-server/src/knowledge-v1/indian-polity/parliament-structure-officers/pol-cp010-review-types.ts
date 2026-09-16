export type PolCp010Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp010ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp010Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type PolCp010QuestionSeed = Omit<PolCp010ReviewQuestion, "questionId" | "correctIndex" | "options"> & {
  distractors: readonly [string, string, string];
};
