import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1, COM003_HARD_DIFFICULTY_STATUS_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v2";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-v2-chapter-freeze-v1";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM003_CHAPTER_COMPLETION_AUTHORITY_V1 } from "./com003-chapter-completion-authority-v1";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";

if (COM003_CHAPTER_COMPLETION_AUTHORITY_V1.status !== "COMPLETE_STANDARD_REVIEW_ONLY") {
  throw new Error("COM-003 BANK_ONLY activation requires completed REVIEW_ONLY chapter implementation.");
}
if (!COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.governance.localizationFrozen) {
  throw new Error("COM-003 BANK_ONLY activation requires the Localization V2 chapter freeze.");
}
if (COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorization.lifecycleStage !== "REVIEW_ONLY") {
  throw new Error("COM-003 BANK_ONLY activation requires REVIEW_ONLY Question Studio activation first.");
}
if (COM003_HARD_DIFFICULTY_STATUS_V1.authorized) {
  throw new Error("COM-003 BANK_ONLY activation must not silently authorize Hard difficulty.");
}

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

export const COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
  packageId: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  status: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  activationReason: "USER_DIRECTED_CONTINUATION_AFTER_COM003_REVIEW_ONLY_COMPLETION" as const,
  activationScope: "QUESTION_STUDIO_REVIEW_PERSISTENCE_AND_MANUAL_QUESTION_BANK_ACCEPTANCE_ONLY" as const,
  sourceAuthorities: Object.freeze({
    chapterCompletionAuthorityId: COM003_CHAPTER_COMPLETION_AUTHORITY_V1.authorityId,
    reviewOnlyActivationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
    englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    localizationFreezeAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    difficultyAuthorityVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  }),
  corpus: Object.freeze({
    permanentQlCount: 19 as const,
    supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
    englishQuestionCount: 228 as const,
    hindiQuestionCount: 228 as const,
    punjabiQuestionCount: 228 as const,
    frozenQuestionLanguageArtifactCount: 684 as const,
    immutable: true as const,
    revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
  }),
  authorization: Object.freeze({
    standardLifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: "COM-003-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    supportedDifficulties: Object.freeze(["Easy", "Medium"] as const),
    hardDifficultyAuthorized: false as const,
    difficultyFilterSupported: true as const,
    productionDifficultyClaimAuthorized: false as const,
  }),
  locks: Object.freeze({
    contentMutationAuthorized: false as const,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    testBuilderEligible: false as const,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  }),
  nextGate: "COM003_INTERNAL_TEST_BUILDER_ELIGIBILITY_ACTIVATION" as const,
  replacementRule:
    "Any test-builder eligibility, mock-test eligibility, public publication, production release, Hard-difficulty claim, or frozen-corpus mutation requires a separate audited authority." as const,
});

export type Com003BankOnlyActivationAuthorityV1 = typeof COM003_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
