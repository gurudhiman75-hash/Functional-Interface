import type { StudentSentenceCodeRow } from "./exact-atomic-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export type CompleteCandidateSetPrototypeId =
  | "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET"
  | "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET";

export type CompleteCandidateSetDirection = "WORD_TO_ALL_TOKENS" | "TOKEN_TO_ALL_WORDS";
export type CompleteCandidateSetDifficulty = "MEDIUM" | "HARD";
export type CompleteCandidateSetErrorLabel =
  | "CANDIDATE_OMITTED"
  | "IMPOSSIBLE_MEMBER_ADDED"
  | "CANDIDATE_REPLACED";

export interface CompleteCandidateSetOption {
  value: string;
  members: readonly string[];
  canonicalValue: string;
  isCorrect: boolean;
  errorLabel?: CompleteCandidateSetErrorLabel;
}

export interface CompleteCandidateSetExplanation {
  referenceAid: readonly string[];
  quickMethod: string;
  evidenceComparison: readonly string[];
  completenessProof: string;
  conclusion: string;
  commonTrapAlert: string;
}

export interface CompleteCandidateSetStructuredPrompt {
  rows: readonly StudentSentenceCodeRow[];
  queryDirection: CompleteCandidateSetDirection;
  targetWord: string;
  targetToken: string;
  completeCandidateSet: readonly string[];
}

export interface GeneratedCompleteCandidateSetPrototypeQuestion {
  checkpointId: "COD-CP-009";
  prototypeId: CompleteCandidateSetPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: Extract<
    SentenceCodeTopologyKind,
    "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
  >;
  difficulty: CompleteCandidateSetDifficulty;
  renderer: "STATEMENT_CODE_GRID";
  answerType: "CODE_TOKEN_SET" | "WORD_SET";
  stem: string;
  structuredPrompt: CompleteCandidateSetStructuredPrompt;
  options: readonly CompleteCandidateSetOption[];
  correctIndex: number;
  explanation: CompleteCandidateSetExplanation;
  metadata: {
    runtimeVersion: "cod-cp009-complete-candidate-set-prototype-v1";
    scenarioId: string;
    topologyFingerprint: string;
    solutionCount: 2 | 6;
    candidateCount: 2 | 3;
    candidateWitnessCounts: Readonly<Record<string, number>>;
    hiddenMappingFingerprint: string;
  };
}
