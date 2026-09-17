import type { PolCp021Difficulty } from "./pol-cp021-review-types";

export interface PolCp021ReviewSeed {
  qlId: string;
  difficulty: PolCp021Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
}
