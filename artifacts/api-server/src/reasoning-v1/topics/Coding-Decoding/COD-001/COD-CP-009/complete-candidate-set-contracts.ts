import type {
  CompleteCandidateSetDirection,
  CompleteCandidateSetPrototypeId,
} from "./complete-candidate-set-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export interface CompleteCandidateSetPrototypeContract {
  prototypeId: CompleteCandidateSetPrototypeId;
  queryDirection: CompleteCandidateSetDirection;
  answerType: "CODE_TOKEN_SET" | "WORD_SET";
  supportedTopologies: readonly Extract<
    SentenceCodeTopologyKind,
    "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
  >[];
  status: "PROTOTYPE";
}

const SUPPORTED_TOPOLOGIES = [
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
] as const;

export const COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS: readonly CompleteCandidateSetPrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-COMPLETE-CODE-CANDIDATE-SET",
    queryDirection: "WORD_TO_ALL_TOKENS",
    answerType: "CODE_TOKEN_SET",
    supportedTopologies: SUPPORTED_TOPOLOGIES,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-COMPLETE-WORD-CANDIDATE-SET",
    queryDirection: "TOKEN_TO_ALL_WORDS",
    answerType: "WORD_SET",
    supportedTopologies: SUPPORTED_TOPOLOGIES,
    status: "PROTOTYPE",
  },
] as const;

export function getCompleteCandidateSetContract(
  prototypeId: CompleteCandidateSetPrototypeId,
): CompleteCandidateSetPrototypeContract {
  const found = COMPLETE_CANDIDATE_SET_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown complete-candidate-set prototype '${prototypeId}'`);
  return found;
}
