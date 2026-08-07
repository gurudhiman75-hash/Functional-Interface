import type {
  IneCp006AuthorityId,
  IneCp006PrototypeId,
  IneCp006TaskKind,
} from "./types";

export interface IneCp006PrototypeContract {
  prototypeId: IneCp006PrototypeId;
  authorityId: IneCp006AuthorityId;
  taskKind: IneCp006TaskKind;
  deliveryProfile: "GUIDED_CONCEPT" | "EXAM_PRACTICE_PROTOTYPE";
  status: "PROTOTYPE";
  permanentQlId: null;
  sourceLedgerIds: readonly string[];
}

export const INE_CP006_PROTOTYPE_CONTRACTS: readonly IneCp006PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP006-PROT-DECODE-RELATION",
      authorityId: "DECODE_FIXED_MAP_RELATION",
      taskKind: "DECODE_RELATION",
      deliveryProfile: "GUIDED_CONCEPT",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-003", "DISHA-INE-004"],
    },
    {
      prototypeId: "INE-CP006-PROT-SOLVE-CODED-CHAIN",
      authorityId: "SOLVE_FIXED_MAP_CODED_CHAIN",
      taskKind: "SOLVE_RELATION",
      deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-003", "AGG-INE-004", "AGG-INE-005"],
    },
    {
      prototypeId: "INE-CP006-PROT-EVALUATE-CODED-CONCLUSIONS",
      authorityId: "EVALUATE_FIXED_MAP_CODED_CONCLUSIONS",
      taskKind: "EVALUATE_CONCLUSIONS",
      deliveryProfile: "EXAM_PRACTICE_PROTOTYPE",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-004", "DISHA-INE-004", "DISHA-INE-006"],
    },
    {
      prototypeId: "INE-CP006-PROT-ENCODE-RELATION",
      authorityId: "ENCODE_FIXED_MAP_RELATION",
      taskKind: "ENCODE_RELATION",
      deliveryProfile: "GUIDED_CONCEPT",
      status: "PROTOTYPE",
      permanentQlId: null,
      sourceLedgerIds: ["AGG-INE-003", "DISHA-INE-004"],
    },
  ];

export function getIneCp006PrototypeContract(
  prototypeId: IneCp006PrototypeId,
): IneCp006PrototypeContract {
  const contract = INE_CP006_PROTOTYPE_CONTRACTS.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-006 prototype ${prototypeId}.`);
  return contract;
}
