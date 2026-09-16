import type { PolCp019Difficulty } from "./pol-cp019-review-types";

export interface PolCp019ReviewSeed {
  qlId: string;
  difficulty: PolCp019Difficulty;
  stem: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
}
