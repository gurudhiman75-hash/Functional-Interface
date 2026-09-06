import type { Com003DistractorStrategy } from "./com003-distractor-readiness";

export type Com003ReviewQuestion = {
  questionId: string;
  qlId: string;
  cpId: "COM-003-CP-001" | "COM-003-CP-002" | "COM-003-CP-003" | "COM-003-CP-004";
  surfaceMode: string;
  targetFactId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  distractorStrategy: Com003DistractorStrategy;
  controlledPoolId?: string;
  versionScoped: boolean;
  solverAuthority: "CANONICAL_FACT_RELATION";
  reviewOnly: true;
  runtimeRegistered: false;
};
