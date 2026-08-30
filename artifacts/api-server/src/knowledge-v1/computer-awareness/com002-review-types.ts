export type Com002ReviewQuestion = {
  questionId: string;
  qlId: string;
  cpId: "COM-002-CP-001" | "COM-002-CP-002";
  surfaceMode: string;
  targetFactId: string | null;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  solverAuthority: "CANONICAL_FACT_RELATION" | "KNOWLEDGE_COMPOSITION_VERIFIER";
  reviewOnly: true;
  runtimeRegistered: false;
};
