import type { PolCp017Difficulty } from "./pol-cp017-review-types";

export interface PolCp017ReviewSeed {
  qlId: string;
  difficulty: PolCp017Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
}
