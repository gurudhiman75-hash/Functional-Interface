import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY,
  BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
  buildBtdCp015ScoredTestEligibilityPlanV1,
} from "../BTD-CP-015/btd-cp015-scored-test-eligibility-v1";

export const BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION =
  "BTD-001-CP016-MOCK-TEST-ELIGIBILITY-READINESS-v1" as const;

export const BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY = Object.freeze({
  status: "READY_FOR_EXPLICIT_MOCK_TEST_ELIGIBILITY_APPROVAL" as const,
  scoredTestAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
  scoredTestEligibilityRequired: true as const,
  publishedProjectionRequired: true as const,
  activeExamPlacementRequired: true as const,
  activeTaxonomyPlacementRequired: true as const,
  approvedHindiTranslationRequired: true as const,
  approvedPunjabiTranslationRequired: true as const,
  canonicalTestSeriesQaRequired: true as const,
  testSeriesMembershipGuardRequired: true as const,
  legacyUnflaggedQuestionCompatibility: true as const,
  explicitMockIneligibleQuestionMustBlockSeries: true as const,
  mockTestEligibilityApprovalGranted: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  sourceQuestionBankMutationAuthorized: false as const,
  projectionContentMutationAuthorized: false as const,
  projectionMockEligibilityMutationAuthorized: false as const,
});

function assertCp015Boundary(): void {
  const source = BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY;
  if (!source.testEligibilityApprovalGranted || !source.testEligible) {
    throw new Error("BTD-001 CP016 requires the certified CP015 scored-test authority.");
  }
  if (source.mockTestEligible || source.publiclyPublishable || source.automaticStudentPublication) {
    throw new Error("BTD-001 CP015 source unexpectedly crossed its mock/public boundary.");
  }
}

export type BtdCp016MockTestEligibilityReadinessRequest = Readonly<{
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds?: readonly string[];
}>;

export function buildBtdCp016MockTestEligibilityReadinessPlanV1(
  request: BtdCp016MockTestEligibilityReadinessRequest,
) {
  assertCp015Boundary();
  const scored = buildBtdCp015ScoredTestEligibilityPlanV1(request);
  if (!scored.targetProjectionState.testEligible || scored.targetProjectionState.mockTestEligible) {
    throw new Error(`${scored.qlId}: CP016 requires a scored-test eligible, mock-ineligible projection.`);
  }

  return Object.freeze({
    checkpointId: "BTD-CP-016" as const,
    readinessVersion: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_VERSION,
    scoredTestAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
    projectionBundleKey: scored.projectionBundleKey,
    qlId: scored.qlId,
    seed: scored.seed,
    examVersionId: scored.examVersionId,
    primaryTaxonomyNodeId: scored.primaryTaxonomyNodeId,
    taxonomyNodeIds: scored.taxonomyNodeIds,
    sourceAdmissionKeys: scored.sourceAdmissionKeys,
    expectedProjectionState: Object.freeze({
      questionStatus: "published" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    mockSeriesPolicy: Object.freeze({
      explicitFalseMustBlockMembership: true as const,
      explicitTrueMayProceedToCanonicalSeriesQa: true as const,
      legacyMissingFlagMayProceedUnderLegacyRules: true as const,
      acceptedMemberTestStatuses: Object.freeze([
        "qa_approved",
        "scheduled",
        "live",
        "completed",
      ] as const),
    }),
    futureGrantState: Object.freeze({
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    lifecycle: BTD_CP016_MOCK_TEST_ELIGIBILITY_READINESS_BOUNDARY,
  });
}
