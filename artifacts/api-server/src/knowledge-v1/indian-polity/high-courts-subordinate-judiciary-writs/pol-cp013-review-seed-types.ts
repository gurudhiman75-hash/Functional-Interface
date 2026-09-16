import type { PolCp013Difficulty } from "./pol-cp013-review-types";

export type PolCp013Seed = {
  qlId: string;
  difficulty: PolCp013Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
