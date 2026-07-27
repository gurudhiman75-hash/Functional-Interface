import type { StudentSentenceCodeRow } from "./exact-atomic-types";

export type ResolvedCompositionPrototypeId =
  | "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS"
  | "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS";

export interface ResolvedCompositionOption {
  value: string;
  members: readonly string[];
  canonicalValue: string;
  isCorrect: boolean;
  errorLabel?: "ONE_COMPONENT_REPLACED" | "DISPLAYED_ROW_COPIED";
}

export interface ResolvedCompositionExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  branchProofs: readonly [string, string];
  composition: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface ResolvedCompositionStructuredPrompt {
  rows: readonly StudentSentenceCodeRow[];
  queryDirection: "WORDS_TO_TOKENS" | "TOKENS_TO_WORDS";
  targetWords: readonly [string, string];
  targetTokens: readonly [string, string];
}

export interface GeneratedResolvedCompositionPrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: ResolvedCompositionPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: "RESOLVED_COMPONENT_COMPOSITION";
  difficulty: "MEDIUM";
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN_SET" | "WORD_SET";
  stem: string;
  structuredPrompt: ResolvedCompositionStructuredPrompt;
  options: readonly ResolvedCompositionOption[];
  correctIndex: number;
  explanation: ResolvedCompositionExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-resolved-composition-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: 1;
    bothBranchesRequired: true;
    hiddenMappingFingerprint: string;
  };
}
