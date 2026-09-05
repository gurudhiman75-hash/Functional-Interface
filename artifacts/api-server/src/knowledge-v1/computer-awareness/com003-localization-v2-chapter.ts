import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1,
} from "./com003-localization-v2-wave1";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE2,
} from "./com003-localization-v2-wave2";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE3,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE3,
} from "./com003-localization-v2-wave3";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE4,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE4,
} from "./com003-localization-v2-wave4";
import {
  applyCom003LocalizationExplanationDiversityV2,
  COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY,
} from "./com003-localization-v2-explanation-diversity";

export const COM003_HINDI_LOCALIZATION_V2_CHAPTER = Object.freeze(
  applyCom003LocalizationExplanationDiversityV2(
    [
      ...COM003_HINDI_LOCALIZATION_V2_WAVE1,
      ...COM003_HINDI_LOCALIZATION_V2_WAVE2,
      ...COM003_HINDI_LOCALIZATION_V2_WAVE3,
      ...COM003_HINDI_LOCALIZATION_V2_WAVE4,
    ],
    "hi",
  ),
);

export const COM003_PUNJABI_LOCALIZATION_V2_CHAPTER = Object.freeze(
  applyCom003LocalizationExplanationDiversityV2(
    [
      ...COM003_PUNJABI_LOCALIZATION_V2_WAVE1,
      ...COM003_PUNJABI_LOCALIZATION_V2_WAVE2,
      ...COM003_PUNJABI_LOCALIZATION_V2_WAVE3,
      ...COM003_PUNJABI_LOCALIZATION_V2_WAVE4,
    ],
    "pa",
  ),
);

export const COM003_LOCALIZATION_V2_CHAPTER_CANDIDATE_AUTHORITY = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-V2-CHAPTER-CANDIDATE-2" as const,
  chapterCode: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  sourceEnglishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  sourceEnglishCorpus: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
  explanationDiversityAuthorityId: COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY.authorityId,
  qlRange: "COM-003-QL-001..COM-003-QL-019" as const,
  qlCount: 19,
  englishQuestionCount: 228,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_CHAPTER.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  localizedQuestionCount:
    COM003_HINDI_LOCALIZATION_V2_CHAPTER.length + COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  questionLanguageArtifactCount:
    228 + COM003_HINDI_LOCALIZATION_V2_CHAPTER.length + COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length,
  questionsPerQlPerLanguage: 12,
  governance: Object.freeze({
    localizationReviewOnly: true,
    localizationFrozen: false,
    chapterFreezeAuthorized: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publiclyPublishable: false,
    productionReleased: false,
  }),
  nextGate: "COM003_LOCALIZATION_V2_CHAPTER_SEMANTIC_EDITORIAL_AUDIT" as const,
});
