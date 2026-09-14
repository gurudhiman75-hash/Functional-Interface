import type { KnowledgeV1Difficulty } from "../../types";

export type PolCp006ReviewQuestion = {
  questionId: string;
  chapterId: "POL-001";
  cpId: "POL-CP-006";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};
