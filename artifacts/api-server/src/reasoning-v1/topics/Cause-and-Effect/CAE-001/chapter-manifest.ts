import { CAE_CHECKPOINT_IDS, CAE_PROVISIONAL_QL_IDS } from "./types.ts";

const checkpoint = (
  checkpointId: (typeof CAE_CHECKPOINT_IDS)[number],
  qlIds: readonly string[],
  ownership: string,
  status: "IMPLEMENTED_REVIEW_CANDIDATE_V2" | "AUTOMATED_QA_NOT_FROZEN",
) => ({ checkpointId, qlIds, ownership, status }) as const;

export const CAE_001_MANIFEST = Object.freeze({
  chapterId: "CAE-001" as const,
  subjectCode: "REAS-CAE" as const,
  title: "Cause and Effect" as const,
  family: "FAMILY_C_LOGIC_AND_DEDUCTION" as const,
  examinations: ["SSC", "BANKING", "PUNJAB_STATE"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  qlDiscovery: {
    status: "PROVISIONAL_PENDING_SOURCE_SATURATION" as const,
    currentCandidateIds: CAE_PROVISIONAL_QL_IDS,
    freezeRule: "Do not freeze QL count or allocation until source-pattern discovery and semantic saturation are reviewed.",
  },
  checkpoints: [
    checkpoint("CAE-CP-001", ["CAE-QL-001"], "Current provisional direct-cause/effect candidate; statement order varies independently of causal order.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-002", ["CAE-QL-002"], "Current provisional common-cause/independence candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-003", ["CAE-QL-003"], "Current provisional probable-cause candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-004", ["CAE-QL-004"], "Current provisional probable-effect candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-005", ["CAE-QL-005"], "Current provisional causal-strength/competing-explanation candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-006", ["CAE-QL-006"], "Current provisional indirect-cause candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-007", ["CAE-QL-007"], "Current provisional correlation-versus-causation candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-008", ["CAE-QL-008"], "Current provisional multi-event-sequence candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-009", ["CAE-QL-009"], "Current provisional missing-link candidate.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-010", [], "Generated-output ambiguity, duplication, localization, and difficulty gates.", "AUTOMATED_QA_NOT_FROZEN"),
  ],
  ownership: {
    statementConclusionOwnedBy: "STC-001" as const,
    statementAssumptionOwnedBy: "STA-001" as const,
    statementArgumentOwnedBy: "REAS-ARG" as const,
    courseOfActionOwnedBy: "REAS-COA" as const,
    assertionReasonOwnedBy: "REAS-ASM" as const,
    causalDirectionAndCausalGraphReasoningOwnedBy: "CAE-001" as const,
  },
  generationPolicy: {
    freeFormGenerationAllowed: false,
    composableScenarioFamiliesRequired: true,
    canonicalWorldAndVisibleContextMustBeSeparate: true,
    graphFirstProjectionRequired: true,
    independentCausalGraphSolverRequired: true,
    chronologyAloneIsInsufficientForCausation: true,
    outsideKnowledgeInferenceForbidden: true,
    exactlyOneDefensibleOptionRequired: true,
  },
  lifecycle: {
    reviewOnly: true,
    questionStudioVisible: true,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publicEligible: false,
    automaticPublication: false,
  },
});
