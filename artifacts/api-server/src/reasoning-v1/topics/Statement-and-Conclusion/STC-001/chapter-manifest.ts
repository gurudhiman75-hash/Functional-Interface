import { STC_QL_IDS } from "./types.ts";

export const STC_001_MANIFEST = {
  chapterId: "STC-001",
  subjectCode: "REAS-STC",
  title: "Statement and Conclusion",
  family: "FAMILY_C_LOGIC_AND_DEDUCTION",
  examinations: ["SSC", "BANKING", "PUNJAB_STATE"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  semanticQlCount: 6,
  qlIds: STC_QL_IDS,
  checkpoints: [
    { checkpointId: "STC-CP-001", qlIds: ["STC-QL-001", "STC-QL-002"], status: "IMPLEMENTED_PROOF_GREEN_V1" },
    { checkpointId: "STC-CP-002", qlIds: ["STC-QL-003", "STC-QL-004"], status: "IMPLEMENTED_REVIEW_CANDIDATE_V1" },
    { checkpointId: "STC-CP-003", qlIds: ["STC-QL-005", "STC-QL-006"], status: "IMPLEMENTED_REVIEW_CANDIDATE_V1" },
  ] as const,
  boundary: {
    freeFormGenerationAllowed: false,
    curatedScenarioAuthoritiesRequired: true,
    independentSolverRequired: true,
    syllogismSetRelationOwnedBy: "SYL-001",
    assumptionsOwnedBy: "STA-001",
    argumentsOwnedBy: "REAS-ARG",
    courseOfActionOwnedBy: "REAS-COA",
    causeEffectClassificationOwnedBy: "REAS-CAE",
    decisionEligibilityOwnedBy: "REAS-DCS",
  },
  lifecycle: {
    semanticQlAllocationComplete: true,
    chapterFrozen: false,
    multilingualFrozen: false,
    questionStudio: "NOT_REGISTERED",
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publicEligible: false,
    automaticPublication: false,
  },
} as const;
