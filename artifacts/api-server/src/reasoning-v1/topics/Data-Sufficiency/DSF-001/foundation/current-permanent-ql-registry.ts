import { DSF_PERMANENT_QL_REGISTRY } from "./permanent-ql-registry.ts";

/**
 * CP000's DSF_PERMANENT_QL_REGISTRY is a historical freeze snapshot and must
 * remain unchanged. Later permanent allocations are layered here so historical
 * CP000 tests continue to describe the state that was actually frozen then.
 */
export const DSF_QL_002_PERMANENT_ENTRY = Object.freeze({
  qlId: "DSF-QL-002" as const,
  allocatedFromCandidateId: "DSF-QL-CAND-002" as const,
  implementationCheckpoint: "DSF-CP-015" as const,
  taskDirection: "DATA_SUFFICIENCY" as const,
  taskContract: "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS" as const,
  ruleId: "INFORMATION_SUFFICIENCY_SUBSET_LATTICE" as const,
  answerSemantic: "MINIMAL_SUFFICIENT_STATEMENT_SUBSET" as const,
  statementCount: 3 as const,
  semanticStateCount: 19 as const,
  supportedTargetFamilies: Object.freeze([
    "SCALAR_OR_EXACT_VALUE",
    "BOOLEAN_OR_CATEGORICAL_PROPERTY",
    "RELATIONAL_TARGETS",
  ] as const),
  presentationProfiles: Object.freeze([
    "NAMED_STATEMENT_SUBSETS",
    "MIXED_MINIMAL_SUBSET_EXPRESSIONS",
    "DYNAMIC_NEAREST_5",
  ] as const),
  lifecycle: Object.freeze({
    englishContentStatus: "CP015_THREE_STATEMENT_SEMANTIC_FOUNDATION_FROZEN" as const,
    sourceBackedPrototypeChapters: Object.freeze(["NUM-001"] as const),
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  }),
});

export const DSF_CURRENT_PERMANENT_QL_REGISTRY = Object.freeze([
  ...DSF_PERMANENT_QL_REGISTRY,
  DSF_QL_002_PERMANENT_ENTRY,
] as const);

export type DsfCurrentPermanentQlId = (typeof DSF_CURRENT_PERMANENT_QL_REGISTRY)[number]["qlId"];

export const DSF_CURRENT_NEXT_AVAILABLE_QL_ID = "DSF-QL-003" as const;

export function getCurrentDsfPermanentQl(qlId: string) {
  return DSF_CURRENT_PERMANENT_QL_REGISTRY.find((entry) => entry.qlId === qlId);
}
