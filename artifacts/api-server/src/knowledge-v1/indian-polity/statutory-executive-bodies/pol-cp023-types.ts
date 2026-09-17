export type PolCp023Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp023ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp023Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
};

export type PolCp023SeedRow = readonly [
  qlId: string,
  difficulty: PolCp023Difficulty,
  stem: string,
  answer: string,
  distractor1: string,
  distractor2: string,
  distractor3: string,
  explanation: string,
  sourceIds: readonly string[],
];
