import type { WorPrototypeContract } from "../foundation/types";

export const WOR_CP002_PROTOTYPES: readonly WorPrototypeContract[] = [
  { prototypeId: "WOR-PROT-005", checkpointId: "WOR-CP-002", taskKind: "SELECT_KTH", answerType: "WORD", title: "Word at a specified position", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-006", checkpointId: "WOR-CP-002", taskKind: "FIND_RANK", answerType: "RANK", title: "Position of a specified word", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-007", checkpointId: "WOR-CP-002", taskKind: "SELECT_PREDECESSOR", answerType: "WORD", title: "Immediate predecessor", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-008", checkpointId: "WOR-CP-002", taskKind: "SELECT_SUCCESSOR", answerType: "WORD", title: "Immediate successor", allocationDecision: "RETAIN" },
  { prototypeId: "WOR-PROT-009", checkpointId: "WOR-CP-002", taskKind: "SELECT_MIDDLE", answerType: "WORD", title: "Middle word after ordering", allocationDecision: "RETAIN" },
];
