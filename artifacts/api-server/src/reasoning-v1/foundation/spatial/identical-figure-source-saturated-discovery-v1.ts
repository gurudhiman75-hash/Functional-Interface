export const IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 = Object.freeze({
  authorityId: "SPA-IDF-001-SOURCE-SATURATED-DISCOVERY-V1" as const,
  chapterCode: "IDF-001" as const,
  chapterName: "Identical Figure / Figure Grouping" as const,
  auditDate: "2026-09-06" as const,
  reviewedNewMainHead: "e9f4d78572fbb10725b9d8d68a3194118e9cdb4c" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  repositoryAuthorities: Object.freeze([
    "SPA_001_SPATIAL_FAMILY_MASTER_BLUEPRINT.md",
    "SPA_001_QUESTION_TYPE_INVENTORY.md",
    "SPA_001_VALIDATION_CONTRACT.md",
    "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1",
    "SPA-FMT-001-SOURCE-SATURATED-DISCOVERY-V1",
  ] as const),
  sourceEvidence: Object.freeze({
    primaryReference: "Radian Reasoning for Competitions (2022), Figure Matrix Q31-Q33 figure-grouping surface" as const,
    observedExamTag: "RRB_ALP_2018" as const,
    observedStemSurface: "Use each numbered figure exactly once and form the required groups" as const,
    observedGroupingExamples: Object.freeze([
      "GROUP_BY_OUTER_SHAPE_IDENTITY",
      "GROUP_BY_INTERSECTION_OR_CONTAINMENT_RELATION",
      "GROUP_BY_INNER_ELEMENT_OR_PARTITION_STRUCTURE",
    ] as const),
    adjacentEvidence: Object.freeze([
      "Figure Classification repeatedly uses rotation-equivalence as an odd-one-out property, proving rotation-normalized figure identity is exam-real but remains FCL when the task is odd-one-out.",
      "The Spatial blueprint explicitly reserves exact equivalence matching under declared rotation/reflection policy for IDF-001.",
    ] as const),
  }),
  semanticBoundary: Object.freeze({
    owns: "PARTITION_A_NUMBERED_FIGURE_BANK_INTO_EQUIVALENCE_GROUPS_UNDER_A_DECLARED_STRUCTURAL_OR_TRANSFORM_POLICY" as const,
    differsFromFigureClassification: "FCL-001 asks which one figure breaks a common property. IDF-001 asks which complete partition of the numbered bank groups all figures by the same declared equivalence basis." as const,
    differsFromFigureMatrix: "FMT-001 completes a missing matrix cell by row/column rules. A numbered bank that must be partitioned into groups is IDF-001 even when a source book prints it after matrix questions." as const,
    differsFromFigureAnalogy: "FAN-001 applies a pairwise transform A:B::C:?. IDF-001 performs equivalence grouping across the whole bank and has no missing transformed target." as const,
  }),
  canonicalTaskFamilies: Object.freeze([
    Object.freeze({
      proposalId: "IDF-PROP-01" as const,
      skillMode: "COMPONENT_IDENTITY_GROUPING" as const,
      name: "Group figures by a stable outer, inner or repeated component identity" as const,
      observedRuleExamples: Object.freeze([
        "SAME_OUTER_SHAPE",
        "SAME_INNER_SHAPE",
        "SAME_REPEATED_COMPONENT_SET",
        "SAME_PARTITION_SKELETON",
      ] as const),
      solverRequirement: "Extract the governed component signature from every numbered figure and prove that the proposed partition uses each figure exactly once with a single signature per group." as const,
    }),
    Object.freeze({
      proposalId: "IDF-PROP-02" as const,
      skillMode: "TOPOLOGICAL_RELATION_GROUPING" as const,
      name: "Group figures by containment, overlap or intersection topology" as const,
      observedRuleExamples: Object.freeze([
        "ONE_SHAPE_COMPLETELY_INSIDE_ANOTHER",
        "PARTIAL_OVERLAP_WITH_HALF_INSIDE",
        "CROSSING_INTERSECTION",
        "DISJOINT_OR_TOUCHING_RELATION",
      ] as const),
      solverRequirement: "Recompute the topological relation from semantic geometry; superficial motif identity or position must not determine the group." as const,
    }),
    Object.freeze({
      proposalId: "IDF-PROP-03" as const,
      skillMode: "TRANSFORM_EQUIVALENCE_GROUPING" as const,
      name: "Group asymmetric figures that are identical under the declared rotation/reflection policy" as const,
      observedRuleExamples: Object.freeze([
        "ROTATION_ONLY_EQUIVALENCE",
        "ROTATION_PLUS_REFLECTION_EQUIVALENCE",
        "MIRROR_CHIRALITY_REJECTED_WHEN_REFLECTION_NOT_ALLOWED",
      ] as const),
      solverRequirement: "Canonicalize each asymmetric figure under only the transformations permitted by the question, then group equal canonical signatures and reject visually close chiral or component-changed distractors." as const,
    }),
  ]),
  consolidation: Object.freeze({
    numberOfGroups: "INSTANCE_PARAMETER" as const,
    figuresPerGroup: "INSTANCE_PARAMETER" as const,
    exactShapeChoice: "MOTIF_PARAMETER" as const,
    absoluteRotationAngle: "TRANSFORM_PARAMETER" as const,
    clockwiseVsAnticlockwise: "TRANSFORM_PARAMETER" as const,
    groupOrdering: "PRESENTATION_PARAMETER" as const,
    easyVsHard: "NUMBER_OF_ACTIVE_ATTRIBUTES_AND_EQUIVALENCE_POLICY_PARAMETER" as const,
  }),
  exclusions: Object.freeze([
    "Odd-one-out classification remains FCL-001 even when three options are rotations of one another.",
    "Missing-cell row/column inference remains FMT-001.",
    "Pairwise A:B::C:? transformation remains FAN-001.",
    "Grouping authority must come from semantic component/topology/transform signatures, not SVG pixel similarity.",
    "Every answer option must use each numbered figure exactly once; malformed partitions are prohibited.",
  ] as const),
  runtimeContract: Object.freeze({
    authorityRepresentation: "LANGUAGE_NEUTRAL_NUMBERED_FIGURE_STATES_PLUS_DECLARED_EQUIVALENCE_POLICY" as const,
    deterministic: true as const,
    defaultBankSize: 9,
    defaultGroupCount: 3,
    fourOptionsRequired: true as const,
    independentSolverRequired: true as const,
    solverMustRecomputeGroupKeys: true as const,
    everyFigureUsedExactlyOnce: true as const,
    correctPartitionMustBeUnique: true as const,
    everyDistractorMustBreakAtLeastOneGroup: true as const,
    duplicatePartitionsRejected: true as const,
    svgIsOutputNotAuthority: true as const,
  }),
  visualContract: Object.freeze({
    whiteBackground: true as const,
    examStrokeWidthPx: 1.35 as const,
    examStroke: "#111827" as const,
    equalScaleAcrossNumberedBank: true as const,
    numberLabelsOutsideFigureInk: true as const,
    noAccidentalWholeFigureTilt: true as const,
    noBrokenOrClippedEdges: true as const,
    asymmetricTransformMotifsRequiredForTransformFamily: true as const,
    topologicalRelationMustBeVisuallyUnambiguous: true as const,
  }),
  explanationContract: Object.freeze({
    stateGroupingRuleFirst: true as const,
    listEveryCorrectGroup: true as const,
    explainWhyEveryMemberBelongs: true as const,
    identifyAtLeastOneBrokenGroupInEachDistractor: true as const,
    solutionIllustrationRequired: true as const,
    assertionOnlyExplanationProhibited: true as const,
  }),
  localization: Object.freeze({
    languages: Object.freeze(["en", "hi", "pa"] as const),
    geometryLanguageNeutral: true as const,
    groupingAnswerLanguageNeutral: true as const,
    stemAndExplanationLocalized: true as const,
    semanticParityRequired: true as const,
  }),
  decision: Object.freeze({
    allocatePermanentQlCount: 3,
    allocateProposalIds: Object.freeze(["IDF-PROP-01", "IDF-PROP-02", "IDF-PROP-03"] as const),
    proposedPermanentQlRange: "SPA-QL-061..SPA-QL-063" as const,
    sourceSaturationEstablishedForCoreGroupingSurface: true as const,
    chapterImplementationAuthorized: true as const,
    figureClassificationBoundaryPreserved: true as const,
    figureMatrixGroupingLeakClosed: true as const,
  }),
} as const);

if (IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length !== 3) {
  throw new Error("IDF-001 discovery expects three consolidated semantic task families.");
}
if (!IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.decision.figureClassificationBoundaryPreserved) {
  throw new Error("IDF-001 must not absorb odd-one-out Figure Classification.");
}
if (IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.visualContract.examStrokeWidthPx !== 1.35) {
  throw new Error("IDF-001 review visuals must use the approved Spatial exam stroke.");
}
