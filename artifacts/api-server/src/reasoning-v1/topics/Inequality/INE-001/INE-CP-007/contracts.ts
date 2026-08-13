import type {
  IneCp007AuthorityId,
  IneCp007PrototypeId,
  IneCp007TaskKind,
} from "./types";

export interface IneCp007PrototypeContract {
  prototypeId: IneCp007PrototypeId;
  authorityId: IneCp007AuthorityId;
  taskKind: IneCp007TaskKind;
  deliveryProfile: "EXAM_PRACTICE_PROTOTYPE" | "GUIDED_DISCOVERY";
  examApplicability:
    | "BANKING_REGULATORY_PRACTICE_ONLY"
    | "GUIDED_CONCEPT_ONLY";
  sourceLedgerIds: readonly string[];
}

export const INE_CP007_PROTOTYPE_CONTRACTS: readonly IneCp007PrototypeContract[] = [
  {
    prototypeId: "INE-CP007-PROT-MISSING-OPERATOR",
    authorityId: "COMPLETE_MISSING_CODED_OPERATOR",
    taskKind: "MISSING_OPERATOR",
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
    examApplicability: "BANKING_REGULATORY_PRACTICE_ONLY",
    sourceLedgerIds: ["DISHA-INE-005", "DISHA-INE-006"],
  },
  {
    prototypeId: "INE-CP007-PROT-SELECT-EXPRESSION",
    authorityId: "SELECT_CODED_EXPRESSION_FOR_RELATION",
    taskKind: "SELECT_EXPRESSION",
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
    examApplicability: "BANKING_REGULATORY_PRACTICE_ONLY",
    sourceLedgerIds: ["DISHA-INE-005", "DISHA-INE-006"],
  },
  {
    prototypeId: "INE-CP007-PROT-RECOVER-MAP",
    authorityId: "RECOVER_MISSING_MAP_ENTRY",
    taskKind: "RECOVER_MAP",
    deliveryProfile: "GUIDED_DISCOVERY",
    examApplicability: "GUIDED_CONCEPT_ONLY",
    sourceLedgerIds: ["AGG-INE-003", "DISHA-INE-004"],
  },
  {
    prototypeId: "INE-CP007-PROT-CONSISTENT-MAP",
    authorityId: "IDENTIFY_ONLY_CONSISTENT_CODE_MAP",
    taskKind: "CONSISTENT_MAP",
    deliveryProfile: "GUIDED_DISCOVERY",
    examApplicability: "GUIDED_CONCEPT_ONLY",
    sourceLedgerIds: ["AGG-INE-003", "DISHA-INE-004"],
  },
];

export function getIneCp007PrototypeContract(
  prototypeId: IneCp007PrototypeId,
): IneCp007PrototypeContract {
  const contract = INE_CP007_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract) throw new Error(`Unknown INE-CP-007 prototype ${prototypeId}.`);
  return contract;
}
