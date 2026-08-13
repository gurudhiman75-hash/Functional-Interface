export const RNK_CP005_QL034_OWNERSHIP_AUDIT_VERSION =
  "RNK_CP005_QL034_OWNERSHIP_AUDIT_V1" as const;

export const RNK_CP005_QL034_OWNERSHIP_DECISION =
  "KEEP_SEPARATE_PROVISIONAL_AUTHORITY" as const;

export const RNK_CP005_QL034_OWNERSHIP_REASON_CODES = [
  "UNIQUE_TOTAL_ORDER_VS_MULTI_MODEL_UNIVERSAL",
  "RELATION_STATUS_EXTENDS_BEYOND_DEFINITE_TRUE",
  "RANKING_SOURCE_SUPPORTS_INCOMPARABLE_PARTIAL_ORDERS",
  "FROZEN_QL034_CONTRACT_MUST_NOT_BE_SILENTLY_BROADENED",
] as const;

export const RNK_CP005_QL034_OWNERSHIP_AUDIT = {
  version: RNK_CP005_QL034_OWNERSHIP_AUDIT_VERSION,
  decision: RNK_CP005_QL034_OWNERSHIP_DECISION,
  existingAuthority: {
    qlId: "RNK-QL-034",
    checkpointId: "RNK-CP-004",
    authorityId: "DEFINITELY_TRUE_RELATION",
    stateContract: "ONE_UNIQUE_COMPLETE_ORDER",
    proofContract: "TRANSITIVE_RELATION_PROOF",
  },
  cp005Candidate: {
    checkpointId: "RNK-CP-005",
    authorityId: "RELATION_TRUTH_STATUS",
    stateContract: "TWO_OR_MORE_VALID_COMPLETE_ORDERS",
    queryModes: ["MUST", "COULD", "CANNOT", "PAIR_STATUS"],
  },
  reasonCodes: RNK_CP005_QL034_OWNERSHIP_REASON_CODES,
  consequence: {
    provisionalCp005AuthorityCount: 3,
    provisionalAuthorities: [
      "RELATION_TRUTH_STATUS",
      "POSSIBLE_RANK_BOUND",
      "EXACT_RANK_DETERMINACY",
    ],
    permanentQlAllocated: false,
    nextAvailableQl: "RNK-QL-036",
    englishFreeze: false,
  },
  lifecycle: {
    questionStudio: "DISABLED",
    persistence: "DISABLED",
    questionBank: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
} as const;
