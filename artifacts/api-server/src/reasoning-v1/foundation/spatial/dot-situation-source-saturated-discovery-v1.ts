export const DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1 = Object.freeze({
  authorityId: "SPA-DOT-001-SOURCE-SATURATED-DISCOVERY-V1" as const,
  chapterCode: "DOT-001" as const,
  chapterName: "Dot Situation" as const,
  auditDate: "2026-09-05" as const,
  reviewedNewMainHead: "f00991daeaa08702889089d2d35edc72c8f10639" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  repositoryAuthorities: Object.freeze([
    "SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md",
    "SPA_001_QUESTION_TYPE_INVENTORY.md",
    "SPA_001_VALIDATION_CONTRACT.md",
    "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1",
  ] as const),
  sourceEvidence: Object.freeze([
    Object.freeze({
      sourceFamily: "PUNJAB_STATE_SYLLABUS" as const,
      evidence: "Punjab recruitment reasoning syllabus explicitly names Dot Situation under Non-Verbal Reasoning." as const,
      semanticContribution: Object.freeze(["DOT_REGION_MEMBERSHIP_MATCHING"] as const),
    }),
    Object.freeze({
      sourceFamily: "SSC_DOT_SITUATION_PRACTICE_AND_PYQ_STYLE" as const,
      evidence: "SSC-style material consistently asks the learner to preserve the conditions of dot placement across rearranged clusters of the same geometric shapes." as const,
      semanticContribution: Object.freeze([
        "SINGLE_DOT_REGION_SIGNATURE",
        "MULTI_DOT_REGION_SIGNATURE_SET",
        "EXACT_INSIDE_OUTSIDE_EXCLUSIONS",
      ] as const),
    }),
    Object.freeze({
      sourceFamily: "CROSS_EXAM_NON_VERBAL_REASONING" as const,
      evidence: "Competitive-exam references use one, two and three-dot problems and clusters built from circles, squares, rectangles and triangles." as const,
      semanticContribution: Object.freeze([
        "ONE_TO_THREE_DOTS",
        "THREE_OR_MORE_SHAPE_CLUSTER_COMMONLY_USED",
        "SIMPLE_AND_COMPLEX_OVERLAP_SURFACES",
      ] as const),
    }),
    Object.freeze({
      sourceFamily: "PRODUCT_OWNER_UPLOADED_REFERENCE_SET" as const,
      evidence: "Reviewed source examples include two to four shapes and one to three dots, with full membership conditions such as common to A+B only, A+B+C, and all participating shapes." as const,
      semanticContribution: Object.freeze([
        "TWO_TO_FOUR_SHAPE_VARIETY",
        "ONE_TO_THREE_DOT_VARIETY",
        "FULL_SIGNATURE_INCLUDES_EXCLUSIONS",
        "REARRANGED_OPTION_GEOMETRY",
      ] as const),
    }),
  ]),
  canonicalTaskFamilies: Object.freeze([
    Object.freeze({
      proposalId: "DOT-PROP-01" as const,
      skillMode: "MATCH_DOT_REGION_MEMBERSHIP_SIGNATURES" as const,
      name: "Choose the rearranged figure that preserves every dot-placement condition" as const,
      answerSurface: "SHAPE_CLUSTER_OPTION" as const,
      solverRequirement: "For every source dot, the option must contain a safely placeable region with the identical complete inside/outside signature across corresponding shape identities." as const,
    }),
  ]),
  consolidation: Object.freeze({
    singleDot: "DOT_COUNT_PARAMETER" as const,
    doubleDot: "DOT_COUNT_PARAMETER" as const,
    tripleDot: "DOT_COUNT_PARAMETER" as const,
    twoShapeSurface: "OBJECT_POOL_PARAMETER" as const,
    threeShapeSurface: "OBJECT_POOL_PARAMETER" as const,
    fourShapeSurface: "OBJECT_POOL_AND_DIFFICULTY_PARAMETER" as const,
    simpleVsComplexFigures: "OVERLAP_TOPOLOGY_AND_DIFFICULTY_PARAMETER" as const,
    exactOnlyExclusion: "PART_OF_EVERY_DOT_SIGNATURE_NOT_A_SEPARATE_QL" as const,
  }),
  exclusions: Object.freeze([
    "Absolute dot coordinates are not semantic authority; only full region membership is preserved.",
    "A dot touching or nearly touching a boundary is prohibited because placement becomes visually ambiguous.",
    "Figure Classification is owned by FCL-001; DOT-001 asks whether required set-regions exist.",
    "Embedded Figure is owned by EMB-001; DOT-001 does not search for a target subgraph.",
    "Venn-diagram arithmetic/counting is outside DOT-001.",
    "Reverse text-only membership prompts remain held until target-exam source evidence justifies a separate answer surface.",
  ] as const),
  runtimeContract: Object.freeze({
    authorityRepresentation: "LANGUAGE_NEUTRAL_SHAPES_PLUS_COMPLETE_DOT_MEMBERSHIP_SIGNATURES" as const,
    deterministic: true as const,
    sourceDotCountRange: Object.freeze([1, 3] as const),
    sourceShapeCountRange: Object.freeze([2, 4] as const),
    supportedShapeKinds: Object.freeze(["CIRCLE", "SQUARE", "TRIANGLE", "RECTANGLE"] as const),
    fullInsideOutsideSignatureRequired: true as const,
    recomputeSignatureFromGeometry: true as const,
    boundarySafetyMarginRequired: true as const,
    correctOptionMustRealizeEverySignature: true as const,
    distractorMustBreakAtLeastOneRequiredSignature: true as const,
    uniqueAnswerRequired: true as const,
    duplicateSemanticOptionsRejected: true as const,
    svgIsOutputNotAuthority: true as const,
  }),
  visualContract: Object.freeze({
    whiteBackground: true as const,
    examStrokeWidthPx: 1.35 as const,
    examStroke: "#111827" as const,
    dotMustBeClearlyVisible: true as const,
    learnerOptionsContainShapesWithoutPreplacedAnswerDots: true as const,
    noBoundaryTouchingDots: true as const,
    noBrokenOrClippedEdges: true as const,
  }),
  explanationContract: Object.freeze({
    listEveryDotSeparately: true as const,
    stateInsideShapes: true as const,
    stateOutsideShapes: true as const,
    provideMembershipTable: true as const,
    verifyCorrectOption: true as const,
    identifyWhyEveryDistractorFails: true as const,
    assertionOnlyExplanationProhibited: true as const,
  }),
  localization: Object.freeze({
    languages: Object.freeze(["en", "hi", "pa"] as const),
    geometryLanguageNeutral: true as const,
    stemAndExplanationLocalized: true as const,
    semanticParityRequired: true as const,
  }),
  decision: Object.freeze({
    allocatePermanentQlCount: 1,
    allocateProposalIds: Object.freeze(["DOT-PROP-01"] as const),
    nextPermanentQlRange: "SPA-QL-054" as const,
    sourceSaturationEstablishedForCoreDotSituation: true as const,
    chapterImplementationAuthorized: true as const,
  }),
} as const);

if (DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length !== 1) {
  throw new Error("DOT-001 must remain one semantic QL; dot count and overlap complexity are parameters.");
}
if (!DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.runtimeContract.fullInsideOutsideSignatureRequired) {
  throw new Error("DOT-001 cannot degrade to inside-only matching; exact exclusions are semantic authority.");
}
if (DOT_SITUATION_SOURCE_SATURATED_DISCOVERY_V1.visualContract.examStrokeWidthPx !== 1.35) {
  throw new Error("DOT-001 review visuals must use the approved Spatial exam stroke.");
}
