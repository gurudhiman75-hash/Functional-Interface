import type { PolCp011Difficulty } from "./pol-cp011-review-types";

export type PolCp011Seed = {
  qlId: string;
  difficulty: PolCp011Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};
