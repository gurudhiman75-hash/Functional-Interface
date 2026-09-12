import { CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1 } from "./cubes-dice-question-studio-registered-runtime-v1";
import { CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "./cubes-dice-student-solution-localization-freeze-v1";

if (CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.registrationStatus !== "REGISTERED_REVIEW_ONLY") {
  throw new Error("CND bank-only activation requires review-only Question Studio registration first.");
}
if (!CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.frozen) {
  throw new Error("CND bank-only activation requires frozen EN/HI/PA student solutions.");
}

export const CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
  chapterCode: "CND-001" as const,
  sourceRegistrationAuthorityId:
    CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
  localizationFreezeAuthorityId:
    CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlIds: Object.freeze([
    "SPA-QL-043",
    "SPA-QL-044",
    "SPA-QL-045",
    "SPA-QL-046",
    "SPA-QL-047",
  ] as const),
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  status: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  activationReason:
    "USER_DIRECTED_CONTINUATION_AFTER_CND_REVIEW_ONLY_REGISTRATION" as const,
  activationScope:
    "QUESTION_STUDIO_PERSISTENCE_AND_QUESTION_BANK_ACCEPTANCE_ONLY" as const,
  questionStudioDiscoverable: true,
  previewGenerationAuthorized: true,
  persistenceAllowed: true,
  internalReviewRunsWritable: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  manualApprovalRequired: true,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false,
  testBuilderEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  automaticStudentPublication: false,
  contentMutationAuthorized: false,
  nextGate: "CND_001_INTERNAL_TEST_BUILDER_ELIGIBILITY_ACTIVATION" as const,
});
