import type { CodDifficulty, CodRenderer, ExplanationTrace, GeneratedOption } from "../foundation/types";

export type Cp008PrototypeId =
  | "COD-CP008-PROT-DIRECT-RENAMED-LABEL"
  | "COD-CP008-PROT-SEMANTIC-REFERENT-RENAMING";

export type Cp008TaskKind = "DIRECT_LABEL_QUERY" | "SEMANTIC_REFERENT_QUERY";
export type Cp008Topology = "OPEN_CHAIN" | "CYCLE";
export type Cp008FactCategory = "ATTRIBUTE" | "FUNCTION" | "ROLE" | "CATEGORY";

export interface Cp008RenamingPair {
  actual: string;
  called: string;
}

export interface Cp008SemanticFact {
  factId: string;
  category: Cp008FactCategory;
  question: string;
  ordinaryAnswer: string;
  rationale: string;
  domain: readonly string[];
}

export interface Cp008PrototypeContract {
  prototypeId: Cp008PrototypeId;
  taskKind: Cp008TaskKind;
  ruleId: "DIRECT_RENAMED_LABEL" | "SEMANTIC_REFERENT_THEN_RENAME";
  status: "PROTOTYPE";
}

export interface Cp008StructuredPrompt {
  taskKind: Cp008TaskKind;
  topology: Cp008Topology;
  mapping: readonly Cp008RenamingPair[];
  directTarget?: string;
  semanticFactId?: string;
  semanticQuestion?: string;
  ordinaryAnswer: string;
}

export interface GeneratedCp008PrototypeQuestion {
  packageId: "COD-001";
  checkpointId: "COD-CP-008";
  prototypeId: Cp008PrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  ruleId: "DIRECT_RENAMED_LABEL" | "SEMANTIC_REFERENT_THEN_RENAME";
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: "WORD_OR_LABEL";
  stem: string;
  structuredPrompt: Cp008StructuredPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-cp008-renaming-prototype-v1";
    hiddenFingerprint: string;
    mappingInjective: true;
    identityEdges: 0;
    oneStepOnly: true;
    ordinaryAnswerUnique: true;
    solverAgreement: true;
    mappingSize: number;
    topology: Cp008Topology;
    factCategory?: Cp008FactCategory;
    correctAnswer: string;
  };
}
