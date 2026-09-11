import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp009ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP009";
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
    | "COURSE_STATE_RELATION"
    | "UNIQUE_STATE_TO_RIVER"
    | "SOURCE_STATE_RELATION"
    | "COURSE_SET_VERIFIER"
    | "MATCHED_RIVER_STATE_VERIFIER"
    | "INTERSTATE_PAIR_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
