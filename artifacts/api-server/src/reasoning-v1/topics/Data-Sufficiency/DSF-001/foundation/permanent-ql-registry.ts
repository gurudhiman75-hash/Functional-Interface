export const DSF_PERMANENT_QL_REGISTRY = [
  {
    qlId: "DSF-QL-001",
    allocatedFromCandidateId: "DSF-QL-CAND-001",
    implementationCheckpoint: "DSF-CP-001",
    taskDirection: "DATA_SUFFICIENCY",
    taskContract: "TWO_STATEMENT_TARGET_DETERMINACY",
    ruleId: "INFORMATION_SUFFICIENCY_TWO_STATEMENT",
    answerSemantic: "SUFFICIENCY_CLASS",
    statementCount: 2,
    supportedTargetFamilies: [
      "SCALAR_OR_EXACT_VALUE",
      "BOOLEAN_OR_CATEGORICAL_PROPERTY",
      "RANK_OR_POSITION",
      "IDENTITY",
      "DIRECTION_OR_DISTANCE",
      "RELATION",
      "COMPARISON",
      "COUNT",
    ],
    lifecycle: {
      englishContentStatus: "PARTIAL_PRODUCTION_GENERATION_REVIEW_CANDIDATE",
      productionBackedSourceChapters: ["NUM-001", "RAP-001", "PCT-001"],
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  },
] as const;

export type DsfPermanentQlId = (typeof DSF_PERMANENT_QL_REGISTRY)[number]["qlId"];

export const DSF_NEXT_AVAILABLE_QL_ID = "DSF-QL-002" as const;

export function getDsfPermanentQl(qlId: string) {
  return DSF_PERMANENT_QL_REGISTRY.find((entry) => entry.qlId === qlId);
}
