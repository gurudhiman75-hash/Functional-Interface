import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp012ReviewQuestion = Readonly<{
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP012";
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
