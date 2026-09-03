import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";

export const FIGURE_FORMATION_SOURCE_EVIDENCE_V2 = Object.freeze({
  authorityId: "SPA-FFM-001-SOURCE-EVIDENCE-V2" as const,
  discoveryAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  reviewedDate: "2026-09-03" as const,
  records: Object.freeze([
    Object.freeze({
      target: "PUNJAB_STATE" as const,
      sourceKind: "PPSC_RECRUITMENT_SYLLABUS_RECORD" as const,
      url: "https://indiankanoon.org/doc/73057174/" as const,
      supports: Object.freeze(["FORMING_FIGURES_AND_ANALYSIS", "CONSTRUCTION_OF_SQUARES_AND_TRIANGLES"] as const),
    }),
    Object.freeze({
      target: "SSC" as const,
      sourceKind: "SSC_CGL_FIGURE_FORMATION_REFERENCE" as const,
      url: "https://edurev.in/t/308821/ssc-cgl-overview-figure-formation-analysis" as const,
      supports: Object.freeze(["ASSEMBLE_ALL_PIECES_TO_RESULT", "SELECT_PIECE_SUBSET_FOR_TARGET", "IDENTIFY_PIECE_SET_FOR_TARGET"] as const),
    }),
    Object.freeze({
      target: "BANKING" as const,
      sourceKind: "IBPS_RRB_FIGURE_FORMATION_QUESTION_REFERENCE" as const,
      url: "https://www.embibe.com/questions/In-the-following-question%2C-find-out-which-of-the-figures-%28a%29%2C-%28b%29%2C-%28c%29-and-%28d%29-can-be-formed-from-the-pieces-given-in-%28x%29.%0AProblem-Figure%3A%0A%0A/EM4190415" as const,
      supports: Object.freeze(["ASSEMBLE_ALL_PIECES_TO_RESULT"] as const),
    }),
    Object.freeze({
      target: "SSC_BANKING_STATE_CROSS_TARGET" as const,
      sourceKind: "CURRENT_NON_VERBAL_REASONING_REFERENCE" as const,
      url: "https://www.schandpublishing.com/books/competitive-books/dr-rs-aggarwal/a-modern-approach-non-verbal-reasoning-fully-solved-2026/9789373593494/" as const,
      supports: Object.freeze(["CONSTRUCTION_OF_SQUARES_AND_TRIANGLES", "FIGURE_FORMATION_AND_ANALYSIS"] as const),
    }),
  ]),
  conclusion: Object.freeze({
    coreThreeSemanticQlSplitSupported: true as const,
    squareAndTriangleAreTargetParametersNotSeparateQl: true as const,
    rotationAllowedReflectionDisallowedBoundaryRetained: true as const,
  }),
} as const);
