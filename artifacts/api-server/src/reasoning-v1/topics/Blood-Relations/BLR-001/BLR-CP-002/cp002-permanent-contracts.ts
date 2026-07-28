import type { BlrCp002PrototypeId, BlrCp002QuestionForm } from "./cp002-types";

export type BlrCp002QlId = "BLR-QL-008";
export type BlrCp002SolveAuthority = "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION";

export interface BlrCp002PermanentContract {
  qlId: BlrCp002QlId;
  checkpointId: "BLR-CP-002";
  solveAuthority: BlrCp002SolveAuthority;
  sourcePrototypeIds: readonly BlrCp002PrototypeId[];
  questionForms: readonly BlrCp002QuestionForm[];
  answerType: "RELATION_LABEL_OR_SELF";
  status: "ENGLISH_RUNTIME_PROOF";
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
}

export const BLR_CP002_SOURCE_PROTOTYPE_IDS: readonly BlrCp002PrototypeId[] = [
  "BLR-CP002-PROT-POINTED-TO-SPEAKER",
  "BLR-CP002-PROT-SPEAKER-TO-POINTED",
  "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
  "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
  "BLR-CP002-PROT-THREE-ANCHOR-INTRODUCTION",
  "BLR-CP002-PROT-SELF-IDENTITY",
] as const;

export const BLR_CP002_PERMANENT_CONTRACTS: readonly BlrCp002PermanentContract[] = [
  {
    qlId: "BLR-QL-008",
    checkpointId: "BLR-CP-002",
    solveAuthority: "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
    sourcePrototypeIds: BLR_CP002_SOURCE_PROTOTYPE_IDS,
    questionForms: ["HOW_RELATED", "WHOSE_PHOTOGRAPH", "WHOSE_PORTRAIT"],
    answerType: "RELATION_LABEL_OR_SELF",
    status: "ENGLISH_RUNTIME_PROOF",
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
  },
] as const;

export function getBlrCp002PermanentContract(
  qlId: BlrCp002QlId,
): BlrCp002PermanentContract {
  const contract = BLR_CP002_PERMANENT_CONTRACTS.find(
    (entry) => entry.qlId === qlId,
  );
  if (!contract) throw new Error(`Unknown BLR-CP-002 QL '${qlId}'.`);
  return contract;
}
