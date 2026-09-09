import type { KnowledgeV1Difficulty } from "../../types";
import type { GeographyExplanationMapRenderV1 } from "../explanation-maps/geography-explanation-map-v1";

export type GeoRiv001Cp002ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP002";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  explanationMap?: GeographyExplanationMapRenderV1;
  sourceIds: string[];
  sourceFactIds: string[];
  solverAuthority:
    | "CANONICAL_FACT_RELATION"
    | "RELATION_CLASS_COMPOSER"
    | "JOIN_CHAIN_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
