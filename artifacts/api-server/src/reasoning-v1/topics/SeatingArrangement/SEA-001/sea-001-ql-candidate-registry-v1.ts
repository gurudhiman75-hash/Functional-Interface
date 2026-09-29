export type Sea001CandidateQlId =
  | "SEA-QL-CAND-001"
  | "SEA-QL-CAND-002"
  | "SEA-QL-CAND-003"
  | "SEA-QL-CAND-004"
  | "SEA-QL-CAND-005"
  | "SEA-QL-CAND-006"
  | "SEA-QL-CAND-007"
  | "SEA-QL-CAND-008"
  | "SEA-QL-CAND-009";

export type Sea001CandidateRole =
  | "MOCK_AUTHENTIC_BASELINE"
  | "PRACTICE_VARIANT_WITHIN_CONTRACT";

export interface Sea001CandidateQlV1 {
  candidateQlId: Sea001CandidateQlId;
  learnerContract: string;
  answerSemantics: string;
  ownedRuntimeQueryContracts: readonly string[];
  ownedReviewExtensionKinds: readonly string[];
  supportedCheckpoints: readonly string[];
  role: Sea001CandidateRole;
  notes: string;
}

export const SEA_001_QL_CANDIDATES_V1: readonly Sea001CandidateQlV1[] = Object.freeze([
  {
    candidateQlId: "SEA-QL-CAND-001",
    learnerContract: "IDENTIFY_ENDPOINT_OCCUPANCY",
    answerSemantics: "person or pair occupying one/both extreme positions",
    ownedRuntimeQueryContracts: ["SEA-QC-001"],
    ownedReviewExtensionKinds: ["EXTREME_END_PAIR"],
    supportedCheckpoints: ["SEA-CP-001", "SEA-CP-002"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Single-end and two-end answers are presentation variants of the same endpoint-reading operation.",
  },
  {
    candidateQlId: "SEA-QL-CAND-002",
    learnerContract: "IDENTIFY_PERSON_AT_RELATIVE_POSITION",
    answerSemantics: "person at immediate/k-th left or right of reference",
    ownedRuntimeQueryContracts: ["SEA-QC-003", "SEA-QC-005", "SEA-QC-022"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "QC005 is steps=1; QC022 is a transformed-state practice variant after flipping facings, not a new permanent learner contract.",
  },
  {
    candidateQlId: "SEA-QL-CAND-003",
    learnerContract: "DESCRIBE_RELATIVE_POSITION",
    answerSemantics: "left/right relation and ordinal distance between two people",
    ownedRuntimeQueryContracts: [],
    ownedReviewExtensionKinds: ["RELATIVE_POSITION_DESCRIPTION", "DEFINITELY_TRUE_RELATION_STATEMENT"],
    supportedCheckpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Definitely-true statement is a presentation shell over the same person-to-person relation result.",
  },
  {
    candidateQlId: "SEA-QL-CAND-004",
    learnerContract: "IDENTIFY_IMMEDIATE_NEIGHBOURS",
    answerSemantics: "pair of persons directly adjacent to a reference",
    ownedRuntimeQueryContracts: ["SEA-QC-006"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Physical adjacency is independent of facing direction.",
  },
  {
    candidateQlId: "SEA-QL-CAND-005",
    learnerContract: "COUNT_PERSONS_BETWEEN_LINEAR",
    answerSemantics: "undirected count strictly between two row positions",
    ownedRuntimeQueryContracts: ["SEA-QC-008"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-001", "SEA-CP-002"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Linear rows have one physical interval between the two named seats.",
  },
  {
    candidateQlId: "SEA-QL-CAND-006",
    learnerContract: "COUNT_PERSONS_BETWEEN_CIRCULAR_DIRECTION",
    answerSemantics: "count strictly between two people along named clockwise/anticlockwise arc",
    ownedRuntimeQueryContracts: ["SEA-QC-009"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-003", "SEA-CP-004"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Kept separate from linear count because choosing the correct arc is part of the learner operation.",
  },
  {
    candidateQlId: "SEA-QL-CAND-007",
    learnerContract: "IDENTIFY_OPPOSITE_PERSON",
    answerSemantics: "person diametrically opposite a reference in an even circle",
    ownedRuntimeQueryContracts: ["SEA-QC-010"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-003", "SEA-CP-004", "SEA-CP-005"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Odd circles correctly disable this contract.",
  },
  {
    candidateQlId: "SEA-QL-CAND-008",
    learnerContract: "IDENTIFY_DIRECTIONAL_SEQUENCE",
    answerSemantics: "ordered next persons clockwise/anticlockwise from a reference",
    ownedRuntimeQueryContracts: ["SEA-QC-020"],
    ownedReviewExtensionKinds: [],
    supportedCheckpoints: ["SEA-CP-003", "SEA-CP-004"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Sequence order is semantically relevant and distinct from neighbour-pair selection.",
  },
  {
    candidateQlId: "SEA-QL-CAND-009",
    learnerContract: "RESOLVE_FACING_STATE",
    answerSemantics: "facing count or person-plus-facing state",
    ownedRuntimeQueryContracts: [],
    ownedReviewExtensionKinds: ["FACING_DIRECTION_COUNT", "END_PERSON_AND_FACING"],
    supportedCheckpoints: ["SEA-CP-002", "SEA-CP-005"],
    role: "MOCK_AUTHENTIC_BASELINE",
    notes: "Count and person-direction answer shells share one solved-facing-state operation.",
  },
]);

export const SEA_001_QL_CANDIDATE_REGISTRY_V1 = Object.freeze({
  authorityId: "SEA_001_QL_CANDIDATE_REGISTRY_V1",
  status: "CANDIDATE_TAXONOMY_AWAITING_PERMANENT_ALLOCATION",
  candidateCount: SEA_001_QL_CANDIDATES_V1.length,
  planningOnlyRuntimeQueryIdsNotAllocated: ["SEA-QC-004", "SEA-QC-014", "SEA-QC-015"] as const,
  topologyOrFacingAloneCreatesQl: false,
  immediateVsKthCreatesQl: false,
  statementShellCreatesQl: false,
  counterfactualFacingCreatesQl: false,
  permanentQlAllocationPermittedByThisFile: false,
});
