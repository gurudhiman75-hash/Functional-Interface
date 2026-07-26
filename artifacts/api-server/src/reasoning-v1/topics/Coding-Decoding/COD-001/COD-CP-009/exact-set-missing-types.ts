import type { StudentSentenceCodeRow } from "./exact-atomic-types";

export type ExactSetMissingPrototypeId =
  | "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS"
  | "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE"
  | "COD-CP009-PROT-MISSING-TOKEN"
  | "COD-CP009-PROT-MISSING-WORD";

export type ExactSetMissingDifficulty = "MEDIUM";

export type ExactSetMissingErrorLabel =
  | "INDIVIDUAL_AMBIGUITY_CONFUSED_WITH_SET_AMBIGUITY"
  | "ONE_MEMBER_REPLACED"
  | "RELATED_STATEMENT_SET"
  | "MISSING_MEMBER_WRONG_DIFFERENCE"
  | "RELATED_WORD_SELECTED"
  | "STATEMENT_ORDER_ASSUMED"
  | "UNRESOLVED_ASSUMED";

export interface ExactSetMissingOption {
  value: string;
  canonicalValue: string;
  isCorrect: boolean;
  errorLabel?: ExactSetMissingErrorLabel;
}

export interface ExactSetMissingExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  evidenceComparison: readonly string[];
  targetResult: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface ExactPhraseStructuredPrompt {
  kind: "EXACT_PHRASE_TO_TOKENS" | "EXACT_TOKENS_TO_PHRASE";
  rows: readonly StudentSentenceCodeRow[];
  phraseWords: readonly string[];
  phraseTokens: readonly string[];
}

export interface MissingTokenStructuredPrompt {
  kind: "MISSING_TOKEN";
  rows: readonly StudentSentenceCodeRow[];
  incompleteStatementId: string;
  incompleteSentence: string;
  displayedCodeWithBlank: string;
  knownTokens: readonly string[];
  correctToken: string;
}

export interface MissingWordStructuredPrompt {
  kind: "MISSING_WORD";
  rows: readonly StudentSentenceCodeRow[];
  incompleteStatementId: string;
  displayedSentenceWithBlank: string;
  fullCodeTokens: readonly string[];
  displayedCode: string;
  correctWord: string;
}

export type ExactSetMissingStructuredPrompt =
  | ExactPhraseStructuredPrompt
  | MissingTokenStructuredPrompt
  | MissingWordStructuredPrompt;

export interface GeneratedExactSetMissingPrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: ExactSetMissingPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: "PHRASE_SET_COMPOSITION" | "MISSING_MEMBER_COMPLETION";
  difficulty: ExactSetMissingDifficulty;
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN_SET" | "WORD_SET" | "CODE_TOKEN" | "WORD";
  stem: string;
  structuredPrompt: ExactSetMissingStructuredPrompt;
  options: readonly ExactSetMissingOption[];
  correctIndex: number;
  explanation: ExactSetMissingExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-exact-set-missing-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: number;
    exactResultCount: 1;
    individualPairAmbiguity: boolean;
    hiddenMappingFingerprint: string;
  };
}
