import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-matrix-source-saturated-discovery-v1";

export const FIGURE_MATRIX_SOURCE_EVIDENCE_V1 = Object.freeze({
  authorityId: "SPA-FMT-001-SOURCE-EVIDENCE-V1" as const,
  discoveryAuthorityId: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  reviewedDate: "2026-09-05" as const,
  records: Object.freeze([
    Object.freeze({
      target: "PUNJAB_STATE" as const,
      sourceKind: "PUNJAB_RECRUITMENT_SYLLABUS_RECORD" as const,
      url: "https://indiankanoon.org/doc/73057174/" as const,
      supports: Object.freeze(["FIGURE_MATRIX_EXPLICITLY_NAMED_UNDER_NON_VERBAL_REASONING"] as const),
    }),
    Object.freeze({
      target: "PUNJAB_STATE" as const,
      sourceKind: "CURRENT_PUNJAB_EXAM_SYLLABUS_MIRROR" as const,
      url: "https://testbook.com/ppsc-senior-assistant" as const,
      supports: Object.freeze(["FIGURE_MATRIX", "RULE_DETECTION"] as const),
    }),
    Object.freeze({
      target: "BANKING" as const,
      sourceKind: "CURRENT_BANKING_EXAM_SYLLABUS_MIRROR" as const,
      url: "https://testbook.com/amp/idbi-assistant-manager" as const,
      supports: Object.freeze(["FIGURE_MATRIX"] as const),
    }),
    Object.freeze({
      target: "SSC" as const,
      sourceKind: "SOLVED_SSC_PAPER_TASK" as const,
      url: "https://blogmedia.testbook.com/blog/wp-content/uploads/2020/07/solved-ssc-gd-5th-march-2019-shift-2-c13ebd83.pdf" as const,
      supports: Object.freeze(["MISSING_FIGURE_IN_3X3_MATRIX"] as const),
    }),
    Object.freeze({
      target: "CROSS_COMPETITIVE_REFERENCE" as const,
      sourceKind: "PRODUCT_OWNER_UPLOADED_REASONING_REFERENCE" as const,
      referenceTitle: "Reasoning for Competitions — Figure Matrix chapter" as const,
      supports: Object.freeze([
        "MATRIX_SIZES_2X2_3X3_4X4",
        "ROW_OR_COLUMN_COMMON_RULE",
        "FOUR_OPTION_MISSING_FIGURE_FORMAT",
        "ELEMENT_REMOVAL",
        "ROTATION_AND_INVERSION",
        "DOT_COUNT_PROGRESSIONS",
        "COMMON_PARTS_OR_COMPOSITION",
        "ELEMENT_POSITION_SHIFT",
        "NESTED_SIZE_LAYER_RECOMBINATION",
        "CSAT_RRB_DSSSB_IB_ACIO_STYLE_REFERENCES_IN_EXERCISE",
      ] as const),
    }),
  ]),
  uploadedReferenceObservations: Object.freeze({
    reviewedByProductOwnerContext: true as const,
    matrixSizesObserved: Object.freeze(["2x2", "3x3", "4x4"] as const),
    instructionPatternObserved: "IDENTIFY_THE_MISSING_FIGURE_TO_COMPLETE_THE_MATRIX" as const,
    ruleFamiliesDirectlyObserved: Object.freeze([
      "REMOVE_OUTER_OR_INNER_ELEMENT",
      "REMOVE_ORTHOGONAL_LINE_COMPONENT",
      "DOT_COUNT_MULTIPLICATION_OR_ADDITION",
      "DIAGONAL_OR_HORIZONTAL_INVERSION",
      "ROTATION_90_OR_135_DEGREES",
      "ROTATION_PLUS_REFLECTION",
      "COMMON_PARTS_INTERSECTION_OR_COMPOSITION",
      "CYCLIC_ELEMENT_SHIFT",
      "NESTED_SHAPE_SIZE_RECOMBINATION",
    ] as const),
    sourceTaxonomyLeakObserved: "THE_SAME_BOOK_CHAPTER_CONTINUES_WITH_FORM_THREE_GROUPS_ITEMS_AFTER_THE_CORE_MISSING_MATRIX_SET" as const,
    examtreeRemediation: "ROUTE_GROUPING_ITEMS_OUT_OF_FMT_001_AND_KEEP_ONLY_TRUE_2D_MATRIX_COMPLETION_SEMANTICS" as const,
    sourceExplanationWeakness: "SHORT_RULE_ASSERTIONS_WITHOUT_A_SYSTEMATIC_ROW_COLUMN_PROOF_OR_DISTRACTOR_CHECK" as const,
    explanationUpgrade: "STATE_AXIS_AND_RULE_SHOW_COMPLETED_EXAMPLE_APPLY_TO_MISSING_CELL_VERIFY_SECOND_AXIS_AND_EXPLAIN_NEAR_MISS_FAILURES" as const,
  }),
  taxonomyEvidence: Object.freeze({
    repeatedUnaryTransformSupported: true as const,
    binaryCompositionSupported: true as const,
    quantitativeCountRelationSupported: true as const,
    cyclicDistributionSupported: true as const,
    orthogonalRowColumnAttributesSupported: true as const,
    compoundRuleSupported: true as const,
    groupingIsSeparateSemanticTask: true as const,
  }),
  conclusion: Object.freeze({
    sixConsolidatedSemanticQlsSupported: true as const,
    matrixSizeIsParameter: true as const,
    governingAxisIsParameter: true as const,
    exactTransformSubtypeIsParameter: true as const,
    rowAndColumnVerificationRequiredWhenEvidenceExists: true as const,
    sourceSaturationSufficientForReviewRuntime: true as const,
  }),
} as const);

if (FIGURE_MATRIX_SOURCE_EVIDENCE_V1.records.length < 5) {
  throw new Error("FMT-001 source evidence must retain Punjab, Banking, SSC and uploaded-reference support.");
}
if (!FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.groupingIsSeparateSemanticTask) {
  throw new Error("FMT-001 must not absorb figure-grouping questions from source-book chapter layout.");
}
if (!FIGURE_MATRIX_SOURCE_EVIDENCE_V1.conclusion.sixConsolidatedSemanticQlsSupported) {
  throw new Error("FMT-001 consolidated QL taxonomy has not been established.");
}
