export const NUM_CP011_PERMANENT_ALLOCATION = [
  { qlId: "NUM-QL-213", authorityId: "NUM-CP011-AUTH-001", label: "Prime valuation in a structured product", authorityAnswerSemantic: "PRIME_VALUATION", sourcePrototypes: ["NUM-CP011-PROT-001"] },
  { qlId: "NUM-QL-214", authorityId: "NUM-CP011-AUTH-002", label: "Prime valuation in a factorial / highest prime-power exponent", authorityAnswerSemantic: "FACTORIAL_PRIME_VALUATION", sourcePrototypes: ["NUM-CP011-PROT-002"] },
  { qlId: "NUM-QL-215", authorityId: "NUM-CP011-AUTH-003", label: "Prime valuation in an exact factorial ratio", authorityAnswerSemantic: "FACTORIAL_RATIO_PRIME_VALUATION", sourcePrototypes: ["NUM-CP011-PROT-003"] },
  { qlId: "NUM-QL-216", authorityId: "NUM-CP011-AUTH-004", label: "Highest composite-power exponent dividing a factorial", authorityAnswerSemantic: "HIGHEST_COMPOSITE_POWER_EXPONENT", sourcePrototypes: ["NUM-CP011-PROT-004"] },
  { qlId: "NUM-QL-217", authorityId: "NUM-CP011-AUTH-005", label: "Decimal trailing zeroes of a factorial", authorityAnswerSemantic: "DECIMAL_FACTORIAL_TRAILING_ZERO_COUNT", sourcePrototypes: ["NUM-CP011-PROT-005"] },
  { qlId: "NUM-QL-218", authorityId: "NUM-CP011-AUTH-006", label: "Trailing zeroes of a factorial in a declared base", authorityAnswerSemantic: "GENERAL_BASE_FACTORIAL_TRAILING_ZERO_COUNT", sourcePrototypes: ["NUM-CP011-PROT-006"] },
  { qlId: "NUM-QL-219", authorityId: "NUM-CP011-AUTH-007", label: "Least factorial index reaching a prime-valuation threshold", authorityAnswerSemantic: "LEAST_N_FOR_PRIME_VALUATION_THRESHOLD", sourcePrototypes: ["NUM-CP011-PROT-007"] },
  { qlId: "NUM-QL-220", authorityId: "NUM-CP011-AUTH-008", label: "Exact factorial-valuation preimage", authorityAnswerSemantic: "EXACT_FACTORIAL_VALUATION_PREIMAGE", sourcePrototypes: ["NUM-CP011-PROT-008"] },
  { qlId: "NUM-QL-221", authorityId: "NUM-CP011-AUTH-009", label: "Least factorial index reaching a general-base zero threshold", authorityAnswerSemantic: "LEAST_N_FOR_GENERAL_BASE_ZERO_THRESHOLD", sourcePrototypes: ["NUM-CP011-PROT-009"] },
  { qlId: "NUM-QL-222", authorityId: "NUM-CP011-AUTH-010", label: "Least factorial divisible by a declared composite integer", authorityAnswerSemantic: "LEAST_N_FOR_COMPOSITE_DIVISIBILITY", sourcePrototypes: ["NUM-CP011-PROT-010"] },
  { qlId: "NUM-QL-223", authorityId: "NUM-CP011-AUTH-011", label: "Recover an unknown product exponent from a target valuation", authorityAnswerSemantic: "UNKNOWN_EXPONENT_FROM_TARGET_VALUATION", sourcePrototypes: ["NUM-CP011-PROT-011"] },
  { qlId: "NUM-QL-224", authorityId: "NUM-CP011-AUTH-012", label: "Trailing zeroes of an exact factorial ratio", authorityAnswerSemantic: "FACTORIAL_RATIO_TRAILING_ZERO_COUNT", sourcePrototypes: ["NUM-CP011-PROT-012"] },
  { qlId: "NUM-QL-225", authorityId: "NUM-CP011-AUTH-013", label: "Trailing zeroes of a structured product", authorityAnswerSemantic: "STRUCTURED_PRODUCT_TRAILING_ZERO_COUNT", sourcePrototypes: ["NUM-CP011-PROT-013"] },
] as const;

export type NumCp011PermanentAllocation = typeof NUM_CP011_PERMANENT_ALLOCATION[number];
export type NumCp011PermanentQlId = NumCp011PermanentAllocation["qlId"];
export type NumCp011PermanentAuthorityId = NumCp011PermanentAllocation["authorityId"];

export const NUM_CP011_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP011_PERMANENT_ALLOCATION.map((item) => item.qlId),
) as readonly NumCp011PermanentQlId[];

export const NUM_CP011_ALLOCATION_STATUS = Object.freeze({
  authorizationDate: "2026-08-23",
  authorizationStatus: "PROCEED_INSTRUCTION_AFTER_COUNT_PROPOSAL",
  approvedAuthorityCount: 13,
  firstPermanentQl: "NUM-QL-213",
  lastPermanentQl: "NUM-QL-225",
  nextAvailableQl: "NUM-QL-226",
  allocationState: "PERMANENT_ENGLISH_FREEZE_CANDIDATE",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);
