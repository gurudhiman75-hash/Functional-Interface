import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp010ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP010";
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
    | "PROJECT_RIVER_RELATION"
    | "UNIQUE_RIVER_TO_PROJECT"
    | "PROJECT_STATE_RELATION"
    | "PROJECT_RESERVOIR_RELATION"
    | "RESERVOIR_PROJECT_RELATION"
    | "MATCHED_PROJECT_RIVER_VERIFIER"
    | "MATCHED_PROJECT_STATE_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
