import type {
  BlrCp001AdvancedAnswerType,
  BlrCp001AdvancedPrototypeId,
  BlrCp001AdvancedRuleId,
  BlrCp001AdvancedTaskKind,
} from "./advanced-prototype-types";

export interface BlrCp001AdvancedPrototypeContract {
  prototypeId: BlrCp001AdvancedPrototypeId;
  taskKind: BlrCp001AdvancedTaskKind;
  answerType: BlrCp001AdvancedAnswerType;
  ruleId: BlrCp001AdvancedRuleId;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS: readonly BlrCp001AdvancedPrototypeContract[] = [
  {
    prototypeId: "BLR-CP001-PROT-IDENTIFY-PERSON",
    taskKind: "IDENTIFY_PERSON_BY_RELATION",
    answerType: "PERSON_NAME",
    ruleId: "BLOOD_GRAPH_IDENTITY",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-IDENTIFY-PAIR",
    taskKind: "IDENTIFY_ORDERED_PAIR",
    answerType: "ORDERED_PAIR",
    ruleId: "BLOOD_GRAPH_PAIR",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-RELATION-CLAIM",
    taskKind: "SELECT_RELATION_CLAIM",
    answerType: "RELATION_CLAIM",
    ruleId: "BLOOD_GRAPH_CLAIM",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-GENERATION-COMPARISON",
    taskKind: "COMPARE_GENERATIONS",
    answerType: "GENERATION_LABEL",
    ruleId: "BLOOD_GRAPH_GENERATION",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-BRANCHING-RELATION",
    taskKind: "SOLVE_BRANCHING_RELATION",
    answerType: "RELATION_LABEL",
    ruleId: "BLOOD_GRAPH_RELATION",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
] as const;

export function getBlrCp001AdvancedPrototypeContract(
  prototypeId: BlrCp001AdvancedPrototypeId,
): BlrCp001AdvancedPrototypeContract {
  const contract = BLR_CP001_ADVANCED_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract) {
    throw new Error(`Unknown BLR-CP-001 advanced prototype: ${prototypeId}.`);
  }
  return contract;
}
