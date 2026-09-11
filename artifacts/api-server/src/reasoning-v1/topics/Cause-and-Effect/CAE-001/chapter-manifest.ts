import { CAE_CHECKPOINT_IDS, CAE_QL_IDS } from "./types.ts";

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
  qlIds: CAE_QL_IDS,
  checkpoints: [
    checkpoint("CAE-CP-001", ["CAE-QL-001"], "Direct cause to effect; statement order varies independently of causal order.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-002", ["CAE-QL-002"], "Common cause, independent causes, and independent effects.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-003", ["CAE-QL-003"], "Probable cause of an observed event.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-004", ["CAE-QL-004"], "Probable immediate effect of an event.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-005", ["CAE-QL-005"], "Causal strength and competing explanations.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-006", ["CAE-QL-006"], "Indirect cause through one or more hidden causal links.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-007", ["CAE-QL-007"], "Correlation and temporal coincidence do not establish causation.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-008", ["CAE-QL-008"], "Multi-event causal sequence and structural relationships.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
    checkpoint("CAE-CP-009", ["CAE-QL-009"], "Causal graph completion and missing-link identification.", "IMPLEMENTED_REVIEW_CANDIDATE_V2"),
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
    curatedCausalWorldsRequired: true,
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
