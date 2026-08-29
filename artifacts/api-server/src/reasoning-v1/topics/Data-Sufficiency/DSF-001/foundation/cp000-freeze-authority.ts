export const DSF_CP000_FREEZE_AUTHORITY = {
  authorityId: "DSF_CP000_FOUNDATION_DISCOVERY_FREEZE_V1",
  checkpointId: "DSF-CP-000",
  status: "FROZEN",
  frozenPermanentQlAllocation: {
    candidateId: "DSF-QL-CAND-001",
    qlId: "DSF-QL-001",
    taskContract: "TWO_STATEMENT_TARGET_DETERMINACY",
    nextAvailableQlId: "DSF-QL-002",
  },
  deferredContracts: [
    "DSF-QL-CAND-002/THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS",
    "SEATING_AND_GENERAL_PUZZLE_ADAPTERS",
    "PUNJAB_OFFICIAL_ANSWER_PROFILE",
  ],
  semanticFreeze: {
    sufficiencyCriterion: "UNIQUE_NORMALIZED_TARGET_ANSWER_OVER_NONEMPTY_SURVIVING_WORLD_SET",
    statementEvaluation: "I_ALONE__II_ALONE__I_AND_II_FROM_SHARED_BASE",
    canonicalClassCount: 5,
    completeWorldUniquenessRequired: false,
  },
  executableEvidence: [
    "NUMBER_SYSTEM_ALL_FIVE_CLASSES_AND_TARGET_PROJECTION",
    "ALGEBRA_TARGET_FUNCTION_MULTIPLE_WORLDS_UNIQUE_TARGET",
    "RANKING_ALL_FIVE_CLASSES_AND_MULTI_ORDER_TARGET_PROJECTION",
    "BANKING_FIVE_OPTION_AND_REORDERED_PROFILES",
    "SSC_FOUR_OPTION_SOURCE_PROFILES",
    "THREE_STATEMENT_SOURCE_PATTERN_DEFERRED_CONTRACT",
    "EXISTING_NUM_TMW_SAP_OWNERSHIP_RECONCILED",
  ],
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
} as const;
