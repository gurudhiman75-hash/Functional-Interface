import type { ClsCp004PrototypeId } from "./types";
import { CLS_CP004_PROTOTYPES } from "./number-domain";

export const CLS_CP004_ENGLISH_QL_ID = "CLS-QL-007" as const;
export const CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID = "CP004-FIND-NUMBER-PROPERTY-OUTLIER" as const;

export type ClsCp004EnglishQlId = typeof CLS_CP004_ENGLISH_QL_ID;
export type ClsCp004EnglishSolveContractId = typeof CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID;

export const CLS_CP004_ENGLISH_CONTRACT = {
  qlId: CLS_CP004_ENGLISH_QL_ID,
  checkpointId: "CLS-CP-004" as const,
  solveContractId: CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID,
  task: "FIND_NUMBER_PROPERTY_OUTLIER" as const,
  answerObject: "DISPLAYED_NUMBER" as const,
  allowedPrototypeIds: CLS_CP004_PROTOTYPES.map((prototype) => prototype.prototypeId) as readonly ClsCp004PrototypeId[],
  locale: "en-IN" as const,
  status: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
};
