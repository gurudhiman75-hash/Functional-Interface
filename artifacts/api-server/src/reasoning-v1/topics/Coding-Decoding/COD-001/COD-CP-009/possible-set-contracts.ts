import type {
  PossibleSetDirection,
  PossibleSetPrototypeId,
} from "./possible-set-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export interface PossibleSetPrototypeContract {
  prototypeId: PossibleSetPrototypeId;
  queryDirection: PossibleSetDirection;
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

export const POSSIBLE_SET_PROTOTYPE_CONTRACTS: readonly PossibleSetPrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-SET-TO-TOKENS",
    queryDirection: "WORDS_TO_TOKENS",
    answerType: "CODE_TOKEN_SET",
    supportedTopologies: SUPPORTED_TOPOLOGIES,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-SET-TO-WORDS",
    queryDirection: "TOKENS_TO_WORDS",
    answerType: "WORD_SET",
    supportedTopologies: SUPPORTED_TOPOLOGIES,
    status: "PROTOTYPE",
  },
] as const;

export function getPossibleSetContract(prototypeId: PossibleSetPrototypeId): PossibleSetPrototypeContract {
  const found = POSSIBLE_SET_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-009 possible-set prototype '${prototypeId}'`);
  return found;
}
