export const ALP_WFM_OWNERSHIP_BOUNDARY_V2 = {
  authorityId: "ALP_WFM_OWNERSHIP_BOUNDARY_V2",
  alpPackageId: "ALP-001",
  wfmPackageId: "WFM-001",
  alpOwns: [
    "alphabet positions and relative positions",
    "alphabet gaps, distances and middle positions",
    "modified alphabet arrangements",
    "position and rearrangement queries within a supplied word when the answer is an alphabet-position/rearrangement property rather than a newly formed meaningful word",
    "alphabet-pair relations within words",
    "explicit letter-class transformations",
    "digit/alphanumeric/symbol position, pair and scan relations",
    "mixed-sequence rearrangement and composite scans",
  ] as const,
  wfmOwns: [
    "whether a meaningful option word can be formed from a supplied letter multiset",
    "whether a meaningful option word cannot be formed from a supplied letter multiset",
    "counting governed meaningful words formed from letters selected from a source word",
    "rearranging a supplied letter multiset into a meaningful word",
  ] as const,
  selectedPositionRule:
    "A selected-position task belongs to WFM when the final learner task is meaningful-word formation or counting; ordinary alphabet-position/scan relations remain ALP.",
  worBoundary:
    "Dictionary ordering of multiple words or clusters remains WOR-001 ownership.",
  codBoundary:
    "Hidden coding/decoding inference remains COD-001 ownership.",
  lifecycle: {
    movesExistingAlpQl: false,
    allocatesNewAlpQl: false,
    allocatesNewWfmQl: false,
    opensQuestionBank: false,
    opensMockDelivery: false,
    opensPublicDelivery: false,
  },
} as const;
