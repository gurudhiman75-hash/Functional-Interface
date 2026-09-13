import { CAE_CHECKPOINT_IDS, CAE_PROVISIONAL_QL_IDS } from "./types.ts";

const checkpoint = (
  checkpointId: (typeof CAE_CHECKPOINT_IDS)[number],
  qlIds: readonly string[],
  ownership: string,
  status: "IMPLEMENTED_REVIEW_APPROVED_V2" | "FINAL_QA_EXECUTION_GREEN_HUMAN_REVIEW_APPROVED",
) => ({ checkpointId, qlIds, ownership, status }) as const;

export const CAE_001_MANIFEST = Object.freeze({
  chapterId: "CAE-001" as const,
  subjectCode: "REAS-CAE" as const,
  title: "Cause and Effect" as const,
  family: "FAMILY_C_LOGIC_AND_DEDUCTION" as const,
  examinations: ["SSC", "BANKING", "PUNJAB_STATE"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  qlDiscovery: {
    status: "SOURCE_SATURATED_CONTENT_FROZEN" as const,
    currentCandidateIds: CAE_PROVISIONAL_QL_IDS,
    freezeRule: "Current CAE-QL-001..009 allocation is content-frozen after source-pattern census, reviewed QA execution and final human editorial review. Add a new QL only for a materially new sourced learner operation that cannot be represented by the frozen allocation.",
  },
  checkpoints: [
    checkpoint("CAE-CP-001", ["CAE-QL-001"], "Direct cause/effect plus source-profile direct-recognition coverage.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-002", ["CAE-QL-002"], "Common/independent relationships plus exact Bank/Punjab source relationship sets.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-003", ["CAE-QL-003"], "Probable cause with conventional one-of-four and graph-proven two-cause combination rendering; final human ambiguity remediation applied.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-004", ["CAE-QL-004"], "Probable effect with conventional one-of-four and graph-proven two/three-effect combination rendering.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-005", ["CAE-QL-005"], "Reviewed causal-strength/competing-explanation calibration with genuine MEDIUM/HARD alternatives.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-006", ["CAE-QL-006"], "Indirect causal chain plus immediate-versus-remote/principal causal-distance discrimination.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-007", ["CAE-QL-007"], "Reviewed same-domain false causation/post-hoc and hidden-common-factor discrimination; decisive false-causation evidence is learner-visible.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-008", ["CAE-QL-008"], "Reviewed multi-event causal reasoning across sequence, immediate/remote roles, bridge and invalid-link operations.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-009", ["CAE-QL-009"], "Reviewed integrated graph reasoning across one/two-gap, connector, relation, outcome and common-cause reconstruction; answer-leading explicit-chain cue removed.", "IMPLEMENTED_REVIEW_APPROVED_V2"),
    checkpoint("CAE-CP-010", [], "Reviewed-output saturation, ambiguity, identity, localization, lifecycle and editorial-pack gates executed green; regenerated 90-question and source-profile packs passed final human editorial review.", "FINAL_QA_EXECUTION_GREEN_HUMAN_REVIEW_APPROVED"),
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
