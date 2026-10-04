export const ASM_001_PACKAGE_ID = "ASM-001" as const;
export const ASM_001_RUNTIME_MODE = "review-only" as const;
export const ASM_001_FREEZE_VERSION = "ASM_001_POST_CLOSURE_FREEZE_2026_10_04_V2" as const;

export type AsmQlId = "ASM-QL-001";
export type AsmCheckpointId = "ASM-CP-001";

export type AsmAnswerClass =
  | "BOTH_TRUE_REASON_EXPLAINS"
  | "BOTH_TRUE_REASON_NOT_EXPLAINS"
  | "ASSERTION_TRUE_REASON_FALSE"
  | "ASSERTION_FALSE_REASON_TRUE"
  | "BOTH_FALSE";

export const ASM_001_QL_AUTHORITIES = Object.freeze([
  Object.freeze({
    qlId: "ASM-QL-001" as const,
    checkpointId: "ASM-CP-001" as const,
    title: "Assertion and Reason truth-explanation classification",
    solveContract:
      "Evaluate Assertion and Reason independently for truth, then decide whether a true Reason correctly explains a true Assertion.",
    answerSemantic: "ASSERTION_REASON_CLASS" as const,
    supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
    sourceEvidenceRefs: [
      "repo:REASONING-V1-MASTER-BLUEPRINT.md::REAS-ASM",
      "repo:CAE-001-SOURCE-AND-OWNERSHIP-AUDIT.md::assertionReasonOwnedBy",
      "external:testbook-rpf-constable-assertions-and-reasons",
      "external:testbook-assertion-reason-standard-four-class-format",
      "external:testbook-assertion-reason-five-class-format",
    ] as const,
  }),
] as const);

export const ASM_001_PERMANENT_QL_IDS = Object.freeze(["ASM-QL-001"] as const);
export const ASM_001_CHECKPOINT_IDS = Object.freeze(["ASM-CP-001"] as const);

export const ASM_001_CONTENT_CLOSURE = Object.freeze({
  authorityId: "ASM_001_POST_CLOSURE_DEEP_AUDIT_20261004_V2" as const,
  status: "CONTENT_DEEP_AUDIT_CLOSED__1_QL__23_CURATED_SCENARIOS__TRILINGUAL_REVIEW_ONLY" as const,
  packageId: ASM_001_PACKAGE_ID,
  permanentQlRange: "ASM-QL-001" as const,
  permanentQlCount: 1 as const,
  nextAvailablePermanentQl: "ASM-QL-002" as const,
  sourcePosture:
    "ASSERTION_REASON_FORMAT_SOURCE_BACKED__CURATED_FACT_AUTHORITY__TARGET_EXAM_FREQUENCY_NOT_OVERCLAIMED" as const,
  sourceSaturationClaim:
    "CORE_ANSWER_LATTICE_AND_PRESENTATION_PROFILES_CLOSED__FUTURE_SOURCE_REOPEN_ALLOWED" as const,
  reviewGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

export function isAsm001QlId(value: string): value is AsmQlId {
  return value === "ASM-QL-001";
}
