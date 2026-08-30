import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION } from "../BTD-CP-015/btd-cp015-scored-test-eligibility-v1";
import {
  BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY,
  BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
  buildBtdCp016MockTestEligibilityReadinessPlanV1,
} from "../BTD-CP-016/btd-cp016-mock-test-eligibility-readiness-v1";

export const BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION =
  "BTD-001-CP017-MOCK-TEST-ELIGIBILITY-v1" as const;

export const BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY = Object.freeze({
  status: "MOCK_TEST_ELIGIBILITY_AUTHORIZED" as const,
  readinessAuthority: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
  scoredTestAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
  publishedProjectionRequired: true as const,
  scoredTestEligibleRequired: true as const,
  activeExamPlacementRequired: true as const,
  activeTaxonomyPlacementRequired: true as const,
  approvedHindiTranslationRequired: true as const,
  approvedPunjabiTranslationRequired: true as const,
  canonicalTestSeriesQaRequired: true as const,
  mockTestEligibilityApprovalGranted: true as const,
  testEligible: true as const,
  mockTestEligible: true as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  sourceQuestionBankMutationAuthorized: false as const,
  projectionContentMutationAuthorized: false as const,
  projectionMockEligibilityMutationAuthorized: true as const,
});

function assertCp016Boundary(): void {
  const source = BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY;
  if (source.mockTestEligibilityApprovalGranted || source.mockTestEligible) {
    throw new Error("BTD-001 CP016 readiness unexpectedly granted mock-test eligibility itself.");
  }
  if (!source.scoredTestEligibilityRequired || !source.testSeriesMembershipGuardRequired) {
    throw new Error("BTD-001 CP017 requires the complete CP016 mock-readiness authority.");
  }
  if (source.publiclyPublishable || source.automaticStudentPublication) {
    throw new Error("BTD-001 CP016 source unexpectedly crossed its public-delivery boundary.");
  }
}

export type BtdCp017MockTestEligibilityRequest = Readonly<{
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds?: readonly string[];
}>;

export function buildBtdCp017MockTestEligibilityPlanV1(
  request: BtdCp017MockTestEligibilityRequest,
) {
  assertCp016Boundary();
  const readiness = buildBtdCp016MockTestEligibilityReadinessPlanV1(request);

  return Object.freeze({
    checkpointId: "BTD-CP-017" as const,
    eligibilityVersion: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
    readinessAuthority: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
    scoredTestAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
    projectionBundleKey: readiness.projectionBundleKey,
    qlId: readiness.qlId,
    seed: readiness.seed,
    examVersionId: readiness.examVersionId,
    primaryTaxonomyNodeId: readiness.primaryTaxonomyNodeId,
    taxonomyNodeIds: readiness.taxonomyNodeIds,
    sourceAdmissionKeys: readiness.sourceAdmissionKeys,
    expectedProjectionState: readiness.expectedProjectionState,
    targetProjectionState: Object.freeze({
      questionStatus: "published" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    testSeriesPolicy: Object.freeze({
      mockEligibilityFlagRequiredForGeneratedQuestions: true as const,
      canonicalQaStillRequired: true as const,
      acceptedMemberTestStatuses: readiness.mockSeriesPolicy.acceptedMemberTestStatuses,
    }),
    lifecycle: BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY,
  });
}
