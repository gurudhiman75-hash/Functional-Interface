import type { ExactAtomicDifficulty, ExactAtomicPrototypeId } from "./exact-atomic-types";
import type { SentenceCodeTopologyKind } from "./topology-generator";

export interface ExactAtomicPrototypeContract {
  prototypeId: ExactAtomicPrototypeId;
  queryDirection: "WORD_TO_TOKEN" | "TOKEN_TO_WORD";
  answerType: "CODE_TOKEN" | "WORD";
  supportedTopologies: readonly SentenceCodeTopologyKind[];
  status: "PROTOTYPE";
}

export const EXACT_ATOMIC_TOPOLOGIES = [
  "DIRECT_SINGLE_INTERSECTION",
  "CHAINED_SINGLETON_PROPAGATION",
  "SET_DIFFERENCE_ELIMINATION",
  "FORKED_EVIDENCE_JOIN",
  "GLOBAL_BIJECTION_DEDUCTION",
] as const satisfies readonly SentenceCodeTopologyKind[];

export const EXACT_ATOMIC_PROTOTYPE_CONTRACTS: readonly ExactAtomicPrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-EXACT-WORD-TO-TOKEN",
    queryDirection: "WORD_TO_TOKEN",
    answerType: "CODE_TOKEN",
    supportedTopologies: EXACT_ATOMIC_TOPOLOGIES,
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-EXACT-TOKEN-TO-WORD",
    queryDirection: "TOKEN_TO_WORD",
    answerType: "WORD",
    supportedTopologies: EXACT_ATOMIC_TOPOLOGIES,
    status: "PROTOTYPE",
  },
] as const;

export function getExactAtomicPrototypeContract(prototypeId: ExactAtomicPrototypeId): ExactAtomicPrototypeContract {
  const found = EXACT_ATOMIC_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-009 exact atomic prototype '${prototypeId}'`);
  return found;
}

export function exactAtomicDifficulty(kind: SentenceCodeTopologyKind): ExactAtomicDifficulty {
  if (kind === "DIRECT_SINGLE_INTERSECTION") return "EASY";
  if (kind === "FORKED_EVIDENCE_JOIN") return "HARD";
  return "MEDIUM";
}
