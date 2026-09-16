import type { KnowledgeV1Difficulty } from "../../types";

export type EnvCp015ReviewQuestion = {
  questionId: string;
  chapterId: "ENV-001";
  cpId: "ENV-CP-015";
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
