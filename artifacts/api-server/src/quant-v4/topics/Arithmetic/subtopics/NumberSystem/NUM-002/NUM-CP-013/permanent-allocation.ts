export const NUM_CP013_PERMANENT_ALLOCATION = [
  { qlId: "NUM-QL-237", authorityId: "NUM-CP013-AUTH-001", label: "Base numeral value and positional-structure projections", authorityAnswerSemantic: "POSITIONAL_BASE_STRUCTURE", sourcePrototypes: ["NUM-CP013-PROT-001", "NUM-CP013-PROT-011"] },
  { qlId: "NUM-QL-238", authorityId: "NUM-CP013-AUTH-002", label: "Conversion to a target non-decimal base", authorityAnswerSemantic: "BASE_CONVERSION", sourcePrototypes: ["NUM-CP013-PROT-002", "NUM-CP013-PROT-003", "NUM-CP013-PROT-009"] },
  { qlId: "NUM-QL-239", authorityId: "NUM-CP013-AUTH-003", label: "Base validity, minimum base and bounded valid-base domain", authorityAnswerSemantic: "BASE_VALIDITY_DOMAIN", sourcePrototypes: ["NUM-CP013-PROT-004", "NUM-CP013-PROT-010", "NUM-CP013-PROT-012", "NUM-CP013-PROT-018", "NUM-CP013-PROT-022"] },
  { qlId: "NUM-QL-240", authorityId: "NUM-CP013-AUTH-004", label: "Unknown digit in a base numeral equality", authorityAnswerSemantic: "UNKNOWN_DIGIT_IN_BASE_NUMERAL", sourcePrototypes: ["NUM-CP013-PROT-005"] },
  { qlId: "NUM-QL-241", authorityId: "NUM-CP013-AUTH-005", label: "Unknown base inverse family and bounded solution topology", authorityAnswerSemantic: "UNKNOWN_BASE_INVERSE", sourcePrototypes: ["NUM-CP013-PROT-006", "NUM-CP013-PROT-013", "NUM-CP013-PROT-021"] },
  { qlId: "NUM-QL-242", authorityId: "NUM-CP013-AUTH-006", label: "Addition in a stated base", authorityAnswerSemantic: "ADDITION_IN_STATED_BASE", sourcePrototypes: ["NUM-CP013-PROT-007", "NUM-CP013-PROT-019"] },
  { qlId: "NUM-QL-243", authorityId: "NUM-CP013-AUTH-007", label: "Subtraction in a stated base", authorityAnswerSemantic: "SUBTRACTION_IN_STATED_BASE", sourcePrototypes: ["NUM-CP013-PROT-008", "NUM-CP013-PROT-020"] },
  { qlId: "NUM-QL-244", authorityId: "NUM-CP013-AUTH-008", label: "Multiplication in a stated base", authorityAnswerSemantic: "MULTIPLICATION_IN_STATED_BASE", sourcePrototypes: ["NUM-CP013-PROT-014"] },
  { qlId: "NUM-QL-245", authorityId: "NUM-CP013-AUTH-009", label: "Comparison of numerals written in different bases", authorityAnswerSemantic: "CROSS_BASE_COMPARISON", sourcePrototypes: ["NUM-CP013-PROT-015"] },
  { qlId: "NUM-QL-246", authorityId: "NUM-CP013-AUTH-010", label: "Base-essential remainder and divisibility", authorityAnswerSemantic: "BASE_ESSENTIAL_REMAINDER", sourcePrototypes: ["NUM-CP013-PROT-016"] },
  { qlId: "NUM-QL-247", authorityId: "NUM-CP013-AUTH-011", label: "Terminal digit in a stated non-decimal base", authorityAnswerSemantic: "TERMINAL_DIGIT_IN_STATED_BASE", sourcePrototypes: ["NUM-CP013-PROT-017"] },
] as const;

export type NumCp013PermanentAllocation = typeof NUM_CP013_PERMANENT_ALLOCATION[number];
export type NumCp013PermanentQlId = NumCp013PermanentAllocation["qlId"];
export type NumCp013PermanentAuthorityId = NumCp013PermanentAllocation["authorityId"];

export const NUM_CP013_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP013_PERMANENT_ALLOCATION.map((item) => item.qlId),
) as readonly NumCp013PermanentQlId[];

export const NUM_CP013_ALLOCATION_STATUS = Object.freeze({
  authorizationDate: "2026-08-27",
  authorizationStatus: "WAVE01_TO_WAVE04_EXACT_HEAD_GREEN",
  certifiedDiscoveryHead: "3025065dbe9ffbfc3ea6ab1554465fc129a4aa4b",
  approvedAuthorityCount: 11,
  discoveryPrototypeCount: 22,
  firstPermanentQl: "NUM-QL-237",
  lastPermanentQl: "NUM-QL-247",
  nextAvailableQl: "NUM-QL-248",
  allocationState: "PERMANENT_ENGLISH_FREEZE_CANDIDATE",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
} as const);
