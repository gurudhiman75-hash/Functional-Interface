import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp004ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP004";
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
  solverAuthority:
    | "CANONICAL_FACT_RELATION"
    | "RELATION_CLASS_COMPOSER"
    | "CONFLUENCE_CHAIN_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
