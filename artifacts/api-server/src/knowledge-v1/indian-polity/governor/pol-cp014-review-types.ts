import type { PolCp014Difficulty } from "./pol-cp014-review-seed-types";

export type PolCp014ReviewQuestion = {
  questionId: string;
  qlId: string;
  difficulty: PolCp014Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};
