export const RNK_CP007_MERGE_SPLIT_AUDIT_VERSION =
  "RNK_CP007_MERGE_SPLIT_AUDIT_V1" as const;

export type RnkCp007DiscoveryCandidateId =
  | "CATEGORY_COMPOSITION_AROUND_RANK"
  | "DERIVED_QUANTITY_ORDER"
  | "NUMERIC_VALUE_CONSTRAINED_ORDER"
  | "RELATIONAL_SIDE_COUNT_EQUATION";

export type RnkCp007Disposition =
  | "PROVISIONAL_AUTHORITY_CANDIDATE"
  | "DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED"
  | "HOLD_MERGE_WITH_DERIVED_QUANTITY"
  | "REDIRECT_CP001_EXTENSION";

export interface RnkCp007CandidateAudit {
  readonly id: RnkCp007DiscoveryCandidateId;
  readonly sourceFixtures: readonly string[];
  readonly disposition: RnkCp007Disposition;
  readonly learnerBurden: string;
  readonly nearestExistingOwnership: readonly string[];
  readonly differentiator: string;
  readonly permanentQlAllocated: false;
}

export const RNK_CP007_CANDIDATE_AUDIT: readonly RnkCp007CandidateAudit[] = [
  {
    id: "CATEGORY_COMPOSITION_AROUND_RANK",
    sourceFixtures: ["Aggarwal Q65", "Aggarwal Q67"],
    disposition: "PROVISIONAL_AUTHORITY_CANDIDATE",
    learnerBurden:
      "Combine whole-group rank arithmetic with subgroup totals and subgroup composition around the target position.",
    nearestExistingOwnership: ["RNK-QL-003", "RNK-QL-004", "RNK-QL-009"],
    differentiator:
      "Existing CP001 side-count authorities count people around one person but do not partition those counts by an explicitly supplied subgroup composition.",
    permanentQlAllocated: false,
  },
  {
    id: "DERIVED_QUANTITY_ORDER",
    sourceFixtures: ["Aggarwal Q35 / CSAT 2015", "Aggarwal Q68 / SSC MTS 2021"],
    disposition: "DISCOVERY_FAMILY_ADAPTER_VS_QL_UNRESOLVED",
    learnerBurden:
      "Derive compact numeric states from transfers, ratios or equations and then answer a comparative order/rank question.",
    nearestExistingOwnership: ["RNK-QL-027", "RNK-QL-028", "RNK-QL-031", "RNK-QL-034", "RNK-QL-036", "RNK-QL-037", "RNK-QL-038"],
    differentiator:
      "The displayed evidence is arithmetic/equational rather than a direct comparison graph. However the final query can often be an existing CP004/CP005 authority, so CP007 must test derivation-adapter composition before allocating a new QL.",
    permanentQlAllocated: false,
  },
  {
    id: "NUMERIC_VALUE_CONSTRAINED_ORDER",
    sourceFixtures: ["Aggarwal Q27-Q28 / CSAT 2015"],
    disposition: "HOLD_MERGE_WITH_DERIVED_QUANTITY",
    learnerBurden:
      "Solve a bounded numeric-domain constraint system in which exact values and order comparisons jointly restrict the valid states.",
    nearestExistingOwnership: ["DERIVED_QUANTITY_ORDER", "RNK-QL-036", "RNK-QL-038"],
    differentiator:
      "Unlike direct comparison ranking, exact numeric-domain constraints are essential. Current evidence is one source caselet, insufficient to justify a separate QL before merge testing.",
    permanentQlAllocated: false,
  },
  {
    id: "RELATIONAL_SIDE_COUNT_EQUATION",
    sourceFixtures: ["Aggarwal Q66"],
    disposition: "REDIRECT_CP001_EXTENSION",
    learnerBurden:
      "Solve simple equations linking front/behind counts, then apply ordinary one-person side-count identities.",
    nearestExistingOwnership: ["RNK-QL-003", "RNK-QL-004", "RNK-QL-005", "RNK-QL-006", "RNK-QL-009"],
    differentiator:
      "The equation is a preprocessing representation of CP001 side counts rather than a new ranking state or answer contract.",
    permanentQlAllocated: false,
  },
] as const;

export const RNK_CP007_ARCHITECTURE_HYPOTHESES = {
  categoryComposition: {
    preferred: "NEW_AUTHORITY_IF_EDITORIAL_AND_SOURCE_DIVERSITY_SURVIVE",
    alternative: "CP001_COMPOSITION_EXTENSION",
  },
  derivedQuantity: {
    preferred: "DERIVATION_ADAPTER_PLUS_EXISTING_ORDER_QUERY_AUTHORITY",
    alternative: "NEW_AUTHORITY_ONLY_IF_ADAPTER_COMPOSITION_LOSES_STUDENT_VISIBLE_SOLVE_CONTRACT",
  },
  numericValueConstrained: {
    preferred: "MERGE_INTO_DERIVED_CONSTRAINT_FAMILY",
    alternative: "SEPARATE_ONLY_WITH_MORE_SOURCE_DIVERSITY_AND_DISTINCT_ANSWER_CONTRACT",
  },
  relationalSideCount: {
    preferred: "CP001_EXTENSION",
    alternative: "NONE_WITH_CURRENT_EVIDENCE",
  },
} as const;

export const RNK_CP007_LIFECYCLE = {
  permanentQlCount: 0,
  nextAvailableQl: "RNK-QL-042",
  englishFreeze: false,
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publicPublication: false,
  hindiPunjabi: "NOT_STARTED",
} as const;
