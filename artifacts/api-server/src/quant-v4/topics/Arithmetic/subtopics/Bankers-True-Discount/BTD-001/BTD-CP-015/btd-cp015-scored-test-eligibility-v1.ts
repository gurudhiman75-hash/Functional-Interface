import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  buildBtdCp014TestProjectionMaterializationPlanV1,
} from "../BTD-CP-014/btd-cp014-test-projection-materialization-v1";

export const BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION =
  "BTD-001-CP015-SCORED-TEST-ELIGIBILITY-v1" as const;

export const BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY = Object.freeze({
  status: "SCORED_TEST_ELIGIBILITY_AUTHORIZED" as const,
  materializationAuthority: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  materializedProjectionRequired: true as const,
  projectionMustBeApprovedAndUnpublished: true as const,
  activeExamPlacementRequired: true as const,
  activeTaxonomyPlacementRequired: true as const,
  approvedHindiTranslationRequired: true as const,
  approvedPunjabiTranslationRequired: true as const,
  testEligibilityApprovalGranted: true as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  internalBlueprintPublicationAuthorized: true as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  sourceQuestionBankMutationAuthorized: false as const,
  projectionEligibilityMutationAuthorized: true as const,
});

function assertCp014Boundary(): void {
  const source = BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY;
  if (!source.testProjectionMaterializationApproved) {
    throw new Error("BTD-001 CP015 requires the certified CP014 materialization authority.");
  }
  if (source.testEligible || source.mockTestEligible || source.publiclyPublishable) {
    throw new Error("BTD-001 CP014 source unexpectedly crossed its delivery boundary.");
  }
  if (source.materializedQuestionPublished) {
    throw new Error("BTD-001 CP014 source must remain unpublished before CP015 activation.");
  }
}

export type BtdCp015ScoredTestEligibilityRequest = Readonly<{
  qlId: BtdPermanentQlId;
  seed: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds?: readonly string[];
}>;

export function buildBtdCp015ScoredTestEligibilityPlanV1(
  request: BtdCp015ScoredTestEligibilityRequest,
) {
  assertCp014Boundary();
  const materialization = buildBtdCp014TestProjectionMaterializationPlanV1(request);

  return Object.freeze({
    checkpointId: "BTD-CP-015" as const,
    eligibilityVersion: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
    materializationAuthority: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
    projectionBundleKey: materialization.projectionBundleKey,
    qlId: materialization.qlId,
    seed: materialization.seed,
    examVersionId: materialization.examVersionId,
    primaryTaxonomyNodeId: materialization.primaryTaxonomyNodeId,
    taxonomyNodeIds: materialization.taxonomyNodeIds,
    sourceAdmissionKeys: materialization.projectionDocument.sourceAdmissionKeys,
    expectedProjectionState: Object.freeze({
      questionStatus: "approved" as const,
      publishedVersionId: null,
      testProjectionMaterialized: true as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
    targetProjectionState: Object.freeze({
      questionStatus: "published" as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    lifecycle: BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY,
  });
}
