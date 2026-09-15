export type PolCp014Difficulty = "Easy" | "Medium" | "Hard";

export type PolCp014Seed = {
  qlId: string;
  difficulty: PolCp014Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
