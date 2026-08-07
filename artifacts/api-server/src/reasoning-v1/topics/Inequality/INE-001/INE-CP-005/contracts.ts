import type {
  IneCp005AuthorityId,
  IneCp005PrototypeId,
  IneCp005TaskKind,
} from "./types";

export interface IneCp005PrototypeContract {
  prototypeId: IneCp005PrototypeId;
  authorityId: IneCp005AuthorityId;
  taskKind: IneCp005TaskKind;
  deliveryProfile:
    | "GUIDED_CONCEPT"
    | "EXAM_PRACTICE_PROTOTYPE"
    | "BANKING_MOCK_PROTOTYPE";
  status: "PROTOTYPE";
  permanentQlId: null;
  sourceLedgerIds: readonly string[];
}

export const INE_CP005_PROTOTYPE_CONTRACTS: readonly IneCp005PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP005-PROT-INTERPRET-LINGUISTIC-RELATION",
      authorityId: "INTERPRET_LINGUISTIC_RELATION",
      taskKind: "INTERPRET_RELATION",
      deliveryProfile: "GUIDED_CONCEPT",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001"],
    },
    {
      prototypeId: "INE-CP005-PROT-SOLVE-LINGUISTIC-CHAIN",
      authorityId: "SOLVE_LINGUISTIC_CHAIN",
      taskKind: "SOLVE_RELATION",
      deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001", "AGG-INE-005", "DISHA-INE-002"],
    },
    {
      prototypeId: "INE-CP005-PROT-SOLVE-MIXED-CHAIN",
      authorityId: "SOLVE_MIXED_LINGUISTIC_SYMBOLIC_CHAIN",
      taskKind: "SOLVE_MIXED_RELATION",
      deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001", "AGG-INE-004", "AGG-INE-005"],
    },
    {
      prototypeId: "INE-CP005-PROT-CONTEXTUAL-CONCLUSIONS",
      authorityId: "EVALUATE_CONTEXTUAL_LINGUISTIC_CONCLUSIONS",
      taskKind: "EVALUATE_CONCLUSIONS",
      deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-001", "AGG-INE-002", "DISHA-INE-003"],
    },
  ];

export function getIneCp005PrototypeContract(
  prototypeId: IneCp005PrototypeId,
): IneCp005PrototypeContract {
  const contract = INE_CP005_PROTOTYPE_CONTRACTS.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-005 prototype ${prototypeId}.`);
  return contract;
}
