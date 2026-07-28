import type { BlrCp002PrototypeId } from "./cp002-types";

export interface BlrCp002PrototypeContract {
  prototypeId: BlrCp002PrototypeId;
  taskKind:
    | "POINTED_TO_SPEAKER"
    | "SPEAKER_TO_POINTED"
    | "NESTED_QUERY_ENDPOINT"
    | "TWO_SPEAKER_CONVERSATION"
    | "SELF_IDENTITY";
  requiredAnswerShape: "RELATION_LABEL" | "RELATION_LABEL_OR_SELF";
  requiresListener: boolean;
  requiresPointedPerson: boolean;
  minimumRoleDepth: number;
  status: "PROTOTYPE";
  permanentQlId: null;
}

export const BLR_CP002_PROTOTYPE_CONTRACTS: readonly BlrCp002PrototypeContract[] = [
  {
    prototypeId: "BLR-CP002-PROT-POINTED-TO-SPEAKER",
    taskKind: "POINTED_TO_SPEAKER",
    requiredAnswerShape: "RELATION_LABEL",
    requiresListener: false,
    requiresPointedPerson: true,
    minimumRoleDepth: 1,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP002-PROT-SPEAKER-TO-POINTED",
    taskKind: "SPEAKER_TO_POINTED",
    requiredAnswerShape: "RELATION_LABEL",
    requiresListener: false,
    requiresPointedPerson: true,
    minimumRoleDepth: 1,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP002-PROT-NESTED-QUERY-ENDPOINT",
    taskKind: "NESTED_QUERY_ENDPOINT",
    requiredAnswerShape: "RELATION_LABEL",
    requiresListener: false,
    requiresPointedPerson: true,
    minimumRoleDepth: 2,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP002-PROT-TWO-SPEAKER-CONVERSATION",
    taskKind: "TWO_SPEAKER_CONVERSATION",
    requiredAnswerShape: "RELATION_LABEL",
    requiresListener: true,
    requiresPointedPerson: false,
    minimumRoleDepth: 2,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
  {
    prototypeId: "BLR-CP002-PROT-SELF-IDENTITY",
    taskKind: "SELF_IDENTITY",
    requiredAnswerShape: "RELATION_LABEL_OR_SELF",
    requiresListener: false,
    requiresPointedPerson: true,
    minimumRoleDepth: 1,
    status: "PROTOTYPE",
    permanentQlId: null,
  },
] as const;

export function getBlrCp002PrototypeContract(
  prototypeId: BlrCp002PrototypeId,
): BlrCp002PrototypeContract {
  const contract = BLR_CP002_PROTOTYPE_CONTRACTS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!contract) throw new Error(`Unknown BLR-CP-002 prototype: ${prototypeId}.`);
  return contract;
}
