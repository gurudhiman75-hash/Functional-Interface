import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp015ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP015";
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
  upstreamFactIds: string[];
  sourceCpId: string;
  sourceQuestionId: string;
  sourceQlId: string;
  reviewOnly: true;
  runtimeRegistered: false;
};
