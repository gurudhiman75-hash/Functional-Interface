export type PolCp015Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp015Seed {
  qlId: string;
  difficulty: PolCp015Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
}
