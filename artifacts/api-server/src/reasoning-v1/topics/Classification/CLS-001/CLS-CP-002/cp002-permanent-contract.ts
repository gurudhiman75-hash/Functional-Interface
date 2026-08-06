import type { ClsCp002PrototypeId } from "./types";

export const CLS_CP002_QL_ID = "CLS-QL-004" as const;
export const CLS_CP002_SOLVE_CONTRACT_ID = "CP002-FIND-ODD-SEMANTIC-RELATION-PAIR" as const;

export type ClsCp002QlId = typeof CLS_CP002_QL_ID;
export type ClsCp002SolveContractId = typeof CLS_CP002_SOLVE_CONTRACT_ID;

export const CLS_CP002_PERMANENT_CONTRACT = {
  qlId: CLS_CP002_QL_ID,
  checkpointId: "CLS-CP-002" as const,
  solveContractId: CLS_CP002_SOLVE_CONTRACT_ID,
  task: "FIND_ODD_PAIR" as const,
  answerObject: "DISPLAYED_PAIR" as const,
  allowedPrototypeIds: [
    "CLS-CP002-PROT-001",
    "CLS-CP002-PROT-002",
    "CLS-CP002-PROT-003",
    "CLS-CP002-PROT-004",
    "CLS-CP002-PROT-005",
  ] as const satisfies readonly ClsCp002PrototypeId[],
  status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF" as const,
};