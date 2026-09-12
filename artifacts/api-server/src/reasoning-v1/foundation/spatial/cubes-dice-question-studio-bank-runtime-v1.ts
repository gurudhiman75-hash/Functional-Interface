import { CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-question-studio-bank-activation-v1";
import {
  generateCubesDiceQuestionStudioRegisteredBatchV1,
  generateCubesDiceQuestionStudioRegisteredV1,
  type CubesDiceRegisteredQuestionV1,
} from "./cubes-dice-question-studio-registered-runtime-v1";
import type {
  CubesDiceQuestionStudioLanguageV2,
  CubesDiceQuestionStudioQlIdV2,
} from "./cubes-dice-question-studio-seeded-runtime-v2";
import type { CubesDiceVoxelRuntimeTaskKindV2 } from "./cubes-dice-voxel-projection-runtime-v2";

const ACTIVATION = CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1;

export type CubesDiceBankQuestionV1 = Readonly<
  Omit<CubesDiceRegisteredQuestionV1, "version" | "lifecycle"> & {
    version: "CND-001-QUESTION-STUDIO-BANK-QUESTION-V1";
    bankActivationAuthority: typeof ACTIVATION.authorityId;
    lifecycle: Readonly<{
      reviewOnly: true;
      questionStudioDiscoverable: true;
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL";
      persistenceAllowed: true;
      questionBankStatus: "READY_FOR_STORAGE";
      questionBankWritable: true;
      questionBankAcceptanceMode: "BANK_ONLY";
      manualApprovalRequired: true;
      testEligibility: "INELIGIBLE";
      testEligible: false;
      testBuilderEligible: false;
      mockTestEligible: false;
      publiclyPublishable: false;
      automaticStudentPublication: false;
    }>;
  }
>;

function activateQuestion(source: CubesDiceRegisteredQuestionV1): CubesDiceBankQuestionV1 {
  return Object.freeze({
    ...source,
    version: "CND-001-QUESTION-STUDIO-BANK-QUESTION-V1" as const,
    bankActivationAuthority: ACTIVATION.authorityId,
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL" as const,
      persistenceAllowed: true as const,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      manualApprovalRequired: true as const,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: false as const,
      testBuilderEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

export function generateCubesDiceQuestionStudioBankV1(input: Readonly<{
  seed: string;
  qlId: CubesDiceQuestionStudioQlIdV2;
  language: CubesDiceQuestionStudioLanguageV2;
  voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2;
}>): CubesDiceBankQuestionV1 {
  return activateQuestion(generateCubesDiceQuestionStudioRegisteredV1(input));
}

export function generateCubesDiceQuestionStudioBankBatchV1(input: Readonly<{
  seed: string;
  language: CubesDiceQuestionStudioLanguageV2;
  count: number;
  qlId?: CubesDiceQuestionStudioQlIdV2;
}>): readonly CubesDiceBankQuestionV1[] {
  return Object.freeze(
    generateCubesDiceQuestionStudioRegisteredBatchV1(input).map(activateQuestion),
  );
}

export const CND_001_QUESTION_STUDIO_BANK_RUNTIME_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-BANK-RUNTIME-V1" as const,
  activationAuthorityId: ACTIVATION.authorityId,
  chapterCode: "CND-001" as const,
  status: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  supportedLanguages: ACTIVATION.supportedLanguages,
  permanentQlIds: ACTIVATION.permanentQlIds,
  persistenceAllowed: true,
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});
