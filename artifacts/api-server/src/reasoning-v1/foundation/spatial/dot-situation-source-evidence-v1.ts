import { DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./dot-situation-source-saturated-discovery-v1";

export const DOT_SITUATION_SOURCE_EVIDENCE_V1 = Object.freeze({
  authorityId: "SPA-DOT-001-SOURCE-EVIDENCE-V1" as const,
  discoveryAuthorityId: DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  reviewedDate: "2026-09-05" as const,
  records: Object.freeze([
    Object.freeze({
      target: "PUNJAB_STATE" as const,
      sourceKind: "PUNJAB_RECRUITMENT_SYLLABUS_RECORD" as const,
      url: "https://indiankanoon.org/doc/73057174/" as const,
      supports: Object.freeze(["DOT_SITUATION_EXPLICITLY_NAMED_UNDER_NON_VERBAL_REASONING"] as const),
    }),
    Object.freeze({
      target: "SSC" as const,
      sourceKind: "CURRENT_SSC_DOT_SITUATION_SOLVED_EXAMPLE" as const,
      url: "https://testbook.com/question-answer/determine-the-correct-figure-from-image-y-which-sa--6a2680cc7f7bcb44921dfc60/amp" as const,
      supports: Object.freeze([
        "THREE_DOT_SURFACE",
        "TRIANGLE_CIRCLE_ONLY_SIGNATURE",
        "TRIANGLE_CIRCLE_SQUARE_SIGNATURE",
        "CIRCLE_SQUARE_ONLY_SIGNATURE",
        "OPTION_REJECTED_WHEN_REQUIRED_REGION_DOES_NOT_EXIST",
      ] as const),
    }),
    Object.freeze({
      target: "SSC" as const,
      sourceKind: "SSC_CGL_DOT_SITUATION_TAXONOMY" as const,
      url: "https://abhyasonline.in/contents/SSC%20CGL/Non%20Verbal%20Reasoning/Dot%20Situation/Multiple%20Dots%20Complex%20Figures/" as const,
      supports: Object.freeze([
        "ONE_OR_MORE_DOTS",
        "SAME_SHAPE_TYPES_REARRANGED_IN_OPTIONS",
        "MULTIPLE_DOTS_COMPLEX_FIGURES",
        "EVERY_REQUIRED_REGION_MUST_EXIST_IN_CORRECT_OPTION",
      ] as const),
    }),
    Object.freeze({
      target: "SSC_BANKING_CROSS_TARGET" as const,
      sourceKind: "COMPETITIVE_EXAM_DOT_SITUATION_INSTRUCTIONAL_RECORD" as const,
      url: "https://www.youtube.com/watch?v=8CyaWsJqjwk" as const,
      supports: Object.freeze(["SINGLE_DOT", "DOUBLE_DOT", "TRIPLE_DOT", "SSC_BANK_RAILWAYS_USAGE"] as const),
    }),
    Object.freeze({
      target: "SSC_REFERENCE_BOOK_STYLE" as const,
      sourceKind: "R_S_AGGARWAL_DOT_SITUATION_EXERCISE_INDEX" as const,
      url: "https://www.embibe.com/books/A-Modern-Approach-to-Verbal-and-Non-Verbal-Reasoning/Dot-Situation/Exercise/kve10189609-15" as const,
      supports: Object.freeze(["FOUR_OPTION_SAME_CONDITIONS_OF_DOT_PLACEMENT_FORMAT"] as const),
    }),
  ]),
  uploadedReferenceObservations: Object.freeze({
    reviewedByProductOwnerContext: true as const,
    shapeCountObserved: Object.freeze([2, 3, 4] as const),
    dotCountObserved: Object.freeze([1, 2, 3] as const),
    fullMembershipExclusionsObserved: true as const,
    rearrangedAlternativeFiguresObserved: true as const,
    sourceExplanationWeakness: "ASSERTION_HEAVY_WITHOUT_FULL_DOT_BY_DOT_MEMBERSHIP_WORKING" as const,
    examtreeRemediation: "EXPLICIT_DOT_SIGNATURE_TABLE_PLUS_OPTION_BY_OPTION_FAILURE_CHECK" as const,
  }),
  conclusion: Object.freeze({
    oneSemanticQlSupported: true as const,
    dotCountIsDifficultyParameter: true as const,
    shapeCountIsDifficultyParameter: true as const,
    exactExclusionsAreRequired: true as const,
    oneToThreeDotCoverageRequired: true as const,
    twoToFourShapeCoverageAcceptedForSourceVariety: true as const,
    learnerOptionsShouldRemainUndottedShapeClusters: true as const,
  }),
} as const);

if (DOT_SITUATION_SOURCE_EVIDENCE_V1.records.length < 5) {
  throw new Error("DOT-001 source evidence must retain cross-source support before runtime review.");
}
if (!DOT_SITUATION_SOURCE_EVIDENCE_V1.conclusion.oneSemanticQlSupported) {
  throw new Error("DOT-001 semantic consolidation has not been established.");
}
