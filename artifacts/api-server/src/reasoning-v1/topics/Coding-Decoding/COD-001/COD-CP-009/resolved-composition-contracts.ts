import type { ResolvedCompositionPrototypeId } from "./resolved-composition-types";

export interface ResolvedCompositionPrototypeContract {
  prototypeId: ResolvedCompositionPrototypeId;
  queryDirection: "WORDS_TO_TOKENS" | "TOKENS_TO_WORDS";
  answerType: "CODE_TOKEN_SET" | "WORD_SET";
  status: "PROTOTYPE";
}

export const RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS: readonly ResolvedCompositionPrototypeContract[] = [
  {
    prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-WORDS-TO-TOKENS",
    queryDirection: "WORDS_TO_TOKENS",
    answerType: "CODE_TOKEN_SET",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP009-PROT-EXACT-RESOLVED-TOKENS-TO-WORDS",
    queryDirection: "TOKENS_TO_WORDS",
    answerType: "WORD_SET",
    status: "PROTOTYPE",
  },
] as const;

export function getResolvedCompositionContract(
  prototypeId: ResolvedCompositionPrototypeId,
): ResolvedCompositionPrototypeContract {
  const found = RESOLVED_COMPOSITION_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown resolved-composition prototype '${prototypeId}'`);
  return found;
}
