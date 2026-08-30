import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
  buildBtdCp017MockTestEligibilityPlanV1,
} from "../BTD-CP-017/btd-cp017-mock-test-eligibility-v1";

export const BTD_CP018_PUBLIC_RELEASE_READINESS_VERSION =
  "BTD-001-CP018-PUBLIC-RELEASE-READINESS-v1" as const;

export const BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY = Object.freeze({
  status: "READY_FOR_EXPLICIT_PUBLIC_RELEASE_APPROVAL" as const,
  mockTestAuthority: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
  publishedProjectionRequired: true as const,
  scoredTestEligibleRequired: true as const,
  mockTestEligibleRequired: true as const,
  activeExamPlacementRequired: true as const,
  activeTaxonomyPlacementRequired: true as const,
  approvedHindiTranslationRequired: true as const,
  approvedPunjabiTranslationRequired: true as const,
  publicReleaseApprovalGranted: false as const,
  testEligible: true as const,
  mockTestEligible: true as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  sourceQuestionBankMutationAuthorized: false as const,
  projectionContentMutationAuthorized: false as const,
  projectionPublicEligibilityMutationAuthorized: false as const,
});

export type BtdCp018PublicReleaseReadinessRequest = Readonly<{
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds?: readonly string[];
}>;

export function buildBtdCp018PublicReleaseReadinessPlanV1(
  request: BtdCp018PublicReleaseReadinessRequest,
) {
  const source = buildBtdCp017MockTestEligibilityPlanV1(request);
  if (source.targetProjectionState.testEligible !== true || source.targetProjectionState.mockTestEligible !== true) {
    throw new Error("BTD-001 CP018 requires the certified CP017 scored+mock eligible source state.");
  }
  if (source.targetProjectionState.publiclyPublishable !== false || source.targetProjectionState.automaticStudentPublication !== false) {
    throw new Error("BTD-001 CP017 source unexpectedly crossed the public-release boundary.");
  }

  return Object.freeze({
    checkpointId: "BTD-CP-018" as const,
    readinessVersion: BTD_CP018_PUBLIC_RELEASE_READINESS_VERSION,
    mockTestAuthority: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
    projectionBundleKey: source.projectionBundleKey,
    qlId: source.qlId,
    seed: source.seed,
    examVersionId: source.examVersionId,
    primaryTaxonomyNodeId: source.primaryTaxonomyNodeId,
    taxonomyNodeIds: source.taxonomyNodeIds,
    sourceAdmissionKeys: source.sourceAdmissionKeys,
    expectedProjectionState: source.targetProjectionState,
    requiredPublicReleaseChecks: Object.freeze({
      publishedProjection: true as const,
      scoredTestEligible: true as const,
      mockTestEligible: true as const,
      activeExamPlacement: true as const,
      activeTaxonomyPlacement: true as const,
      completeEnglishBase: true as const,
      approvedHindiTranslation: true as const,
      approvedPunjabiTranslation: true as const,
      learnerContentImmutable: true as const,
      explicitPublicReleaseApproval: true as const,
    }),
    proposedPublicReleaseState: Object.freeze({
      questionStatus: "published" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: true as const,
      automaticStudentPublication: false as const,
    }),
    lifecycle: BTD_CP018_PUBLIC_RELEASE_READINESS_BOUNDARY,
  });
}
