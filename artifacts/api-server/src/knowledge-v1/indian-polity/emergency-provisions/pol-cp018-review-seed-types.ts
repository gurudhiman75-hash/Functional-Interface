import type { PolCp018Difficulty } from "./pol-cp018-review-types";

export interface PolCp018ReviewSeed {
  qlId: string;
  difficulty: PolCp018Difficulty;
  stem: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
}
