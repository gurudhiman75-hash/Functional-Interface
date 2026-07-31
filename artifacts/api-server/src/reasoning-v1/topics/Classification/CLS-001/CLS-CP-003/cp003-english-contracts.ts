import type { ClsCp003PrototypeId, ClsCp003Task } from "./types";

export const CLS_CP003_ENGLISH_QL_IDS = ["CLS-QL-005", "CLS-QL-006"] as const;
export type ClsCp003EnglishQlId = (typeof CLS_CP003_ENGLISH_QL_IDS)[number];

export type ClsCp003EnglishSolveContractId =
  | "CP003-FIND-WORD-STRUCTURE-OUTLIER"
  | "CP003-RESOLVE-JUMBLES-AND-FIND-SEMANTIC-OUTLIER";

export type ClsCp003EnglishContract = {
  readonly qlId: ClsCp003EnglishQlId;
  readonly checkpointId: "CLS-CP-003";
  readonly solveContractId: ClsCp003EnglishSolveContractId;
  readonly task: ClsCp003Task;
  readonly answerObject: "DISPLAYED_WORD" | "DISPLAYED_JUMBLE";
  readonly allowedPrototypeIds: readonly ClsCp003PrototypeId[];
  readonly locale: "en-IN";
  readonly status: "FROZEN_ENGLISH_RUNTIME_PROOF";
};

export const CLS_CP003_ENGLISH_CONTRACTS: readonly ClsCp003EnglishContract[] = [
  {
    qlId: "CLS-QL-005",
    checkpointId: "CLS-CP-003",
    solveContractId: "CP003-FIND-WORD-STRUCTURE-OUTLIER",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    answerObject: "DISPLAYED_WORD",
    allowedPrototypeIds: [
      "CLS-CP003-PROT-001",
      "CLS-CP003-PROT-002",
      "CLS-CP003-PROT-003",
      "CLS-CP003-PROT-004",
      "CLS-CP003-PROT-005",
      "CLS-CP003-PROT-006",
    ],
    locale: "en-IN",
    status: "FROZEN_ENGLISH_RUNTIME_PROOF",
  },
  {
    qlId: "CLS-QL-006",
    checkpointId: "CLS-CP-003",
    solveContractId: "CP003-RESOLVE-JUMBLES-AND-FIND-SEMANTIC-OUTLIER",
    task: "RESOLVE_JUMBLES_AND_FIND_OUTLIER",
    answerObject: "DISPLAYED_JUMBLE",
    allowedPrototypeIds: ["CLS-CP003-PROT-007"],
    locale: "en-IN",
    status: "FROZEN_ENGLISH_RUNTIME_PROOF",
  },
] as const;

export function getClsCp003EnglishContract(qlId: ClsCp003EnglishQlId): ClsCp003EnglishContract {
  const contract = CLS_CP003_ENGLISH_CONTRACTS.find((candidate) => candidate.qlId === qlId);
  if (!contract) throw new Error(`Unknown CLS-CP-003 English QL: ${qlId}`);
  return contract;
}
