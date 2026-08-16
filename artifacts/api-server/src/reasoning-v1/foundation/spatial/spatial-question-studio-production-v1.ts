import {
  generateSpatialStudioBatchV1,
  generateSpatialStudioQuestionV1,
  type SpatialPermanentQlIdV1,
  type SpatialStudioBatchRequestV1,
  type SpatialStudioQuestionV1,
} from "./spatial-question-studio-runtime-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v1";

export type SpatialProductionStudioQuestionV1 = Omit<
  SpatialStudioQuestionV1,
  "lifecycle"
> & {
  lifecycle: {
    questionStudioDiscoverable: true;
    registrationStatus: "REGISTERED";
    persistenceAllowed: true;
    questionBankStatus: "READY_FOR_STORAGE";
    testEligibility: "ELIGIBLE";
    testEligible: true;
    publiclyPublishable: true;
    mockTestEligible: true;
    manualApprovalRequired: true;
    automaticStudentPublication: false;
    releaseAuthority: typeof SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority;
  };
};

function productionQuestion(
  question: SpatialStudioQuestionV1,
): SpatialProductionStudioQuestionV1 {
  const { lifecycle: _sourceLifecycle, ...content } = question;
  return {
    ...content,
    lifecycle: {
      questionStudioDiscoverable: true,
      registrationStatus: "REGISTERED",
      persistenceAllowed: true,
      questionBankStatus:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true,
      publiclyPublishable:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.manualApprovalRequired,
      automaticStudentPublication:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.automaticStudentPublication,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
    },
  };
}

export function generateSpatialProductionStudioQuestionV1(input: {
  qlId: SpatialPermanentQlIdV1;
  seed: string;
}): SpatialProductionStudioQuestionV1 {
  return productionQuestion(generateSpatialStudioQuestionV1(input));
}

export function generateSpatialProductionStudioBatchV1(
  request: SpatialStudioBatchRequestV1,
) {
  const generated = generateSpatialStudioBatchV1(request);
  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.generationDomain,
      seed: generated.generationContext.seed,
      count: generated.generationContext.count,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      releaseAuthority: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.authority,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.questionBankStatus,
      testEligibility:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.testEligibility,
      testEligible: true as const,
      publiclyPublishable:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.publiclyPublishable,
      mockTestEligible:
        SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.mockTestEligible,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
    questions: generated.questions.map(productionQuestion),
  } as const;
}
