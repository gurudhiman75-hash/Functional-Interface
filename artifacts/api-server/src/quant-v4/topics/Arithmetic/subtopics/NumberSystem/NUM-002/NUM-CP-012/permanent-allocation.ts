export const NUM_CP012_PERMANENT_ALLOCATION = [
  { qlId: "NUM-QL-226", authorityId: "NUM-CP012-AUTH-001", label: "Perfect-power recognition, claim and compatibility", authorityAnswerSemantic: "PERFECT_POWER_RECOGNITION", sourcePrototypes: ["NUM-CP012-PROT-001", "NUM-CP012-PROT-013"] },
  { qlId: "NUM-QL-227", authorityId: "NUM-CP012-AUTH-002", label: "Exact integer root with signed-domain classification", authorityAnswerSemantic: "EXACT_INTEGER_ROOT", sourcePrototypes: ["NUM-CP012-PROT-002", "NUM-CP012-PROT-009"] },
  { qlId: "NUM-QL-228", authorityId: "NUM-CP012-AUTH-003", label: "Least multiplier for perfect-power completion", authorityAnswerSemantic: "LEAST_PERFECT_POWER_MULTIPLIER", sourcePrototypes: ["NUM-CP012-PROT-003"] },
  { qlId: "NUM-QL-229", authorityId: "NUM-CP012-AUTH-004", label: "Least divisor for perfect-power reduction", authorityAnswerSemantic: "LEAST_PERFECT_POWER_DIVISOR", sourcePrototypes: ["NUM-CP012-PROT-004"] },
  { qlId: "NUM-QL-230", authorityId: "NUM-CP012-AUTH-005", label: "Missing exponent and bounded inverse solution topology", authorityAnswerSemantic: "PERFECT_POWER_EXPONENT_INVERSE", sourcePrototypes: ["NUM-CP012-PROT-005", "NUM-CP012-PROT-014"] },
  { qlId: "NUM-QL-231", authorityId: "NUM-CP012-AUTH-006", label: "Greatest perfect-power divisor", authorityAnswerSemantic: "GREATEST_PERFECT_POWER_DIVISOR", sourcePrototypes: ["NUM-CP012-PROT-006"] },
  { qlId: "NUM-QL-232", authorityId: "NUM-CP012-AUTH-007", label: "Count perfect powers in a bounded interval", authorityAnswerSemantic: "PERFECT_POWER_INTERVAL_COUNT", sourcePrototypes: ["NUM-CP012-PROT-007"] },
  { qlId: "NUM-QL-233", authorityId: "NUM-CP012-AUTH-008", label: "Least additive adjustment to a perfect-power boundary", authorityAnswerSemantic: "PERFECT_POWER_ADDITIVE_COMPLETION", sourcePrototypes: ["NUM-CP012-PROT-008"] },
  { qlId: "NUM-QL-234", authorityId: "NUM-CP012-AUTH-009", label: "One-sided perfect-power value under a bound", authorityAnswerSemantic: "PERFECT_POWER_BOUND_VALUE", sourcePrototypes: ["NUM-CP012-PROT-010"] },
  { qlId: "NUM-QL-235", authorityId: "NUM-CP012-AUTH-010", label: "Nearest perfect-power value", authorityAnswerSemantic: "NEAREST_PERFECT_POWER_VALUE", sourcePrototypes: ["NUM-CP012-PROT-011"] },
  { qlId: "NUM-QL-236", authorityId: "NUM-CP012-AUTH-011", label: "Least perfect-power multiple value", authorityAnswerSemantic: "LEAST_PERFECT_POWER_MULTIPLE_VALUE", sourcePrototypes: ["NUM-CP012-PROT-012"] },
] as const;

export type NumCp012PermanentAllocation = typeof NUM_CP012_PERMANENT_ALLOCATION[number];
export type NumCp012PermanentQlId = NumCp012PermanentAllocation["qlId"];
export type NumCp012PermanentAuthorityId = NumCp012PermanentAllocation["authorityId"];

export const NUM_CP012_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP012_PERMANENT_ALLOCATION.map((item) => item.qlId),
) as readonly NumCp012PermanentQlId[];

export const NUM_CP012_ALLOCATION_STATUS = Object.freeze({
  authorizationDate: "2026-08-25",
  authorizationStatus: "SOURCE_SATURATION_APPROVED_FOR_PERMANENT_FREEZE",
  approvedAuthorityCount: 11,
  firstPermanentQl: "NUM-QL-226",
  lastPermanentQl: "NUM-QL-236",
  nextAvailableQl: "NUM-QL-237",
  allocationState: "PERMANENT_ENGLISH_FREEZE_CANDIDATE",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);
