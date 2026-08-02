import type { IneCp001AuthorityId, IneCp001PrototypeId } from "./types";

export interface IneCp001PrototypeContract {
  prototypeId: IneCp001PrototypeId;
  authorityId: IneCp001AuthorityId;
  topology:
    | "DIRECT_EDGE"
    | "LINEAR_CHAIN"
    | "EQUALITY_CHAIN"
    | "OPPOSING_BRANCH";
  minimumStatementCount: number;
  maximumStatementCount: number;
  expectedIndeterminate: boolean;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const INE_CP001_PROTOTYPE_CONTRACTS: readonly IneCp001PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP001-PROT-DIRECT-RELATION",
      authorityId: "DETERMINE_DIRECT_RELATION",
      topology: "DIRECT_EDGE",
      minimumStatementCount: 1,
      maximumStatementCount: 1,
      expectedIndeterminate: false,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-TRANSITIVE-STRICT",
      authorityId: "DETERMINE_TRANSITIVE_RELATION",
      topology: "LINEAR_CHAIN",
      minimumStatementCount: 2,
      maximumStatementCount: 3,
      expectedIndeterminate: false,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-STRONGEST-INCLUSIVE",
      authorityId: "DETERMINE_STRONGEST_DEFINITE_RELATION",
      topology: "LINEAR_CHAIN",
      minimumStatementCount: 2,
      maximumStatementCount: 3,
      expectedIndeterminate: false,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-EQUALITY-PROPAGATION",
      authorityId: "DETERMINE_RELATION_THROUGH_EQUALITY",
      topology: "EQUALITY_CHAIN",
      minimumStatementCount: 2,
      maximumStatementCount: 3,
      expectedIndeterminate: false,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-INDETERMINATE-BRANCH",
      authorityId: "DETERMINE_RELATION_OR_INDETERMINATE",
      topology: "OPPOSING_BRANCH",
      minimumStatementCount: 2,
      maximumStatementCount: 3,
      expectedIndeterminate: true,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
  ] as const;

export function getIneCp001PrototypeContract(
  prototypeId: IneCp001PrototypeId,
): IneCp001PrototypeContract {
  const contract = INE_CP001_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-001 prototype: ${prototypeId}.`);
  return contract;
}
