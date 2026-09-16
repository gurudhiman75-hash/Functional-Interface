import type { PolCp012Difficulty } from "./pol-cp012-review-types";

export type PolCp012Seed = {
  qlId: string;
  difficulty: PolCp012Difficulty;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
