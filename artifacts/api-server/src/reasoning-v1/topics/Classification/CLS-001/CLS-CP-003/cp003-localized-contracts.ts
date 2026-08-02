import type { ClsCp003PrototypeId, ClsCp003Task } from "./types";

export const CLS_CP003_LOCALIZED_LOCALES = ["hi-IN", "pa-IN"] as const;
export type ClsCp003LocalizedLocale = (typeof CLS_CP003_LOCALIZED_LOCALES)[number];

export const CLS_CP003_LOCALIZED_QL_IDS = ["CLS-QL-005", "CLS-QL-006"] as const;
export type ClsCp003LocalizedQlId = (typeof CLS_CP003_LOCALIZED_QL_IDS)[number];

export type ClsCp003LocalizedSolveContractId =
  | "CP003-FIND-WORD-STRUCTURE-OUTLIER"
  | "CP003-RESOLVE-JUMBLES-AND-FIND-SEMANTIC-OUTLIER";

export type ClsCp003LocalizedContract = {
  readonly qlId: ClsCp003LocalizedQlId;
  readonly checkpointId: "CLS-CP-003";
  readonly solveContractId: ClsCp003LocalizedSolveContractId;
  readonly task: ClsCp003Task;
  readonly answerObject: "DISPLAYED_NATIVE_WORD" | "DISPLAYED_NATIVE_JUMBLE";
  readonly allowedPrototypeIds: readonly ClsCp003PrototypeId[];
  readonly locales: readonly ClsCp003LocalizedLocale[];
  readonly status: "LOCALIZED_REVIEW_RUNTIME_PROOF";
};

export const CLS_CP003_LOCALIZED_CONTRACTS: readonly ClsCp003LocalizedContract[] = [
  {
    qlId: "CLS-QL-005",
    checkpointId: "CLS-CP-003",
    solveContractId: "CP003-FIND-WORD-STRUCTURE-OUTLIER",
    task: "FIND_WORD_STRUCTURE_OUTLIER",
    answerObject: "DISPLAYED_NATIVE_WORD",
    allowedPrototypeIds: [
      "CLS-CP003-PROT-001",
      "CLS-CP003-PROT-002",
      "CLS-CP003-PROT-003",
      "CLS-CP003-PROT-004",
      "CLS-CP003-PROT-005",
      "CLS-CP003-PROT-006",
    ],
    locales: CLS_CP003_LOCALIZED_LOCALES,
    status: "LOCALIZED_REVIEW_RUNTIME_PROOF",
  },
  {
    qlId: "CLS-QL-006",
    checkpointId: "CLS-CP-003",
    solveContractId: "CP003-RESOLVE-JUMBLES-AND-FIND-SEMANTIC-OUTLIER",
    task: "RESOLVE_JUMBLES_AND_FIND_OUTLIER",
    answerObject: "DISPLAYED_NATIVE_JUMBLE",
    allowedPrototypeIds: ["CLS-CP003-PROT-007"],
    locales: CLS_CP003_LOCALIZED_LOCALES,
    status: "LOCALIZED_REVIEW_RUNTIME_PROOF",
  },
] as const;

export function getClsCp003LocalizedContract(
  qlId: ClsCp003LocalizedQlId,
): ClsCp003LocalizedContract {
  const contract = CLS_CP003_LOCALIZED_CONTRACTS.find((candidate) => candidate.qlId === qlId);
  if (!contract) throw new Error(`Unknown CLS-CP-003 localized QL: ${qlId}`);
  return contract;
}
