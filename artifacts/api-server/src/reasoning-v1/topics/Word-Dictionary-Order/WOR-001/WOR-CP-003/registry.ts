import type { WorPrototypeContract } from "../foundation/types";

export const WOR_CP003_PROTOTYPES: readonly WorPrototypeContract[] = [
  { prototypeId: "WOR-PROT-010", checkpointId: "WOR-CP-003", taskKind: "INSERT_WORD", answerType: "RANK", title: "Insert a new word", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
  { prototypeId: "WOR-PROT-011", checkpointId: "WOR-CP-003", taskKind: "RANK_AFTER_INSERTION", answerType: "RANK", title: "Rank after insertion", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
  { prototypeId: "WOR-PROT-012", checkpointId: "WOR-CP-003", taskKind: "PREDECESSOR_AFTER_INSERTION", answerType: "WORD", title: "Predecessor after insertion", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
  { prototypeId: "WOR-PROT-013", checkpointId: "WOR-CP-003", taskKind: "FIND_MISPLACED_WORD", answerType: "WORD", title: "Find the misplaced word", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
  { prototypeId: "WOR-PROT-014", checkpointId: "WOR-CP-003", taskKind: "FIND_INCORRECT_PAIR", answerType: "WORD_PAIR", title: "Find the incorrectly ordered pair", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
  { prototypeId: "WOR-PROT-015", checkpointId: "WOR-CP-003", taskKind: "COMPLETE_PARTIAL_ORDER", answerType: "WORD", title: "Complete a partial dictionary order", allocationDecision: "RETAIN", sourceEvidenceStatus: "EXPLORATORY_SOURCE_GAP" },
];
