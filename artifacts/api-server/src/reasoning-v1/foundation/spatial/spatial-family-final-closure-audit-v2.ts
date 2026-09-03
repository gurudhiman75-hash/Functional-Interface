import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1 } from "./spatial-family-final-closure-audit-v1";
import { FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1 } from "./figure-formation-source-saturated-discovery-v1";
import { FIGURE_FORMATION_INTERNAL_ACTIVATION_V1 } from "./figure-formation-internal-activation-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10 } from "./spatial-permanent-ql-allocation-v10";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V6 } from "./spatial-question-studio-integration-v6";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-test-builder-activation-v1";

export const SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 = Object.freeze({
  authorityId: "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V2-POST-FFM" as const,
  supersedesAuthorityId: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.authorityId,
  auditDate: "2026-09-03" as const,
  targetExams: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.targetExams,
  currentCorpus: Object.freeze({
    permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlCount,
    permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.permanentQlRange,
    nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V10.nextAvailablePermanentQlId,
    spa001NonCndQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V6.permanentQlCount,
    cndQlCount: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds.length,
    expectedUnionRange: "SPA-QL-001..SPA-QL-053" as const,
  }),
  resolvedSinceV1: Object.freeze([
    Object.freeze({
      chapterCode: "FFM-001" as const,
      chapterName: "Figure Formation" as const,
      status: "CORE_SOURCE_SATURATED_AND_INTERNAL_RUNTIME_ACTIVE" as const,
      sourceDiscoveryAuthorityId: FIGURE_FORMATION_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
      activationAuthorityId: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.authorityId,
      permanentQlIds: FIGURE_FORMATION_INTERNAL_ACTIVATION_V1.permanentQlIds,
      permanentQlRange: "SPA-QL-051..SPA-QL-053" as const,
      semanticFamilies: Object.freeze([
        "ASSEMBLE_ALL_PIECES_TO_RESULT",
        "SELECT_PIECE_SUBSET_FOR_TARGET",
        "IDENTIFY_PIECE_SET_FOR_TARGET",
      ] as const),
      rotationAllowed: true as const,
      reflectionAllowed: false as const,
      lifecycle: Object.freeze({
        questionStudioDiscoverable: true as const,
        questionBankWritable: true as const,
        testBuilderEligible: true as const,
        mockTestEligible: false as const,
        publicReleaseAuthorized: false as const,
        studentDeliveryAuthorized: false as const,
        automaticStudentPublication: false as const,
      }),
    }),
  ]),
  blockingMissingChapters: Object.freeze(
    SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V1.blockingMissingChapters
      .filter((entry) => entry.chapterCode !== "FFM-001"),
  ),
  lifecycle: Object.freeze({
    currentFiftyThreeQlImplementationHealthy: true as const,
    sourceSaturationCompleteForWholeFamily: false as const,
    chapterInventoryComplete: false as const,
    familyExhaustivenessEstablished: false as const,
    familyFreezeAuthorized: false as const,
    mockTestReleaseAuthorizedByThisAudit: false as const,
    publicReleaseAuthorizedByThisAudit: false as const,
    studentDeliveryAuthorizedByThisAudit: false as const,
    automaticStudentPublicationAuthorizedByThisAudit: false as const,
  }),
  verdict: "FFM_001_RESOLVED_FAMILY_FREEZE_STILL_BLOCKED_BY_DOT_FMT_IDF" as const,
  remediationOrder: Object.freeze(["DOT-001", "FMT-001", "IDF-001"] as const),
  nextGate: "SPA_DOT_001_SOURCE_DISCOVERY_V1" as const,
} as const);

if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.permanentQlCount !== 53) {
  throw new Error("Post-FFM Spatial closure audit expects exactly 53 permanent QLs.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.nextAvailablePermanentQlId !== "SPA-QL-054") {
  throw new Error("Post-FFM Spatial closure audit expects SPA-QL-054 as the next free permanent QL.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.length !== 3) {
  throw new Error("Post-FFM family freeze must remain blocked by exactly DOT-001, FMT-001 and IDF-001.");
}
if (SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.some((entry) => entry.chapterCode === "FFM-001")) {
  throw new Error("FFM-001 must no longer remain a whole-family closure blocker after V2 activation.");
}
