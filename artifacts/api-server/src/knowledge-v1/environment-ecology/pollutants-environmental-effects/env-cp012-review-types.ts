import type { KnowledgeV1Difficulty } from "../../types";

export type EnvCp012ReviewQuestion = {
  questionId: string;
  chapterId: "ENV-001";
  cpId: "ENV-CP-012";
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
