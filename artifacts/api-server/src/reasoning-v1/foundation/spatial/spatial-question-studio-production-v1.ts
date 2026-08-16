import {
  generateSpatialStudioBatchV1,
  generateSpatialStudioQuestionV1,
  type SpatialPermanentQlIdV1,
  type SpatialStudioBatchRequestV1,
} from "./spatial-question-studio-runtime-v1";
import {
  localizeSpatialStudioQuestionV1,
  type SpatialLocalizedStudioQuestionV1,
  type SpatialQuestionStudioLanguageV1,
} from "./spatial-question-studio-localization-v1";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V1,
  SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1,
} from "./spatial-question-studio-integration-v1";

export type SpatialProductionStudioQuestionV1 = Omit<
  SpatialLocalizedStudioQuestionV1,
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

export type SpatialProductionStudioBatchRequestV1 = SpatialStudioBatchRequestV1 & {
  language?: SpatialQuestionStudioLanguageV1;
};

function productionQuestion(
  question: SpatialLocalizedStudioQuestionV1,
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
  language?: SpatialQuestionStudioLanguageV1;
}): SpatialProductionStudioQuestionV1 {
  const source = generateSpatialStudioQuestionV1({ qlId: input.qlId, seed: input.seed });
  return productionQuestion(
    localizeSpatialStudioQuestionV1(source, input.language ?? "en"),
  );
}

export function generateSpatialProductionStudioBatchV1(
  request: SpatialProductionStudioBatchRequestV1,
) {
  const { language = "en", ...sourceRequest } = request;
  const generated = generateSpatialStudioBatchV1(sourceRequest);
  return {
    generationContext: {
      packageId: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.packageId,
      generationDomain: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.generationDomain,
      seed: generated.generationContext.seed,
      count: generated.generationContext.count,
      language,
      locale: language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const,
      runtimeMode: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.runtimeMode,
      reviewStatus: SPATIAL_QUESTION_STUDIO_PRODUCTION_RELEASE_V1.reviewStatus,
      integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
      localizationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V1.localizationAuthority,
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
    questions: generated.questions.map((question) =>
      productionQuestion(localizeSpatialStudioQuestionV1(question, language))),
  } as const;
}
