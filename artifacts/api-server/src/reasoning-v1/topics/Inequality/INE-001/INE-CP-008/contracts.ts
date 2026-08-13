import type {
  IneCp008AuthorityId,
  IneCp008PrototypeId,
  IneCp008TaskKind,
} from "./types";

export interface IneCp008PrototypeContract {
  prototypeId: IneCp008PrototypeId;
  authorityId: IneCp008AuthorityId;
  taskKind: IneCp008TaskKind;
  deliveryProfile: "EXAM_PRACTICE_PROTOTYPE" | "GUIDED_ADVANCED_PROTOTYPE";
  examApplicability:
    | "BANKING_REGULATORY_PRACTICE_ONLY"
    | "GUIDED_CONCEPT_ONLY";
  sourceLedgerIds: readonly string[];
}

export const INE_CP008_PROTOTYPE_CONTRACTS: readonly IneCp008PrototypeContract[] = [
  {
    prototypeId: "INE-CP008-PROT-SELECT-STATEMENT-SET",
    authorityId: "SELECT_SET_ESTABLISHING_RELATION",
    taskKind: "SELECT_STATEMENT_SET",
    deliveryProfile: "GUIDED_ADVANCED_PROTOTYPE",
    examApplicability: "GUIDED_CONCEPT_ONLY",
    sourceLedgerIds: ["DISHA-INE-005", "DISHA-INE-006"],
  },
  {
    prototypeId: "INE-CP008-PROT-CONTRADICTORY-ADDITION",
    authorityId: "IDENTIFY_CONTRADICTORY_ADDITION",
    taskKind: "CONTRADICTORY_ADDITION",
    deliveryProfile: "GUIDED_ADVANCED_PROTOTYPE",
    examApplicability: "GUIDED_CONCEPT_ONLY",
    sourceLedgerIds: ["DISHA-INE-005", "DISHA-INE-006"],
  },
  {
    prototypeId: "INE-CP008-PROT-RECONSTRUCT-RELATION",
    authorityId: "RECONSTRUCT_MISSING_RELATION",
    taskKind: "RECONSTRUCT_RELATION",
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
    examApplicability: "BANKING_REGULATORY_PRACTICE_ONLY",
    sourceLedgerIds: ["DISHA-INE-005", "DISHA-INE-006"],
  },
  {
    prototypeId: "INE-CP008-PROT-POSSIBLE-CONCLUSION",
    authorityId: "SELECT_POSSIBLE_NOT_DEFINITE_CONCLUSION",
    taskKind: "POSSIBLE_CONCLUSION",
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
    examApplicability: "BANKING_REGULATORY_PRACTICE_ONLY",
    sourceLedgerIds: ["AGG-INE-004", "AGG-INE-005", "DISHA-INE-006"],
  },
];

export function getIneCp008PrototypeContract(
  prototypeId: IneCp008PrototypeId,
): IneCp008PrototypeContract {
  const contract = INE_CP008_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract) throw new Error(`Unknown INE-CP-008 prototype ${prototypeId}.`);
  return contract;
}
