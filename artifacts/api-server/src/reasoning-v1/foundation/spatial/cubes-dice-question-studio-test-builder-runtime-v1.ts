import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-test-builder-activation-v1";
import {
  generateCubesDiceQuestionStudioBankBatchV1,
  generateCubesDiceQuestionStudioBankV1,
  type CubesDiceBankQuestionV1,
} from "./cubes-dice-question-studio-bank-runtime-v1";
import type {
  CubesDiceQuestionStudioLanguageV2,
  CubesDiceQuestionStudioQlIdV2,
} from "./cubes-dice-question-studio-seeded-runtime-v2";
import type { CubesDiceVoxelRuntimeTaskKindV2 } from "./cubes-dice-voxel-projection-runtime-v2";

const ACTIVATION = CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1;

export type CubesDiceTestBuilderQuestionV1 = Readonly<
  Omit<CubesDiceBankQuestionV1, "version" | "lifecycle"> & {
    version: "CND-001-QUESTION-STUDIO-TEST-BUILDER-QUESTION-V1";
    testBuilderActivationAuthority: typeof ACTIVATION.authorityId;
    lifecycle: Readonly<{
      reviewOnly: false;
      questionStudioDiscoverable: true;
      registrationStatus: "REGISTERED_INTERNAL_TEST_BUILDER";
      persistenceAllowed: true;
      questionBankStatus: "READY_FOR_STORAGE";
      questionBankWritable: true;
      questionBankAcceptanceMode: "FULL_RELEASE";
      manualApprovalRequired: true;
      manualQuestionPublicationRequired: true;
      testEligibility: "ELIGIBLE";
      testEligible: true;
      testBuilderEligible: true;
      mockTestEligible: false;
      publiclyPublishable: true;
      publicReleaseAuthorized: false;
      studentDeliveryAuthorized: false;
      automaticStudentPublication: false;
    }>;
  }
>;

function activateForTestBuilder(source: CubesDiceBankQuestionV1): CubesDiceTestBuilderQuestionV1 {
  return Object.freeze({
    ...source,
    version: "CND-001-QUESTION-STUDIO-TEST-BUILDER-QUESTION-V1" as const,
    testBuilderActivationAuthority: ACTIVATION.authorityId,
    lifecycle: Object.freeze({
      reviewOnly: false as const,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_INTERNAL_TEST_BUILDER" as const,
      persistenceAllowed: true as const,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      manualApprovalRequired: true as const,
      manualQuestionPublicationRequired: true as const,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: true as const,
      testBuilderEligible: true as const,
      mockTestEligible: false as const,
      publiclyPublishable: true as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

export function generateCubesDiceQuestionStudioTestBuilderV1(input: Readonly<{
  seed: string;
  qlId: CubesDiceQuestionStudioQlIdV2;
  language: CubesDiceQuestionStudioLanguageV2;
  voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2;
}>): CubesDiceTestBuilderQuestionV1 {
  return activateForTestBuilder(generateCubesDiceQuestionStudioBankV1(input));
}

export function generateCubesDiceQuestionStudioTestBuilderBatchV1(input: Readonly<{
  seed: string;
  language: CubesDiceQuestionStudioLanguageV2;
  count: number;
  qlId?: CubesDiceQuestionStudioQlIdV2;
}>): readonly CubesDiceTestBuilderQuestionV1[] {
  return Object.freeze(
    generateCubesDiceQuestionStudioBankBatchV1(input).map(activateForTestBuilder),
  );
}

export const CND_001_QUESTION_STUDIO_TEST_BUILDER_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-TEST-BUILDER-RUNTIME-V1" as const,
  activationAuthorityId: ACTIVATION.authorityId,
  chapterCode: "CND-001" as const,
  status: "ACTIVE_INTERNAL_TEST_BUILDER" as const,
  supportedLanguages: ACTIVATION.supportedLanguages,
  permanentQlIds: ACTIVATION.permanentQlIds,
  persistenceAllowed: true,
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  testEligible: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
});
