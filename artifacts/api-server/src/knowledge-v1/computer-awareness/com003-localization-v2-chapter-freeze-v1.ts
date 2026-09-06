import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER,
  COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER,
} from "./com003-localization-v2-chapter";
import { COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY } from "./com003-localization-v2-explanation-diversity";

export const COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1" as const,
  chapterCode: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  sourceEnglishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  sourceLocalizationCandidateAuthorityId:
    COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY.authorityId,
  explanationDiversityAuthorityId:
    COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY.authorityId,
  reviewedHeadSha: "03351bcba8f9a2034f89b6f35bd4ed9e1e2322a3" as const,
  semanticEditorialAudit: Object.freeze({
    workflowName: "COM-003 Localization V2 Semantic Editorial Audit" as const,
    workflowRunId: 33967565926,
    conclusion: "success" as const,
    hindiQuestionsChecked: 228,
    punjabiQuestionsChecked: 228,
    highDiversityQuestionsCheckedPerLanguage: 48,
    semanticRuleCount: 11,
  }),
  qlRange: "COM-003-QL-001..COM-003-QL-019" as const,
  qlCount: 19,
  englishQuestionCount: 228,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_CHAPTER.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  questionLanguageArtifactCount:
    228 +
    COM003_HINDI_LOCALIZATION_V2_CHAPTER.length +
    COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  questionsPerQlPerLanguage: 12,
  frozenLanguages: Object.freeze(["en", "hi", "pa"] as const),
  governance: Object.freeze({
    localizationFrozen: true,
    localizationMutationAllowed: false,
    correctionRequiresNewVersion: true,
    questionStudioRuntimeAuthorized: true,
    questionStudioReviewOnly: true,
    difficultyAuthorityMayBindToThisCorpus: true,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publiclyPublishable: false,
    productionReleased: false,
  }),
  supersedesLocalizationFreezeAuthorityId:
    "COM-003-LOCALIZATION-CHAPTER-FREEZE-V1" as const,
  nextGate: "COM003_QUESTION_STUDIO_V2_RUNTIME_PROMOTION" as const,
});
