export type NumCp010PermanentQlId =
  | "NUM-QL-197"
  | "NUM-QL-198"
  | "NUM-QL-199"
  | "NUM-QL-200"
  | "NUM-QL-201"
  | "NUM-QL-202"
  | "NUM-QL-203"
  | "NUM-QL-204"
  | "NUM-QL-205"
  | "NUM-QL-206"
  | "NUM-QL-207"
  | "NUM-QL-208"
  | "NUM-QL-209"
  | "NUM-QL-210"
  | "NUM-QL-211"
  | "NUM-QL-212";

export type NumCp010PermanentAuthorityId =
  | "NUM-CP010-AUTH-001"
  | "NUM-CP010-AUTH-002"
  | "NUM-CP010-AUTH-003"
  | "NUM-CP010-AUTH-004"
  | "NUM-CP010-AUTH-005"
  | "NUM-CP010-AUTH-006"
  | "NUM-CP010-AUTH-007"
  | "NUM-CP010-AUTH-008"
  | "NUM-CP010-AUTH-009"
  | "NUM-CP010-AUTH-010"
  | "NUM-CP010-AUTH-011"
  | "NUM-CP010-AUTH-012"
  | "NUM-CP010-AUTH-013"
  | "NUM-CP010-AUTH-014"
  | "NUM-CP010-AUTH-015"
  | "NUM-CP010-AUTH-016";

export type NumCp010PrototypeId = `NUM-CP010-PROT-${string}`;

export type NumCp010PermanentAllocation = Readonly<{
  qlId: NumCp010PermanentQlId;
  authorityId: NumCp010PermanentAuthorityId;
  label: string;
  authorityAnswerSemantic: string;
  sourcePrototypes: readonly NumCp010PrototypeId[];
}>;

