export const RNK_POST_CP006_GAP_AUDIT_VERSION =
  "RNK_POST_CP006_GAP_AUDIT_2026_08_12_V1" as const;

export const RNK_POST_CP006_GAP_DECISION =
  "NO_NEW_QL_JUSTIFIED_YET" as const;

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

export type RnkHeldGapId =
  | "NUMERIC_POST_TIE_RANK_CONVENTION"
  | "MULTIPLE_INDEPENDENT_TIE_GROUPS"
  | "TIE_CLASS_SIZE_GTE_3"
  | "SHARED_RANKING_CASELETS"
  | "MIXED_RANKING_AND_BLOOD_RELATION"
  | "ADVANCED_MIXED_TRANSFORMATIONS";

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
      "No reviewed exam-source fixture yet establishes this as a distinct Ranking solve contract rather than a synthetic extension.",
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
  {
    id: "ADVANCED_MIXED_TRANSFORMATIONS",
    status: "HOLD",
    reason:
      "CP001..CP006 already cover arithmetic, pair constraints, movement/interchange, unique strict order, uncertainty and equality. No reviewed source currently proves another non-overlapping advanced Ranking authority.",
  },
] as const;

export const RNK_POST_CP006_INFRASTRUCTURE_FINDINGS = {
  frozenMathematicsRemainsFit: true,
  frozenProjectionChangeRequired: false,
  objectPoolExpansionRequired: true,
  staleRoadmapDocumentationRequiresCorrection: true,
  cp007QuestionGenerationAuthorized: false,
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
