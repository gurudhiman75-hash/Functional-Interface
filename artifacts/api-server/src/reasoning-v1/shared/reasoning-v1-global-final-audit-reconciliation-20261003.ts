export type ReasoningImplementedAuditStateV1 =
  | "PASS"
  | "PASS_WITH_REVIEW_GATE";

export interface ReasoningImplementedChapterAuditClosureV1 {
  readonly topicDirectory: string;
  readonly chapterId: string;
  readonly closureAuthorityPath: string;
  readonly auditState: ReasoningImplementedAuditStateV1;
  readonly remainingGate:
    | "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE"
    | "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE";
}

export const REASONING_V1_CURRENT_IMPLEMENTED_AUDIT_RECONCILIATION_20261003 =
  Object.freeze({
    authorityId:
      "REASONING_V1_CURRENT_IMPLEMENTED_AUDIT_RECONCILIATION_20261003" as const,
    scope:
      "CURRENT_IMPLEMENTED_REASONING_CORPUS_ONLY__NOT_A_CLAIM_THAT_EVERY_MASTER_BLUEPRINT_CHAPTER_IS_IMPLEMENTED" as const,
    status:
      "CURRENT_IMPLEMENTED_CHAPTER_CONTENT_AUDITS_RECONCILED__NOVELTY_AUDITS_RECONCILED__LEARNER_RELEASE_GATES_SEPARATE" as const,
    chapters: Object.freeze([
      {
        topicDirectory: "Alphabet-Test",
        chapterId: "ALP-001",
        closureAuthorityPath:
          "topics/Alphabet-Test/ALP-001/ALP-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Analogy",
        chapterId: "ANA-001",
        closureAuthorityPath:
          "topics/Analogy/ANA-001/ANA-001-FINAL-AUDIT-REMEDIATION-V1.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Blood-Relations",
        chapterId: "BLR-001",
        closureAuthorityPath:
          "topics/Blood-Relations/BLR-001/BLR-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Calendar",
        chapterId: "CAL-001",
        closureAuthorityPath:
          "topics/Calendar/CAL-001/CAL-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Cause-and-Effect",
        chapterId: "CAE-001",
        closureAuthorityPath:
          "topics/Cause-and-Effect/CAE-001/CAE-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Classification",
        chapterId: "CLS-001",
        closureAuthorityPath:
          "topics/Classification/CLS-001/CLS-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Clocks",
        chapterId: "CLK-001",
        closureAuthorityPath:
          "topics/Clocks/CLK-001/CLK-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Coding-Decoding",
        chapterId: "COD-001",
        closureAuthorityPath:
          "topics/Coding-Decoding/COD-001/COD-001-FINAL-DEEP-AUDIT-CLOSURE-20260928.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Course-of-Action",
        chapterId: "COA-001",
        closureAuthorityPath:
          "topics/Course-of-Action/COA-001/COA-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Data-Sufficiency",
        chapterId: "DSF-001",
        closureAuthorityPath:
          "topics/Data-Sufficiency/DSF-001/DSF-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Decision-Making",
        chapterId: "DM-001",
        closureAuthorityPath:
          "topics/Decision-Making/DM-001/DM-001-FINAL-CLOSURE-FREEZE-20261004.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Direction-Sense",
        chapterId: "DIR-001",
        closureAuthorityPath:
          "topics/Direction-Sense/DIR-001/DIR-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Floor-and-Flat-Arrangement",
        chapterId: "FLR-001",
        closureAuthorityPath:
          "topics/Floor-and-Flat-Arrangement/FLR-001/FLR-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "InputOutput",
        chapterId: "IOP-001",
        closureAuthorityPath:
          "topics/InputOutput/IOP-001/IOP-001-FINAL-DEEP-AUDIT-CLOSURE-20260930.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Inequality",
        chapterId: "INE-001",
        closureAuthorityPath:
          "topics/Inequality/INE-001/INE-001-FINAL-DEEP-AUDIT-CLOSURE-20261003.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Assertion-and-Reason",
        chapterId: "ASM-001",
        closureAuthorityPath:
          "topics/Assertion-and-Reason/ASM-001/ASM-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Logic-Puzzles",
        chapterId: "LP-001",
        closureAuthorityPath:
          "topics/Logic-Puzzles/LP-001/LP-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20260930.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Mathematical-Operations",
        chapterId: "OPS-001",
        closureAuthorityPath:
          "topics/Mathematical-Operations/OPS-001/OPS-001-FINAL-DEEP-AUDIT-CLOSURE-20260930.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Missing-Number",
        chapterId: "MIS-001",
        closureAuthorityPath:
          "topics/Missing-Number/MIS-001/MIS-001-FINAL-READINESS-FREEZE-V1.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Non-Verbal-Reasoning",
        chapterId: "SPA-FND-001",
        closureAuthorityPath:
          "foundation/spatial/spatial-family-freeze-v1.ts",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Ranking-and-Order",
        chapterId: "RNK-001",
        closureAuthorityPath:
          "topics/Ranking-and-Order/RNK-001/RNK-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20260930.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "SeatingArrangement",
        chapterId: "SEA-FAMILY-CURRENT",
        closureAuthorityPath:
          "topics/SeatingArrangement/SEA-FAMILY-CURRENT-CLOSURE-20261003.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Series",
        chapterId: "SER-001",
        closureAuthorityPath:
          "topics/Series/SER-001/SER-001-FINAL-DEEP-AUDIT-CLOSURE-20260929.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Statement-and-Arguments",
        chapterId: "ARG-001",
        closureAuthorityPath:
          "topics/Statement-and-Arguments/ARG-001/ARG-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Statement-and-Assumption",
        chapterId: "STA-001",
        closureAuthorityPath:
          "topics/Statement-and-Assumption/STA-001/STA-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Statement-and-Conclusion",
        chapterId: "STC-001",
        closureAuthorityPath:
          "topics/Statement-and-Conclusion/STC-001/STC-001-POST-CLOSURE-DEEP-AUDIT-20261003.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Statement-and-Inference",
        chapterId: "SIF-001",
        closureAuthorityPath:
          "topics/Statement-and-Inference/SIF-001/SIF-001-POST-CLOSURE-DEEP-AUDIT-20261004.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Syllogism",
        chapterId: "SYL-001",
        closureAuthorityPath:
          "topics/Syllogism/SYL-001/SYL-001-POST-CLOSURE-DEEP-AUDIT-20261003.md",
        auditState: "PASS",
        remainingGate: "SOURCE_WEIGHTING_DIFFICULTY_CALIBRATION_AND_RELEASE_SEPARATE",
      },
      {
        topicDirectory: "Venn-Diagrams",
        chapterId: "VEN-001",
        closureAuthorityPath:
          "topics/Venn-Diagrams/VEN-001/VEN-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Word-Dictionary-Order",
        chapterId: "WOR-001",
        closureAuthorityPath:
          "topics/Word-Dictionary-Order/WOR-001/WOR-001-FINAL-CONTENT-DEEP-AUDIT-CLOSURE-20261001.md",
        auditState: "PASS_WITH_REVIEW_GATE",
        remainingGate: "MANUAL_EDITORIAL_OR_PRODUCT_APPROVAL_SEPARATE",
      },
      {
        topicDirectory: "Word-Formation",
        chapterId: "WFM-001",
        closureAuthorityPath:
          "topics/Word-Formation/WFM-001/WFM-001-FINAL-DEEP-AUDIT-CLOSURE-20261001.md",
        auditState: "PASS",
        remainingGate: "RELEASE_OR_PRODUCT_APPROVAL_SEPARATE",
      },
    ] satisfies readonly ReasoningImplementedChapterAuditClosureV1[]),
    reconciliationRules: Object.freeze({
      intermediateWavePendingTextDoesNotOverrideLaterClosureAuthority: true,
      contentDeepAuditClosureDoesNotAuthorizeLearnerRelease: true,
      controlledNoveltyClosureDoesNotReplaceSourceCoverage: true,
      sourceThinExplicitHoldsDoNotReopenAnOtherwiseClosedContentAudit: true,
      blueprintOnlyOrNotYetStandaloneChaptersAreOutsideThisClosure: true,
    }),
    knownStandaloneBlueprintFrontier: Object.freeze([
      "REAS-MAT",
      "REAS-GAM",
    ] as const),
  } as const);
