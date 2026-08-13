export const RNK_CP007_POST_V11_OWNERSHIP_AUDIT_VERSION =
  "RNK_CP007_POST_V11_OWNERSHIP_AUDIT_V1" as const;

export const RNK_CP007_MANUAL_REVIEW_VERDICT = {
  questionsReviewed: 28,
  wrongKeys: 0,
  ambiguousItems: 0,
  invalidExplanations: 0,
  editorialVerdict: "PASS" as const,
} as const;

export const RNK_CP007_OWNERSHIP_DECISIONS = [
  {
    candidateId: "CATEGORY_COMPOSITION_AROUND_RANK",
    disposition: "KEEP_SEPARATE_PROVISIONAL_AUTHORITY" as const,
    sourceFixtures: ["Aggarwal Q65", "Aggarwal Q67"] as const,
    nearestExistingAuthority: "RNK-CP-001 / RNK-QL-003..006,009",
    reason:
      "The solve state requires a partitioned population, category totals, a named rank, and cross-category side evidence. Frozen CP001 owns one-person side counts only and has no subgroup-composition dimension.",
    permanentQlAllocated: false,
  },
  {
    candidateId: "TRANSFER_BALANCE_ORDER",
    disposition: "DERIVATION_ADAPTER_TO_CP004" as const,
    sourceFixtures: ["Aggarwal Q35 / CSAT 2015"] as const,
    queryMappings: {
      HIGHEST_BALANCE: "RNK-QL-027 ENDPOINT_ENTITY",
      LOWEST_BALANCE: "RNK-QL-027 ENDPOINT_ENTITY",
      SECOND_HIGHEST_BALANCE: "RNK-QL-028 ENTITY_AT_POSITION",
      TRUE_FINAL_RELATION: "RNK-QL-034 DEFINITELY_TRUE_RELATION",
    } as const,
    reason:
      "After the short arithmetic ledger is evaluated, the final balances form one unique strict order. The assessed ranking query is already owned by CP004.",
    permanentQlAllocated: false,
  },
  {
    candidateId: "SCALED_OBJECT_ORDER",
    disposition: "DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT" as const,
    sourceFixtures: ["Aggarwal Q68 / SSC MTS 2021"] as const,
    targetAuthority: "RNK-QL-038 EXACT_RANK_DETERMINACY",
    reason:
      "The arithmetic produces several valid complete orders, while the same entity occupies the requested rank in all of them. Asking for that entity is the inverse presentation of exact-rank invariance, not a new derivation-specific authority.",
    permanentQlAllocated: false,
  },
  {
    candidateId: "NUMERIC_VALUE_CONSTRAINED_ORDER",
    disposition: "HOLD_AS_DERIVATION_ADAPTER" as const,
    sourceFixtures: ["Aggarwal Q27-Q28 / CSAT 2015"] as const,
    reason:
      "The numeric constraints should normalize into an order state before an existing strict/partial-order query authority is selected. More source diversity is still required before any special adapter contract is frozen.",
    permanentQlAllocated: false,
  },
  {
    candidateId: "RELATIONAL_SIDE_COUNT_EQUATION",
    disposition: "REDIRECT_CP001_EXTENSION" as const,
    sourceFixtures: ["Aggarwal Q66"] as const,
    reason:
      "A compact algebraic normalization yields ordinary before/after counts already owned by CP001. The equation layer is evidence preprocessing, not a new ranking authority.",
    permanentQlAllocated: false,
  },
] as const;

export const RNK_CP007_POST_V11_ARCHITECTURE = {
  newAuthorityCandidates: ["CATEGORY_COMPOSITION_AROUND_RANK"] as const,
  derivedQuantityQlRejected: true,
  ql038InverseVariantRequired: true,
  cp001ExtensionRequired: true,
  ql042Allocated: false,
  nextAvailableQl: "RNK-QL-042" as const,
  questionStudio: "DISABLED" as const,
  persistence: "DISABLED" as const,
  publicPublication: false,
} as const;
