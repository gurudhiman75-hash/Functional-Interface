import type { KnowledgeV1Difficulty } from "../../types";

export type GeoRiv001Cp011ReviewQuestion = Readonly<{
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP011";
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
    | "RIVER_BASIN_RELATION"
    | "BASIN_RIVER_DISCRIMINATION"
    | "MATCHED_RIVER_BASIN_VERIFIER"
    | "DRAINAGE_PATTERN_RECOGNITION"
    | "DRAINAGE_PATTERN_CONTROL"
    | "MATCHED_PATTERN_CONTROL_VERIFIER"
    | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
}>;