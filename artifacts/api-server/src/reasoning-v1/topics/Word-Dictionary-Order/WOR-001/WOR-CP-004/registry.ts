import type { WorPrototypeContract } from "../foundation/types";

export const WOR_CP004_PROTOTYPES: readonly WorPrototypeContract[] = [
  { prototypeId: "WOR-PROT-016", checkpointId: "WOR-CP-004", taskKind: "SELECT_COMPLETE_ORDER", answerType: "WORD_SEQUENCE", title: "Advanced common-prefix order", allocationDecision: "MERGE_AS_INSTANCE_VARIANT", hardOnly: true },
  { prototypeId: "WOR-PROT-017", checkpointId: "WOR-CP-004", taskKind: "SELECT_KTH", answerType: "WORD", title: "Advanced common-prefix position", allocationDecision: "MERGE_AS_INSTANCE_VARIANT", hardOnly: true },
  { prototypeId: "WOR-PROT-018", checkpointId: "WOR-CP-004", taskKind: "FIND_RANK", answerType: "RANK", title: "Advanced common-prefix rank", allocationDecision: "MERGE_AS_INSTANCE_VARIANT", hardOnly: true },
  { prototypeId: "WOR-PROT-019", checkpointId: "WOR-CP-004", taskKind: "INSERT_WORD", answerType: "RANK", title: "Advanced common-prefix insertion", allocationDecision: "MERGE_AS_INSTANCE_VARIANT", hardOnly: true },
];
