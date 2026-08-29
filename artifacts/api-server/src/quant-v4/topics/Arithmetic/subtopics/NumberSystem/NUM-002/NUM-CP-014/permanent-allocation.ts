export const NUM_CP014_PERMANENT_ALLOCATION = [
  {
    qlId: "NUM-QL-248",
    authorityId: "NUM-CP014-AUTH-001",
    label: "Unique hidden scalar from two independently essential Number System engines",
    authorityAnswerSemantic: "DYNAMIC_HIDDEN_SCALAR",
    sourcePrototypes: [
      "NUM-CP014-PROT-001", "NUM-CP014-PROT-002", "NUM-CP014-PROT-003", "NUM-CP014-PROT-004",
      "NUM-CP014-PROT-005", "NUM-CP014-PROT-006", "NUM-CP014-PROT-013", "NUM-CP014-PROT-014",
      "NUM-CP014-PROT-015", "NUM-CP014-PROT-016", "NUM-CP014-PROT-017", "NUM-CP014-PROT-018",
      "NUM-CP014-PROT-019",
    ],
  },
  {
    qlId: "NUM-QL-249",
    authorityId: "NUM-CP014-AUTH-002",
    label: "Least or greatest value from a two-engine synthesis domain",
    authorityAnswerSemantic: "TWO_ENGINE_EXTREMUM",
    sourcePrototypes: ["NUM-CP014-PROT-007", "NUM-CP014-PROT-008"],
  },
  {
    qlId: "NUM-QL-250",
    authorityId: "NUM-CP014-AUTH-003",
    label: "Exact count after intersecting two independently essential constraints",
    authorityAnswerSemantic: "TWO_ENGINE_COUNT",
    sourcePrototypes: ["NUM-CP014-PROT-009", "NUM-CP014-PROT-012"],
  },
  {
    qlId: "NUM-QL-251",
    authorityId: "NUM-CP014-AUTH-004",
    label: "Answer-impact solution class under two essential Number System constraints",
    authorityAnswerSemantic: "TWO_ENGINE_SOLUTION_CLASS",
    sourcePrototypes: ["NUM-CP014-PROT-010"],
  },
  {
    qlId: "NUM-QL-252",
    authorityId: "NUM-CP014-AUTH-005",
    label: "Unique hidden scalar from three independently essential Number System engines",
    authorityAnswerSemantic: "THREE_ENGINE_HIDDEN_SCALAR",
    sourcePrototypes: ["NUM-CP014-PROT-011"],
  },
  {
    qlId: "NUM-QL-253",
    authorityId: "NUM-CP014-AUTH-006",
    label: "Complete valid set from two independently essential Number System constraints",
    authorityAnswerSemantic: "TWO_ENGINE_COMPLETE_SET",
    sourcePrototypes: ["NUM-CP014-PROT-020"],
  },
] as const;

export type NumCp014PermanentAllocation = typeof NUM_CP014_PERMANENT_ALLOCATION[number];
export type NumCp014PermanentQlId = NumCp014PermanentAllocation["qlId"];
export type NumCp014PermanentAuthorityId = NumCp014PermanentAllocation["authorityId"];

export const NUM_CP014_PERMANENT_QL_IDS = Object.freeze(
  NUM_CP014_PERMANENT_ALLOCATION.map((item) => item.qlId),
) as readonly NumCp014PermanentQlId[];

export const NUM_CP014_ALLOCATION_STATUS = Object.freeze({
  authorizationDate: "2026-08-28",
  authorizationStatus: "WAVE01_TO_WAVE05_CUMULATIVE_EXACT_HEAD_GREEN",
  certifiedDiscoveryHead: "0d807794ce3fc9d3393df278b074c2fb4d65662d",
  certifiedCumulativeRun: 33144489296,
  approvedAuthorityCount: 6,
  discoveryPrototypeCount: 20,
  firstPermanentQl: "NUM-QL-248",
  lastPermanentQl: "NUM-QL-253",
  nextAvailableQl: "NUM-QL-254",
  allocationState: "PERMANENT_ENGLISH_FREEZE_CANDIDATE",
  sourceSelectionModel: "DECOUPLED_AUTHORITY_SEED_AND_SOURCE_SEED_V1",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
} as const);
