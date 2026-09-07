import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13 } from "./spatial-permanent-ql-allocation-v13";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V9 } from "./spatial-question-studio-integration-v9";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-test-builder-activation-v1";
import { FIGURE_FORMATION_INTERNAL_ACTIVATION_V2 } from "./figure-formation-freeze-v1";
import { DOT_SITUATION_INTERNAL_ACTIVATION_V1 } from "./dot-situation-freeze-v1";
import { FIGURE_MATRIX_INTERNAL_ACTIVATION_V1 } from "./figure-matrix-freeze-v1";
import { IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1 } from "./identical-figure-freeze-v1";

const expectedUnion = Array.from({ length: 63 }, (_, index) => `SPA-QL-${String(index + 1).padStart(3, "0")}`);
const mainPackageIds = [...SPATIAL_QUESTION_STUDIO_PACKAGE_V9.qlIds];
const cndIds = [...CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds];
const actualUnion = [...new Set([...mainPackageIds, ...cndIds])].sort();

export const SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 = Object.freeze({
  authorityId: "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V2" as const,
  supersedesAuthorityId: "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1" as const,
  reviewedNewMainHead: "4472e9388f419e8081a5add2ac17cbaaba547094" as const,
  auditDate: "2026-09-07" as const,
  targetExams: Object.freeze(["SSC", "BANKING", "PUNJAB_STATE"] as const),
  sourcePolicy: "REPO_BLUEPRINT_PLUS_TARGET_EXAM_SYLLABUS_AND_PYQ_SEMANTIC_COVERAGE" as const,
  currentCorpus: Object.freeze({
    permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount,
    permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlRange,
    nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId,
    mainQuestionStudioQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount,
    mainQuestionStudioQlIds: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.qlIds,
    cndSeparateQlCount: cndIds.length,
    cndSeparateQlIds: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds,
    combinedImplementedQlCount: actualUnion.length,
    expectedUnionRange: "SPA-QL-001..SPA-QL-063" as const,
    expectedMainPlusCndSplit: "58_PLUS_5" as const,
  }),
  resolvedFormerBlockers: Object.freeze([
    Object.freeze({
      chapterCode: "FFM-001" as const,
      chapterName: "Figure Formation" as const,
      permanentQlIds: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.permanentQlIds,
      activationAuthorityId: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.authorityId,
      questionStudioDiscoverable: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.questionStudioDiscoverable,
      testBuilderEligible: FIGURE_FORMATION_INTERNAL_ACTIVATION_V2.testBuilderEligible,
    }),
    Object.freeze({
      chapterCode: "DOT-001" as const,
      chapterName: "Dot Situation" as const,
      permanentQlIds: DOT_SITUATION_INTERNAL_ACTIVATION_V1.permanentQlIds,
      activationAuthorityId: DOT_SITUATION_INTERNAL_ACTIVATION_V1.authorityId,
      questionStudioDiscoverable: DOT_SITUATION_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable,
      testBuilderEligible: DOT_SITUATION_INTERNAL_ACTIVATION_V1.testBuilderEligible,
    }),
    Object.freeze({
      chapterCode: "FMT-001" as const,
      chapterName: "Figure Matrix" as const,
      permanentQlIds: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.permanentQlIds,
      activationAuthorityId: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.authorityId,
      questionStudioDiscoverable: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable,
      testBuilderEligible: FIGURE_MATRIX_INTERNAL_ACTIVATION_V1.testBuilderEligible,
    }),
    Object.freeze({
      chapterCode: "IDF-001" as const,
      chapterName: "Identical Figure / Figure Grouping" as const,
      permanentQlIds: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.permanentQlIds,
      activationAuthorityId: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.authorityId,
      questionStudioDiscoverable: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable,
      testBuilderEligible: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.testBuilderEligible,
    }),
  ]),
  blockingMissingChapters: Object.freeze([] as const),
  closureInvariants: Object.freeze({
    allFormerBlockersResolved: true,
    allPermanentQlIdsAllocatedWithoutGap: actualUnion.join("|") === expectedUnion.join("|"),
    mainPackageAndCndRemainSeparate: mainPackageIds.length === 58 && cndIds.length === 5,
    allApprovedSecondaryChaptersDiscoverable: [
      FIGURE_FORMATION_INTERNAL_ACTIVATION_V2,
      DOT_SITUATION_INTERNAL_ACTIVATION_V1,
      FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
      IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
    ].every((authority) => authority.questionStudioDiscoverable),
    allApprovedSecondaryChaptersTestBuilderEligible: [
      FIGURE_FORMATION_INTERNAL_ACTIVATION_V2,
      DOT_SITUATION_INTERNAL_ACTIVATION_V1,
      FIGURE_MATRIX_INTERNAL_ACTIVATION_V1,
      IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
    ].every((authority) => authority.testBuilderEligible),
    manualApprovalStillRequired: true,
    mockTestReleaseStillClosed: true,
    publicReleaseStillClosed: true,
    studentDeliveryStillClosed: true,
    automaticStudentPublicationStillClosed: true,
  }),
  lifecycle: Object.freeze({
    sourceSaturationCompleteForWholeFamily: true,
    chapterInventoryComplete: true,
    familyExhaustivenessEstablished: true,
    finalUnified63QlSoakRequired: true,
    finalUnified63QlSoakPassed: false,
    familyFreezeAuthorized: false,
    mockTestReleaseAuthorizedByThisAudit: false,
    publicReleaseAuthorizedByThisAudit: false,
    studentDeliveryAuthorizedByThisAudit: false,
    automaticStudentPublicationAuthorizedByThisAudit: false,
  }),
  verdict: "CHAPTER_INVENTORY_COMPLETE_63_QL_UNION_READY_FOR_FINAL_UNIFIED_SOAK" as const,
  nextGate: "SPA_63_QL_FINAL_UNIFIED_CLOSURE_SOAK_V1" as const,
} as const);

if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount !== 63) {
  throw new Error("Spatial final closure V2 expects exactly 63 allocated permanent QLs.");
}
if (SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId !== "SPA-QL-064") {
  throw new Error("Spatial final closure V2 expects SPA-QL-064 as the next available permanent identity.");
}
if (SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount !== 58) {
  throw new Error("Spatial final closure V2 expects the main Question Studio package to contain 58 QLs.");
}
if (cndIds.length !== 5) {
  throw new Error("Spatial final closure V2 expects CND-001 to remain a separate five-QL activation.");
}
if (actualUnion.join("|") !== expectedUnion.join("|")) {
  throw new Error("Spatial final closure V2 expects a gap-free SPA-QL-001..063 union across the main package and CND-001.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.resolvedFormerBlockers.some((chapter) => !chapter.questionStudioDiscoverable || !chapter.testBuilderEligible)) {
  throw new Error("Spatial final closure V2 requires every former missing chapter to be internally activated.");
}
