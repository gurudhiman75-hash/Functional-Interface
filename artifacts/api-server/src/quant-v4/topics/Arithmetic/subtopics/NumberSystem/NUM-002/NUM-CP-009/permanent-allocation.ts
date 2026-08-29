export type NumCp009PermanentQlId =
  | "NUM-QL-185"
  | "NUM-QL-186"
  | "NUM-QL-187"
  | "NUM-QL-188"
  | "NUM-QL-189"
  | "NUM-QL-190"
  | "NUM-QL-191"
  | "NUM-QL-192"
  | "NUM-QL-193"
  | "NUM-QL-194"
  | "NUM-QL-195"
  | "NUM-QL-196";

export type NumCp009PermanentAuthorityId =
  | "NUM-CP009-AUTH-001"
  | "NUM-CP009-AUTH-002"
  | "NUM-CP009-AUTH-003"
  | "NUM-CP009-AUTH-004"
  | "NUM-CP009-AUTH-005"
  | "NUM-CP009-AUTH-006"
  | "NUM-CP009-AUTH-007"
  | "NUM-CP009-AUTH-008"
  | "NUM-CP009-AUTH-009"
  | "NUM-CP009-AUTH-010"
  | "NUM-CP009-AUTH-011"
  | "NUM-CP009-AUTH-012";

export type NumCp009PrototypeId = `NUM-CP009-PROT-${string}`;

export type NumCp009SourceSlice = Readonly<{
  prototypeId: NumCp009PrototypeId;
  requiredAnswerSemantic?: "LAST_TWO_DIGITS" | "LAST_THREE_DIGITS";
}>;

export type NumCp009PermanentAllocation = Readonly<{
  qlId: NumCp009PermanentQlId;
  authorityId: NumCp009PermanentAuthorityId;
  label: string;
  authorityAnswerSemantic: string;
  sourceSlices: readonly NumCp009SourceSlice[];
}>;

export const NUM_CP009_PERMANENT_ALLOCATION: readonly NumCp009PermanentAllocation[] = Object.freeze([
  {
    qlId: "NUM-QL-185",
    authorityId: "NUM-CP009-AUTH-001",
    label: "Unit digit of a single power",
    authorityAnswerSemantic: "UNIT_DIGIT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-001" }],
  },
  {
    qlId: "NUM-QL-186",
    authorityId: "NUM-CP009-AUTH-002",
    label: "Unit digit of a short composed power expression",
    authorityAnswerSemantic: "UNIT_DIGIT",
    sourceSlices: [
      { prototypeId: "NUM-CP009-PROT-002" },
      { prototypeId: "NUM-CP009-PROT-003" },
    ],
  },
  {
    qlId: "NUM-QL-187",
    authorityId: "NUM-CP009-AUTH-003",
    label: "Unit digit of a bounded power tower",
    authorityAnswerSemantic: "UNIT_DIGIT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-004" }],
  },
  {
    qlId: "NUM-QL-188",
    authorityId: "NUM-CP009-AUTH-004",
    label: "Unit-digit cycle length",
    authorityAnswerSemantic: "CYCLE_LENGTH",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-005" }],
  },
  {
    qlId: "NUM-QL-189",
    authorityId: "NUM-CP009-AUTH-005",
    label: "Exponent class set from terminal conditions",
    authorityAnswerSemantic: "EXPONENT_CLASS_SET",
    sourceSlices: [
      { prototypeId: "NUM-CP009-PROT-006" },
      { prototypeId: "NUM-CP009-PROT-016" },
    ],
  },
  {
    qlId: "NUM-QL-190",
    authorityId: "NUM-CP009-AUTH-006",
    label: "Bounded exponent count from a terminal condition",
    authorityAnswerSemantic: "COUNT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-007" }],
  },
  {
    qlId: "NUM-QL-191",
    authorityId: "NUM-CP009-AUTH-007",
    label: "Last two digits of a power expression",
    authorityAnswerSemantic: "LAST_TWO_DIGITS",
    sourceSlices: [
      { prototypeId: "NUM-CP009-PROT-008" },
      { prototypeId: "NUM-CP009-PROT-009" },
      { prototypeId: "NUM-CP009-PROT-015", requiredAnswerSemantic: "LAST_TWO_DIGITS" },
    ],
  },
  {
    qlId: "NUM-QL-192",
    authorityId: "NUM-CP009-AUTH-008",
    label: "Last three digits of a power expression",
    authorityAnswerSemantic: "LAST_THREE_DIGITS",
    sourceSlices: [
      { prototypeId: "NUM-CP009-PROT-010" },
      { prototypeId: "NUM-CP009-PROT-011" },
      { prototypeId: "NUM-CP009-PROT-015", requiredAnswerSemantic: "LAST_THREE_DIGITS" },
    ],
  },
  {
    qlId: "NUM-QL-193",
    authorityId: "NUM-CP009-AUTH-009",
    label: "Complete bounded exponent set from a terminal condition",
    authorityAnswerSemantic: "EXPONENT_SET",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-012" }],
  },
  {
    qlId: "NUM-QL-194",
    authorityId: "NUM-CP009-AUTH-010",
    label: "Terminal-digit feasibility",
    authorityAnswerSemantic: "POSSIBLE_OR_IMPOSSIBLE_TERMINAL_DIGIT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-013" }],
  },
  {
    qlId: "NUM-QL-195",
    authorityId: "NUM-CP009-AUTH-011",
    label: "Unit digit with a structured exponent",
    authorityAnswerSemantic: "UNIT_DIGIT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-014" }],
  },
  {
    qlId: "NUM-QL-196",
    authorityId: "NUM-CP009-AUTH-012",
    label: "Unit digit of a long repeated-power sum",
    authorityAnswerSemantic: "UNIT_DIGIT",
    sourceSlices: [{ prototypeId: "NUM-CP009-PROT-017" }],
  },
]);

export const NUM_CP009_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP009_PERMANENT_ALLOCATION.map((allocation) => allocation.qlId),
) as readonly NumCp009PermanentQlId[];

export const NUM_CP009_ALLOCATION_STATUS = Object.freeze({
  checkpointId: "NUM-CP-009",
  approvalStatus: "EXPLICIT_COUNT_APPROVAL_RECEIVED",
  approvedAuthorityCount: 12,
  permanentQlCount: 12,
  firstPermanentQl: "NUM-QL-185",
  lastPermanentQl: "NUM-QL-196",
  nextAvailableQl: "NUM-QL-197",
  permanentIdentitiesAllocated: true,
  englishRuntimeFrozen: true,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}) as const;
