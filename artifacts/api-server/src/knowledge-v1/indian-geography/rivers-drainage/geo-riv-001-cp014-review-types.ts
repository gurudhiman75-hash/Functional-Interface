import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp014ReviewQuestion = Readonly<{
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP014";
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
  solverAuthority: string;
  reviewOnly: true;
  runtimeRegistered: false;
}>;
