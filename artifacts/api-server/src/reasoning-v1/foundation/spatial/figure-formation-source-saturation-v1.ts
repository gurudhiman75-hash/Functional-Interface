export const FFM_001_SOURCE_SATURATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "SPA-FFM-001-SOURCE-SATURATION-V1" as const,
  auditDate: "2026-09-03" as const,
  chapterCode: "FFM-001" as const,
  chapterName: "Figure Formation" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  repositoryBlueprint: Object.freeze({
    inventoryPath: "SPA_001_QUESTION_TYPE_INVENTORY.md" as const,
    masterBlueprintPath: "SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md" as const,
    canonicalFamilies: Object.freeze([
      "select pieces forming a target",
      "identify result of joining pieces",
      "two-piece and three-piece assembly",
      "tangram-style assembly",
      "rotation allowed but reflection disallowed",
      "hidden joined edge",
      "matching boundary lengths and angles",
    ] as const),
  }),
  externalEvidence: Object.freeze([
    Object.freeze({
      examFamily: "PUNJAB_STATE" as const,
      source: "Punjab recruitment syllabus reproduced in Jasveer Singh v State of Punjab (2020)" as const,
      url: "https://indiankanoon.org/doc/73057174/" as const,
      evidence: Object.freeze(["FORMING_FIGURES_AND_ANALYSIS", "CONSTRUCTION_OF_SQUARES_AND_TRIANGLES"] as const),
    }),
    Object.freeze({
      examFamily: "SSC" as const,
      source: "SSC/non-verbal previous-paper collections and official-paper reproductions" as const,
      urls: Object.freeze([
        "https://www.mockers.in/online/ssc-chsl-chapter-wise-test-for-figure-formation-amp-analysis",
        "https://edurev.in/test/41775/ssc-cgl-mcq-figure-formation-analysis-1-solutions",
      ] as const),
      evidence: Object.freeze([
        "FORM_TARGET_FROM_ALL_GIVEN_PIECES",
        "SELECT_THREE_PIECES_TO_FORM_SQUARE_OR_TRIANGLE",
      ] as const),
    }),
    Object.freeze({
      examFamily: "BANKING" as const,
      source: "Competitive reasoning taxonomy used across SSC/Banking" as const,
      url: "https://www.youtube.com/watch?v=nwLzUz--Bmo" as const,
      evidence: Object.freeze(["FIGURE_FORMATION_AND_ANALYSIS"] as const),
    }),
  ]),
  semanticQlDecision: Object.freeze([
    Object.freeze({
      proposedQlId: "SPA-QL-051" as const,
      skillMode: "ASSEMBLE_ALL_GIVEN_PIECES_TO_MATCH_TARGET" as const,
      name: "Figure formation from all supplied pieces" as const,
      includes: Object.freeze([
        "which answer figure can be formed from the supplied pieces",
        "identify the result of joining the supplied pieces",
        "two-piece, three-piece and tangram-style assembly",
        "rotation allowed with reflection disallowed",
        "hidden joined-edge and boundary matching variants",
      ] as const),
      representationVariantsMerged: true,
    }),
    Object.freeze({
      proposedQlId: "SPA-QL-052" as const,
      skillMode: "SELECT_SUBSET_OF_PIECES_TO_FORM_DECLARED_TARGET" as const,
      name: "Select pieces that form a square or triangle" as const,
      includes: Object.freeze([
        "choose the required subset from a larger piece pool",
        "construction of square",
        "construction of triangle",
      ] as const),
      representationVariantsMerged: true,
    }),
  ]),
  rejectedOverSplits: Object.freeze([
    Object.freeze({ label: "IDENTIFY_RESULT_OF_JOINING_PIECES", owner: "SPA-QL-051", reason: "Same piece-assembly semantic skill; only the stem direction changes." }),
    Object.freeze({ label: "TWO_VS_THREE_PIECE_ASSEMBLY", owner: "SPA-QL-051", reason: "Piece count is a difficulty parameter, not a new semantic skill." }),
    Object.freeze({ label: "SQUARE_VS_TRIANGLE_SUBSET", owner: "SPA-QL-052", reason: "Target polygon is a parameter inside the same subset-selection skill." }),
  ]),
  invariants: Object.freeze({
    solverStoresPlacementTransformForEveryCorrectPiece: true,
    rotationAllowed: true,
    reflectionAllowed: false,
    noGapNoOverlapRequired: true,
    distractorsMustFailAtLeastOneHardInvariant: true,
    semanticSkillNotRepresentationVariant: true,
  }),
  verdict: "SOURCE_SATURATED_TWO_PERMANENT_QLS_JUSTIFIED" as const,
  allocationAuthorized: true,
  authorizedQlIds: Object.freeze(["SPA-QL-051", "SPA-QL-052"] as const),
  nextGate: "FFM_001_PERMANENT_QL_ALLOCATION_AND_REVIEW_RUNTIME_V1" as const,
} as const);
