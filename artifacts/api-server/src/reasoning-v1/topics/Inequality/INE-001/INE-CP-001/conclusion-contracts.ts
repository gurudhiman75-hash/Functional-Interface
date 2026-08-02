import type { IneCp001ConclusionPrototypeId } from "./types";

export interface IneCp001ConclusionContract {
  prototypeId: IneCp001ConclusionPrototypeId;
  authorityId:
    | "EVALUATE_SINGLE_CONCLUSION"
    | "SELECT_VALID_CONCLUSION"
    | "SELECT_INVALID_CONCLUSION";
  answerType: "CONCLUSION_TRUTH" | "CONCLUSION_SELECTION";
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const INE_CP001_CONCLUSION_CONTRACTS: readonly IneCp001ConclusionContract[] =
  [
    {
      prototypeId: "INE-CP001-PROT-EVALUATE-SINGLE-CONCLUSION",
      authorityId: "EVALUATE_SINGLE_CONCLUSION",
      answerType: "CONCLUSION_TRUTH",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-SELECT-VALID-CONCLUSION",
      authorityId: "SELECT_VALID_CONCLUSION",
      answerType: "CONCLUSION_SELECTION",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
    {
      prototypeId: "INE-CP001-PROT-SELECT-INVALID-CONCLUSION",
      authorityId: "SELECT_INVALID_CONCLUSION",
      answerType: "CONCLUSION_SELECTION",
      status: "PROTOTYPE",
      permanentQlId: null,
    },
  ] as const;

export function getIneCp001ConclusionContract(
  prototypeId: IneCp001ConclusionPrototypeId,
): IneCp001ConclusionContract {
  const contract = INE_CP001_CONCLUSION_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract)
    throw new Error(`Unknown INE-CP-001 conclusion prototype: ${prototypeId}.`);
  return contract;
}
