export const SPATIAL_FFM_001_SOURCE_AUDIT_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FFM-001-SOURCE-AUDIT-V1" as const,
  auditDate: "2026-09-03" as const,
  chapterCode: "FFM-001" as const,
  chapterName: "Figure Formation" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  evidence: Object.freeze([
    Object.freeze({
      sourceClass: "SSC_OFFICIAL_PAPER_INDEXED_PYQ" as const,
      sourceLabel: "Allahabad High Court ARO Official Paper, 15 Dec 2021 Shift 1",
      observedTask: "Given loose pieces, select the answer figure that can be formed by joining them.",
      semanticOwner: "FORWARD_ASSEMBLY" as const,
    }),
    Object.freeze({
      sourceClass: "SSC_CGL_PREPARATION_TAXONOMY" as const,
      sourceLabel: "SSC CGL Figure Formation & Analysis taxonomy",
      observedTask: "Forward assembly, reverse decomposition, triangle formation and square formation are taught as separate task forms.",
      semanticOwner: "FOUR_WAY_FFM_SPLIT" as const,
    }),
    Object.freeze({
      sourceClass: "PUNJAB_STATE_SYLLABUS" as const,
      sourceLabel: "Punjab Public Service Commission non-verbal reasoning syllabus",
      observedTask: "Forming figures and analysis; Construction of squares and triangles.",
      semanticOwner: "FORWARD_REVERSE_AND_TARGET_SHAPE_CONSTRUCTION" as const,
    }),
    Object.freeze({
      sourceClass: "CROSS_EXAM_REFERENCE" as const,
      sourceLabel: "S. Chand A Modern Approach to Non-Verbal Reasoning",
      observedTask: "Construction of Squares and Triangles and Figure Formation and Analysis are separate non-verbal chapters used for SSC and banking preparation.",
      semanticOwner: "TARGET_SHAPE_CONSTRUCTION_SEPARATE_FROM_GENERAL_ASSEMBLY" as const,
    }),
  ]),
  semanticFindings: Object.freeze([
    Object.freeze({
      proposalId: "FFM-PQL-01" as const,
      skillMode: "ASSEMBLE_ALL_PIECES_SELECT_COMPOSITE" as const,
      name: "Select the composite figure formed by all given pieces" as const,
      rationale: "Forward composition is a direct assembly task and is not Figure Completion because no region is missing from a pre-existing whole." as const,
      baseDifficulty: "MODERATE" as const,
    }),
    Object.freeze({
      proposalId: "FFM-PQL-02" as const,
      skillMode: "DECOMPOSE_TARGET_SELECT_PIECE_SET" as const,
      name: "Select the piece set that can form a given target figure" as const,
      rationale: "Reverse decomposition changes the reasoning direction: the learner must infer the target's component pieces rather than choose a composite outcome." as const,
      baseDifficulty: "MODERATE" as const,
    }),
    Object.freeze({
      proposalId: "FFM-PQL-03" as const,
      skillMode: "SELECT_SUBSET_FORM_TRIANGLE" as const,
      name: "Select the subset of pieces that forms the required triangle" as const,
      rationale: "Triangle construction requires target-shape boundary constraints and subset selection from decoy pieces." as const,
      baseDifficulty: "MODERATE" as const,
    }),
    Object.freeze({
      proposalId: "FFM-PQL-04" as const,
      skillMode: "SELECT_SUBSET_FORM_SQUARE" as const,
      name: "Select the subset of pieces that forms the required square" as const,
      rationale: "Square construction has distinct right-angle and equal-boundary constraints and is independently named in target-exam taxonomies." as const,
      baseDifficulty: "MODERATE" as const,
    }),
  ]),
  aliasPolicy: Object.freeze({
    signsAndSymbols: "REPRESENTATION_VARIANT_OF_REVERSE_DECOMPOSITION_NOT_A_NEW_QL" as const,
    constructionOfSquaresAndTriangles: "SPLIT_INTO_TRIANGLE_AND_SQUARE_SEMANTIC_QLS" as const,
    figureCompletion: "OUT_OF_SCOPE_DIFFERENT_CHAPTER_FGC_001" as const,
    embeddedFigure: "OUT_OF_SCOPE_DIFFERENT_CHAPTER_EMB_001" as const,
  }),
  solverPolicy: Object.freeze({
    canonicalPieceGeometryRequired: true,
    rotationAllowed: true,
    translationAllowed: true,
    scalingAllowed: false,
    arbitraryVisualNoiseForbidden: true,
    exactPieceInventoryPreserved: true,
    exactlyOneCorrectOptionRequired: true,
  }),
  allocationDecision: Object.freeze({
    permanentQlAllocationAuthorized: true,
    allocateCount: 4,
    allocatedRange: "SPA-QL-051..SPA-QL-054" as const,
    nextAvailableAfterAllocation: "SPA-QL-055" as const,
  }),
  lifecycle: Object.freeze({
    sourceSaturationCompleteForFfm001: true,
    permanentIdentityAllocationAuthorized: true,
    reviewRuntimeAuthorized: true,
    learnerContentFrozen: false,
    questionStudioActivationAuthorized: false,
    mockTestReleaseAuthorized: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublicationAuthorized: false,
  }),
  nextGate: "SPA_FFM_001_PERMANENT_QL_ALLOCATION_AND_REVIEW_RUNTIME_V1" as const,
} as const);

if (SPATIAL_FFM_001_SOURCE_AUDIT_V1.semanticFindings.length !== 4) {
  throw new Error("FFM-001 source audit must resolve exactly four semantic QL families.");
}
