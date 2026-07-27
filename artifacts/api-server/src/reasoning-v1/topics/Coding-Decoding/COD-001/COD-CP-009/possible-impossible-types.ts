import type { StudentSentenceCodeRow } from "./exact-atomic-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export type PossibleImpossiblePrototypeId =
  | "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN"
  | "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD"
  | "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN"
  | "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD";

export type PossibleImpossiblePredicate = "POSSIBLE" | "IMPOSSIBLE";
export type PossibleImpossibleDirection = "WORD_TO_TOKEN" | "TOKEN_TO_WORD";
export type PossibleImpossibleDifficulty = "MEDIUM";

export type PossibleImpossibleErrorLabel =
  | "POSSIBLE_WITNESS"
  | "ZERO_WITNESS"
  | "POSITIONAL_MATCH_ASSUMED";

export interface PossibleImpossibleOption {
  value: string;
  isCorrect: boolean;
  witnessCount: number;
  errorLabel?: PossibleImpossibleErrorLabel;
}

export interface PossibleImpossibleExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  evidenceComparison: readonly string[];
  witnessOrExclusion: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface PossibleImpossibleStructuredPrompt {
  rows: readonly StudentSentenceCodeRow[];
  predicate: PossibleImpossiblePredicate;
  queryDirection: PossibleImpossibleDirection;
  targetWord: string;
  targetToken: string;
}

export interface GeneratedPossibleImpossiblePrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: PossibleImpossiblePrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: Extract<
    SentenceCodeTopologyKind,
    "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
  >;
  difficulty: PossibleImpossibleDifficulty;
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN" | "WORD";
  stem: string;
  structuredPrompt: PossibleImpossibleStructuredPrompt;
  options: readonly PossibleImpossibleOption[];
  correctIndex: number;
  explanation: PossibleImpossibleExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-possible-impossible-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: 2 | 6;
    targetCandidateCount: 2 | 3;
    correctWitnessCount: number;
    optionWitnessCounts: Readonly<Record<string, number>>;
    hiddenMappingFingerprint: string;
  };
}
