import type { SentenceCodeTopologyKind } from "./topology-generator";

export interface StudentSentenceCodeRow {
  statementId: string;
  sentence: string;
  words: readonly string[];
  displayedCodeTokens: readonly string[];
  displayedCode: string;
}

export type ExactAtomicPrototypeId =
  | "COD-CP009-PROT-EXACT-WORD-TO-TOKEN"
  | "COD-CP009-PROT-EXACT-TOKEN-TO-WORD";

export type ExactAtomicDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface ExactAtomicOption {
  value: string;
  isCorrect: boolean;
  errorLabel?:
    | "STATEMENT_ORDER_ASSUMED"
    | "CODE_OF_RELATED_WORD"
    | "RELATED_STATEMENT_MEMBER"
    | "UNRESOLVED_ASSUMED";
}

export interface ExactAtomicExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  evidenceComparison: readonly string[];
  targetResult: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface ExactAtomicStructuredPrompt {
  rows: readonly StudentSentenceCodeRow[];
  queryDirection: "WORD_TO_TOKEN" | "TOKEN_TO_WORD";
  targetWord: string;
  targetToken: string;
}

export interface GeneratedExactAtomicPrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: ExactAtomicPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: SentenceCodeTopologyKind;
  difficulty: ExactAtomicDifficulty;
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN" | "WORD";
  stem: string;
  structuredPrompt: ExactAtomicStructuredPrompt;
  options: readonly ExactAtomicOption[];
  correctIndex: number;
  explanation: ExactAtomicExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-exact-atomic-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: number;
    targetCandidateCount: 1;
    hiddenMappingFingerprint: string;
  };
}
