import type { Com004DistractorStrategy } from "./com004-distractor-readiness";

export type Com004ReviewQuestion = {
  questionId: string;
  qlId: string;
  cpId:
    | "COM-004-CP-001"
    | "COM-004-CP-002"
    | "COM-004-CP-003"
    | "COM-004-CP-004"
    | "COM-004-CP-005"
    | "COM-004-CP-006"
    | "COM-004-CP-007"
    | "COM-004-CP-008"
    | "COM-004-CP-009";
  surfaceMode: string;
  examSurfaceFamily: "DIRECT_RECALL" | "FUNCTIONAL_APPLICATION" | "CONTRAST_DISCRIMINATION" | "CONTEXT_SELECTION";
  targetFactId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  distractorStrategy: Com004DistractorStrategy;
  controlledPoolId?: string;
  versionScoped: boolean;
  solverAuthority: "CANONICAL_FACT_RELATION";
  stemAuthority: "COM004_V1_CONTROLLED_EXAM_SURFACE_AUTHORITY";
  reviewOnly: true;
  runtimeRegistered: false;
};
