import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp007ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP007";
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
    | "CANONICAL_PARENT_RELATION"
    | "CONFLUENCE_PLACE_VERIFIER"
    | "FORMATION_RELATION_VERIFIER"
    | "BANK_GROUP_VERIFIER"
    | "MATCHED_PAIR_VERIFIER"
    | "RELATION_CHAIN_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
