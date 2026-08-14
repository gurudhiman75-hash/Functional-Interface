import type { WorPrototypeContract } from "../foundation/types";

export const WOR_CP001_PROTOTYPES: readonly WorPrototypeContract[] = [
  { prototypeId: "WOR-PROT-001", checkpointId: "WOR-CP-001", taskKind: "SELECT_COMPLETE_ORDER", answerType: "WORD_SEQUENCE", title: "Complete ascending dictionary order", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-002", checkpointId: "WOR-CP-001", taskKind: "SELECT_DESCENDING_ORDER", answerType: "WORD_SEQUENCE", title: "Complete reverse dictionary order", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-003", checkpointId: "WOR-CP-001", taskKind: "SELECT_FIRST", answerType: "WORD", title: "Alphabetically first word", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-004", checkpointId: "WOR-CP-001", taskKind: "SELECT_LAST", answerType: "WORD", title: "Alphabetically last word", allocationDecision: "RETAIN" },
];
