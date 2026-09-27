export const CLOCK_SOURCE_CANDIDATE_POLICY = {
  status: "SOURCE_AUDIT_CANDIDATES_NOT_AUTHORITIES",
  rowCountHasProductMeaning: false,
  permanentQlAllocationAllowed: false,
  requiredBeforeAuthorityFreeze: [
    "SOURCE_SATURATION",
    "MERGE_SPLIT_AUDIT",
    "INVERSE_AUDIT",
    "BOUNDARY_AUDIT",
    "CHAPTER_GAP_AUDIT",
    "ENGLISH_HUMAN_FREEZE",
  ],
} as const;
