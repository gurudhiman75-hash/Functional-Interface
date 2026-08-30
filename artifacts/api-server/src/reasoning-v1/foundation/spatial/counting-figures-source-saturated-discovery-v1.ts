export type CountingFigureSourceShapeV1 =
  | "TRIANGLE"
  | "SQUARE"
  | "RECTANGLE"
  | "QUADRILATERAL";

export type CountingFigureSourceRecordV1 = Readonly<{
  sourceId: string;
  examFamily: "SSC_CGL" | "SSC_CHSL";
  heldOn: string;
  shift: string;
  targetShape: CountingFigureSourceShapeV1;
  sourceKind: "DIRECT_OFFICIAL_PAPER_MIRROR" | "DIRECT_PYQ_PAGE";
  sourceUrl: string;
  note: string;
}>;

export const FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1 = Object.freeze([
  {
    sourceId: "FCT-SRC-001",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-12",
    shift: "2",
    targetShape: "SQUARE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-squares-are-there-in-the-given-figure--6710ce2b971b04a9fc63f7b6",
    note: "SSC CGL 2024 Tier-I official paper mirror; square-count question, answer 9.",
  },
  {
    sourceId: "FCT-SRC-002",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-13",
    shift: "3",
    targetShape: "SQUARE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-squares-are-there-in-the-figure-shown-bel--6715fbd9922d29b22cf3d08e",
    note: "SSC CGL 2024 Tier-I official paper mirror; square-count question, answer 11.",
  },
  {
    sourceId: "FCT-SRC-003",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-17",
    shift: "1",
    targetShape: "TRIANGLE",
    sourceKind: "DIRECT_OFFICIAL_PAPER_MIRROR",
    sourceUrl: "https://cdn.testbook.com/1771254597536-SSC%20CGL%202024%20Tier-I%20Official%20Paper%20%28Held%20On%2017%20Sept%202024%20Shift%201%29%20English.pdf/1771254598.pdf",
    note: "SSC CGL 2024 Tier-I official paper mirror; Q23 asks triangle count.",
  },
  {
    sourceId: "FCT-SRC-004",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-17",
    shift: "3",
    targetShape: "TRIANGLE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-triangles-are-there-in-the-given-figure--6715fce24379da4118072756",
    note: "SSC CGL 2024 Tier-I official paper mirror; triangle-count question, answer 12.",
  },
  {
    sourceId: "FCT-SRC-005",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-25",
    shift: "2",
    targetShape: "TRIANGLE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-triangles-are-there-in-the-given-figure--671609e7c44081684d87b0a3",
    note: "SSC CGL 2024 Tier-I official paper mirror; triangle-count question, answer 13.",
  },
  {
    sourceId: "FCT-SRC-006",
    examFamily: "SSC_CGL",
    heldOn: "2024-09-26",
    shift: "1",
    targetShape: "TRIANGLE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-triangles-are-there-in-the-given-figure--67160a8434f3ec68d2cc90b9",
    note: "SSC CGL 2024 Tier-I official paper mirror; triangle-count question, answer 8.",
  },
  {
    sourceId: "FCT-SRC-007",
    examFamily: "SSC_CHSL",
    heldOn: "2023-08-02",
    shift: "2",
    targetShape: "RECTANGLE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/identify-the-number-of-rectangles-in-the-given-fig--64e5caf41bf95afebffd2c6c",
    note: "SSC CHSL 2023 Tier-I official paper mirror; rectangle-count question, answer 9.",
  },
  {
    sourceId: "FCT-SRC-008",
    examFamily: "SSC_CGL",
    heldOn: "2020-03-03",
    shift: "1",
    targetShape: "RECTANGLE",
    sourceKind: "DIRECT_OFFICIAL_PAPER_MIRROR",
    sourceUrl: "https://blogmedia.testbook.com/blog/wp-content/uploads/2020/07/ssc-cgl-3-march-2020-shift-1_eng-f2b0e30d.pdf",
    note: "SSC CGL 2020 Tier-I official paper mirror; rectangle-count question, answer 35.",
  },
  {
    sourceId: "FCT-SRC-009",
    examFamily: "SSC_CGL",
    heldOn: "2019-06-04",
    shift: "1",
    targetShape: "SQUARE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-squares-are-there-in-the-following-figure--5d84be88f60d5d14273ef96e",
    note: "SSC CGL 2019 Tier-I official paper mirror; square-count question, answer 14.",
  },
  {
    sourceId: "FCT-SRC-010",
    examFamily: "SSC_CGL",
    heldOn: "2019-06-06",
    shift: "1",
    targetShape: "SQUARE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-squares-are-there-in-the-following-figure--5d78f826fdb8bb3615fea69d",
    note: "SSC CGL 2019 Tier-I official paper mirror; square-count question, answer 14.",
  },
  {
    sourceId: "FCT-SRC-011",
    examFamily: "SSC_CGL",
    heldOn: "2017-08-16",
    shift: "1",
    targetShape: "QUADRILATERAL",
    sourceKind: "DIRECT_OFFICIAL_PAPER_MIRROR",
    sourceUrl: "https://blogmedia.testbook.com/blog/wp-content/uploads/2020/03/ssc-cgl-tier-1-16th-august-2017-d6a77f60.pdf",
    note: "SSC CGL 2017 Tier-I official paper mirror; direct quadrilateral-count task.",
  },
  {
    sourceId: "FCT-SRC-012",
    examFamily: "SSC_CHSL",
    heldOn: "2022-05-31",
    shift: "1",
    targetShape: "SQUARE",
    sourceKind: "DIRECT_PYQ_PAGE",
    sourceUrl: "https://testbook.com/question-answer/how-many-squares-are-there-in-the-given-figure--62cdb0be775a5bfe5e83da1f",
    note: "SSC CHSL 2021 cycle paper held in 2022; square-count question, answer 14.",
  },
] as const satisfies readonly CountingFigureSourceRecordV1[]);

export const FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-SOURCE-SATURATED-DISCOVERY-V1" as const,
  chapterCode: "FCT-001" as const,
  status: "CP001_SOURCE_BACKED_FOUNDATION_CANDIDATE" as const,
  directSscRecordCount: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
  coveredExamFamilies: ["SSC_CGL", "SSC_CHSL"] as const,
  coveredHeldYearRange: "2017..2024" as const,
  sourceBackedTargetShapes: ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const,
  recentCoreEvidence: {
    year: 2024,
    examFamily: "SSC_CGL",
    triangleEvidenceAcrossMultipleShifts: true,
    squareEvidenceAcrossMultipleShifts: true,
  },
  candidateQlBoundary: {
    candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" as const,
    targetShapeIsInitiallyParameterNotQl: true,
    permanentQlAllocationDeferred: true,
    nextAvailableSpatialPermanentQlId: "SPA-QL-042" as const,
  },
  heldBoundaries: [
    "FCT-HOLD-B-REGULAR-GRID-FORMULA",
    "FCT-HOLD-C-LINE-SEGMENT-COUNT",
    "GENERIC_CONCAVE_QUADRILATERAL_ENUMERATION_PENDING_SOLVER_PROOF",
    "BANKING_DIRECT_COVERAGE_NOT_YET_ESTABLISHED",
    "PUNJAB_STATE_DIRECT_COVERAGE_NOT_YET_ESTABLISHED",
  ] as const,
  governance: {
    permanentQlAllocated: false,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    mergeAuthorized: false,
    deploymentPerformed: false,
  },
  nextGate: "FCT_001_EXACT_GRAPH_FOUNDATION_V1" as const,
});
