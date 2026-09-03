export const FFM_001_SOURCE_SATURATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "SPA-FFM-001-SOURCE-SATURATION-V2" as const,
  auditDate: "2026-09-03" as const,
  chapterCode: "FFM-001" as const,
  chapterName: "Figure Formation" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  repositoryEvidence: Object.freeze({
    blueprint: "SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md" as const,
    inventory: "SPA_001_QUESTION_TYPE_INVENTORY.md" as const,
    closureBlocker: "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1" as const,
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
      source: "SSC figure-formation previous-paper/chapter-wise reproductions" as const,
      urls: Object.freeze([
        "https://www.mockers.in/online/ssc-chsl-chapter-wise-test-for-figure-formation-amp-analysis",
        "https://edurev.in/test/41775/ssc-cgl-mcq-figure-formation-analysis-1-solutions",
      ] as const),
      evidence: Object.freeze([
        "FORM_TARGET_FROM_ALL_GIVEN_PIECES",
        "SELECT_PIECES_TO_FORM_SQUARE_OR_TRIANGLE",
      ] as const),
    }),
    Object.freeze({
      examFamily: "BANKING" as const,
      source: "Competitive non-verbal reasoning Figure Formation / Shape Construction coverage" as const,
      evidence: Object.freeze(["FIGURE_FORMATION_FROM_PARTS", "TARGET_SHAPE_CONSTRUCTION"] as const),
    }),
  ]),
  semanticQlDecision: Object.freeze([
    Object.freeze({
      permanentQlId: "SPA-QL-051" as const,
      proposalId: "FFM-PQL-01" as const,
      skillMode: "ASSEMBLE_ALL_GIVEN_PIECES_TO_MATCH_TARGET" as const,
      name: "Figure formation from all supplied pieces" as const,
      includes: Object.freeze([
        "choose the answer figure formed by all supplied pieces",
        "identify the result of joining supplied pieces",
        "two-piece, three-piece and tangram-style assembly",
        "rotation allowed with reflection disallowed",
      ] as const),
    }),
    Object.freeze({
      permanentQlId: "SPA-QL-052" as const,
      proposalId: "FFM-PQL-02" as const,
      skillMode: "SELECT_PIECES_TO_FORM_DECLARED_TARGET" as const,
      name: "Select pieces that form a square or triangle" as const,
      includes: Object.freeze([
        "select a labelled subset from a larger piece pool",
        "select the correct visual piece-set option",
        "construction of square",
        "construction of triangle",
      ] as const),
    }),
  ]),
  consolidation: Object.freeze({
    identifyJoinedResult: "SPA-QL-051" as const,
    twoVsThreePieces: "DIFFICULTY_PARAMETER_IN_SPA_QL_051" as const,
    labelledSubsetVsVisualPieceSet: "REPRESENTATION_VARIANTS_IN_SPA_QL_052" as const,
    squareVsTriangle: "TARGET_PARAMETER_IN_SPA_QL_052" as const,
    tangramStyle: "OBJECT_POOL_PARAMETER_IN_SPA_QL_051" as const,
  }),
  rejectedThirdQl: Object.freeze({
    formerDraftProposalId: "FFM-PROP-03" as const,
    reason: "Choosing a labelled subset and choosing a visual candidate piece set both test the same exact-cover target-construction skill; only answer representation differs." as const,
    disposition: "MERGED_INTO_SPA_QL_052" as const,
  }),
  invariants: Object.freeze({
    semanticSkillNotRepresentationVariant: true,
    deterministic: true,
    exactCoverSolverRequired: true,
    rotationAllowed: true,
    reflectionAllowed: false,
    noGapNoOverlapRequired: true,
    uniqueAnswerRequired: true,
    svgIsOutputNotAuthority: true,
  }),
  decision: Object.freeze({
    permanentQlCount: 2,
    allocatedRange: "SPA-QL-051..SPA-QL-052" as const,
    nextAvailablePermanentQlIdAfterAllocation: "SPA-QL-053" as const,
    sourceSaturationEstablishedForCoreFigureFormation: true,
    reviewRuntimeAuthorized: true,
    downstreamActivationAuthorized: false,
  }),
} as const);

if (FFM_001_SOURCE_SATURATION_AUTHORITY_V2.semanticQlDecision.length !== 2) {
  throw new Error("FFM-001 V2 must remain consolidated to exactly two semantic permanent QLs.");
}
if (FFM_001_SOURCE_SATURATION_AUTHORITY_V2.invariants.reflectionAllowed) {
  throw new Error("FFM-001 V2 must not permit reflected pieces.");
}
