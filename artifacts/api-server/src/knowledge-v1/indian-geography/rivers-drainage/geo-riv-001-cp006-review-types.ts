export type GeoRiv001Cp006Difficulty = "Easy" | "Medium" | "Hard";

export type GeoRiv001Cp006ReviewQuestion = {
  questionId: string;
  chapterId: "GEO-RIV-001";
  cpId: "GEO-RIV-001-CP006";
  qlId: string;
  qlName: string;
  difficulty: GeoRiv001Cp006Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  solverAuthority: "CANONICAL_FACT_RELATION" | "RELATION_CLASS_COMPOSER" | "RELATION_CHAIN_VERIFIER" | "STATEMENT_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
