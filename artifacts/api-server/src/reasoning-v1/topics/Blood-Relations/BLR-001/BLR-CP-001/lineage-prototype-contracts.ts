import type {
  BlrCp001LineageAnswerType,
  BlrCp001LineagePrototypeId,
  BlrCp001LineageRuleId,
  BlrCp001LineageTaskKind,
} from "./lineage-prototype-types";

export interface BlrCp001LineagePrototypeContract {
  prototypeId: BlrCp001LineagePrototypeId;
  taskKind: BlrCp001LineageTaskKind;
  answerType: BlrCp001LineageAnswerType;
  ruleId: BlrCp001LineageRuleId;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS: readonly BlrCp001LineagePrototypeContract[] = [
  {
    prototypeId: "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER",
    taskKind: "IDENTIFY_PERSON_BY_GENDER",
    answerType: "PERSON_NAME",
    ruleId: "BLOOD_GRAPH_GENDER",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP001-PROT-EXACT-LINEAGE-RELATION",
    taskKind: "SOLVE_EXACT_LINEAGE_RELATION",
    answerType: "EXACT_LINEAGE_RELATION",
    ruleId: "BLOOD_GRAPH_EXACT_LINEAGE",
    status: "PROTOTYPE",
    permanentQlId: null,
  },
] as const;

export function getBlrCp001LineagePrototypeContract(
  prototypeId: BlrCp001LineagePrototypeId,
): BlrCp001LineagePrototypeContract {
  const contract = BLR_CP001_LINEAGE_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract) {
    throw new Error(`Unknown BLR-CP-001 lineage prototype: ${prototypeId}.`);
  }
  return contract;
}
