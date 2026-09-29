export type Sea001QlId =
  | "SEA-QL-001"
  | "SEA-QL-002"
  | "SEA-QL-003"
  | "SEA-QL-004"
  | "SEA-QL-005"
  | "SEA-QL-006"
  | "SEA-QL-007"
  | "SEA-QL-008"
  | "SEA-QL-009";

export type Sea001QlDeliveryRole =
  | "MOCK_AUTHENTIC_BASELINE"
  | "PRACTICE_VARIANT_WITHIN_QL";

export interface Sea001QlDefinition {
  qlId: Sea001QlId;
  learnerContract: string;
  answerSemantics: string;
  runtimeQueryContracts: readonly string[];
  reviewExtensionKinds: readonly string[];
  checkpoints: readonly string[];
  notes: string;
}

export const SEA_001_QLS: readonly Sea001QlDefinition[] = Object.freeze([
  {
    qlId: "SEA-QL-001",
    learnerContract: "IDENTIFY_ENDPOINT_OCCUPANCY",
    answerSemantics: "person or pair occupying one/both extreme positions",
    runtimeQueryContracts: ["SEA-QC-001"],
    reviewExtensionKinds: ["EXTREME_END_PAIR"],
    checkpoints: ["SEA-CP-001", "SEA-CP-002"],
    notes: "Single-end and both-end questions share one endpoint-reading operation.",
  },
  {
    qlId: "SEA-QL-002",
    learnerContract: "IDENTIFY_PERSON_AT_RELATIVE_POSITION",
    answerSemantics: "person at immediate/k-th left or right of reference",
    runtimeQueryContracts: ["SEA-QC-003", "SEA-QC-005", "SEA-QC-022"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    notes: "Immediate is steps=1. QC022 is a transformed-facing practice variant under the same learner contract.",
  },
  {
    qlId: "SEA-QL-003",
    learnerContract: "DESCRIBE_RELATIVE_POSITION",
    answerSemantics: "left/right relation and ordinal distance between two people",
    runtimeQueryContracts: [],
    reviewExtensionKinds: ["RELATIVE_POSITION_DESCRIPTION", "DEFINITELY_TRUE_RELATION_STATEMENT"],
    checkpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    notes: "Definitely-true relation statement is a presentation shell over the same solved relation.",
  },
  {
    qlId: "SEA-QL-004",
    learnerContract: "IDENTIFY_IMMEDIATE_NEIGHBOURS",
    answerSemantics: "pair of persons directly adjacent to a reference",
    runtimeQueryContracts: ["SEA-QC-006"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    notes: "Physical adjacency is independent of facing direction.",
  },
  {
    qlId: "SEA-QL-005",
    learnerContract: "COUNT_PERSONS_BETWEEN_LINEAR",
    answerSemantics: "undirected count strictly between two row positions",
    runtimeQueryContracts: ["SEA-QC-008"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-001", "SEA-CP-002"],
    notes: "Linear rows have one physical interval between the named seats.",
  },
  {
    qlId: "SEA-QL-006",
    learnerContract: "COUNT_PERSONS_BETWEEN_CIRCULAR_DIRECTION",
    answerSemantics: "count strictly between two people along named circular arc",
    runtimeQueryContracts: ["SEA-QC-009"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-003", "SEA-CP-004"],
    notes: "Choosing the requested clockwise/anticlockwise arc is part of the solve contract.",
  },
  {
    qlId: "SEA-QL-007",
    learnerContract: "IDENTIFY_OPPOSITE_PERSON",
    answerSemantics: "person diametrically opposite a reference",
    runtimeQueryContracts: ["SEA-QC-010"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    notes: "Available only where the circle has an even number of seats.",
  },
  {
    qlId: "SEA-QL-008",
    learnerContract: "IDENTIFY_DIRECTIONAL_SEQUENCE",
    answerSemantics: "ordered next persons clockwise/anticlockwise from a reference",
    runtimeQueryContracts: ["SEA-QC-020"],
    reviewExtensionKinds: [],
    checkpoints: ["SEA-CP-003", "SEA-CP-004"],
    notes: "Order is semantically relevant and therefore distinct from neighbour-pair selection.",
  },
  {
    qlId: "SEA-QL-009",
    learnerContract: "RESOLVE_FACING_STATE",
    answerSemantics: "facing count or person-plus-facing state",
    runtimeQueryContracts: [],
    reviewExtensionKinds: ["FACING_DIRECTION_COUNT", "END_PERSON_AND_FACING"],
    checkpoints: ["SEA-CP-002", "SEA-CP-005"],
    notes: "Facing count and person-direction shells share one solved facing-state operation.",
  },
]);

const runtimeOwner = new Map<string, Sea001QlId>();
const extensionOwner = new Map<string, Sea001QlId>();
for (const ql of SEA_001_QLS) {
  for (const queryId of ql.runtimeQueryContracts) {
    if (runtimeOwner.has(queryId)) throw new Error(`Duplicate SEA runtime query ownership: ${queryId}`);
    runtimeOwner.set(queryId, ql.qlId);
  }
  for (const kind of ql.reviewExtensionKinds) {
    if (extensionOwner.has(kind)) throw new Error(`Duplicate SEA review extension ownership: ${kind}`);
    extensionOwner.set(kind, ql.qlId);
  }
}

export function sea001QlForRuntimeQuery(queryContractId: string): Sea001QlId {
  const qlId = runtimeOwner.get(queryContractId);
  if (!qlId) throw new Error(`No permanent SEA-001 QL owns runtime query ${queryContractId}`);
  return qlId;
}

export function sea001QlForReviewExtension(kind: string): Sea001QlId {
  const qlId = extensionOwner.get(kind);
  if (!qlId) throw new Error(`No permanent SEA-001 QL owns review extension ${kind}`);
  return qlId;
}

export function sea001DeliveryRoleForRuntimeQuery(queryContractId: string): Sea001QlDeliveryRole {
  return queryContractId === "SEA-QC-022"
    ? "PRACTICE_VARIANT_WITHIN_QL"
    : "MOCK_AUTHENTIC_BASELINE";
}

export const SEA_001_QL_REGISTRY = Object.freeze({
  authorityId: "SEA_001_PERMANENT_QL_REGISTRY_V1",
  status: "PERMANENT_QLS_ALLOCATED_REVIEW_ONLY",
  permanentQlCount: SEA_001_QLS.length,
  permanentQlRange: "SEA-QL-001..SEA-QL-009",
  planningOnlyQueryIdsNotAllocated: ["SEA-QC-004", "SEA-QC-014", "SEA-QC-015"] as const,
  topologyOrFacingAloneCreatesQl: false,
  immediateVsKthCreatesQl: false,
  statementShellCreatesQl: false,
  counterfactualFacingCreatesQl: false,
  questionStudioRegistered: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
