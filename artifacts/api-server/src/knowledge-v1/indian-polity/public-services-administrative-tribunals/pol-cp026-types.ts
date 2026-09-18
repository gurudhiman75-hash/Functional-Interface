export type PolCp026Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp026ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp026Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
};

export type PolCp026SeedRow = readonly [
  qlId: string,
  difficulty: PolCp026Difficulty,
  stem: string,
  answer: string,
  distractor1: string,
  distractor2: string,
  distractor3: string,
  explanation: string,
  sourceIds: readonly string[],
];
