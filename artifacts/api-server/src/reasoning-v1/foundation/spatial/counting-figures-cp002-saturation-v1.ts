import { FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1 } from "./counting-figures-source-saturated-discovery-v1";

export type CountingFigureCp002TargetFamilyV1 = "TRIANGLE" | "SQUARE" | "RECTANGLE" | "QUADRILATERAL";

function countTarget(targetShape: CountingFigureCp002TargetFamilyV1): number {
  return FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.filter((record) => record.targetShape === targetShape).length;
}

export const FCT_001_CP002_MOTIF_REQUIREMENTS_V1 = Object.freeze([
  {
    motifFamily: "TRIANGULAR_SUBDIVISION",
    requiredTargetShapes: ["TRIANGLE"] as const,
    solverDemand: "COMPOSITE_SIDES_AND_MULTI_SIZE_CLOSED_FIGURES" as const,
  },
  {
    motifFamily: "RECTANGULAR_GRID_OR_PARTITION",
    requiredTargetShapes: ["SQUARE", "RECTANGLE", "QUADRILATERAL"] as const,
    solverDemand: "COMPOSITE_HORIZONTAL_VERTICAL_SIDES" as const,
  },
  {
    motifFamily: "ROTATED_OR_NESTED_QUADRILATERAL",
    requiredTargetShapes: ["SQUARE", "QUADRILATERAL"] as const,
    solverDemand: "NON_AXIS_ALIGNED_STRAIGHT_SIDES" as const,
  },
  {
    motifFamily: "COMPOSITE_CROSSING_NETWORK",
    requiredTargetShapes: ["TRIANGLE", "QUADRILATERAL"] as const,
    solverDemand: "EXPLICIT_INTERSECTION_TOPOLOGY" as const,
  },
] as const);

export const FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1 = Object.freeze({
  authorityId: "FCT-001-CP002-QL-MERGE-SPLIT-DECISION-V1" as const,
  chapterCode: "FCT-001" as const,
  status: "CP002_SINGLE_CORE_CANDIDATE_RETAINED" as const,
  sourceTargetCounts: {
    TRIANGLE: countTarget("TRIANGLE"),
    SQUARE: countTarget("SQUARE"),
    RECTANGLE: countTarget("RECTANGLE"),
    QUADRILATERAL: countTarget("QUADRILATERAL"),
  },
  sourceTargetTotal: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
  retainedCandidate: {
    candidateId: "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION" as const,
    learnerSkill: "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION" as const,
    targetShapeParameter: ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const,
    layoutParameters: [
      "TRIANGULAR_SUBDIVISION",
      "RECTANGULAR_GRID_OR_PARTITION",
      "ROTATED_OR_NESTED_QUADRILATERAL",
      "COMPOSITE_CROSSING_NETWORK",
    ] as const,
    splitRequiredNow: false,
  },
  mergeDecisions: {
    triangleVsSquareVsRectangleVsQuadrilateral: "MERGE_AS_TARGET_SHAPE_PARAMETER" as const,
    regularGridVsIrregularNetwork: "MERGE_AS_LAYOUT_PARAMETER" as const,
    formulaFirstGridMethod: "DO_NOT_CREATE_STANDALONE_QL_AT_CP002" as const,
    rationale: "Same learner task is exhaustive enumeration of valid closed figures; target predicate and layout change, core solve mode does not." as const,
  },
  holds: [
    {
      candidateId: "FCT-HOLD-C-LINE-SEGMENT-COUNT" as const,
      reason: "Open-path enumeration is a different semantic solver and lacks current direct-source saturation." as const,
    },
    {
      candidateId: "FCT-HOLD-D-CURVED_OR_MIXED-SHAPE-COUNT" as const,
      reason: "Arc/circle semantics require a richer edge model and separate source proof." as const,
    },
  ] as const,
  permanentQlDecision: {
    allocateAtCp002: false,
    nextAvailableSpatialPermanentQlId: "SPA-QL-042" as const,
    earliestAllocationGate: "FCT_001_CP005_AFTER_PRODUCTION_AND_LEARNER_REVIEW" as const,
  },
  governance: {
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    mergeAuthorized: false,
    deploymentPerformed: false,
  },
  nextGate: "FCT_001_CP003_DETERMINISTIC_PRODUCTION_GENERATOR" as const,
});