export const NUM_CP010_PERMANENT_ALLOCATION: readonly NumCp010PermanentAllocation[] = Object.freeze([
  {
    qlId: "NUM-QL-197",
    authorityId: "NUM-CP010-AUTH-001",
    label: "Decimal place value — direct and inverse",
    authorityAnswerSemantic: "DECIMAL_PLACE_VALUE_DIRECT_OR_INVERSE",
    sourcePrototypes: ["NUM-CP010-PROT-001", "NUM-CP010-PROT-009", "NUM-CP010-PROT-010"],
  },
  {
    qlId: "NUM-QL-198",
    authorityId: "NUM-CP010-AUTH-002",
    label: "Missing digit from digit aggregate",
    authorityAnswerSemantic: "DIGIT",
    sourcePrototypes: ["NUM-CP010-PROT-002"],
  },
  {
    qlId: "NUM-QL-199",
    authorityId: "NUM-CP010-AUTH-003",
    label: "Number reversal / digit interchange reconstruction",
    authorityAnswerSemantic: "DECIMAL_INTEGER",
    sourcePrototypes: ["NUM-CP010-PROT-003", "NUM-CP010-PROT-004", "NUM-CP010-PROT-023"],
  },
  {
    qlId: "NUM-QL-200",
    authorityId: "NUM-CP010-AUTH-004",
    label: "Single-unknown column addition digit reconstruction",
    authorityAnswerSemantic: "DIGIT",
    sourcePrototypes: ["NUM-CP010-PROT-005", "NUM-CP010-PROT-011"],
  },
  {
    qlId: "NUM-QL-201",
    authorityId: "NUM-CP010-AUTH-005",
    label: "Two-unknown column addition reconstruction",
    authorityAnswerSemantic: "ORDERED_DIGIT_PAIR",
    sourcePrototypes: ["NUM-CP010-PROT-020"],
  },
  {
    qlId: "NUM-QL-202",
    authorityId: "NUM-CP010-AUTH-006",
    label: "Column subtraction digit reconstruction",
    authorityAnswerSemantic: "DIGIT",
    sourcePrototypes: ["NUM-CP010-PROT-006", "NUM-CP010-PROT-012"],
  },
  {
    qlId: "NUM-QL-203",
    authorityId: "NUM-CP010-AUTH-007",
    label: "Palindrome reconstruction",
    authorityAnswerSemantic: "DECIMAL_INTEGER",
    sourcePrototypes: ["NUM-CP010-PROT-007", "NUM-CP010-PROT-016"],
  },
  {
    qlId: "NUM-QL-204",
    authorityId: "NUM-CP010-AUTH-008",
    label: "Relational / consecutive digit reconstruction",
    authorityAnswerSemantic: "DECIMAL_INTEGER",
    sourcePrototypes: ["NUM-CP010-PROT-008", "NUM-CP010-PROT-024"],
  },
  {
    qlId: "NUM-QL-205",
    authorityId: "NUM-CP010-AUTH-009",
    label: "Least or greatest numeral under digit constraints",
    authorityAnswerSemantic: "DECIMAL_INTEGER_EXTREMUM",
    sourcePrototypes: ["NUM-CP010-PROT-013"],
  },
  {
    qlId: "NUM-QL-206",
    authorityId: "NUM-CP010-AUTH-010",
    label: "Complete valid digit/number set under decimal constraints",
    authorityAnswerSemantic: "COMPLETE_DECIMAL_STATE_SET",
    sourcePrototypes: ["NUM-CP010-PROT-014", "NUM-CP010-PROT-019"],
  },
  {
    qlId: "NUM-QL-207",
    authorityId: "NUM-CP010-AUTH-011",
    label: "Bounded digit-occurrence count",
    authorityAnswerSemantic: "DIGIT_OCCURRENCE_COUNT",
    sourcePrototypes: ["NUM-CP010-PROT-015", "NUM-CP010-PROT-026"],
  },
  {
    qlId: "NUM-QL-208",
    authorityId: "NUM-CP010-AUTH-012",
    label: "Exact number of decimal digits",
    authorityAnswerSemantic: "NUMBER_OF_DIGITS",
    sourcePrototypes: ["NUM-CP010-PROT-017"],
  },
  {
    qlId: "NUM-QL-209",
    authorityId: "NUM-CP010-AUTH-013",
    label: "Digit-constraint solution multiplicity classification",
    authorityAnswerSemantic: "SOLUTION_MULTIPLICITY_CLASS",
    sourcePrototypes: ["NUM-CP010-PROT-018"],
  },
  {
    qlId: "NUM-QL-210",
    authorityId: "NUM-CP010-AUTH-014",
    label: "Missing digit in multiplication with carry",
    authorityAnswerSemantic: "DIGIT",
    sourcePrototypes: ["NUM-CP010-PROT-021"],
  },
  {
    qlId: "NUM-QL-211",
    authorityId: "NUM-CP010-AUTH-015",
    label: "Repeated decimal block / concatenation reconstruction",
    authorityAnswerSemantic: "DECIMAL_INTEGER",
    sourcePrototypes: ["NUM-CP010-PROT-022"],
  },
  {
    qlId: "NUM-QL-212",
    authorityId: "NUM-CP010-AUTH-016",
    label: "Digital root / repeated digit-sum reduction",
    authorityAnswerSemantic: "DIGITAL_ROOT",
    sourcePrototypes: ["NUM-CP010-PROT-025"],
  },
]);

export const NUM_CP010_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP010_PERMANENT_ALLOCATION.map((allocation) => allocation.qlId),
) as readonly NumCp010PermanentQlId[];

export const NUM_CP010_ALLOCATION_STATUS = Object.freeze({
  checkpointId: "NUM-CP-010",
  approvalDate: "2026-08-22",
  approvalStatus: "EXPLICIT_COUNT_APPROVAL_RECEIVED",
  approvedAuthorityCount: 16,
  permanentQlCount: 16,
  firstPermanentQl: "NUM-QL-197",
  lastPermanentQl: "NUM-QL-212",
  nextAvailableQl: "NUM-QL-213",
  permanentIdentitiesAllocated: true,
  englishRuntimeFrozen: true,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}) as const;
