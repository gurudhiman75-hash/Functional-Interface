import type { PolCp016Difficulty } from "./pol-cp016-review-types";

export interface PolCp016Seed {
  qlId: string;
  difficulty: PolCp016Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
}
