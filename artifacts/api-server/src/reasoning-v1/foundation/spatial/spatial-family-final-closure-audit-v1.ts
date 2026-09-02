import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9 } from "./spatial-permanent-ql-allocation-v9";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V5 } from "./spatial-question-studio-integration-v5";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-test-builder-activation-v1";
import { SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1 } from "./spatial-final-held-gap-saturation-v1";

export const SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1" as const,
  reviewedNewMainHead: "da321c466f9ed30a66ffa1612c9e43069a97b67e" as const,
  auditDate: "2026-09-02" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  sourcePolicy: "REPO_BLUEPRINT_PLUS_TARGET_EXAM_SYLLABUS_AND_PYQ_SEMANTIC_COVERAGE" as const,
  currentCorpus: Object.freeze({
    permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlCount,
    permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.permanentQlRange,
    nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V9.nextAvailablePermanentQlId,
    spa001ProductionQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount,
    spa001ProductionQlIds: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds,
    cndProductionQlIds: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds,
    currentImplementedQlCount: 50,
    expectedUnionRange: "SPA-QL-001..SPA-QL-050" as const,
  }),
  alreadyClosedHeldGapAudit: Object.freeze({
    authorityId: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.authorityId,
    promotedQlIds: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.promotedQlIds,
    retainedOrMergedHolds: SPATIAL_FINAL_HELD_GAP_SATURATION_AUTHORITY_V1.retainedOrMergedHolds,
  }),
  implementedChapterCodes: Object.freeze([
    "MIR-001",
    "WAT-001",
    "FAN-001",
    "FCL-001",
    "FSR-001",
    "FGC-001",
    "PFC-001",
    "TPF-001",
    "EMB-001",
    "FCT-001",
    "CND-001",
  ] as const),
  blockingMissingChapters: Object.freeze([
    Object.freeze({
      chapterCode: "FFM-001" as const,
      chapterName: "Figure Formation" as const,
      blueprintPriority: "P1" as const,
      semanticBoundary: "ASSEMBLE_OR_SELECT_PIECES_TO_FORM_A_TARGET_FIGURE" as const,
      whyExistingCoverageIsInsufficient: "Figure Completion fills a missing region; Figure Formation reasons about independent pieces and their placement transforms." as const,
      punjabSyllabusEvidence: Object.freeze([
        "FORMING_FIGURES_AND_ANALYSIS" as const,
        "CONSTRUCTION_OF_SQUARES_AND_TRIANGLES_WHEN_ASSEMBLY_IS_ASKED" as const,
      ]),
      disposition: "BLOCK_FAMILY_FREEZE_AND_RUN_SOURCE_DISCOVERY" as const,
    }),
    Object.freeze({
      chapterCode: "DOT-001" as const,
      chapterName: "Dot Situation" as const,
      blueprintPriority: "P2" as const,
      semanticBoundary: "REGION_MEMBERSHIP_AND_INSIDE_OUTSIDE_RELATION_MATCHING" as const,
      whyExistingCoverageIsInsufficient: "The task preserves set-region membership of marked dots across rearranged overlapping shapes; it is not figure classification or embedding." as const,
      punjabSyllabusEvidence: Object.freeze(["DOT_SITUATION" as const]),
      disposition: "BLOCK_FAMILY_FREEZE_AND_RUN_SOURCE_DISCOVERY" as const,
    }),
    Object.freeze({
      chapterCode: "FMT-001" as const,
      chapterName: "Figure Matrix" as const,
      blueprintPriority: "P2" as const,
      semanticBoundary: "ROW_AND_COLUMN_RULE_INFERENCE_IN_A_2D_FIGURE_MATRIX" as const,
      whyExistingCoverageIsInsufficient: "Figure Series is one-dimensional progression; Figure Matrix requires simultaneous row/column constraints and missing-cell inference." as const,
      punjabSyllabusEvidence: Object.freeze(["FIGURE_MATRIX" as const]),
      disposition: "BLOCK_FAMILY_FREEZE_AND_RUN_SOURCE_DISCOVERY" as const,
    }),
    Object.freeze({
      chapterCode: "IDF-001" as const,
      chapterName: "Identical Figure / Identical Figure Grouping" as const,
      blueprintPriority: "P2" as const,
      semanticBoundary: "EXACT_EQUIVALENCE_MATCHING_UNDER_DECLARED_ROTATION_REFLECTION_POLICY" as const,
      whyExistingCoverageIsInsufficient: "Classification asks for a class relation or odd figure; identical-figure tasks ask exact equivalence/grouping under a stated transform policy." as const,
      punjabSyllabusEvidence: Object.freeze(["IDENTICAL_FIGURE_GROUPINGS" as const]),
      disposition: "BLOCK_FAMILY_FREEZE_AND_RUN_SOURCE_DISCOVERY" as const,
    }),
  ]),
  aliasDispositions: Object.freeze([
    Object.freeze({
      syllabusLabel: "CONSTRUCTION_OF_SQUARES_AND_TRIANGLES" as const,
      disposition: "SPLIT_BY_TASK_SEMANTICS" as const,
      routing: Object.freeze({
        countExistingShapes: "FCT-001" as const,
        assemblePiecesIntoTarget: "FFM-001" as const,
      }),
    }),
    Object.freeze({
      syllabusLabel: "RULES_DETECTION" as const,
      disposition: "DO_NOT_CREATE_STANDALONE_CHAPTER_WITHOUT_PYQ_SEMANTIC_EVIDENCE" as const,
      currentCandidateOwners: Object.freeze(["FAN-001", "FCL-001", "FSR-001", "FMT-001"] as const),
    }),
    Object.freeze({
      syllabusLabel: "ANALYTICAL_REASONING_NON_VERBAL" as const,
      disposition: "GENERIC_UMBRELLA_NOT_A_STANDALONE_SPATIAL_QL" as const,
    }),
  ]),
  lifecycle: Object.freeze({
    currentFiftyQlSoakRequired: true,
    currentFiftyQlSoakPassed: false,
    sourceSaturationCompleteForWholeFamily: false,
    chapterInventoryComplete: false,
    familyExhaustivenessEstablished: false,
    familyFreezeAuthorized: false,
    mockTestReleaseAuthorizedByThisAudit: false,
    publicReleaseAuthorizedByThisAudit: false,
    studentDeliveryAuthorizedByThisAudit: false,
    automaticStudentPublicationAuthorizedByThisAudit: false,
  }),
  verdict: "BLOCKED_NOT_EXHAUSTIVE_FOUR_BLUEPRINT_CHAPTERS_UNIMPLEMENTED" as const,
  remediationOrder: Object.freeze(["FFM-001", "DOT-001", "FMT-001", "IDF-001"] as const),
  nextGate: "SPA_SECONDARY_AND_FORMATION_CHAPTER_SOURCE_DISCOVERY_V1" as const,
} as const);

if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.currentCorpus.permanentQlCount !== 50) {
  throw new Error("Spatial final closure audit expects exactly 50 currently allocated permanent QLs.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.currentCorpus.nextAvailablePermanentQlId !== "SPA-QL-051") {
  throw new Error("Spatial final closure audit expects SPA-QL-051 to remain the next available permanent identity.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.blockingMissingChapters.length !== 4) {
  throw new Error("Spatial family freeze must remain blocked until all four missing blueprint chapters are resolved.");
}
