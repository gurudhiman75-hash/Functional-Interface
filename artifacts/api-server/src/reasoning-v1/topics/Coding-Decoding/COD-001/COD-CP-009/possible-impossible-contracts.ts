import type {
  PossibleImpossibleDirection,
  PossibleImpossiblePredicate,
  PossibleImpossiblePrototypeId,
} from "./possible-impossible-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export interface PossibleImpossiblePrototypeContract {
  prototypeId: PossibleImpossiblePrototypeId;
  predicate: PossibleImpossiblePredicate;
  queryDirection: PossibleImpossibleDirection;
  answerType: "CODE_TOKEN" | "WORD";
  supportedTopologies: readonly Extract<
    SentenceCodeTopologyKind,
    "CONTROLLED_PARTIAL_INFORMATION" | "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"
  >[];
  status: "PROTOTYPE";
}

const BOTH_PARTIAL_TOPOLOGIES = [
  "CONTROLLED_PARTIAL_INFORMATION",
  "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION",
] as const;
const THREE_WAY_ONLY = ["CONTROLLED_THREE_WAY_PARTIAL_INFORMATION"] as const;

export const POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS: readonly PossibleImpossiblePrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-POSSIBLE-WORD-TO-TOKEN",
    predicate: "POSSIBLE",
    queryDirection: "WORD_TO_TOKEN",
    answerType: "CODE_TOKEN",
    supportedTopologies: BOTH_PARTIAL_TOPOLOGIES,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-POSSIBLE-TOKEN-TO-WORD",
    predicate: "POSSIBLE",
    queryDirection: "TOKEN_TO_WORD",
    answerType: "WORD",
    supportedTopologies: BOTH_PARTIAL_TOPOLOGIES,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-IMPOSSIBLE-WORD-TO-TOKEN",
    predicate: "IMPOSSIBLE",
    queryDirection: "WORD_TO_TOKEN",
    answerType: "CODE_TOKEN",
    supportedTopologies: THREE_WAY_ONLY,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-IMPOSSIBLE-TOKEN-TO-WORD",
    predicate: "IMPOSSIBLE",
    queryDirection: "TOKEN_TO_WORD",
    answerType: "WORD",
    supportedTopologies: THREE_WAY_ONLY,
    status: "PROTOTYPE",
  },
] as const;

export function getPossibleImpossibleContract(
  prototypeId: PossibleImpossiblePrototypeId,
): PossibleImpossiblePrototypeContract {
  const found = POSSIBLE_IMPOSSIBLE_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-009 possible/impossible prototype '${prototypeId}'`);
  return found;
}
