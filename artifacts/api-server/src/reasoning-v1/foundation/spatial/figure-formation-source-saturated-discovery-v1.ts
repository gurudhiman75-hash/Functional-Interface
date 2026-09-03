export const FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 = Object.freeze({
  authorityId: "SPA-FFM-001-SOURCE-SATURATED-DISCOVERY-V1" as const,
  chapterCode: "FFM-001" as const,
  chapterName: "Figure Formation" as const,
  auditDate: "2026-09-03" as const,
  reviewedNewMainHead: "b16c291fc64a2b2976f2695004e168267f0efb3b" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  repositoryAuthorities: Object.freeze([
    "SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md",
    "SPA_001_QUESTION_TYPE_INVENTORY.md",
    "SPA_001_VALIDATION_CONTRACT.md",
    "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1",
  ] as const),
  sourceEvidence: Object.freeze([
    Object.freeze({
      sourceFamily: "SSC_PYQ_AGGREGATION" as const,
      evidence: "Assemble Image questions include choosing the figure formed by given pieces, choosing the pieces that form a target, and selecting a subset that forms a complete square." as const,
      representativeEvidenceDate: "2026-08" as const,
      semanticContribution: Object.freeze([
        "ASSEMBLE_ALL_PIECES_TO_RESULT",
        "SELECT_PIECE_SUBSET_FOR_TARGET",
        "IDENTIFY_PIECE_SET_FOR_TARGET",
      ] as const),
    }),
    Object.freeze({
      sourceFamily: "BANKING_NON_VERBAL_REASONING" as const,
      evidence: "Current competitive-exam reasoning references retain Figure Formation from Parts / Shape Construction for IBPS and SBI-style reasoning preparation." as const,
      semanticContribution: Object.freeze(["ASSEMBLE_ALL_PIECES_TO_RESULT"] as const),
    }),
    Object.freeze({
      sourceFamily: "PUNJAB_STATE_SYLLABUS" as const,
      evidence: "Punjab-state/PPSC reasoning coverage names forming figures and analysis, including construction of squares and triangles." as const,
      semanticContribution: Object.freeze([
        "ASSEMBLE_ALL_PIECES_TO_RESULT",
        "SELECT_PIECE_SUBSET_FOR_TARGET",
      ] as const),
    }),
  ]),
  canonicalTaskFamilies: Object.freeze([
    Object.freeze({
      proposalId: "FFM-PROP-01" as const,
      skillMode: "ASSEMBLE_ALL_PIECES_TO_RESULT" as const,
      name: "Choose the figure formed by all given pieces" as const,
      answerSurface: "VISUAL_RESULT_OPTION" as const,
      solverRequirement: "Every source piece must be placed exactly once with legal rotation and translation, no reflection, no overlap and exact target-boundary coverage." as const,
    }),
    Object.freeze({
      proposalId: "FFM-PROP-02" as const,
      skillMode: "SELECT_PIECE_SUBSET_FOR_TARGET" as const,
      name: "Choose the subset of pieces that forms the target" as const,
      answerSurface: "PIECE_SUBSET_OPTION" as const,
      solverRequirement: "Exactly one offered subset must tile the target under legal rotation and translation without reflection." as const,
    }),
    Object.freeze({
      proposalId: "FFM-PROP-03" as const,
      skillMode: "IDENTIFY_PIECE_SET_FOR_TARGET" as const,
      name: "Choose the piece set that can form the target" as const,
      answerSurface: "VISUAL_PIECE_SET_OPTION" as const,
      solverRequirement: "Exactly one candidate piece set must tile the target under legal rotation and translation without reflection." as const,
    }),
  ]),
  consolidation: Object.freeze({
    twoPieceAssembly: "OBJECT_POOL_PARAMETER" as const,
    threePieceAssembly: "OBJECT_POOL_PARAMETER" as const,
    tangramStyleAssembly: "OBJECT_POOL_AND_DIFFICULTY_PARAMETER" as const,
    rotationAllowed: "DEFAULT_EQUIVALENCE_POLICY_WITHIN_ALL_THREE_QLS" as const,
    reflectionAllowed: false as const,
    hiddenJoinedEdge: "SOLVER_AND_DISTRACTOR_CONSTRAINT" as const,
    matchingBoundaryLengthsAndAngles: "COMMON_SOLVER_CONSTRAINT" as const,
    constructionOfSquaresAndTriangles: "ROUTE_BY_TASK_TO_PROP_02_OR_PROP_03_NOT_A_STANDALONE_QL" as const,
  }),
  exclusions: Object.freeze([
    "Figure Completion: filling a missing region is owned by FGC-001.",
    "Embedded Figure: locating a target subgraph is owned by EMB-001.",
    "Counting existing squares/triangles is owned by FCT-001.",
    "Reflection-equivalent assembly is excluded from V1 and requires separate source evidence before allocation.",
    "Pure jigsaw matching based on drawing imperfections is prohibited.",
  ] as const),
  runtimeContract: Object.freeze({
    authorityRepresentation: "LANGUAGE_NEUTRAL_SEMANTIC_PIECES_AND_PLACEMENT_TRANSFORMS" as const,
    deterministic: true as const,
    exactCoverSolverRequired: true as const,
    everyPieceUsedAccordingToQl: true as const,
    illegalOverlapRejected: true as const,
    joinedBoundaryMustMatch: true as const,
    outerBoundaryMustEqualTarget: true as const,
    rotationAllowed: true as const,
    reflectionAllowed: false as const,
    uniqueAnswerRequired: true as const,
    svgIsOutputNotAuthority: true as const,
  }),
  localization: Object.freeze({
    languages: Object.freeze(["en", "hi", "pa"] as const),
    geometryLanguageNeutral: true as const,
    stemAndExplanationLocalized: true as const,
    semanticParityRequired: true as const,
  }),
  decision: Object.freeze({
    allocatePermanentQlCount: 3,
    allocateProposalIds: Object.freeze(["FFM-PROP-01", "FFM-PROP-02", "FFM-PROP-03"] as const),
    nextPermanentQlRange: "SPA-QL-051..SPA-QL-053" as const,
    sourceSaturationEstablishedForCoreFigureFormation: true as const,
    chapterImplementationAuthorized: true as const,
  }),
} as const);

if (FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length !== 3) {
  throw new Error("FFM-001 discovery must remain consolidated to exactly three semantic task families.");
}
if (FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.consolidation.reflectionAllowed) {
  throw new Error("FFM-001 V1 must not silently permit reflected pieces.");
}
