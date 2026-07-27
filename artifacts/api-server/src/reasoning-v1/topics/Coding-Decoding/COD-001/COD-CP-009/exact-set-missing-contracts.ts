import type {
  ExactSetMissingDifficulty,
  ExactSetMissingPrototypeId,
} from "./exact-set-missing-types";

export interface ExactSetMissingPrototypeContract {
  prototypeId: ExactSetMissingPrototypeId;
  promptKind: "EXACT_PHRASE_TO_TOKENS" | "EXACT_TOKENS_TO_PHRASE" | "MISSING_TOKEN" | "MISSING_WORD";
  topologyKind: "PHRASE_SET_COMPOSITION" | "MISSING_MEMBER_COMPLETION";
  answerType: "CODE_TOKEN_SET" | "WORD_SET" | "CODE_TOKEN" | "WORD";
  difficulty: ExactSetMissingDifficulty;
  status: "PROTOTYPE";
}

export const EXACT_SET_MISSING_PROTOTYPE_CONTRACTS: readonly ExactSetMissingPrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-EXACT-PHRASE-TO-TOKENS",
    promptKind: "EXACT_PHRASE_TO_TOKENS",
    topologyKind: "PHRASE_SET_COMPOSITION",
    answerType: "CODE_TOKEN_SET",
    difficulty: "MEDIUM",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-EXACT-TOKENS-TO-PHRASE",
    promptKind: "EXACT_TOKENS_TO_PHRASE",
    topologyKind: "PHRASE_SET_COMPOSITION",
    answerType: "WORD_SET",
    difficulty: "MEDIUM",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-MISSING-TOKEN",
    promptKind: "MISSING_TOKEN",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    answerType: "CODE_TOKEN",
    difficulty: "EASY",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-MISSING-WORD",
    promptKind: "MISSING_WORD",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    answerType: "WORD",
    difficulty: "EASY",
    status: "PROTOTYPE",
  },
] as const;

export function getExactSetMissingContract(prototypeId: ExactSetMissingPrototypeId): ExactSetMissingPrototypeContract {
  const found = EXACT_SET_MISSING_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-009 exact set/missing prototype '${prototypeId}'`);
  return found;
}
