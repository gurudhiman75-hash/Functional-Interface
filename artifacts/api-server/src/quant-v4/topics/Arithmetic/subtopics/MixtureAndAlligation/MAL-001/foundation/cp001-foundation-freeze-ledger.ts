import {
  MAL_CP001_PROVISIONAL_QL_TEMPLATES,
  MAL_CP001_PROVISIONAL_SOLVE_MODES,
} from "./cp001-ql-expansion-ledger";

export const MAL_CP001_FOUNDATION_FREEZE_METADATA = {
  authority: "ExamTree product-owner directive to complete the CP-001 foundation",
  freezeDate: "2026-07-28",
  languageScope: "en",
  status: "FROZEN_FOUNDATION_ENGLISH",
  approvedPrototypeCount: 12,
  solveModeCount: 7,
  qlTemplateCount: 11,
  reviewedQuestionCount: 48,
  solveModeCountFrozen: true,
  qlTemplateCountFrozen: true,
  sourceGapDispositionFrozen: true,
  foundationFreezeReady: true,
  permanentQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
} as const;

export const MAL_CP001_FROZEN_SOLVE_MODES =
  MAL_CP001_PROVISIONAL_SOLVE_MODES.map(({ provisional: _provisional, ...mode }) => ({
    ...mode,
    foundationStatus: "FROZEN_FOUNDATION_ENGLISH" as const,
  }));

export const MAL_CP001_FROZEN_QL_TEMPLATES =
  MAL_CP001_PROVISIONAL_QL_TEMPLATES.map(({ provisionalStatus: _provisionalStatus, ...template }) => ({
    ...template,
    taskDirection:
      template.qlTemplateId === "MAL-CP001-QLC-TARGET-RATIO"
        ? "INVERSE" as const
        : template.taskDirection,
    foundationStatus: "FROZEN_FOUNDATION_ENGLISH" as const,
    permanentQlId: null,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  }));

export const MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS = [
  {
    gapId: "MAL-CP001-GAP-FINAL-TOTAL-QUANTITY",
    decision: "DEFERRED_NO_DIRECT_TARGET_EXAM_EVIDENCE",
    foundationOwner: "OUTSIDE_FROZEN_CP001_FOUNDATION",
    reopenCondition:
      "A direct trusted target-exam fixture must request final total mixture quantity as the answer rather than use it as an intermediate.",
    rationale:
      "The output is mechanically derivable from an admitted missing-quantity state, but it introduces a distinct answer and distractor contract with no recovered direct target-exam evidence.",
  },
  {
    gapId: "MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT",
    decision: "DEFERRED_NO_DIRECT_TARGET_EXAM_EVIDENCE",
    foundationOwner: "OUTSIDE_FROZEN_CP001_FOUNDATION",
    reopenCondition:
      "A direct trusted target-exam fixture must request the difference between the two component quantities.",
    rationale:
      "The scalar difference is not the same learner output as a labelled quantity pair or requested component share and cannot be admitted from algebraic possibility alone.",
  },
  {
    gapId: "MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE",
    decision: "INTERNAL_VALIDATION_ONLY_UNTIL_DIRECT_EXAM_EVIDENCE",
    foundationOwner: "INTERNAL_EDGE_VALIDATION",
    reopenCondition:
      "A direct trusted target-exam fixture must ask for an impossible, insufficient-data or determinacy predicate with dedicated option semantics.",
    rationale:
      "Impossible and underdetermined states remain valuable validator fixtures, but no direct student-facing target-exam contract was recovered.",
  },
] as const;

export const MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS = [
  {
    prototypeId: "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES",
    decision: "DEFERRED_VARIANT",
  },
  {
    prototypeId: "MAL-CP001-PROT-TWO-STAGE-UNKNOWN",
    decision: "HELD_FOR_DIRECT_EVIDENCE_OR_LATER_EXPLICIT_ACCEPTANCE",
  },
  {
    prototypeId: "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
    decision: "REFERRED_TO_MAL_CP002",
  },
] as const;
