import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp008ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP008";
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
  solverAuthority:
    | "CANONICAL_SOURCE_RELATION"
    | "SOURCE_GEOGRAPHY_VERIFIER"
    | "MOUTH_RELATION_VERIFIER"
    | "MATCHED_RELATION_VERIFIER"
    | "SOURCE_TO_MOUTH_CHAIN_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
