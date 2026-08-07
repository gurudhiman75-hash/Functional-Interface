import type {
  IneCp004AuthorityId,
  IneCp004PrototypeId,
  IneCp004TaskKind,
} from "./types";

export interface IneCp004PrototypeContract {
  prototypeId: IneCp004PrototypeId;
  authorityId: IneCp004AuthorityId;
  taskKind: IneCp004TaskKind;
  deliveryProfile: "GUIDED_CONCEPT" | "BANKING_MOCK_PROTOTYPE";
  status: "PROTOTYPE";
  permanentQlId: null;
  sourceLedgerIds: readonly string[];
}

export const INE_CP004_PROTOTYPE_CONTRACTS: readonly IneCp004PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP004-PROT-CLASSIFY-COMPLEMENTARY-PAIR",
      authorityId: "CLASSIFY_COMPLEMENTARY_PAIR",
      taskKind: "CLASSIFY_PAIR",
      deliveryProfile: "GUIDED_CONCEPT",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001", "AGG-INE-005", "DISHA-INE-006"],
    },
    {
      prototypeId: "INE-CP004-PROT-IDENTIFY-COMPLEMENTARY-PAIR",
      authorityId: "IDENTIFY_COMPLEMENTARY_PAIR",
      taskKind: "SELECT_PAIR",
      deliveryProfile: "GUIDED_CONCEPT",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001", "DISHA-INE-006"],
    },
    {
      prototypeId: "INE-CP004-PROT-RESOLVE-EITHER-OR-CONCLUSIONS",
      authorityId: "RESOLVE_EITHER_OR_CONCLUSIONS",
      taskKind: "EVALUATE_TWO_CONCLUSIONS",
      deliveryProfile: "BANKING_MOCK_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-002", "DISHA-INE-003", "DISHA-INE-006"],
    },
    {
      prototypeId: "INE-CP004-PROT-DEFINITE-PLUS-EITHER-OR",
      authorityId: "RESOLVE_DEFINITE_PLUS_EITHER_OR",
      taskKind: "EVALUATE_THREE_CONCLUSIONS",
      deliveryProfile: "BANKING_MOCK_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-002", "AGG-INE-005", "DISHA-INE-006"],
    },
  ];

export function getIneCp004PrototypeContract(
  prototypeId: IneCp004PrototypeId,
): IneCp004PrototypeContract {
  const contract = INE_CP004_PROTOTYPE_CONTRACTS.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-004 prototype ${prototypeId}.`);
  return contract;
}
