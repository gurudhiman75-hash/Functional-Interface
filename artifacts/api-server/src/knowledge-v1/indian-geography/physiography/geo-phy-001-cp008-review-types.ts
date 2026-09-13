import type { KnowledgeV1Difficulty } from "../../types";

export type GeoPhy001Cp008ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-PHY-001";
  cpId: "GEO-PHY-001-CP008";
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
