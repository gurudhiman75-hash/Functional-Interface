import {
  auditCom004DifficultyAuthorityV1,
  COM004_DIFFICULTY_AUTHORITY_VERSION_V1,
  COM004_DIFFICULTY_AUTHORITY_V1,
} from "../../knowledge-v1/computer-awareness/com004-difficulty-authority-v1";
import { COM004_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com004-english-chapter-v2";
import {
  auditCom004LocalizationFreezeV2,
  COM004_LOCALIZATION_FREEZE_AUTHORITY_V2,
} from "../../knowledge-v1/computer-awareness/com004-localization-freeze-v2";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

const difficultyAudit = auditCom004DifficultyAuthorityV1();
const localizationAudit = auditCom004LocalizationFreezeV2();

if (!COM004_ENGLISH_FREEZE_AUTHORITY_V2.governance.englishFrozen) {
  throw new Error("COM-004 BANK_ONLY activation requires English Freeze V2.");
}
if (!localizationAudit.valid || !COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.localizationFrozen) {
  throw new Error("COM-004 BANK_ONLY activation requires the complete Hindi/Punjabi localization freeze.");
}
if (!difficultyAudit.valid) {
  throw new Error(`COM-004 BANK_ONLY activation requires a valid difficulty authority: ${difficultyAudit.issues.join(", ")}`);
}
if (COM004_DIFFICULTY_AUTHORITY_V1.hardDifficultyAuthorized) {
  throw new Error("COM-004 BANK_ONLY activation must not silently authorize Hard difficulty.");
}

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

export const COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
  packageId: "COM-004" as const,
  chapterTitle: "Internet, Web, E-mail & Digital Services" as const,
  status: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  activationReason: "COM004_FROZEN_ENGLISH_AND_HI_PA_CORPUS_REGISTERED_IN_EXISTING_KNOWLEDGE_V1_STUDIO" as const,
  activationScope: "QUESTION_STUDIO_REVIEW_PERSISTENCE_AND_MANUAL_QUESTION_BANK_ACCEPTANCE_ONLY" as const,
  sourceAuthorities: Object.freeze({
    englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
    difficultyAuthorityId: COM004_DIFFICULTY_AUTHORITY_V1.authorityId,
    difficultyAuthorityVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V1,
  }),
  corpus: Object.freeze({
    permanentQlCount: 17 as const,
    supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
    englishQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenEnglishQuestionCount,
    hindiQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenHindiQuestionCount,
    punjabiQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenPunjabiQuestionCount,
    frozenQuestionLanguageArtifactCount:
      COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenEnglishQuestionCount +
      COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenHindiQuestionCount +
      COM004_LOCALIZATION_FREEZE_AUTHORITY_V2.frozenPunjabiQuestionCount,
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
    questionBankAcceptanceAuthority: "COM-004-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
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
  nextGate: "COM004_INTERNAL_TEST_BUILDER_ELIGIBILITY_ACTIVATION" as const,
  replacementRule:
    "Any test-builder eligibility, mock-test eligibility, public publication, production release, Hard-difficulty claim, or frozen-corpus mutation requires a separate audited authority." as const,
});

export type Com004BankOnlyActivationAuthorityV1 = typeof COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
