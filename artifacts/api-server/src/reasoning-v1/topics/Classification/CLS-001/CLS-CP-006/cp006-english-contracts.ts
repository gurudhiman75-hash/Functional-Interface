import { CLS_CP006_PROTOTYPES } from "./alphabet-domain";
import type { ClsCp006PrototypeId, ClsCp006RuleId } from "./types";

export const CLS_CP006_ODD_LETTER_QL_ID = "CLS-QL-010" as const;
export const CLS_CP006_ODD_LETTER_PAIR_QL_ID = "CLS-QL-011" as const;

export const CLS_CP006_ODD_LETTER_SOLVE_CONTRACT_ID =
  "CP006-FIND-ODD-SINGLE-LETTER" as const;
export const CLS_CP006_ODD_LETTER_PAIR_SOLVE_CONTRACT_ID =
  "CP006-FIND-ODD-ORDERED-LETTER-PAIR" as const;

export type ClsCp006EnglishQlId =
  | typeof CLS_CP006_ODD_LETTER_QL_ID
  | typeof CLS_CP006_ODD_LETTER_PAIR_QL_ID;

export type ClsCp006PermanentSourceDescriptor = {
  readonly prototypeId: ClsCp006PrototypeId;
  readonly ruleId: ClsCp006RuleId;
};

export const CLS_CP006_ODD_LETTER_SOURCES: readonly ClsCp006PermanentSourceDescriptor[] =
  CLS_CP006_PROTOTYPES
    .filter((prototype) => prototype.optionKind === "LETTER")
    .map((prototype) => ({
      prototypeId: prototype.prototypeId,
      ruleId: prototype.allowedRuleIds[0]!,
    }));

export const CLS_CP006_ODD_LETTER_PAIR_SOURCES: readonly ClsCp006PermanentSourceDescriptor[] =
  CLS_CP006_PROTOTYPES
    .filter((prototype) => prototype.optionKind === "LETTER_PAIR")
    .map((prototype) => ({
      prototypeId: prototype.prototypeId,
      ruleId: prototype.allowedRuleIds[0]!,
    }));

export const CLS_CP006_ENGLISH_CONTRACTS = [
  {
    qlId: CLS_CP006_ODD_LETTER_QL_ID,
    checkpointId: "CLS-CP-006" as const,
    solveContractId: CLS_CP006_ODD_LETTER_SOLVE_CONTRACT_ID,
    task: "FIND_ODD_LETTER" as const,
    answerObject: "DISPLAYED_SINGLE_LATIN_LETTER" as const,
    optionKind: "LETTER" as const,
    referenceState: "ABSENT" as const,
    allowedSources: CLS_CP006_ODD_LETTER_SOURCES,
    locale: "en-IN" as const,
    status: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
  },
  {
    qlId: CLS_CP006_ODD_LETTER_PAIR_QL_ID,
    checkpointId: "CLS-CP-006" as const,
    solveContractId: CLS_CP006_ODD_LETTER_PAIR_SOLVE_CONTRACT_ID,
    task: "FIND_ODD_LETTER_PAIR" as const,
    answerObject: "DISPLAYED_COMPLETE_ORDERED_LETTER_PAIR" as const,
    optionKind: "LETTER_PAIR" as const,
    referenceState: "ABSENT" as const,
    allowedSources: CLS_CP006_ODD_LETTER_PAIR_SOURCES,
    locale: "en-IN" as const,
    status: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
  },
] as const;

export const CLS_CP006_ENGLISH_CONTRACT_BY_QL = new Map(
  CLS_CP006_ENGLISH_CONTRACTS.map((contract) => [contract.qlId, contract]),
);
