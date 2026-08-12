export const RNK_POST_CP006_GAP_AUDIT_VERSION =
  "RNK_POST_CP006_GAP_AUDIT_2026_08_12_V2" as const;

export const RNK_POST_CP006_GAP_DECISION =
  "SOURCE_BACKED_CP007_DISCOVERY_REQUIRED" as const;

export const RNK_POST_CP006_FROZEN_RANGE = {
  first: "RNK-QL-001",
  last: "RNK-QL-041",
  nextAvailable: "RNK-QL-042",
} as const;

export const RNK_IMPLEMENTED_STATE_CONTRACTS = [
  {
    checkpoint: "RNK-CP-004",
    qlRange: "RNK-QL-027..035",
    contract: "ONE_UNIQUE_STRICT_TOTAL_ORDER",
    role: "strict multi-entity order reconstruction and queries",
  },
  {
    checkpoint: "RNK-CP-005",
    qlRange: "RNK-QL-036..038",
    contract: "MULTIPLE_VALID_STRICT_TOTAL_ORDERS",
    role: "partial-order uncertainty, modal relations and rank bounds",
  },
  {
    checkpoint: "RNK-CP-006",
    qlRange: "RNK-QL-039..041",
    contract: "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
    role: "equality-aware pair, endpoint and complete weak-order reasoning",
  },
] as const;

export type RnkCp007DiscoveryCandidateId =
  | "CATEGORY_COMPOSITION_AROUND_RANK"
  | "DERIVED_QUANTITY_ORDER"
  | "NUMERIC_VALUE_CONSTRAINED_ORDER"
  | "RELATIONAL_SIDE_COUNT_EQUATION";

export const RNK_CP007_DISCOVERY_CANDIDATES: readonly {
  readonly id: RnkCp007DiscoveryCandidateId;
  readonly sourceEvidence: readonly string[];
  readonly disposition:
    | "DISCOVER_AS_PROVISIONAL_AUTHORITY"
    | "AUDIT_MERGE_WITH_DERIVED_QUANTITY_ORDER"
    | "AUDIT_EXTENSION_OF_CP001";
  readonly rationale: string;
  readonly permanentQlId: null;
}[] = [
  {
    id: "CATEGORY_COMPOSITION_AROUND_RANK",
    sourceEvidence: [
      "Aggarwal Ranking Q65: total class + boys:girls composition + target rank + subgroup ahead -> subgroup after",
      "Aggarwal Ranking Q67: total class + girls:boys composition + target rank + subgroup ahead -> subgroup after",
    ],
    disposition: "DISCOVER_AS_PROVISIONAL_AUTHORITY",
    rationale:
      "CP001 owns one-person rank/side-count arithmetic but not category-composition accounting around the ranked person; CP002 owns two fixed positions rather than subgroup populations.",
    permanentQlId: null,
  },
  {
    id: "DERIVED_QUANTITY_ORDER",
    sourceEvidence: [
      "Aggarwal Ranking Q35 [CSAT 2015]: money transfers are applied before holdings are ranked",
      "Aggarwal Ranking Q68 [SSC MTS 2021]: weight ratios/equations are derived before second-from-bottom ranking",
    ],
    disposition: "DISCOVER_AS_PROVISIONAL_AUTHORITY",
    rationale:
      "The displayed facts first determine derived numeric quantities; the learner then answers an order/rank query. This is not represented by CP004's direct comparison graph or CP005's comparison-only uncertainty state.",
    permanentQlId: null,
  },
  {
    id: "NUMERIC_VALUE_CONSTRAINED_ORDER",
    sourceEvidence: [
      "Aggarwal Ranking Q27-Q28 [CSAT 2015]: ages occupy a bounded consecutive numeric domain with exact one-year and ordering constraints; queries ask possible value/order count",
    ],
    disposition: "AUDIT_MERGE_WITH_DERIVED_QUANTITY_ORDER",
    rationale:
      "This is source-backed, but it may be a numeric-domain mode of DERIVED_QUANTITY_ORDER rather than a separate learner authority. Discovery must compare solver and answer contracts before any split.",
    permanentQlId: null,
  },
  {
    id: "RELATIONAL_SIDE_COUNT_EQUATION",
    sourceEvidence: [
      "Aggarwal Ranking Q66: one person's front/behind counts are related multiplicatively and another person's front count is linked to them",
    ],
    disposition: "AUDIT_EXTENSION_OF_CP001",
    rationale:
      "The arithmetic is still side-count reasoning, but it links two people through equations. Audit whether CP001 can safely own this as a new generated mode or whether the proof contract is materially distinct.",
    permanentQlId: null,
  },
] as const;

export type RnkHeldGapId =
  | "NUMERIC_POST_TIE_RANK_CONVENTION"
  | "MULTIPLE_INDEPENDENT_TIE_GROUPS"
  | "TIE_CLASS_SIZE_GTE_3"
  | "SHARED_RANKING_CASELETS"
  | "MIXED_RANKING_AND_BLOOD_RELATION";

export const RNK_HELD_GAPS: readonly {
  readonly id: RnkHeldGapId;
  readonly status: "HOLD" | "INFRASTRUCTURE" | "OTHER_CHAPTER_BOUNDARY";
  readonly reason: string;
}[] = [
  {
    id: "NUMERIC_POST_TIE_RANK_CONVENTION",
    status: "HOLD",
    reason:
      "The reviewed Ranking source proves explicit equality classes but does not establish a universal competition/dense/fractional numerical rank rule after a tie.",
  },
  {
    id: "MULTIPLE_INDEPENDENT_TIE_GROUPS",
    status: "HOLD",
    reason:
      "No reviewed exam-source fixture yet establishes this as a distinct Ranking solve contract rather than a synthetic extension of CP006.",
  },
  {
    id: "TIE_CLASS_SIZE_GTE_3",
    status: "HOLD",
    reason:
      "The current source-backed equality evidence is satisfied by the frozen two-person equality-class contract; larger tie classes need explicit evidence before expansion.",
  },
  {
    id: "SHARED_RANKING_CASELETS",
    status: "INFRASTRUCTURE",
    reason:
      "A shared passage can ask existing QLs and therefore belongs to delivery/caselet assembly unless it introduces a genuinely new solver contract.",
  },
  {
    id: "MIXED_RANKING_AND_BLOOD_RELATION",
    status: "OTHER_CHAPTER_BOUNDARY",
    reason:
      "A source example combines height ordering with gender/family inference; the family inference burden belongs to Blood Relations or a controlled mixed-puzzle layer, not a new pure Ranking QL.",
  },
] as const;

export const RNK_POST_CP006_INFRASTRUCTURE_FINDINGS = {
  frozenMathematicsRemainsFit: true,
  frozenProjectionChangeRequired: false,
  objectPoolExpansionRequired: true,
  staleRoadmapDocumentationRequiresCorrection: true,
  cp007DiscoveryAuthorized: true,
  cp007PermanentRuntimeAuthorized: false,
  cp007EnglishFreezeAuthorized: false,
  permanentQl042Allocated: false,
} as const;

export const RNK_POST_CP006_LIFECYCLE = {
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  hindiPunjabi: "NOT_STARTED",
} as const;
