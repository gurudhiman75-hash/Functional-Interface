import {
  generateQuestion as generatePreviousQuestion,
  isNumCp014QuestionStudioRequest,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
  listQuestionStudioPackages as listPreviousPackages,
  type SharedQuestionStudioGenerationRequest,
} from "./shared-generation-engine-cp014.ts";
import {
  generateSriQuestionStudioBatchV1,
  isSriQuestionStudioRequestV1,
  listSriQuestionStudioPackagesV1,
  type SriQuestionStudioRequestV1,
} from "../quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/question-studio-v1.ts";
import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  isDsf001NormalQuestionStudioRequest,
  previewDsf001NormalQuestionStudioReview,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-review-v1.ts";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../reasoning-v1/foundation/spatial/cubes-dice-test-builder-activation-v1.ts";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V5 } from "../reasoning-v1/foundation/spatial/spatial-question-studio-integration-v5.ts";
import { SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../reasoning-v1/topics/Series/SER-001/SER-CP-007-QUESTION-STUDIO-INTEGRATION/ser-001-internal-test-builder-activation-v1.ts";

export {
  isDsf001NormalQuestionStudioRequest,
  isNumCp014QuestionStudioRequest,
  isSriQuestionStudioRequestV1,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
};
export type { SharedQuestionStudioGenerationRequest, SriQuestionStudioRequestV1 };

const SPA_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: "SPA-001" as const,
  topic: "Reasoning" as const,
  subtopic: "Spatial Reasoning" as const,
  subject: "Reasoning Ability" as const,
  label: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.label,
  enabled: true,
  cpIds: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount,
  permanentQlIds: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds,
  supportedLanguages: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.supportedLanguages,
  supportedDifficulties: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.supportedDifficulties,
  runtimeMode: "CANONICAL_REVIEW" as const,
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
  difficultyPolicy: "QL_RUNTIME_CONTROLLED" as const,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankStatus: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.questionBankStatus,
  questionBankWritable: true,
  testEligibility: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.testEligibility,
  testEligible: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  releaseId: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.finalHeldGapActivationAuthority,
});

const CND_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: "SPA-001-CND-001-REVIEW" as const,
  topic: "Reasoning" as const,
  subtopic: "Cubes & Dice" as const,
  subject: "Reasoning Ability" as const,
  label: "Cubes & Dice — CND-001" as const,
  enabled: true,
  cpIds: Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const),
  permanentQlCount: 5,
  permanentQlIds: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds,
  supportedLanguages: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.supportedLanguages,
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  runtimeMode: "CANONICAL_REVIEW" as const,
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
  difficultyPolicy: "QL_RUNTIME_CONTROLLED" as const,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankStatus: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.questionBankStatus,
  questionBankWritable: true,
  testEligibility: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.testEligibility,
  testEligible: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  releaseId: CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.authorityId,
});

const SER_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: "SER-001" as const,
  topic: "Reasoning" as const,
  subtopic: "Series" as const,
  subject: "Reasoning Ability" as const,
  label: "Series — SER-001 · 140 Frozen Templates" as const,
  enabled: true,
  cpIds: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds,
  permanentQlCount: 13,
  permanentQlIds: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds,
  supportedLanguages: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.supportedLanguages,
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  runtimeMode: "FROZEN_REVIEW" as const,
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN" as const,
  difficultyPolicy: "FROZEN_TEMPLATE_CONTROLLED" as const,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankStatus: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.questionBankStatus,
  questionBankWritable: true,
  testEligibility: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.testEligibility,
  testEligible: true,
  testBuilderEligible: true,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  releaseId: SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.authorityId,
});

export function listQuestionStudioPackages() {
  const previous = [...listPreviousPackages()] as any[];

  if (previous.some((entry) => String(entry.packageId) === DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId)) {
    throw new Error("Question Studio package DSF-001 already exists before CP017 normal-workflow activation.");
  }
  previous.push(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE);

  const sri = listSriQuestionStudioPackagesV1();
  for (const pkg of sri) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before SRI activation.`);
    }
    previous.push(pkg);
  }

  for (const pkg of [SPA_001_QUESTION_STUDIO_PACKAGE, CND_001_QUESTION_STUDIO_PACKAGE, SER_001_QUESTION_STUDIO_PACKAGE]) {
    if (previous.some((entry) => String(entry.packageId) === pkg.packageId)) {
      throw new Error(`Question Studio package ${pkg.packageId} already exists before reasoning workflow activation.`);
    }
    previous.push(pkg);
  }

  return previous;
}

export async function generateQuestion(request: SharedQuestionStudioGenerationRequest | SriQuestionStudioRequestV1 = {}) {
  if (isDsf001NormalQuestionStudioRequest(request as any)) {
    return previewDsf001NormalQuestionStudioReview(request as any);
  }
  if (isSriQuestionStudioRequestV1(request)) return generateSriQuestionStudioBatchV1(request);
  return generatePreviousQuestion(request as SharedQuestionStudioGenerationRequest);
}
