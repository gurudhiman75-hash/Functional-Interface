import type {
  IneCp003AuthorityId,
  IneCp003PrototypeId,
  IneCp003TaskKind,
} from "./types";

export interface IneCp003PrototypeContract {
  prototypeId: IneCp003PrototypeId;
  authorityId: IneCp003AuthorityId;
  taskKind: IneCp003TaskKind;
  targetTruth?: "DEFINITELY_TRUE" | "POSSIBLY_TRUE" | "IMPOSSIBLE";
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const INE_CP003_PROTOTYPE_CONTRACTS: readonly IneCp003PrototypeContract[] =
  [
    {
      prototypeId: "INE-CP003-PROT-CLASSIFY-SINGLE-CONCLUSION",
      authorityId: "CLASSIFY_SINGLE_CONCLUSION_TRUTH",
      taskKind: "CLASSIFY_CONCLUSION",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP003-PROT-SELECT-DEFINITE-CONCLUSION",
      authorityId: "IDENTIFY_DEFINITELY_TRUE_CONCLUSION",
      taskKind: "SELECT_CONCLUSION",
      targetTruth: "DEFINITELY_TRUE",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP003-PROT-SELECT-POSSIBLE-CONCLUSION",
      authorityId: "IDENTIFY_POSSIBLY_TRUE_CONCLUSION",
      taskKind: "SELECT_CONCLUSION",
      targetTruth: "POSSIBLY_TRUE",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP003-PROT-SELECT-IMPOSSIBLE-CONCLUSION",
      authorityId: "IDENTIFY_IMPOSSIBLE_CONCLUSION",
      taskKind: "SELECT_CONCLUSION",
      targetTruth: "IMPOSSIBLE",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP003-PROT-IDENTIFY-POSSIBLE-RELATIONS",
      authorityId: "IDENTIFY_ALL_POSSIBLE_RELATIONS",
      taskKind: "SELECT_RELATION_SET",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP003-PROT-EVALUATE-INCLUSIVE-CONCLUSION",
      authorityId: "EVALUATE_INCLUSIVE_CONCLUSION_TRUTH",
      taskKind: "CLASSIFY_CONCLUSION",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
  ];

export function getIneCp003PrototypeContract(
  prototypeId: IneCp003PrototypeId,
): IneCp003PrototypeContract {
  const contract = INE_CP003_PROTOTYPE_CONTRACTS.find(
    (candidate) => candidate.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-003 prototype ${prototypeId}.`);
  return contract;
}
