import type { PolCp015Difficulty } from "./pol-cp015-review-seed-types";

export interface PolCp015ReviewQuestion {
  questionId: string;
  qlId: string;
  difficulty: PolCp015Difficulty;
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
}
