import type {
  IneCp002AuthorityId,
  IneCp002PrototypeId,
  IneCp002TaskKind,
} from "./types";

export interface IneCp002PrototypeContract {
  prototypeId: IneCp002PrototypeId;
  authorityId: IneCp002AuthorityId;
  taskKind: IneCp002TaskKind;
  minimumStatementCount: number;
  maximumStatementCount: number;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const INE_CP002_PROTOTYPE_CONTRACTS: readonly IneCp002PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP002-PROT-LONG-CHAIN",
      authorityId: "DETERMINE_LONG_CHAIN_RELATION",
      taskKind: "RELATION",
      minimumStatementCount: 2,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-MULTIPLE-ROUTES",
      authorityId: "DETERMINE_MULTI_ROUTE_RELATION",
      taskKind: "RELATION",
      minimumStatementCount: 3,
      maximumStatementCount: 6,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-ALTERNATE-STRICT-PATH",
      authorityId: "APPLY_ALTERNATE_PATH_STRICTNESS",
      taskKind: "RELATION",
      minimumStatementCount: 4,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-BRANCHED-GRAPH",
      authorityId: "DETERMINE_BRANCHED_GRAPH_RELATION",
      taskKind: "RELATION",
      minimumStatementCount: 3,
      maximumStatementCount: 5,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-IRRELEVANT-EVIDENCE",
      authorityId: "FILTER_IRRELEVANT_STATEMENTS",
      taskKind: "RELATION",
      minimumStatementCount: 3,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-SELECT-DEFINITE-PAIR",
      authorityId: "IDENTIFY_PAIR_WITH_DEFINITE_RELATION",
      taskKind: "SELECT_DEFINITE_PAIR",
      minimumStatementCount: 3,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-SELECT-INDETERMINATE-PAIR",
      authorityId: "IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION",
      taskKind: "SELECT_INDETERMINATE_PAIR",
      minimumStatementCount: 4,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-DISCONNECTED-COMPONENTS",
      authorityId: "DETERMINE_DISCONNECTED_PAIR_RELATION",
      taskKind: "RELATION",
      minimumStatementCount: 2,
      maximumStatementCount: 4,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP002-PROT-EQUALITY-SPANNING-BRANCHES",
      authorityId: "PROPAGATE_EQUALITY_ACROSS_BRANCHES",
      taskKind: "RELATION",
      minimumStatementCount: 2,
      maximumStatementCount: 5,
      status: "PROTOTYPE",
      permanentQlId: null,
    },
  ];

export function getIneCp002PrototypeContract(
  prototypeId: IneCp002PrototypeId,
): IneCp002PrototypeContract {
  const contract = INE_CP002_PROTOTYPE_CONTRACTS.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-002 prototype: ${prototypeId}`);
  return contract;
}
