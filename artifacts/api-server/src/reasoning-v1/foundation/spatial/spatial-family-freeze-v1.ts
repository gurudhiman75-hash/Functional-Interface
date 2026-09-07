import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 } from "./spatial-family-final-closure-audit-v2";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13 } from "./spatial-permanent-ql-allocation-v13";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V9 } from "./spatial-question-studio-integration-v9";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-test-builder-activation-v1";

export const SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1 = Object.freeze({
  authorityId: "SPA_63_QL_FINAL_UNIFIED_CLOSURE_SOAK_V1" as const,
  sourcePullRequest: 1475,
  sourceHeadSha: "aadb85754cf2ec6b677a70bedb069bcd5acc5206" as const,
  mergedCommitSha: "a6786c4cd3b0b12331ab6bc4130b2e6c30e6d8b3" as const,
  workflowName: "Validate SPA 63-QL Final Unified Closure Soak V1" as const,
  workflowRunId: 34143649753,
  artifactId: 10026854024,
  artifactDigest: "sha256:d69d1b74fecda4bef3a3341f240c9a153230703a79de029a68274c85575a323f" as const,
  verdict: "PASS_UNIFIED_63_QL_SPATIAL_CORPUS_READY_FOR_FREEZE_REVIEW" as const,
  permanentQlRange: "SPA-QL-001..SPA-QL-063" as const,
  permanentQlCount: 63,
  mainQuestionStudioQlCount: 58,
  separateCndQlCount: 5,
  generatedQuestions: 378,
  deterministicReplayChecks: 378,
  svgChecks: 1899,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  effectiveReleaseGatesClosed: true,
  result: "SUCCESS" as const,
} as const);

export const SPATIAL_FAMILY_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "SPA-FND-001-FAMILY-FREEZE-V1" as const,
  status: "FROZEN_COMPLETE_63_QL_INTERNAL_FAMILY_SNAPSHOT" as const,
  scope: "SPATIAL_REASONING_COMPLETE_INTERNAL_FAMILY" as const,

  sourceClosureAuditAuthorityId: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.authorityId,
  sourceAllocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.authorityId,
  sourceQuestionStudioIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority,
  sourceCndActivationAuthorityId: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.authorityId,
  sourceSoakEvidence: SPATIAL_FAMILY_FINAL_63QL_SOAK_EVIDENCE_V1,

  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlRange,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.permanentQlCount,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V13.nextAvailablePermanentQlId,
  mainQuestionStudioQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.permanentQlCount,
  separateCndQlCount: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds.length,
  familyPermanentQlUnionCount: 63,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  mainQuestionStudioChapters: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.chapters,
  separateInternalChapter: "CND-001" as const,

  formerlyBlockingChapters: Object.freeze([
    Object.freeze({ chapterCode: "FFM-001" as const, qlRange: "SPA-QL-051..053" as const }),
    Object.freeze({ chapterCode: "DOT-001" as const, qlRange: "SPA-QL-054" as const }),
    Object.freeze({ chapterCode: "FMT-001" as const, qlRange: "SPA-QL-055..060" as const }),
    Object.freeze({ chapterCode: "IDF-001" as const, qlRange: "SPA-QL-061..063" as const }),
  ] as const),

  freezeContract: Object.freeze({
    chapterInventoryComplete: true,
    sourceSaturationBlockersClosed: true,
    permanentQlAllocationGapFree: true,
    permanentQlAllocationFrozen: true,
    currentQuestionStudioIntegrationSnapshotFrozen: true,
    currentCndOwnershipSnapshotFrozen: true,
    multilingualRuntimeSnapshotFrozen: true,
    deterministicUnifiedSoakPassed: true,
    familyFreezeAuthorized: true,
    familyFrozen: true,
    contentMutationAuthorized: false,
    mutationRequiresExplicitSupersedingAuthority: true,
  }),

  lifecycle: Object.freeze({
    questionStudioDiscoverable: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.questionStudioDiscoverable,
    persistenceAllowed: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.persistenceAllowed,
    questionBankWritable: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.questionBankWritable,
    testBuilderEligible: SPATIAL_QUESTION_STUDIO_PACKAGE_V9.testBuilderEligible,
    mockTestEligible: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
    manualApprovalRequired: true,
    publicReleaseDecisionRequired: true,
  }),

  releaseBoundary: "FAMILY_FREEZE_DOES_NOT_AUTHORIZE_MOCK_PUBLIC_OR_STUDENT_RELEASE" as const,
  nextGate: "MANUAL_RELEASE_DECISION_OR_EXPLICIT_SUPERSEDING_FAMILY_AUTHORITY" as const,
} as const);
