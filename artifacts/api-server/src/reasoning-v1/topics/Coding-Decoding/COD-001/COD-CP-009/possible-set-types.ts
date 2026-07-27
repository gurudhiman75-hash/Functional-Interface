import type { StudentSentenceCodeRow } from "./exact-atomic-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export type PossibleSetPrototypeId =
  | "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS"
  | "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS";

export type PossibleSetDirection = "WORDS_TO_TOKENS" | "TOKENS_TO_WORDS";
export type PossibleSetDifficulty = "MEDIUM" | "HARD";

export interface PossibleSetOption {
  value: string;
  members: readonly string[];
  canonicalValue: string;
  isCorrect: boolean;
  witnessCount: number;
  errorLabel?: "ZERO_WITNESS_SET";
}

export interface PossibleSetExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  evidenceComparison: readonly string[];
  witness: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface PossibleSetStructuredPrompt {
  rows: readonly StudentSentenceCodeRow[];
  queryDirection: PossibleSetDirection;
  targetWords: readonly [string, string];
  targetTokens: readonly [string, string];
  ambiguousMember: string;
  resolvedMember: string;
}

export interface GeneratedPossibleSetPrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: PossibleSetPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: Extract<
    SentenceCodeTopologyKind,
    "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
  >;
  difficulty: PossibleSetDifficulty;
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN_SET" | "WORD_SET";
  stem: string;
  structuredPrompt: PossibleSetStructuredPrompt;
  options: readonly PossibleSetOption[];
  correctIndex: number;
  explanation: PossibleSetExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-possible-set-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: 2 | 6;
    possibleSetCount: 2 | 3;
    correctWitnessCount: number;
    optionWitnessCounts: Readonly<Record<string, number>>;
    hiddenMappingFingerprint: string;
  };
}
