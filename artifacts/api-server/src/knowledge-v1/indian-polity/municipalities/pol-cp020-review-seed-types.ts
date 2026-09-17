import type { PolCp020Difficulty } from "./pol-cp020-review-types";

export type PolCp020ReviewSeed = {
  qlId: string;
  difficulty: PolCp020Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
};
